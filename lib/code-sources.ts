// Auto-generated from component source files

export const KPI_CARD_CODE = `import { Card, Skeleton, Tooltip } from 'antd';
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
  if (format === 'percentage') return \`\${value.toFixed(1)} %\`;
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
`;

export const FUND_CARD_CODE = `'use client';
import { Button, Card, Tag } from 'antd';
import { CalendarOutlined, DownloadOutlined, PictureOutlined } from '@ant-design/icons';

interface FundCardProps {
  id: number;
  name: string;
  closeDate?: string;
  image: string | null;
  description: string[];
  docs?: string[];
}

export function FundCard({ name, closeDate, image, description, docs }: FundCardProps) {
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
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{name}</h3>
        {description.length > 0 && (
          <ul style={{ margin: '0 0 12px', paddingLeft: 18, color: 'var(--ih-text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>
            {description.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        )}
        {docs && docs.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            {docs.map((doc) => (
              <Button key={doc} size="small" icon={<DownloadOutlined />} style={{ borderRadius: 6, fontSize: 11.5 }}>
                {doc}
              </Button>
            ))}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 4 }}>
          <Button
            type="primary"
            style={{ background: 'var(--ih-primary)', border: 'none', fontWeight: 600, fontSize: 13, borderRadius: 6 }}
          >
            Voir plus &gt;
          </Button>
        </div>
      </div>
    </Card>
  );
}
`;

export const SUBSCRIPTION_TABLE_CODE = `'use client';
import { useState, useMemo } from 'react';
import { Table, Select, Space, Button, Tooltip, Typography, Tag, ConfigProvider } from 'antd';
import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface Subscription {
  id: number;
  fund: string;
  part: string | null;
  date: string;
  amount: number;
  called: number;
  distributed: number;
  valuation: number | null;
  status: string;
}

interface SubscriptionTableProps {
  data: Subscription[];
}

function formatEur(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
}

export function SubscriptionTable({ data }: SubscriptionTableProps) {
  const [fundFilter, setFundFilter] = useState<string | undefined>(undefined);
  const [partFilter, setPartFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const funds = useMemo(() => Array.from(new Set(data.map(d => d.fund))), [data]);
  const parts = useMemo(() => Array.from(new Set(data.map(d => d.part).filter(Boolean) as string[])), [data]);

  const filtered = useMemo(() => data.filter(d => {
    if (fundFilter && d.fund !== fundFilter) return false;
    if (partFilter && d.part !== partFilter) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    return true;
  }), [data, fundFilter, partFilter, statusFilter]);

  const totals = useMemo(() => ({
    amount: filtered.reduce((s, d) => s + d.amount, 0),
    called: filtered.reduce((s, d) => s + d.called, 0),
    distributed: filtered.reduce((s, d) => s + d.distributed, 0),
  }), [filtered]);

  const columns: ColumnsType<Subscription> = [
    {
      title: 'Type',
      key: 'type',
      width: 60,
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ih-bg)', border: '1px solid var(--ih-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserOutlined style={{ fontSize: 14, color: 'var(--ih-primary)' }} />
          </div>
        </div>
      ),
    },
    {
      title: 'Fonds',
      key: 'fund',
      sorter: (a, b) => a.fund.localeCompare(b.fund),
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>{record.fund}</div>
          {record.part && <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>{record.part}</div>}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: v => <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)', whiteSpace: 'nowrap' }}>{v}</span>,
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: v => <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap' }}>{formatEur(v)}</span>,
    },
    {
      title: 'Appelé',
      dataIndex: 'called',
      key: 'called',
      align: 'right',
      render: v => <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatEur(v)}</span>,
    },
    {
      title: 'Distribué',
      dataIndex: 'distributed',
      key: 'distributed',
      align: 'right',
      render: v => <span style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatEur(v)}</span>,
    },
    {
      title: 'Valorisation',
      dataIndex: 'valuation',
      key: 'valuation',
      align: 'right',
      render: v => <span style={{ fontSize: 13, color: v ? 'inherit' : 'var(--ih-text-secondary)', whiteSpace: 'nowrap' }}>{formatEur(v)}</span>,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: v => <StatusBadge status={v} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => {
        if (record.status === 'valid') {
          return (
            <Tooltip title="Plus d'actions">
              <Button type="text" icon={<EllipsisOutlined />} size="small" />
            </Tooltip>
          );
        }
        return (
          <Space size={4}>
            <Tooltip title="Voir">
              <Button type="text" icon={<EyeOutlined />} size="small" />
            </Tooltip>
            <Tooltip title="Modifier">
              <Button type="text" icon={<EditOutlined />} size="small" />
            </Tooltip>
            <Tooltip title="Supprimer">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Select
          placeholder="Tous les fonds"
          allowClear
          style={{ minWidth: 180 }}
          value={fundFilter}
          onChange={setFundFilter}
          options={funds.map(f => ({ value: f, label: f }))}
        />
        <Select
          placeholder="Toutes les parts"
          allowClear
          style={{ minWidth: 160 }}
          value={partFilter}
          onChange={setPartFilter}
          options={parts.map(p => ({ value: p, label: p }))}
        />
        <Select
          placeholder="Tous les statuts"
          allowClear
          style={{ minWidth: 180 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'to_sign', label: 'À envoyer en signature' },
            { value: 'in_progress', label: 'En cours' },
            { value: 'valid', label: 'Valide' },
          ]}
        />
        <div style={{ marginLeft: 'auto' }}>
          <Typography.Text style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>
            Souscriptions ({filtered.length}/{data.length})
          </Typography.Text>
        </div>
      </div>

      <ConfigProvider theme={{ token: { colorFillAlter: '#ffffff' } }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => \`\${total} souscription\${total > 1 ? 's' : ''}\` }}
          size="middle"
          style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}
          summary={() => (
            <Table.Summary.Row style={{ background: '#fff', fontWeight: 600 }}>
              <Table.Summary.Cell index={0} colSpan={3}>
                <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>Total</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                <span style={{ fontWeight: 700 }}>{formatEur(totals.amount)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                <span>{formatEur(totals.called)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                <span>{formatEur(totals.distributed)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} colSpan={3} />
            </Table.Summary.Row>
          )}
        />
      </ConfigProvider>
    </div>
  );
}
`;

