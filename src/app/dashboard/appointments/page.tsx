import { Calendar } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded-md text-sm">
            Sync Calendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="md:col-span-2 bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">March 2026</h2>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 text-sm border rounded">‹</button>
              <button className="px-2 py-1 text-sm border rounded">›</button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-medium text-muted-foreground">{day}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => (
                <div 
                  key={i} 
                  className={`p-2 text-sm ${i === 12 ? 'bg-primary text-primary-foreground rounded' : ''}`}
                >
                  {i + 1 <= 31 ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Upcoming</h2>
          </div>
          <div className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
