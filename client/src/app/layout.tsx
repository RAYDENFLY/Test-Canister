import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'DecentWork - Web3 Job Agent Platform',
  description: 'AI-powered Web3 job platform with Fetch.ai integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 font-inter antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-80 p-6">
              <Header />
              <div className="space-y-6">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
