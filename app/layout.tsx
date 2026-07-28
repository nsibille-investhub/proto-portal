import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { investHubTheme } from '@/lib/theme';
import { AppLayout } from '@/components/layout/AppLayout';

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
            <AppLayout>{children}</AppLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
