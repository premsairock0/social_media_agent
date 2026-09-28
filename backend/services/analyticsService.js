/**
 * Analytics Service
 * 
 * Responsible for mathematical engagement calculations and benchmark comparisons
 * with sample-size-aware statistical confidence.
 */

class AnalyticsService {
  /**
   * Calculate standard social engagement rate percentage.
   */
  calculateEngagementRate(metrics) {
    const { likes = 0, comments = 0, shares = 0, impressions = 0 } = metrics;
    if (!impressions || Number(impressions) === 0) {
      return 0;
    }
    const totalInteractions = Number(likes) + Number(comments) + Number(shares);
    return Number(((totalInteractions / Number(impressions)) * 100).toFixed(2));
  }

  /**
   * Compare post metrics against brand benchmarks, with sample-size awareness.
   * Threshold: < 100 impressions is treated as an early/unvalidated signal.
   */
  compareWithBenchmark(currentRate, benchmarkRate = 2.5, impressions = 0) {
    const delta = Number((currentRate - benchmarkRate).toFixed(2));
    const percentageDifference = benchmarkRate > 0 ? Number(((delta / benchmarkRate) * 100).toFixed(1)) : 0;
    const numImpressions = Number(impressions);
    const isSmallSample = numImpressions < 100;

    let performanceLabel = 'average';
    let interpretation = '';

    if (isSmallSample) {
      performanceLabel = 'Early signal (insufficient sample)';
      interpretation = `Early signal — sample size (${numImpressions} impressions) is too small for a reliable conclusion. More reach is required before validating audience preference.`;
    } else {
      if (percentageDifference >= 25) {
        performanceLabel = 'substantially outperformed';
        interpretation = `Statistically robust signal (${numImpressions.toLocaleString()} impressions) substantially exceeding account baseline (+${percentageDifference}%).`;
      } else if (percentageDifference >= 10) {
        performanceLabel = 'outperformed';
        interpretation = `Statistically reliable signal (${numImpressions.toLocaleString()} impressions) exceeding account baseline (+${percentageDifference}%).`;
      } else if (percentageDifference <= -25) {
        performanceLabel = 'substantially underperformed';
        interpretation = `Statistically robust signal (${numImpressions.toLocaleString()} impressions) falling substantially below account baseline (${percentageDifference}%).`;
      } else if (percentageDifference <= -10) {
        performanceLabel = 'underperformed';
        interpretation = `Statistically reliable signal (${numImpressions.toLocaleString()} impressions) falling below account baseline (${percentageDifference}%).`;
      } else {
        performanceLabel = 'average';
        interpretation = `Consistent with historical account benchmark (~${benchmarkRate}%).`;
      }
    }

    return {
      currentRate,
      benchmarkRate,
      delta,
      percentageDifference,
      performanceLabel,
      isSmallSample,
      interpretation,
      impressions: numImpressions,
    };
  }
}

module.exports = new AnalyticsService();
