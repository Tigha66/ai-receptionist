import { MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Conversations Today"
          value="12"
          change="+3 from yesterday"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="New Leads"
          value="5"
          change="+2 from last week"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Appointments"
          value="8"
          change="3 pending"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Response Rate"
          value="94%"
          change="+5% this month"
        />
      </div>

      {/* Recent Conversations */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Conversations</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground text-center py-8">
            No conversations yet. Add the widget to your site to start receiving messages.
          </p>
        </div>
      </div>

      {/* Widget Code */}
      <div className="mt-8 bg-card rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Embed Widget</h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Add this code to your website to enable the chat widget:
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`<script>
  (function(w,d,s,o,f,js,fjs){
    w['AIReceptionistWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aiWidget','/widget.js'));
  aiWidget('init', { businessId: 'YOUR_BUSINESS_ID' });
</script>`}
          </pre>
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
      <div className="text-xs text-muted-foreground">{change}</div>
    </div>
  );
}
