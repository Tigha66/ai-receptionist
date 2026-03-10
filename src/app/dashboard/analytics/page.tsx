import { BarChart3, TrendingUp, Clock, ThumbsUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Total Conversations"
          value="156"
          change="+23%"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Avg Response Time"
          value="2m"
          change="-15%"
        />
        <StatCard
          icon={<ThumbsUp className="w-5 h-5" />}
          label="Satisfaction"
          value="94%"
          change="+5%"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Conversion Rate"
          value="32%"
          change="+8%"
        />
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Conversations Over Time</h2>
          <div className="h-48 flex items-end gap-2">
            {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Lead Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Chat Widget', value: 65 },
              { source: 'Direct', value: 20 },
              { source: 'Referral', value: 15 },
            ].map(item => (
              <div key={item.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.source}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change: string }) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-green-600">{change} from last month</div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
