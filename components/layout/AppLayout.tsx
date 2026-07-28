'use client';
import { Suspense } from 'react';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';

const { Sider, Content } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
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
        <Content
          style={{
            padding: '32px 64px',
            minHeight: '100vh',
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
