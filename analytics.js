// AI Receptionist - Analytics & Feedback System

class ReceptionistAnalytics {
  constructor() {
    this.calls = [];
    this.feedback = [];
  }

  // Track a call
  trackCall(callData) {
    const call = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      caller: callData.caller || null,
      intent: callData.intent || null,
      outcome: callData.outcome || null,
      duration: callData.duration || 0,
      satisfaction: null,
      notes: ''
    };
    
    this.calls.push(call);
    this.save();
    return call.id;
  }

  // Update call outcome
  updateCall(callId, updates) {
    const call = this.calls.find(c => c.id === callId);
    if (call) {
      Object.assign(call, updates);
      this.save();
    }
  }

  // Record feedback
  addFeedback(callId, rating, comment) {
    this.feedback.push({
      callId,
      rating, // 1-5
      comment,
      timestamp: new Date().toISOString()
    });
    this.save();
  }

  // Get analytics
  getStats() {
    const totalCalls = this.calls.length;
    const booked = this.calls.filter(c => c.outcome === 'booked').length;
    const faq = this.calls.filter(c => c.outcome === 'faq').length;
    const missed = this.calls.filter(c => c.outcome === 'missed').length;
    
    const avgRating = this.feedback.length > 0
      ? this.feedback.reduce((a, b) => a + b.rating, 0) / this.feedback.length
      : 0;

    return {
      totalCalls,
      booked,
      faq,
      missed,
      bookingRate: totalCalls > 0 ? (booked / totalCalls * 100).toFixed(1) : 0,
      avgRating: avgRating.toFixed(1),
      feedbackCount: this.feedback.length
    };
  }

  // Generate report
  generateReport(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const recentCalls = this.calls.filter(c => new Date(c.timestamp) >= since);
    const recentFeedback = this.feedback.filter(f => new Date(f.timestamp) >= since);
    
    return {
      period: `${days} days`,
      calls: recentCalls.length,
      bookings: recentCalls.filter(c => c.outcome === 'booked').length,
      satisfaction: recentFeedback.length > 0 
        ? (recentFeedback.reduce((a, b) => a + b.rating, 0) / recentFeedback.length).toFixed(1)
        : 'N/A',
      intents: this.groupBy(recentCalls, 'intent'),
      outcomes: this.groupBy(recentCalls, 'outcome')
    };
  }

  // Group by key
  groupBy(array, key) {
    return array.reduce((acc, item) => {
      const val = item[key] || 'unknown';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  }

  generateId() {
    return 'call_' + Math.random().toString(36).substr(2, 9);
  }

  // Save to localStorage
  save() {
    localStorage.setItem('receptionist_analytics', JSON.stringify({
      calls: this.calls,
      feedback: this.feedback
    }));
  }

  // Load from localStorage
  load() {
    const data = JSON.parse(localStorage.getItem('receptionist_analytics') || '{}');
    this.calls = data.calls || [];
    this.feedback = data.feedback || [];
  }
}

// Export for use
module.exports = { ReceptionistAnalytics };

// For browser use
if (typeof window !== 'undefined') {
  window.ReceptionistAnalytics = ReceptionistAnalytics;
}
