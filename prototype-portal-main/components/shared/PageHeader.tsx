'use client';
import { Typography } from 'antd';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <Typography.Title
        level={2}
        style={{ margin: 0, color: 'var(--ih-text-primary)', fontWeight: 700, fontSize: 26 }}
      >
        {title}
      </Typography.Title>
      {subtitle && (
        <Typography.Text style={{ color: 'var(--ih-text-secondary)', fontSize: 14, marginTop: 4, display: 'block' }}>
          {subtitle}
        </Typography.Text>
      )}
    </div>
  );
}
