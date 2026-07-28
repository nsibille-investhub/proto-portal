import { Card, Skeleton, Tooltip } from 'antd';
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

export interface KpiCardProps {
  label: string;
  value: number | string;
  format?: 'currency' | 'percentage' | 'number';
  trend?: number;
  icon?: ReactNode;
  loading?: boolean;
  tooltip?: string;
}

function formatValue(value: number | string, format?: string): string {
  if (typeof value !== 'number') return String(value);
  if (format === 'currency') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (format === 'percentage') return `${value.toFixed(1)} %`;
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function KpiCard({ label, value, format, trend, icon, loading, tooltip }: KpiCardProps) {
  if (loading) {
    return (
      <Card style={{ borderRadius: 12 }}>
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  return (
    <Card style={{ background: 'var(--ih-bg-card)', borderRadius: 12, border: '1px solid var(--ih-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              color: 'var(--ih-text-secondary)',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {label}
            {tooltip && (
              <Tooltip title={tooltip}>
                <QuestionCircleOutlined style={{ fontSize: 12, cursor: 'help' }} />
              </Tooltip>
            )}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--ih-text-primary)',
              lineHeight: 1.1,
              wordBreak: 'break-word',
            }}
          >
            {formatValue(value, format)}
          </div>
          {trend !== undefined && (
            <div
              style={{
                fontSize: 13,
                marginTop: 8,
                color: trend >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(trend).toFixed(1)} %
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              fontSize: 28,
              color: 'var(--ih-primary)',
              opacity: 0.7,
              marginLeft: 12,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