export const DOCUMENT_EXPLORER_CODE = `'use client';
import { useState, useMemo } from 'react';
import { Tree, Table, Tag, Space, Typography, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { DocumentIcon, FolderIcon } from '@/components/shared/Icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

interface Document {
  id: number;
  fund: string;
  name: string;
  type: string;
  size: string;
  addedAt: string;
  isNew: boolean;
}

interface DocumentExplorerProps {
  documents: Document[];
}

export function DocumentExplorer({ documents }: DocumentExplorerProps) {
  const funds = useMemo(() => Array.from(new Set(documents.map(d => d.fund))), [documents]);
  const [selectedFund, setSelectedFund] = useState<string>(funds[0] ?? '');

  const treeData: DataNode[] = useMemo(() => funds.map(fund => {
    const count = documents.filter(d => d.fund === fund).length;
    return {
      key: fund,
      title: \`\${fund} (\${count})\`,
      icon: <FolderIcon size={16} />,
      isLeaf: true,
    };
  }), [funds, documents]);

  const filtered = useMemo(() =>
    documents.filter(d => d.fund === selectedFund),
    [documents, selectedFund]
  );

  const columns: ColumnsType<Document> = [
    {
      title: 'Nom',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, doc) => (
        <Space>
          <DocumentIcon size={22} />
          <div>
            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              {doc.name}
              {doc.isNew && (
                <Tag
                  style={{
                    borderRadius: 12, fontSize: 11, padding: '0 6px',
                    border: '1px solid #d9d9d9', color: 'var(--ih-text-primary)',
                    background: 'white',
                  }}
                >
                  New
                </Tag>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>{doc.type}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ajouté le',
      dataIndex: 'addedAt',
      sorter: (a, b) => a.addedAt.localeCompare(b.addedAt),
    },
    {
      title: 'Taille',
      dataIndex: 'size',
    },
    {
      key: 'actions',
      width: 80,
      render: () => (
        <Space size={12}>
          <Tooltip title="Aperçu"><EyeOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 16 }} /></Tooltip>
          <Tooltip title="Télécharger"><DownloadOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 16 }} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Tree panel */}
      <div style={{
        width: 280, flexShrink: 0,
        background: 'var(--ih-bg-card)', borderRadius: 12,
        border: '1px solid var(--ih-border)', padding: 16,
      }}>
        <Typography.Text style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-secondary)', display: 'block', marginBottom: 12 }}>
          Documents ({documents.length})
        </Typography.Text>
        <Tree
          showIcon
          defaultExpandAll
          selectedKeys={[selectedFund]}
          treeData={treeData}
          onSelect={(keys) => {
            if (keys[0]) setSelectedFund(String(keys[0]));
          }}
          style={{ background: 'transparent' }}
        />
      </div>

      {/* File list */}
      <div style={{ flex: 1, background: 'var(--ih-bg-card)', borderRadius: 12, border: '1px solid var(--ih-border)', padding: 16 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={false}
          showHeader={!!filtered.length}
          locale={{ emptyText: 'Aucun document' }}
          rowSelection={{ type: 'checkbox' }}
        />
      </div>
    </div>
  );
}
`;

