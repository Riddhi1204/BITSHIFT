import prisma from '../lib/prisma.js';

export interface ExpiryFilterOptions {
  bloodBankId?: string;
  hospitalId?: string;
  warningDays?: number; // default 7
  bloodGroup?: string;
  status?: 'all' | 'safe' | 'expiring_soon' | 'expired' | 'wasted' | 'used';
  component?: string;
  search?: string;
  state?: string;
  city?: string;
}

export interface WasteRecordInput {
  batchId?: string;
  inventoryId?: string;
  bloodBankId?: string;
  hospitalId?: string;
  bloodGroup: string;
  component?: string;
  units: number;
  reason: string;
  notes?: string;
  recordedById?: string;
}

export class WasteService {
  /**
   * Calculate dynamic expiry status for a batch
   */
  static calculateBatchStatus(
    batch: { expiryDate: Date | string; status?: string | null },
    warningDays: number = 7
  ): {
    status: 'SAFE' | 'EXPIRING_SOON' | 'EXPIRED' | 'WASTED' | 'USED';
    daysRemaining: number;
    badgeColor: string;
  } {
    if (batch.status === 'wasted' || batch.status === 'discarded') {
      return { status: 'WASTED', daysRemaining: 0, badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
    if (batch.status === 'used' || batch.status === 'fulfilled' || batch.status === 'transferred') {
      return { status: 'USED', daysRemaining: 0, badgeColor: 'bg-blue-900/50 text-blue-300 border-blue-700/50' };
    }

    const now = new Date();
    const expiry = new Date(batch.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'EXPIRED', daysRemaining: diffDays, badgeColor: 'bg-red-950 text-red-300 border-red-700' };
    }
    if (diffDays <= warningDays) {
      return { status: 'EXPIRING_SOON', daysRemaining: diffDays, badgeColor: 'bg-amber-950 text-amber-300 border-amber-600' };
    }
    return { status: 'SAFE', daysRemaining: diffDays, badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600' };
  }

  /**
   * Get all batches with dynamic expiry telemetry & summary stats
   */
  static async getExpiryBatches(options: ExpiryFilterOptions = {}) {
    const warningDays = options.warningDays !== undefined ? Number(options.warningDays) : 7;
    const where: any = {};

    // Filter by organization if specified
    if (options.bloodBankId) {
      where.inventory = { bloodBankId: options.bloodBankId };
    } else if (options.hospitalId) {
      where.inventory = { hospitalId: options.hospitalId };
    } else if (options.state || options.city) {
      where.inventory = {
        OR: [
          {
            bloodBank: {
              ...(options.state ? { state: { contains: options.state, mode: 'insensitive' } } : {}),
              ...(options.city ? { city: { contains: options.city, mode: 'insensitive' } } : {}),
            },
          },
          {
            hospital: {
              ...(options.state ? { state: { contains: options.state, mode: 'insensitive' } } : {}),
              ...(options.city ? { city: { contains: options.city, mode: 'insensitive' } } : {}),
            },
          },
        ],
      };
    }

    if (options.bloodGroup && options.bloodGroup !== 'all') {
      where.bloodGroup = options.bloodGroup;
    }
    if (options.component && options.component !== 'all') {
      where.component = { contains: options.component, mode: 'insensitive' };
    }
    if (options.search) {
      where.OR = [
        { batchNumber: { contains: options.search, mode: 'insensitive' } },
        { bloodGroup: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const batches = await prisma.inventoryBatch.findMany({
      where,
      include: {
        inventory: {
          include: {
            bloodBank: { select: { id: true, name: true, city: true, state: true, phone: true } },
            hospital: { select: { id: true, name: true, city: true, state: true, phone: true } },
          },
        },
        donor: { select: { id: true, fullName: true, bloodGroup: true } },
      },
      orderBy: { expiryDate: 'asc' },
    });

    const now = new Date();

    // Map batches with computed statuses & telemetry
    const mappedBatches = batches.map((batch) => {
      const { status: calculatedStatus, daysRemaining, badgeColor } = this.calculateBatchStatus(batch, warningDays);
      const orgName = batch.inventory.bloodBank?.name || batch.inventory.hospital?.name || 'Unknown Facility';
      const orgType = batch.inventory.bloodBank ? 'Blood Bank' : 'Hospital';
      const location = `${batch.inventory.bloodBank?.city || batch.inventory.hospital?.city || ''}, ${batch.inventory.bloodBank?.state || batch.inventory.hospital?.state || ''}`;

      return {
        id: batch.id,
        batchNumber: batch.batchNumber,
        bloodGroup: batch.bloodGroup,
        component: batch.component,
        units: batch.units,
        collectionDate: batch.collectionDate,
        expiryDate: batch.expiryDate,
        rawStatus: batch.status,
        calculatedStatus,
        daysRemaining,
        badgeColor,
        organizationName: orgName,
        organizationType: orgType,
        organizationId: batch.inventory.bloodBankId || batch.inventory.hospitalId,
        location,
        donor: batch.donor,
      };
    });

    // Compute Summary Stats across full dataset
    let totalUnits = 0;
    let safeUnits = 0;
    let expiringSoonUnits = 0;
    let expiredUnits = 0;
    let wastedUnits = 0;
    let usedUnits = 0;

    let expiringTodayUnits = 0;
    let expiringIn3DaysUnits = 0;
    let expiringIn7DaysUnits = 0;
    let expiringIn30DaysUnits = 0;

    mappedBatches.forEach((b) => {
      const u = b.units || 0;
      totalUnits += u;

      if (b.calculatedStatus === 'WASTED') wastedUnits += u;
      else if (b.calculatedStatus === 'USED') usedUnits += u;
      else if (b.calculatedStatus === 'EXPIRED') expiredUnits += u;
      else if (b.calculatedStatus === 'EXPIRING_SOON') expiringSoonUnits += u;
      else if (b.calculatedStatus === 'SAFE') safeUnits += u;

      // Timeframe buckets
      if (b.calculatedStatus !== 'WASTED' && b.calculatedStatus !== 'USED' && b.daysRemaining >= 0) {
        if (b.daysRemaining === 0) expiringTodayUnits += u;
        if (b.daysRemaining <= 3) expiringIn3DaysUnits += u;
        if (b.daysRemaining <= 7) expiringIn7DaysUnits += u;
        if (b.daysRemaining <= 30) expiringIn30DaysUnits += u;
      }
    });

    // Filter by requested status if specified
    const filteredBatches = options.status && options.status !== 'all'
      ? mappedBatches.filter((b) => b.calculatedStatus.toLowerCase() === options.status?.toLowerCase())
      : mappedBatches;

    const wasteRate = totalUnits > 0 ? Number(((wastedUnits / totalUnits) * 100).toFixed(1)) : 0;

    return {
      batches: filteredBatches,
      summary: {
        totalUnits,
        safeUnits,
        expiringSoonUnits,
        expiredUnits,
        wastedUnits,
        usedUnits,
        wasteRate,
        expiringTodayUnits,
        expiringIn3DaysUnits,
        expiringIn7DaysUnits,
        expiringIn30DaysUnits,
        totalBatches: mappedBatches.length,
        warningDaysApplied: warningDays,
      },
    };
  }

  /**
   * Record Blood Waste with reason and audit trail
   */
  static async recordWaste(data: WasteRecordInput) {
    if (!data.units || data.units <= 0) {
      throw new Error('Waste units must be greater than 0');
    }
    if (!data.reason || data.reason.trim() === '') {
      throw new Error('Waste reason is mandatory');
    }

    let targetBatch = null;
    let targetInventory = null;

    if (data.batchId) {
      targetBatch = await prisma.inventoryBatch.findUnique({
        where: { id: data.batchId },
        include: { inventory: true },
      });

      if (!targetBatch) {
        throw new Error('Inventory batch not found');
      }
      if (targetBatch.status === 'wasted') {
        throw new Error('This batch has already been marked as wasted');
      }

      // Mark batch as discarded
      await prisma.inventoryBatch.update({
        where: { id: data.batchId },
        data: { status: 'discarded' },
      });

      // Decrement inventory available units
      targetInventory = targetBatch.inventory;
      if (targetInventory) {
        const newUnits = Math.max(0, (targetInventory.unitsAvailable ?? 0) - data.units);
        await prisma.bloodInventory.update({
          where: { id: targetInventory.id },
          data: { unitsAvailable: newUnits, lastUpdated: new Date() },
        });
      }
    } else if (data.inventoryId) {
      targetInventory = await prisma.bloodInventory.findUnique({
        where: { id: data.inventoryId },
      });
      if (targetInventory) {
        const newUnits = Math.max(0, (targetInventory.unitsAvailable ?? 0) - data.units);
        await prisma.bloodInventory.update({
          where: { id: targetInventory.id },
          data: { unitsAvailable: newUnits, lastUpdated: new Date() },
        });
      }
    } else if (data.bloodBankId || data.hospitalId) {
      // Locate inventory by bloodGroup
      targetInventory = await prisma.bloodInventory.findFirst({
        where: {
          ...(data.bloodBankId ? { bloodBankId: data.bloodBankId } : {}),
          ...(data.hospitalId ? { hospitalId: data.hospitalId } : {}),
          bloodGroup: data.bloodGroup,
        },
      });
      if (targetInventory) {
        const newUnits = Math.max(0, (targetInventory.unitsAvailable ?? 0) - data.units);
        await prisma.bloodInventory.update({
          where: { id: targetInventory.id },
          data: { unitsAvailable: newUnits, lastUpdated: new Date() },
        });
      }
    }

    // Create waste record
    const wasteRecord = await prisma.wasteRecord.create({
      data: {
        batchId: data.batchId || null,
        inventoryId: targetInventory?.id || data.inventoryId || null,
        bloodBankId: data.bloodBankId || targetInventory?.bloodBankId || null,
        hospitalId: data.hospitalId || targetInventory?.hospitalId || null,
        bloodGroup: data.bloodGroup,
        component: data.component || targetBatch?.component || 'whole_blood',
        units: data.units,
        reason: data.reason,
        notes: data.notes || null,
        recordedById: data.recordedById || null,
        wastedAt: new Date(),
      },
      include: {
        recordedBy: { select: { id: true, fullName: true, email: true } },
        bloodBank: { select: { id: true, name: true, city: true } },
        hospital: { select: { id: true, name: true, city: true } },
        batch: true,
      },
    });

    // Record in AuditLog
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.recordedById || null,
          action: 'BLOOD_MARKED_AS_WASTED',
          entityType: 'WasteRecord',
          entityId: wasteRecord.id,
          newValues: {
            batchId: data.batchId,
            bloodGroup: data.bloodGroup,
            units: data.units,
            reason: data.reason,
            notes: data.notes,
          },
        },
      });
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }

    return wasteRecord;
  }

  /**
   * Update batch status with validation rules (e.g. mark as used, cannot reissue expired blood)
   */
  static async updateBatchStatus(
    batchId: string,
    newStatus: 'available' | 'used' | 'wasted' | 'reserved',
    userId?: string,
    reason?: string
  ) {
    const batch = await prisma.inventoryBatch.findUnique({
      where: { id: batchId },
      include: { inventory: true },
    });

    if (!batch) {
      throw new Error('Batch not found');
    }

    // Safety checks
    if (batch.status === 'wasted' && newStatus === 'available') {
      throw new Error('Wasted or discarded blood cannot be returned to available inventory');
    }

    const { status: calculatedStatus } = this.calculateBatchStatus(batch);
    if (calculatedStatus === 'EXPIRED' && (newStatus === 'available' || newStatus === 'used')) {
      throw new Error('Expired blood cannot be issued or marked as available for clinical use');
    }

    const oldStatus = batch.status;

    // Update batch
    const updatedBatch = await prisma.inventoryBatch.update({
      where: { id: batchId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        inventory: true,
      },
    });

    // If marked as used or wasted, decrement unitsAvailable
    if ((newStatus === 'used' || newStatus === 'wasted') && oldStatus !== 'used' && oldStatus !== 'wasted') {
      if (batch.inventory) {
        const newUnits = Math.max(0, (batch.inventory.unitsAvailable ?? 0) - batch.units);
        await prisma.bloodInventory.update({
          where: { id: batch.inventory.id },
          data: { unitsAvailable: newUnits, lastUpdated: new Date() },
        });
      }
    }

    // If marked as wasted, create a waste record automatically
    if (newStatus === 'wasted') {
      await prisma.wasteRecord.create({
        data: {
          batchId: batch.id,
          inventoryId: batch.inventoryId,
          bloodBankId: batch.inventory.bloodBankId,
          hospitalId: batch.inventory.hospitalId,
          bloodGroup: batch.bloodGroup,
          component: batch.component,
          units: batch.units,
          reason: reason || (calculatedStatus === 'EXPIRED' ? 'Expired' : 'Discarded'),
          notes: `Batch status changed to wasted by user`,
          recordedById: userId || null,
          wastedAt: new Date(),
        },
      });
    }

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: userId || null,
          action: 'BATCH_STATUS_UPDATED',
          entityType: 'InventoryBatch',
          entityId: batch.id,
          oldValues: { status: oldStatus },
          newValues: { status: newStatus, reason },
        },
      });
    } catch (e) {
      console.error('Failed to log batch update audit:', e);
    }

    return updatedBatch;
  }

  /**
   * Get comprehensive waste & expiry analytics across the grid or for a specific facility
   */
  static async getWasteAnalytics(options: {
    bloodBankId?: string;
    hospitalId?: string;
    state?: string;
    city?: string;
    bloodGroup?: string;
    dateRange?: string;
  } = {}) {
    const whereWaste: any = {};
    if (options.bloodBankId) whereWaste.bloodBankId = options.bloodBankId;
    if (options.hospitalId) whereWaste.hospitalId = options.hospitalId;
    if (options.bloodGroup && options.bloodGroup !== 'all') whereWaste.bloodGroup = options.bloodGroup;

    if (options.state || options.city) {
      whereWaste.OR = [
        {
          bloodBank: {
            ...(options.state ? { state: { contains: options.state, mode: 'insensitive' } } : {}),
            ...(options.city ? { city: { contains: options.city, mode: 'insensitive' } } : {}),
          },
        },
        {
          hospital: {
            ...(options.state ? { state: { contains: options.state, mode: 'insensitive' } } : {}),
            ...(options.city ? { city: { contains: options.city, mode: 'insensitive' } } : {}),
          },
        },
      ];
    }

    // Fetch waste records and inventory batches
    const [wasteRecords, expiryReport] = await Promise.all([
      prisma.wasteRecord.findMany({
        where: whereWaste,
        include: {
          bloodBank: { select: { id: true, name: true, city: true, state: true } },
          hospital: { select: { id: true, name: true, city: true, state: true } },
        },
        orderBy: { wastedAt: 'desc' },
      }),
      this.getExpiryBatches(options),
    ]);

    const totalWastedUnits = wasteRecords.reduce((acc, curr) => acc + (curr.units || 0), 0);
    const totalInventoryUnits = expiryReport.summary.totalUnits;
    const totalPool = totalInventoryUnits + totalWastedUnits;
    const wasteRate = totalPool > 0 ? Number(((totalWastedUnits / totalPool) * 100).toFixed(1)) : 0;

    // Waste by Blood Group
    const wasteByGroup: Record<string, number> = {
      'O+': 0, 'O-': 0, 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0,
    };
    wasteRecords.forEach((w) => {
      if (wasteByGroup[w.bloodGroup] !== undefined) {
        wasteByGroup[w.bloodGroup] += w.units;
      } else {
        wasteByGroup[w.bloodGroup] = (wasteByGroup[w.bloodGroup] || 0) + w.units;
      }
    });

    // Waste by Reason
    const wasteByReason: Record<string, number> = {};
    wasteRecords.forEach((w) => {
      const r = w.reason || 'Other';
      wasteByReason[r] = (wasteByReason[r] || 0) + w.units;
    });

    // Monthly Waste Trend (Group by YYYY-MM)
    const monthlyMap = new Map<string, { month: string; wastedUnits: number; recordCount: number }>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    wasteRecords.forEach((w) => {
      const d = w.wastedAt ? new Date(w.wastedAt) : new Date(w.createdAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${months[d.getMonth()]} ${d.getFullYear()}`;

      const existing = monthlyMap.get(key) || { month: label, wastedUnits: 0, recordCount: 0 };
      existing.wastedUnits += w.units;
      existing.recordCount += 1;
      monthlyMap.set(key, existing);
    });

    const monthlyTrend = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((entry) => entry[1]);

    // Historical comparison (current month vs previous month)
    const now = new Date();
    const currMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const currMonthUnits = monthlyMap.get(currMonthKey)?.wastedUnits || 0;
    const prevMonthUnits = monthlyMap.get(prevMonthKey)?.wastedUnits;

    let historicalComparison: {
      hasEnoughData: boolean;
      previousPeriodUnits?: number;
      currentPeriodUnits?: number;
      diffPercent?: number;
      trend?: 'decrease' | 'increase' | 'neutral';
      message: string;
    } = {
      hasEnoughData: false,
      message: 'Not enough historical data',
    };

    if (prevMonthUnits !== undefined && prevMonthUnits > 0) {
      const diff = currMonthUnits - prevMonthUnits;
      const pct = Number(((diff / prevMonthUnits) * 100).toFixed(1));
      historicalComparison = {
        hasEnoughData: true,
        previousPeriodUnits: prevMonthUnits,
        currentPeriodUnits: currMonthUnits,
        diffPercent: Math.abs(pct),
        trend: pct < 0 ? 'decrease' : pct > 0 ? 'increase' : 'neutral',
        message: pct < 0 ? `↓ ${Math.abs(pct)}% compared with previous month` : `↑ ${Math.abs(pct)}% compared with previous month`,
      };
    }

    // Waste by Organization
    const orgMap = new Map<string, { id: string; name: string; type: string; city: string; wastedUnits: number }>();
    wasteRecords.forEach((w) => {
      const org = w.bloodBank || w.hospital;
      if (org) {
        const key = org.id;
        const existing = orgMap.get(key) || {
          id: org.id,
          name: org.name,
          type: w.bloodBank ? 'Blood Bank' : 'Hospital',
          city: org.city || 'National Grid',
          wastedUnits: 0,
        };
        existing.wastedUnits += w.units;
        orgMap.set(key, existing);
      }
    });

    const wasteByOrganization = Array.from(orgMap.values())
      .sort((a, b) => b.wastedUnits - a.wastedUnits)
      .slice(0, 10);

    return {
      totalWastedUnits,
      totalInventoryUnits,
      wasteRate,
      historicalComparison,
      wasteByGroup,
      wasteByReason,
      monthlyTrend,
      wasteByOrganization,
      expiryVsUsedVsWasted: {
        safe: expiryReport.summary.safeUnits,
        expiringSoon: expiryReport.summary.expiringSoonUnits,
        expired: expiryReport.summary.expiredUnits,
        used: expiryReport.summary.usedUnits,
        wasted: totalWastedUnits,
      },
      recentWasteRecords: wasteRecords.slice(0, 15),
    };
  }

  /**
   * Generate Smart Waste Prevention Insights derived from real database metrics
   */
  static async getWastePreventionInsights(options: { bloodBankId?: string; hospitalId?: string } = {}) {
    const analytics = await this.getWasteAnalytics(options);
    const expiryReport = await this.getExpiryBatches(options);

    const insights: Array<{
      id: string;
      type: 'warning' | 'info' | 'success' | 'alert';
      title: string;
      description: string;
      actionRecommendation: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
    }> = [];

    // 1. Group with highest wastage
    const groupEntries = Object.entries(analytics.wasteByGroup).sort((a, b) => b[1] - a[1]);
    if (groupEntries.length > 0 && groupEntries[0][1] > 0) {
      const topGroup = groupEntries[0][0];
      const topUnits = groupEntries[0][1];
      insights.push({
        id: 'top-wasted-group',
        type: 'warning',
        title: `High Expiry & Waste Velocity in ${topGroup}`,
        description: `${topGroup} accounts for ${topUnits} units (${Math.round((topUnits / (analytics.totalWastedUnits || 1)) * 100)}%) of total recorded waste across active storage racks.`,
        actionRecommendation: `Prioritize ${topGroup} inventory for first-in-first-out (FIFO) clinical distribution or voluntary camp coordination.`,
        impact: 'HIGH',
      });
    }

    // 2. Expiring soon urgency
    if (expiryReport.summary.expiringSoonUnits > 0) {
      insights.push({
        id: 'expiring-soon-action',
        type: 'alert',
        title: `${expiryReport.summary.expiringSoonUnits} Units Nearing Critical Expiry Window`,
        description: `${expiryReport.summary.expiringSoonUnits} units are expiring within ${expiryReport.summary.warningDaysApplied} days (${expiryReport.summary.expiringTodayUnits} units expiring today).`,
        actionRecommendation: `Issue automated inter-hospital transfer requests or notify adjacent surgical trauma centers immediately.`,
        impact: 'HIGH',
      });
    }

    // 3. Dominant Waste Reason analysis
    const reasonEntries = Object.entries(analytics.wasteByReason).sort((a, b) => b[1] - a[1]);
    if (reasonEntries.length > 0 && reasonEntries[0][1] > 0) {
      const topReason = reasonEntries[0][0];
      const topReasonUnits = reasonEntries[0][1];
      insights.push({
        id: 'dominant-waste-reason',
        type: 'info',
        title: `Primary Waste Factor: ${topReason}`,
        description: `"${topReason}" is the root cause for ${topReasonUnits} discarded units.`,
        actionRecommendation:
          topReason === 'Temperature Excursion'
            ? 'Inspect cold-chain sensors and backup generator battery integrity on rack units.'
            : topReason === 'Damaged Bag' || topReason === 'Leakage'
            ? 'Review centrifugation protocols and packaging pressure standards with phlebotomy staff.'
            : 'Schedule donor camp volumes closer to anticipated weekly hospital consumption.',
        impact: 'MEDIUM',
      });
    }

    // 4. Waste Rate Benchmark
    if (analytics.wasteRate > 5) {
      insights.push({
        id: 'waste-rate-threshold',
        type: 'warning',
        title: `Waste Rate (${analytics.wasteRate}%) Exceeds Recommended 3% Benchmark`,
        description: `Current waste rate of ${analytics.wasteRate}% is higher than national blood transfusion guidelines.`,
        actionRecommendation: `Implement strict expiry-first reservation queues and enable cross-organization sharing.`,
        impact: 'HIGH',
      });
    } else {
      insights.push({
        id: 'waste-rate-healthy',
        type: 'success',
        title: `Optimal Waste Management (${analytics.wasteRate}%)`,
        description: `Inventory waste rate is maintained well within the national safety benchmark (<5%).`,
        actionRecommendation: `Continue automated batch rotation and real-time ledger tracking.`,
        impact: 'LOW',
      });
    }

    return insights;
  }

  /**
   * Get Live Expiry Alerts
   */
  static async getExpiryAlerts(options: { bloodBankId?: string; hospitalId?: string } = {}) {
    const report = await this.getExpiryBatches({ ...options, warningDays: 7, status: 'expiring_soon' });
    const expiredReport = await this.getExpiryBatches({ ...options, status: 'expired' });

    const alerts: Array<{
      id: string;
      level: 'critical' | 'warning' | 'info';
      title: string;
      message: string;
      bloodGroup: string;
      units: number;
      batchNumber: string;
      daysRemaining: number;
      facilityName: string;
      timestamp: Date;
    }> = [];

    // Expired alerts
    expiredReport.batches.slice(0, 5).forEach((b) => {
      alerts.push({
        id: `exp-${b.id}`,
        level: 'critical',
        title: `Expired Blood Batch Detected`,
        message: `🔴 ${b.units} units of ${b.bloodGroup} (${b.component}) expired on ${new Date(b.expiryDate).toLocaleDateString()}. Action required: Discard & record waste.`,
        bloodGroup: b.bloodGroup,
        units: b.units,
        batchNumber: b.batchNumber,
        daysRemaining: b.daysRemaining,
        facilityName: b.organizationName,
        timestamp: new Date(),
      });
    });

    // Expiring soon alerts
    report.batches.slice(0, 10).forEach((b) => {
      const isUrgent = b.daysRemaining <= 2;
      alerts.push({
        id: `soon-${b.id}`,
        level: isUrgent ? 'critical' : 'warning',
        title: `Batch Expiring in ${b.daysRemaining} Day${b.daysRemaining === 1 ? '' : 's'}`,
        message: `⚠ ${b.units} units of ${b.bloodGroup} at ${b.organizationName} expire ${b.daysRemaining === 0 ? 'today' : `in ${b.daysRemaining} days`}.`,
        bloodGroup: b.bloodGroup,
        units: b.units,
        batchNumber: b.batchNumber,
        daysRemaining: b.daysRemaining,
        facilityName: b.organizationName,
        timestamp: new Date(),
      });
    });

    return alerts;
  }
}
