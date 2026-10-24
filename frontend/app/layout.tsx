import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../src/features/auth/hooks/useAuth';
import { Navbar } from '../src/features/common/components/Navbar';
import { Footer } from '../src/features/common/components/Footer';

export const metadata: Metadata = {
  title: 'NIDO | Clases particulares y tutorías para niños de colegio',
  description:
    'Conectamos a estudiantes de primaria y bachillerato con tutores especializados en matemáticas, física, lectura y ciencias.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