export const SECONDARY_MARKET_CARD_CODE = `'use client';
import { Button } from 'antd';

interface SecondaryMarketCardProps {
  fund: string;
  part: string;
  shares: number;
  price: number;
  validUntil: string;
}

export function SecondaryMarketCard({ fund, part, shares, price, validUntil }: SecondaryMarketCardProps) {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 2,
  }).format(price);

  return (
    <div style={{
      background: 'var(--ih-bg-card)',
      border: '1px solid var(--ih-border)',
      borderRadius: 12,
      padding: '20px 24px',
      width: 340,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--ih-text-primary)' }}>{fund}</div>
        <div style={{ fontSize: 13, color: 'var(--ih-text-secondary)', fontWeight: 500, marginTop: 2 }}>{part}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--ih-text-secondary)' }}>Nombre de parts :</span>
          <span style={{ fontWeight: 700 }}>{shares.toLocaleString('fr-FR')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--ih-text-secondary)' }}>Prix de cession :</span>
          <span style={{ fontWeight: 700 }}>{formattedPrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--ih-text-secondary)' }}>Offre valable jusqu&apos;au</span>
          <span style={{ fontWeight: 600 }}>{validUntil}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button style={{ width: 120, borderRadius: 6 }}>Détails</Button>
        <Button type="primary" style={{ width: 120, borderRadius: 6, background: '#1677ff', borderColor: '#1677ff' }}>Acheter</Button>
      </div>
    </div>
  );
}
`;

export const SELL_MODAL_CODE = `'use client';
// Modale de mise en vente — accessible via URL ?modal=sell&id={subscriptionId}
// La modale s'ouvre automatiquement si les paramètres sont présents dans l'URL.

import { Modal, InputNumber, DatePicker, Upload, Button, Drawer } from 'antd';
import { LinkOutlined, CodeOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Subscription {
  id: number;
  fund: string;
  part: string | null;
  amount: number;
  called: number;
  fundType?: 'call' | 'direct';
  navPerShare?: number;
  navDate?: string;
  shares?: number;
}

// Ouvrir : router.replace(\`\${pathname}?modal=sell&id=\${id}\`)
// Fermer : router.replace(\`\${pathname}\`) (retirer modal + id)

export function SellModal({ subscription, open, onClose, onCopyLink }) {
  const [salePrice, setSalePrice] = useState(null);
  const [partsCount, setPartsCount] = useState(null);
  const [ribFile, setRibFile] = useState(null);
  const [showCode, setShowCode] = useState(false);

  const isCallFund = subscription?.fundType === 'call';
  const nav = subscription?.navPerShare ?? null;
  const totalShares = subscription?.shares ?? null;
  const remainingEngagement = (subscription?.amount ?? 0) - (subscription?.called ?? 0);
  const engagementTransferred = totalShares > 0
    ? (remainingEngagement / totalShares) * (partsCount ?? 1)
    : remainingEngagement;

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Vente de parts — {subscription?.fund}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small" icon={<CodeOutlined />} onClick={() => setShowCode(true)}>Code</Button>
              <Button size="small" icon={<LinkOutlined />} onClick={onCopyLink}>Copier le lien</Button>
            </div>
          </div>
        }
        width={640}
      >
        {/* Barre d'appel (fonds à appel) */}
        {isCallFund && <ProgressBar called={subscription.called} amount={subscription.amount} />}

        {/* Prix de vente */}
        <InputNumber min={nav * 0.9} max={nav * 1.15} defaultValue={nav} addonAfter="€" />

        {/* Nombre de parts */}
        <InputNumber min={1} max={totalShares} defaultValue={1} />

        {/* Date de fin */}
        <DatePicker format="DD/MM/YYYY" />

        {/* RIB */}
        <Upload beforeUpload={f => { setRibFile(f); return false; }}>
          <Button icon={<UploadOutlined />}>Déposer votre RIB</Button>
        </Upload>

        {/* Résumé engagement (fonds à appel) */}
        {isCallFund && <EngagementSummary transferred={engagementTransferred} />}

        <Button type="primary" disabled={!ribFile} onClick={onClose}>Mettre en vente</Button>
      </Modal>

      <Drawer open={showCode} onClose={() => setShowCode(false)} title="Code — SellModal" width={640}>
        <SyntaxHighlighter language="tsx" style={oneLight}>{SELL_MODAL_CODE}</SyntaxHighlighter>
      </Drawer>
    </>
  );
}
`;

