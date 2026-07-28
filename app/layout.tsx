import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { investHubTheme } from '@/lib/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'InvestHub Portal',
  description: 'Portail investisseur InvestHub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={investHubTheme}>
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
