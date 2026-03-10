import { Users } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          Add Customer
        </button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="px-3 py-2 border rounded-md text-sm w-64"
          />
        </div>
        <div className="p-4">
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No customers yet</p>
            <p className="text-sm">Customers will appear here when they start conversations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
