import * as admin from 'firebase-admin';

/**
 * Log cost tracking data to Firestore
 * Enables monitoring and optimization of cascade strategy
 */
export async function logCost(
  db: admin.firestore.Firestore,
  operation: string,
  method: 'FREE' | 'CHEAP' | 'EXPENSIVE',
  status: 'PASS' | 'FAIL',
  cost: number,
  timeMs: number
): Promise<void> {
  try {
    await db.collection('cost_tracking').doc(operation).collection('logs').add({
      method,
      status,
      cost,
      timeMs,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Cost logging error:', error);
    // Don't throw - logging should never break the main flow
  }
}

/**
 * Get cost statistics for an operation
 * Used for dashboard analytics
 */
export async function getCostStats(
  db: admin.firestore.Firestore,
  operation: string,
  startDate: Date,
  endDate: Date
): Promise<any> {
  const logs = await db
    .collection('cost_tracking')
    .doc(operation)
    .collection('logs')
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const stats = {
    total_requests: 0,
    total_cost: 0,
    by_method: {
      FREE: { count: 0, cost: 0, pass: 0, fail: 0 },
      CHEAP: { count: 0, cost: 0, pass: 0, fail: 0 },
      EXPENSIVE: { count: 0, cost: 0, pass: 0, fail: 0 },
    },
    avg_time_ms: 0,
  };

  let totalTime = 0;

  logs.forEach((doc) => {
    const data = doc.data();
    stats.total_requests++;
    stats.total_cost += data.cost;
    totalTime += data.timeMs;

    const methodStats = stats.by_method[data.method as keyof typeof stats.by_method];
    methodStats.count++;
    methodStats.cost += data.cost;
    if (data.status === 'PASS') methodStats.pass++;
    if (data.status === 'FAIL') methodStats.fail++;
  });

  stats.avg_time_ms = stats.total_requests > 0 ? totalTime / stats.total_requests : 0;

  return stats;
}
