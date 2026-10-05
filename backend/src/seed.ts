import prisma from './lib/prisma.js';

async function main() {
  console.log('🌱 Starting HemoVite Database Seeding...');

  // 1. Seed Badges
  const badges = [
    { name: 'First Drop', description: 'Completed your first blood donation', requirementType: 'donations', requirementValue: 1, points: 100 },
    { name: 'Life Saver', description: 'Completed 5 blood donations', requirementType: 'donations', requirementValue: 5, points: 500 },
    { name: 'Hero Donor', description: 'Completed 10 blood donations', requirementType: 'donations', requirementValue: 10, points: 1000 },
    { name: 'Emergency Hero', description: 'Responded to an emergency blood request', requirementType: 'emergency_response', requirementValue: 1, points: 250 },
    { name: 'Blood Guardian', description: 'Completed 25 blood donations', requirementType: 'donations', requirementValue: 25, points: 2500 },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { name: b.name },
      update: {},
      create: b,
    });
  }
  console.log('✓ Badges seeded');

  // 2. Seed Regions
  const states = [
    { name: 'Delhi', type: 'state', latitude: 28.6139, longitude: 77.209 },
    { name: 'Jharkhand', type: 'state', latitude: 23.6102, longitude: 85.2799 },
    { name: 'Maharashtra', type: 'state', latitude: 19.7515, longitude: 75.7139 },
    { name: 'Karnataka', type: 'state', latitude: 15.3173, longitude: 75.7139 },
  ];

  const createdRegions: Record<string, string> = {};
  for (const s of states) {
    const existing = await prisma.region.findFirst({ where: { name: s.name } });
    if (!existing) {
      const reg = await prisma.region.create({ data: s });
      createdRegions[s.name] = reg.id;
    } else {
      createdRegions[s.name] = existing.id;
    }
  }
  console.log('✓ Regions seeded');

  // 3. Seed Demo Users
  const demoUsers = [
    {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'citizen',
      bloodGroup: 'O+',
      city: 'New Delhi',
      state: 'Delhi',
      passwordHash: 'password_hash_demo',
      isVerified: true,
    },
    {
      fullName: 'Dr. Priya Patel',
      email: 'priya.patel@aiims.edu',
      phone: '+91 98111 22334',
      role: 'hospital_staff',
      bloodGroup: 'A+',
      city: 'New Delhi',
      state: 'Delhi',
      passwordHash: 'password_hash_demo',
      isVerified: true,
    },
    {
      fullName: 'Vikramaditya Verma',
      email: 'officer.verma@gov.in',
      phone: '+91 94311 00998',
      role: 'government',
      bloodGroup: 'B+',
      city: 'Ranchi',
      state: 'Jharkhand',
      passwordHash: 'password_hash_demo',
      isVerified: true,
    },
  ];

  const userMap: Record<string, string> = {};
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        regionId: createdRegions[u.state],
      },
    });
    userMap[u.email] = user.id;

    if (u.role === 'citizen') {
      await prisma.citizenProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          totalDonations: 4,
          donorAvailable: true,
          emergencyAvailable: true,
          donationEligible: true,
          address: 'Block C-4, Vasant Kunj, New Delhi',
        },
      });
    } else if (u.role === 'government') {
      await prisma.governmentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          department: 'Ministry of Health & Family Welfare',
          designation: 'State Blood Safety Nodal Director',
          employeeId: 'GOV-JH-8812',
          authorityLevel: 'state',
          verificationStatus: 'verified',
        },
      });
    }
  }
  console.log('✓ Users & Profiles seeded');

  // 4. Seed Hospitals
  const hospitals = [
    {
      name: 'All India Institute of Medical Sciences (AIIMS)',
      registrationNumber: 'HOS-001',
      address: 'Ansari Nagar, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '+91 11 2658 8500',
      emergencyPhone: '+91 11 2658 8700',
      email: 'emergency@aiims.edu',
      verificationStatus: 'verified',
      stock: { 'O-': 6, 'O+': 24, 'A+': 32, 'A-': 4, 'B+': 38, 'B-': 5, 'AB+': 18, 'AB-': 2 },
    },
    {
      name: 'Raj Medical Institute & Research Centre',
      registrationNumber: 'HOS-002',
      address: 'Bariatu Road, Ranchi',
      city: 'Ranchi',
      state: 'Jharkhand',
      phone: '+91 651 254 1533',
      emergencyPhone: '+91 651 254 9999',
      email: 'blood@rajhospital.org',
      verificationStatus: 'verified',
      stock: { 'O-': 2, 'O+': 18, 'A+': 22, 'A-': 3, 'B+': 26, 'B-': 4, 'AB+': 10, 'AB-': 1 },
    },
    {
      name: 'Fortis Escorts Hospital & Research Centre',
      registrationNumber: 'HOS-009',
      address: 'Okhla Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '+91 11 4713 5000',
      emergencyPhone: '+91 11 4713 5100',
      email: 'trauma@fortishealthcare.com',
      verificationStatus: 'verified',
      stock: { 'O-': 1, 'O+': 14, 'A+': 16, 'A-': 2, 'B+': 20, 'B-': 3, 'AB+': 8, 'AB-': 1 },
    },
  ];

  for (const h of hospitals) {
    const { stock, ...hData } = h;
    const existing = await prisma.hospital.findFirst({
      where: { registrationNumber: h.registrationNumber },
    });

    let hospitalId = existing?.id;
    if (!existing) {
      const created = await prisma.hospital.create({
        data: {
          ...hData,
          regionId: createdRegions[h.state],
        },
      });
      hospitalId = created.id;
    }

    if (hospitalId) {
      // Seed inventories for all 8 blood groups
      for (const [group, units] of Object.entries(stock)) {
        const inv = await prisma.bloodInventory.findFirst({
          where: { hospitalId, bloodGroup: group },
        });
        if (!inv) {
          await prisma.bloodInventory.create({
            data: {
              hospitalId,
              bloodGroup: group,
              unitsAvailable: units,
              minimumRequiredUnits: 5,
            },
          });
        }
      }

      // Seed shortage prediction
      await prisma.shortagePrediction.create({
        data: {
          hospitalId,
          regionId: createdRegions[h.state],
          bloodGroup: 'O-',
          predictedShortageUnits: 8,
          predictedDemandUnits: 15,
          currentAvailableUnits: stock['O-'] || 2,
          riskScore: 84.5,
          riskLevel: 'critical',
          modelName: 'XGBoost-DemandRisk',
          modelVersion: 'v3.2',
          explanation: 'Elevated trauma caseloads and projected deficit in O- whole blood units.',
        },
      });
    }
  }
  console.log('✓ Hospitals & Inventory seeded');

  // 5. Seed Blood Banks
  const bloodBanks = [
    {
      name: 'Red Cross Central Blood Bank',
      registrationNumber: 'BB-001',
      address: '1 Red Cross Road, Central District',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '+91 11 2371 6441',
      email: 'contact@redcrossblood.org',
      operatingHours: '24 Hours Open',
      verificationStatus: 'verified',
      stock: { 'O-': 18, 'O+': 64, 'A+': 88, 'A-': 14, 'B+': 95, 'B-': 12, 'AB+': 46, 'AB-': 8 },
    },
    {
      name: 'RIMS Regional Transfusion Centre',
      registrationNumber: 'BB-002',
      address: 'RIMS Campus, Bariatu',
      city: 'Ranchi',
      state: 'Jharkhand',
      phone: '+91 651 254 5404',
      email: 'bloodbank@rimsranchi.ac.in',
      operatingHours: '24 Hours Open',
      verificationStatus: 'verified',
      stock: { 'O-': 12, 'O+': 48, 'A+': 55, 'A-': 8, 'B+': 60, 'B-': 10, 'AB+': 30, 'AB-': 4 },
    },
  ];

  for (const bb of bloodBanks) {
    const { stock, ...bbData } = bb;
    const existing = await prisma.bloodBank.findFirst({
      where: { registrationNumber: bb.registrationNumber },
    });

    let bankId = existing?.id;
    if (!existing) {
      const created = await prisma.bloodBank.create({
        data: {
          ...bbData,
          regionId: createdRegions[bb.state],
        },
      });
      bankId = created.id;
    }

    if (bankId) {
      for (const [group, units] of Object.entries(stock)) {
        let inv = await prisma.bloodInventory.findFirst({
          where: { bloodBankId: bankId, bloodGroup: group },
        });
        if (!inv) {
          inv = await prisma.bloodInventory.create({
            data: {
              bloodBankId: bankId,
              bloodGroup: group,
              unitsAvailable: units,
              minimumRequiredUnits: 10,
            },
          });
        }

        // Create sample inventory batches with various expiry dates
        const existingBatches = await prisma.inventoryBatch.count({ where: { inventoryId: inv.id } });
        if (existingBatches === 0) {
          const now = new Date();
          const sampleBatches = [
            {
              batchNumber: `BATCH-${bb.registrationNumber}-${group}-01`,
              bloodGroup: group,
              component: 'Whole Blood',
              units: Math.max(2, Math.floor(units * 0.2)),
              collectionDate: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000),
              expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Expiring in 3 days
              status: 'available',
            },
            {
              batchNumber: `BATCH-${bb.registrationNumber}-${group}-02`,
              bloodGroup: group,
              component: 'Packed Red Blood Cells',
              units: Math.max(3, Math.floor(units * 0.4)),
              collectionDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
              expiryDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // Safe (25 days)
              status: 'available',
            },
            {
              batchNumber: `BATCH-${bb.registrationNumber}-${group}-03`,
              bloodGroup: group,
              component: 'Platelets',
              units: Math.max(1, Math.floor(units * 0.1)),
              collectionDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
              expiryDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Expired 1 day ago
              status: 'available',
            },
            {
              batchNumber: `BATCH-${bb.registrationNumber}-${group}-04`,
              bloodGroup: group,
              component: 'Fresh Frozen Plasma',
              units: Math.max(2, Math.floor(units * 0.15)),
              collectionDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
              expiryDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
              status: 'available',
            },
          ];

          for (const b of sampleBatches) {
            await prisma.inventoryBatch.create({
              data: {
                ...b,
                inventoryId: inv.id,
              },
            });
          }
        }
      }
    }
  }
  console.log('✓ Blood Banks & Inventory Batches seeded');

  // 6. Seed Sample Waste Records for Analytics
  const wasteCount = await prisma.wasteRecord.count();
  if (wasteCount === 0) {
    const allBanks = await prisma.bloodBank.findMany();
    const demoUser = await prisma.user.findFirst({ where: { role: 'hospital_staff' } });
    const now = new Date();

    const sampleWaste = [
      { bloodGroup: 'O+', units: 4, reason: 'Expired', component: 'Whole Blood', daysAgo: 2 },
      { bloodGroup: 'A+', units: 2, reason: 'Temperature Excursion', component: 'Platelets', daysAgo: 5 },
      { bloodGroup: 'B+', units: 3, reason: 'Damaged Bag', component: 'Packed Red Blood Cells', daysAgo: 8 },
      { bloodGroup: 'AB+', units: 5, reason: 'Expired', component: 'Whole Blood', daysAgo: 12 },
      { bloodGroup: 'O-', units: 1, reason: 'Leakage', component: 'Packed Red Blood Cells', daysAgo: 15 },
      { bloodGroup: 'A-', units: 2, reason: 'Contamination', component: 'Platelets', daysAgo: 20 },
      { bloodGroup: 'B-', units: 1, reason: 'Processing Error', component: 'Fresh Frozen Plasma', daysAgo: 25 },
      { bloodGroup: 'O+', units: 6, reason: 'Expired', component: 'Whole Blood', daysAgo: 35 },
      { bloodGroup: 'A+', units: 3, reason: 'Temperature Excursion', component: 'Platelets', daysAgo: 45 },
    ];

    for (let i = 0; i < sampleWaste.length; i++) {
      const sw = sampleWaste[i];
      const bank = allBanks[i % allBanks.length];
      if (bank) {
        await prisma.wasteRecord.create({
          data: {
            bloodBankId: bank.id,
            bloodGroup: sw.bloodGroup,
            component: sw.component,
            units: sw.units,
            reason: sw.reason,
            notes: `Recorded during routine quality assurance audit.`,
            recordedById: demoUser?.id || null,
            wastedAt: new Date(now.getTime() - sw.daysAgo * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
    console.log('✓ Initial Waste Records & Audit trail seeded');
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
