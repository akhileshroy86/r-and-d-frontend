import type { Metadata } from 'next';
import './globals.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Providers } from './providers';
import ConditionalNavbar from '../components/layout/ConditionalNavbar';

export const metadata: Metadata = {
  title: 'Healthcare Management System',
  description: 'Modern healthcare management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="font-sans">
        <Providers>
          <ConditionalNavbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}