export const BUY_MODAL_CODE = `'use client';
// Modale d'achat — accessible via URL ?modal=buy&id={offerId}
// Comportement adapté selon persona : LP (recap) vs Distributeur (recap + sélecteur investisseur)

import { Modal, Select, Button, Tag, Drawer } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Offer {
  id: number;
  fund: string;
  part: string;
  shares: number;
  price: number;
  validUntil: string;
  fundType?: 'call' | 'direct';
  navPerShare?: number;
  engagementPerShare?: number;
}

// Ouvrir : router.replace(\`\${pathname}?modal=buy&id=\${offer.id}\`)
// Fermer : router.replace(\`\${pathname}\`) (retirer modal + id)

export function BuyModal({ offer, open, onClose, isDistributor }) {
  const [investor, setInvestor] = useState(null);
  const [showCode, setShowCode] = useState(false);

  const isCall = offer?.fundType === 'call';
  const totalToPay = (offer?.price ?? 0) * (offer?.shares ?? 0);
  const totalEngagement = offer?.engagementPerShare ? offer.engagementPerShare * offer.shares : null;

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div>Confirmation d'achat — {offer?.fund} ({offer?.part})</div>
              <Tag color={isCall ? 'orange' : 'green'}>{isCall ? 'Fonds à appel' : 'Paiement direct'}</Tag>
            </div>
            <Button size="small" icon={<CodeOutlined />} onClick={() => setShowCode(true)}>Code</Button>
          </div>
        }
        width={520}
      >
        {/* Sélecteur investisseur (distributeur uniquement) */}
        {isDistributor && (
          <Select
            placeholder="Sélectionner un investisseur"
            style={{ width: '100%' }}
            value={investor}
            onChange={setInvestor}
            options={MOCK_INVESTORS}
          />
        )}

        {/* Récapitulatif */}
        <RecapRow label="Nombre de parts" value={offer?.shares} />
        <RecapRow label="Prix de cession" value={formatEur(offer?.price)} />
        <RecapRow label="Montant total" value={formatEur(totalToPay)} highlight />

        {/* Engagement (fonds à appel) */}
        {isCall && totalEngagement && (
          <EngagementBox total={totalEngagement} exposure={totalToPay + totalEngagement} />
        )}

        <Button
          type="primary"
          disabled={isDistributor && !investor}
          onClick={onClose}
          style={{ width: '100%' }}
        >
          {isDistributor && investor
            ? \`Confirmer l'achat pour \${investor.label}\`
            : "Confirmer l'achat"}
        </Button>
      </Modal>

      <Drawer open={showCode} onClose={() => setShowCode(false)} title="Code — BuyModal" width={640}>
        <SyntaxHighlighter language="tsx" style={oneLight}>{BUY_MODAL_CODE}</SyntaxHighlighter>
      </Drawer>
    </>
  );
}
`;

