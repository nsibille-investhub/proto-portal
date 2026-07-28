'use client';
import { Button, Card, Tag } from 'antd';
import { CalendarOutlined, DownloadOutlined, PictureOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface FundCardProps {
  id: number;
  name: string;
  closeDate?: string;
  image: string | null;
  description: string[];
  docs?: string[];
  detailHref?: string;
}

export function FundCard({ id, name, closeDate, image, description, docs, detailHref }: FundCardProps) {
  const href = detailHref ?? `/funds/${id}`;

  return (
    <Card
      style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ih-border)', height: '100%', display: 'flex', flexDirection: 'column' }}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, background: '#E5E7EB', overflow: 'hidden', flexShrink: 0 }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #0E2A32 0%, #1a4050 100%)' }}>
            <PictureOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.4)' }} />
          </div>
        )}
        {closeDate && (
          <Tag
            icon={<CalendarOutlined />}
            style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', border: 'none', fontWeight: 500, fontSize: 12 }}
          >
            Jusqu&apos;au {closeDate}
          </Tag>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{name}</h3>
        {description.length > 0 && (
          <ul style={{ margin: '0 0 16px', paddingLeft: 18, color: 'var(--ih-text-secondary)', lineHeight: 1.7 }}>
            {description.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        )}
        {docs && docs.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {docs.map((doc) => (
              <Button key={doc} size="small" icon={<DownloadOutlined />} style={{ borderRadius: 20, fontSize: 12, borderColor: 'var(--ih-border)', color: 'var(--ih-text-primary)' }}>
                {doc}
              </Button>
            ))}
          </div>
        )}
        <div style={{ flex: 1 }} />
      </div>

      {/* CTA — full-width bar */}
      <Link href={href} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'var(--ih-primary)',
            color: 'white',
            textAlign: 'right',
            padding: '12px 20px',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            borderRadius: '0 0 12px 12px',
            userSelect: 'none',
          }}
        >
          Voir plus &gt;
        </div>
      </Link>
    </Card>
  );
}
