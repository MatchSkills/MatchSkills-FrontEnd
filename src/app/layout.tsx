import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { Toast } from '@/components/common/Toast';
import { APP_NAME, APP_SLOGAN } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} - Recrutamento Inteligente com IA`,
  description: APP_SLOGAN,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
        <AuthProvider>
          <UserProvider>
            {children}
            <Toast />
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