export const DETAILS_DRAWER_CODE = `'use client';
// Drawer de détail d'offre — accessible via URL ?modal=details&id={offerId}
// Affiche le récapitulatif complet de l'offre avec CTA "Acheter ces parts".

import { Drawer, Button, Divider, Tag } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Offer {
  id: number;
  fund: string;
  part: string;
  shares: number;
  price: number;
  validUntil: string;
  fundType?: 'call' | 'direct';
  navPerShare?: number;
  calledPct?: number;
  engagementPerShare?: number;
  status?: 'available' | 'pending';
}

// Ouvrir : router.replace(\`\${pathname}?modal=details&id=\${offer.id}\`)
// Fermer : router.replace(\`\${pathname}\`) (retirer modal + id)

export function DetailsDrawer({ offer, open, onClose, onBuy }) {
  const [showCode, setShowCode] = useState(false);

  const isCall = offer?.fundType === 'call';
  const totalEngagement = offer?.engagementPerShare
    ? offer.engagementPerShare * offer.shares
    : null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div>{offer?.fund} — {offer?.part}</div>
              <Tag color={isCall ? 'blue' : 'green'}>{isCall ? 'Fonds à appel' : 'Paiement direct'}</Tag>
            </div>
            <Button size="small" icon={<CodeOutlined />} onClick={() => setShowCode(true)}>Code</Button>
          </div>
        }
        width={480}
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button style={{ flex: 1 }} onClick={onClose}>Fermer</Button>
            <Button type="primary" style={{ flex: 1 }} disabled={offer?.status === 'pending'} onClick={() => { onClose(); onBuy(); }}>
              Acheter ces parts
            </Button>
          </div>
        }
      >
        {/* Image du fonds */}
        {offer?.image && <img src={offer.image} alt={offer.fund} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />}

        <Divider orientation="left">Informations sur l'offre</Divider>

        <RecapRow label="Nombre de parts" value={offer?.shares} />
        <RecapRow label="Valeur par part" value={formatEur(offer?.navPerShare)} highlight />

        {/* Barre d'appel (fonds à appel) */}
        {isCall && offer?.calledPct !== undefined && <CalledProgressBar pct={offer.calledPct} />}

        <RecapRow label="Prix de cession" value={formatEur(offer?.price)} />

        {/* Engagement (fonds à appel) */}
        {isCall && totalEngagement && (
          <RecapRow label="Engagement restant à reprendre" value={formatEur(totalEngagement)} warning />
        )}

        {isCall && totalEngagement && (
          <EngagementWarning total={totalEngagement} />
        )}
      </Drawer>

      <Drawer open={showCode} onClose={() => setShowCode(false)} title="Code — DetailsDrawer" width={640} zIndex={1100}>
        <SyntaxHighlighter language="tsx" style={oneLight}>{DETAILS_DRAWER_CODE}</SyntaxHighlighter>
      </Drawer>
    </>
  );
}
`;

