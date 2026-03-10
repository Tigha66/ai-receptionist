import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Receptionist | SMB Solution',
  description: 'AI-powered receptionist for small and medium businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
