'use client';

import { useState } from 'react';
import { Calendar, MessageSquare, Link2 } from 'lucide-react';

export default function SettingsPage() {
  const [calendarConnected, setCalendarConnected] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Business Info */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Business Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <input 
                type="text" 
                defaultValue="My Business"
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <select className="mt-1 w-full px-3 py-2 border rounded-md">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-semibold mb-4">Integrations</h2>
          
          {/* Google Calendar */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Google Calendar</div>
                <div className="text-sm text-muted-foreground">
                  {calendarConnected ? 'Connected' : 'Sync appointments with Google Calendar'}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setCalendarConnected(!calendarConnected)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                calendarConnected 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {calendarConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          {/* Twilio (Voice) */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">Twilio (Voice)</div>
                <div className="text-sm text-muted-foreground">Handle phone calls</div>
              </div>
            </div>
            <button className="px-4 py-2 border rounded-md text-sm font-medium">
              Set Up
            </button>
          </div>

          {/* Webhooks */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Webhooks</div>
                <div className="text-sm text-muted-foreground">Connect to other tools</div>
              </div>
            </div>
            <button className="px-4 py-2 border rounded-md text-sm font-medium">
              Configure
            </button>
          </div>
        </div>

        {/* Auto-Responses */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="font-semibold mb-4">AI Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Enable AI auto-responses</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Qualify leads automatically</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Sentiment analysis</span>
            </label>
          </div>
        </div>

        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