export const PERFORMANCE_CHART_CODE = `'use client';
import { useMemo } from 'react';
import { LinePath } from '@visx/shape';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { ParentSize } from '@visx/responsive';
import { curveMonotoneX } from '@visx/curve';

interface DataPoint {
  date: string;
  nav: number;
}

interface ChartInnerProps {
  data: DataPoint[];
  width: number;
  height: number;
}

const margin = { top: 20, right: 20, bottom: 40, left: 55 };

function ChartInner({ data, width, height }: ChartInnerProps) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<DataPoint>();

  const xScale = useMemo(() =>
    scalePoint<string>({
      domain: data.map(d => d.date),
      range: [0, innerWidth],
      padding: 0.1,
    }), [data, innerWidth]);

  const navValues = data.map(d => d.nav);
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);

  const yScale = useMemo(() =>
    scaleLinear<number>({
      domain: [Math.max(0, minNav - 10), maxNav + 10],
      range: [innerHeight, 0],
      nice: true,
    }), [minNav, maxNav, innerHeight]);

  // Show every 4th month as label
  const tickValues = data.filter((_, i) => i % 4 === 0).map(d => d.date);

  const bisectDate = bisector<DataPoint, string>(d => d.date).left;

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    const xPos = x - margin.left;
    // Find the closest data point
    const step = innerWidth / (data.length - 1);
    const idx = Math.round(xPos / step);
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];
    if (!d) return;
    const xVal = xScale(d.date) ?? 0;
    const yVal = yScale(d.nav);
    showTooltip({
      tooltipData: d,
      tooltipLeft: xVal + margin.left,
      tooltipTop: yVal + margin.top,
    });
  };

  if (width < 10) return null;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E2A32" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#0E2A32" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            strokeDasharray="4,4"
            stroke="#E5E7EB"
            numTicks={5}
          />

          {/* Area fill */}
          <path
            d={(() => {
              const points = data.map(d => \`\${xScale(d.date) ?? 0},\${yScale(d.nav)}\`);
              const last = data[data.length - 1];
              const first = data[0];
              return \`M\${xScale(first.date) ?? 0},\${innerHeight} \` +
                \`L\${points.join(' L')} \` +
                \`L\${xScale(last.date) ?? 0},\${innerHeight} Z\`;
            })()}
            fill="url(#navGradient)"
          />

          <LinePath
            data={data}
            x={d => xScale(d.date) ?? 0}
            y={d => yScale(d.nav)}
            stroke="#0E2A32"
            strokeWidth={2.5}
            curve={curveMonotoneX}
          />

          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickValues={tickValues}
            tickFormat={v => {
              const [year, month] = v.split('-');
              return \`\${month}/\${year.slice(2)}\`;
            }}
            stroke="#E5E7EB"
            tickStroke="transparent"
            tickLabelProps={{ fill: '#6B7280', fontSize: 11, textAnchor: 'middle', dy: '0.25em' }}
          />

          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="#E5E7EB"
            tickStroke="transparent"
            tickLabelProps={{ fill: '#6B7280', fontSize: 11, textAnchor: 'end', dx: '-0.3em', dy: '0.25em' }}
            tickFormat={v => \`\${v}\`}
          />

          {tooltipOpen && tooltipData && (
            <circle
              cx={xScale(tooltipData.date) ?? 0}
              cy={yScale(tooltipData.nav)}
              r={5}
              fill="#0E2A32"
              stroke="white"
              strokeWidth={2}
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Transparent overlay for mouse events */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: '#0E2A32',
            color: 'white',
            borderRadius: 6,
            fontSize: 12,
            padding: '6px 10px',
          }}
        >
          <div style={{ fontWeight: 600 }}>{tooltipData.date}</div>
          <div>NAV : {tooltipData.nav}</div>
        </TooltipWithBounds>
      )}
    </div>
  );
}

interface PerformanceChartProps {
  data: DataPoint[];
  height?: number;
}

export function PerformanceChart({ data, height = 280 }: PerformanceChartProps) {
  return (
    <ParentSize>
      {({ width }) => <ChartInner data={data} width={width} height={height} />}
    </ParentSize>
  );
}
`;

