'use client';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { UserDropdown } from './UserDropdown';

const { Sider, Content } = Layout;

const AUTH_PATHS = ['/login', '/register'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (AUTH_PATHS.some(p => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: 'var(--ih-sidebar-bg)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            background: 'var(--ih-bg-card)',
            borderBottom: '1px solid var(--ih-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Suspense fallback={null}>
            <UserDropdown />
          </Suspense>
        </div>
        <Content
          style={{
            padding: '32px 64px',
            minHeight: 'calc(100vh - 56px)',
            background: 'var(--ih-bg)',
          }}
        >
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
