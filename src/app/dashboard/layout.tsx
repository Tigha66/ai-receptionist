import Link from 'next/link';
import { MessageSquare, Calendar, Users, BarChart3, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">AI Receptionist</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink href="/dashboard" icon={<MessageSquare className="w-4 h-4" />}>
            Conversations
          </NavLink>
          <NavLink href="/dashboard/customers" icon={<Users className="w-4 h-4" />}>
            Customers
          </NavLink>
          <NavLink href="/dashboard/appointments" icon={<Calendar className="w-4 h-4" />}>
            Appointments
          </NavLink>
          <NavLink href="/dashboard/analytics" icon={<BarChart3 className="w-4 h-4" />}>
            Analytics
          </NavLink>
          <NavLink href="/dashboard/settings" icon={<Settings className="w-4 h-4" />}>
            Settings
          </NavLink>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
    >
      {icon}
      {children}
    </Link>
  );
}