export const VALIDATION_PAGE_CODE = `'use client';
// Page de prévalidation partenaire de délégation
// Accessible via : /subscriptions/[id]/validation?persona=distributor
// Uniquement disponible en vue distributeur (persona=distributor)

import { useState, useMemo, useEffect, useRef } from 'react';
import { Button, Modal, Input, Tag, Tooltip, Upload, Drawer } from 'antd';
import {
  CheckCircleFilled, CloseCircleFilled, CheckOutlined,
  ArrowLeftOutlined, FileTextOutlined, FolderOutlined,
  WarningFilled, DownloadOutlined, MessageOutlined, UploadOutlined, CodeOutlined
} from '@ant-design/icons';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { kycValidations, kycDocuments, subscriptions } from '@/data/mock';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VALIDATION_PAGE_CODE } from '@/lib/code-sources';

type FieldStatus = 'pending' | 'approved' | 'rejected';

export default function ValidationPage() {
  const { id } = useParams();
  const router = useRouter();
  const persona = useSearchParams().get('persona') ?? 'lp';

  const validation = kycValidations[Number(id)];
  const docs = kycDocuments[Number(id)] ?? [];
  const subscription = subscriptions.find(s => s.id === Number(id));

  // State
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, FieldStatus>>({});
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reopenMessage, setReopenMessage] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [commentTarget, setCommentTarget] = useState<string | null>(null);
  const [docComments, setDocComments] = useState<Record<string, string>>({});
  const [replacedDocs, setReplacedDocs] = useState<Record<string, string>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Computed stats
  const sectionStats = useMemo(() => { /* ... per-section approve/reject counts */ }, [validation, fieldStatuses]);
  const docStats = useMemo(() => { /* ... doc approve/reject counts */ }, [docs, fieldStatuses]);
  const totalApproved = /* sum of all approved fields + docs */;
  const totalFields = /* sum of all fields + docs.length */;
  const progressPct = totalFields > 0 ? Math.round((totalApproved / totalFields) * 100) : 0;

  // Scroll tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = [...validation.sections.map(s => s.id), 'documents'];
    const observers = sectionIds.map(sid => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(sid); },
        { threshold: 0.3 }
      );
      if (sectionRefs.current[sid]) obs.observe(sectionRefs.current[sid]!);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, [validation]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

      {/* Top nav: back button + code button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => router.push(\`/subscriptions?persona=\${persona}\`)}>
          ← Retour aux souscriptions
        </button>
        <Button type="text" icon={<CodeOutlined />} onClick={() => setCodeOpen(true)}
          style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
        >
          Code
        </Button>
      </div>

      {/* Header card: investor name, fund, 4 metrics, progress bar */}
      <div style={{ background: 'var(--ih-bg-card)', borderLeft: '4px solid var(--ih-accent)', borderRadius: 14, padding: '24px 28px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{validation.investorName}</div>
            <div style={{ fontSize: 13.5, color: 'var(--ih-text-secondary)' }}>{subscription.fund} · {validation.part}</div>
          </div>
          <Tag color="purple">Étude du dossier</Tag>
        </div>
        {/* 4 metric mini-cards */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {metrics.map(m => <MetricCard key={m.label} {...m} />)}
        </div>
        {/* Progress bar */}
        <ProgressBar pct={progressPct} total={totalFields} approved={totalApproved} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '236px 1fr', gap: 24 }}>

        {/* Sticky stepper sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          <StepperSidebar
            sections={allStepperItems}
            activeSection={activeSection}
            sectionStats={sectionStats}
            onNavigate={scrollToSection}
          />
        </div>

        {/* Main content */}
        <div>
          {/* KYC sections — field-by-field validation */}
          {validation.sections.map(section => (
            <KycSectionCard
              key={section.id}
              ref={el => { sectionRefs.current[section.id] = el; }}
              section={section}
              fieldStatuses={fieldStatuses}
              onSetStatus={setFieldStatus}
              onValidateAll={() => validateSection(section.id, section.fields.length)}
            />
          ))}

          {/* Documents section */}
          <DocumentsSection
            ref={el => { sectionRefs.current['documents'] = el; }}
            docs={docs}
            fieldStatuses={fieldStatuses}
            docComments={docComments}
            replacedDocs={replacedDocs}
            onSetStatus={setFieldStatus}
            onComment={openComment}
            onReplace={(docId, fileName) => setReplacedDocs(p => ({ ...p, [docId]: fileName }))}
            onValidateAll={validateAllDocs}
          />

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <Button danger onClick={() => setReopenOpen(true)}>Rouvrir le KYC</Button>
            <Button type="primary" onClick={() => router.push(\`/subscriptions?persona=\${persona}\`)}>Valider le KYC</Button>
          </div>
        </div>
      </div>

      {/* Reopen modal */}
      <Modal open={reopenOpen} onCancel={() => setReopenOpen(false)} footer={null}>
        <Input.TextArea value={reopenMessage} onChange={e => setReopenMessage(e.target.value)} rows={4} />
        <Button type="primary" onClick={handleReopen}>Rouvrir le KYC</Button>
      </Modal>

      {/* Code viewer */}
      <Drawer open={codeOpen} onClose={() => setCodeOpen(false)} title="Code — ValidationPage" width={720}>
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {VALIDATION_PAGE_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
`;
