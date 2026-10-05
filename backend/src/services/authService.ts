import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

export interface GoogleAuthState {
  role?: string;
  facilityId?: string;
  returnUrl?: string;
}

export class AuthService {
  /**
   * Generate Google OAuth authorization URL with encoded state
   */
  static getGoogleAuthUrl(options: GoogleAuthState = {}) {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const state = Buffer.from(JSON.stringify(options)).toString('base64url');
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      process.env.GOOGLE_CALLBACK_URL ||
      'http://127.0.0.1:5173/auth/callback';

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
      ].join(' '),
      state,
    });

    return `${rootUrl}?${params.toString()}`;
  }

  /**
   * Get user profile and resolve associated facility (Hospital or BloodBank)
   */
  static async getCurrentUser(userId: string) {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        citizenProfile: true,
        governmentProfile: true,
        hospitalStaff: {
          include: {
            hospital: true,
          },
        },
        verifiedHospitals: true,
        verifiedBloodBanks: true,
      },
    });

    if (!user) return null;

    let facility: any = null;

    if (user.hospitalStaff?.hospital) {
      const h = user.hospitalStaff.hospital;
      facility = {
        id: h.id,
        registrationNumber: h.registrationNumber,
        name: h.name,
        type: 'hospital',
        city: h.city,
        state: h.state,
        phone: h.phone,
        emergencyPhone: h.emergencyPhone,
        address: h.address,
      };
    } else if (user.verifiedHospitals && user.verifiedHospitals.length > 0) {
      const h = user.verifiedHospitals[0];
      facility = {
        id: h.id,
        registrationNumber: h.registrationNumber,
        name: h.name,
        type: 'hospital',
        city: h.city,
        state: h.state,
        phone: h.phone,
        emergencyPhone: h.emergencyPhone,
        address: h.address,
      };
    } else if (user.verifiedBloodBanks && user.verifiedBloodBanks.length > 0) {
      const b = user.verifiedBloodBanks[0];
      facility = {
        id: b.id,
        registrationNumber: b.registrationNumber,
        name: b.name,
        type: 'blood_bank',
        city: b.city,
        state: b.state,
        phone: b.phone,
        address: b.address,
      };
    } else if (user.role === 'blood_bank' || user.role === 'blood_bank_staff') {
      const matchingBB = await prisma.bloodBank.findFirst({
        where: {
          OR: [
            { email: user.email },
            { verifiedBy: user.id },
          ],
        },
      });
      if (matchingBB) {
        facility = {
          id: matchingBB.id,
          registrationNumber: matchingBB.registrationNumber,
          name: matchingBB.name,
          type: 'blood_bank',
          city: matchingBB.city,
          state: matchingBB.state,
          phone: matchingBB.phone,
          address: matchingBB.address,
        };
      }
    } else if (user.role === 'hospital_staff' || user.role === 'hospital') {
      const matchingHosp = await prisma.hospital.findFirst({
        where: {
          OR: [
            { email: user.email },
            { verifiedBy: user.id },
          ],
        },
      });
      if (matchingHosp) {
        facility = {
          id: matchingHosp.id,
          registrationNumber: matchingHosp.registrationNumber,
          name: matchingHosp.name,
          type: 'hospital',
          city: matchingHosp.city,
          state: matchingHosp.state,
          phone: matchingHosp.phone,
          address: matchingHosp.address,
        };
      }
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bloodGroup: user.bloodGroup,
        city: user.city,
        state: user.state,
        phone: user.phone,
        gender: user.gender,
        isVerified: user.isVerified,
      },
      facility,
      citizenProfile: user.citizenProfile,
      governmentProfile: user.governmentProfile,
    };
  }

  /**
   * Link an authenticated user to a registered facility
   */
  static async linkFacility(userId: string, facilityType: 'hospital' | 'blood_bank', facilityId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(facilityId);

    if (facilityType === 'hospital') {
      const hospital = await prisma.hospital.findFirst({
        where: isUuid ? { id: facilityId } : { registrationNumber: facilityId },
      });
      if (!hospital) {
        throw new Error(`Hospital not found for identifier: ${facilityId}`);
      }

      await prisma.hospitalStaff.upsert({
        where: { userId },
        update: { hospitalId: hospital.id },
        create: {
          hospitalId: hospital.id,
          userId,
          designation: 'Hospital Staff Administrator',
          isVerified: true,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'hospital_staff' },
      });

      return {
        id: hospital.id,
        registrationNumber: hospital.registrationNumber,
        name: hospital.name,
        type: 'hospital',
      };
    } else {
      const bloodBank = await prisma.bloodBank.findFirst({
        where: isUuid ? { id: facilityId } : { registrationNumber: facilityId },
      });
      if (!bloodBank) {
        throw new Error(`Blood Bank not found for identifier: ${facilityId}`);
      }

      await prisma.bloodBank.update({
        where: { id: bloodBank.id },
        data: { verifiedBy: userId },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'blood_bank_staff' },
      });

      return {
        id: bloodBank.id,
        registrationNumber: bloodBank.registrationNumber,
        name: bloodBank.name,
        type: 'blood_bank',
      };
    }
  }

  /**
   * Handle Google OAuth Callback code exchange & user provisioning
   */
  static async handleGoogleCallback(code: string, stateStr?: string, customRedirectUri?: string) {
    let state: GoogleAuthState = {};
    if (stateStr) {
      try {
        state = JSON.parse(Buffer.from(stateStr, 'base64url').toString('utf-8'));
      } catch (err) {
        console.error('Failed to parse OAuth state:', err);
      }
    }

    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const redirectUrisToTry = Array.from(new Set([
      customRedirectUri,
      process.env.GOOGLE_REDIRECT_URI,
      process.env.GOOGLE_CALLBACK_URL,
      'http://127.0.0.1:5173/auth/callback',
      'http://localhost:5173/auth/callback',
      'http://localhost:5000/api/auth/google/callback',
      'http://127.0.0.1:5000/api/auth/google/callback',
    ].filter(Boolean) as string[]));

    let tokenData: any = null;
    let lastError = '';

    for (const uri of redirectUrisToTry) {
      try {
        const tokenRes = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: uri,
            grant_type: 'authorization_code',
          }),
        });

        const data: any = await tokenRes.json();
        if (tokenRes.ok && data.access_token) {
          tokenData = data;
          break;
        } else {
          lastError = data.error_description || data.error || 'Failed to exchange authorization code';
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!tokenData || !tokenData.access_token) {
      throw new Error(lastError || 'Failed to exchange authorization code for tokens');
    }

    // Fetch user details from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser: any = await userRes.json();
    if (!googleUser.email) {
      throw new Error('No email address associated with this Google account');
    }

    const role = state.role || 'citizen';
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
      include: {
        citizenProfile: true,
        governmentProfile: true,
        hospitalStaff: true,
      },
    });

    const isNewUser = !user || !user.bloodGroup;

    if (!user) {
      // Create new user in PostgreSQL
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name || googleUser.given_name || 'HemoVite Member',
          avatarUrl: googleUser.picture,
          role,
          isVerified: true,
          passwordHash: `gauth_${googleUser.sub || Date.now()}`,
          lastLoginAt: new Date(),
        },
        include: {
          citizenProfile: true,
          governmentProfile: true,
          hospitalStaff: true,
        },
      });

      // Initialize corresponding profile based on role
      if (role === 'citizen') {
        await prisma.citizenProfile.create({
          data: {
            userId: user.id,
            donorAvailable: true,
            emergencyAvailable: true,
            donationEligible: true,
          },
        });
      } else if (role === 'government') {
        await prisma.governmentProfile.create({
          data: {
            userId: user.id,
            department: 'State Blood Transfusion Council (SBTC)',
            designation: 'Health Coordinator',
            authorityLevel: 'state',
            verificationStatus: 'verified',
          },
        });
      } else if (role === 'hospital_staff' && state.facilityId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.facilityId);
        const hospital = await prisma.hospital.findFirst({
          where: isUuid ? { id: state.facilityId } : { registrationNumber: state.facilityId },
        });
        if (hospital) {
          await prisma.hospitalStaff.create({
            data: {
              hospitalId: hospital.id,
              userId: user.id,
              designation: 'Hospital Administrator',
              isVerified: true,
            },
          });
        }
      } else if ((role === 'blood_bank_staff' || role === 'blood_bank') && state.facilityId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.facilityId);
        const bloodBank = await prisma.bloodBank.findFirst({
          where: isUuid ? { id: state.facilityId } : { registrationNumber: state.facilityId },
        });
        if (bloodBank) {
          await prisma.bloodBank.update({
            where: { id: bloodBank.id },
            data: { verifiedBy: user.id },
          });
        }
      }
    } else {
      // Update existing user with Google metadata
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatarUrl: googleUser.picture || user.avatarUrl,
          isVerified: true,
        },
        include: {
          citizenProfile: true,
          governmentProfile: true,
          hospitalStaff: true,
        },
      });

      // If facilityId provided in state, update linkage
      if (state.facilityId) {
        if (role === 'hospital_staff' || user.role === 'hospital_staff') {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.facilityId);
          const hospital = await prisma.hospital.findFirst({
            where: isUuid ? { id: state.facilityId } : { registrationNumber: state.facilityId },
          });
          if (hospital) {
            await prisma.hospitalStaff.upsert({
              where: { userId: user.id },
              update: { hospitalId: hospital.id },
              create: {
                hospitalId: hospital.id,
                userId: user.id,
                designation: 'Hospital Administrator',
                isVerified: true,
              },
            });
          }
        } else if (role === 'blood_bank_staff' || role === 'blood_bank' || user.role === 'blood_bank_staff') {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.facilityId);
          const bloodBank = await prisma.bloodBank.findFirst({
            where: isUuid ? { id: state.facilityId } : { registrationNumber: state.facilityId },
          });
          if (bloodBank) {
            await prisma.bloodBank.update({
              where: { id: bloodBank.id },
              data: { verifiedBy: user.id },
            });
          }
        }
      }
    }

    // Resolve authoritative facility association
    const resolvedProfile = await this.getCurrentUser(user.id);

    // Generate JWT token with standard claims
    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET || 'hemovite_secure_super_secret_jwt_key_2026',
      { expiresIn: '30d' }
    );

    return {
      token,
      isNewUser,
      user: resolvedProfile?.user || {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bloodGroup: user.bloodGroup,
        city: user.city,
        state: user.state,
        phone: user.phone,
        gender: user.gender,
      },
      facility: resolvedProfile?.facility || null,
      state,
    };
  }

  /**
   * Direct verification for Google ID token (for one-tap or client credential)
   */
  static async verifyGoogleIdToken(idToken: string, options: GoogleAuthState = {}) {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const googleUser: any = await res.json();

    if (!res.ok || !googleUser.email) {
      throw new Error(googleUser.error_description || 'Invalid Google ID Token');
    }

    const role = options.role || 'citizen';
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name || 'HemoVite Member',
          avatarUrl: googleUser.picture,
          role,
          isVerified: true,
          passwordHash: `gauth_${googleUser.sub || Date.now()}`,
          lastLoginAt: new Date(),
        },
      });

      if (role === 'citizen') {
        await prisma.citizenProfile.create({
          data: {
            userId: user.id,
            donorAvailable: true,
            emergencyAvailable: true,
            donationEligible: true,
          },
        });
      }
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatarUrl: googleUser.picture || user.avatarUrl,
          isVerified: true,
        },
      });
    }

    const resolvedProfile = await this.getCurrentUser(user.id);

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET || 'hemovite_secure_super_secret_jwt_key_2026',
      { expiresIn: '30d' }
    );

    return {
      token,
      user: resolvedProfile?.user || {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      facility: resolvedProfile?.facility || null,
    };
  }

  /**
   * Register a new user (Citizen or other role) with password
   */
  static async register(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    bloodGroup?: string;
    city?: string;
    state?: string;
    address?: string;
    gender?: string;
    age?: number;
  }) {
    if (!data.email || !data.password || !data.fullName) {
      throw new Error('Full name, email, and password are required.');
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      throw new Error('An account with this email already exists. Please login instead.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || 'citizen';

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName.trim(),
        email: cleanEmail,
        passwordHash,
        phone: data.phone?.trim() || null,
        role,
        bloodGroup: data.bloodGroup || null,
        city: data.city?.trim() || null,
        state: data.state?.trim() || null,
        gender: data.gender || null,
        isVerified: true,
        isActive: true,
        lastLoginAt: new Date(),
        citizenProfile: role === 'citizen' ? {
          create: {
            address: data.address?.trim() || (data.city ? `${data.city}, ${data.state || 'India'}` : null),
            donationEligible: true,
            donorAvailable: true,
            totalDonations: 0,
          },
        } : undefined,
      },
      include: {
        citizenProfile: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET || 'hemovite_secure_super_secret_jwt_key_2026',
      { expiresIn: '30d' }
    );

    const resolved = await this.getCurrentUser(user.id);

    return {
      token,
      user: resolved?.user || {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        city: user.city,
        state: user.state,
      },
      citizenProfile: resolved?.citizenProfile || user.citizenProfile || null,
      facility: resolved?.facility || null,
    };
  }

  /**
   * Login user with email & password
   */
  static async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Please enter your email and password.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        citizenProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    if (!isMatch && user.passwordHash !== password) {
      throw new Error('Invalid email or password.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      {
        id: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET || 'hemovite_secure_super_secret_jwt_key_2026',
      { expiresIn: '30d' }
    );

    const resolved = await this.getCurrentUser(user.id);

    return {
      token,
      user: resolved?.user || {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        city: user.city,
        state: user.state,
      },
      citizenProfile: resolved?.citizenProfile || user.citizenProfile || null,
      facility: resolved?.facility || null,
    };
  }
}
