'use client';
import { useState, useMemo } from 'react';
import { Table, Select, Button, Typography, ConfigProvider, Modal, InputNumber, DatePicker, Dropdown, Upload, message, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined, ShoppingOutlined, UploadOutlined, LinkOutlined, CodeOutlined, HistoryOutlined, RollbackOutlined, DownloadOutlined, CheckCircleOutlined, AuditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SELL_MODAL_CODE } from '@/lib/code-sources';
import { redemptions as allRedemptions } from '@/data/mock';

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
  fundType?: 'call' | 'direct';
  navPerShare?: number;
  navDate?: string;
  shares?: number;
  investor?: string;
}

interface SubscriptionTableProps {
  data: Subscription[];
}

function formatEur(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ih-text-primary)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SellModal({ subscription, open, onClose, onCopyLink }: { subscription: Subscription | null; open: boolean; onClose: () => void; onCopyLink: () => void }) {
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [partsCount, setPartsCount] = useState<number | null>(null);
  const [ribFile, setRibFile] = useState<File | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);

  if (!subscription) return null;

  const nav = subscription.navPerShare ?? null;
  const totalShares = subscription.shares ?? null;
  const minPrice = nav ? Math.round(nav * 0.90 * 100) / 100 : null;
  const maxPrice = nav ? Math.round(nav * 1.15 * 100) / 100 : null;
  const isCallFund = subscription.fundType === 'call';
  const calledPct = subscription.amount > 0 ? Math.round((subscription.called / subscription.amount) * 100) : 0;
  const remainingEngagement = subscription.amount - subscription.called;
  const effectivePrice = salePrice ?? nav ?? 0;
  const effectiveParts = partsCount ?? 1;
  const totalSale = effectivePrice * effectiveParts;
  const engagementTransferred = totalShares && totalShares > 0
    ? (remainingEngagement / totalShares) * effectiveParts
    : remainingEngagement;
  const netAmount = totalSale - engagementTransferred;

  function reset() {
    setSalePrice(null);
    setPartsCount(null);
    setRibFile(null);
  }

  return (
    <>
    <Modal
      open={open}
      onCancel={() => { onClose(); reset(); }}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ih-text-primary)' }}>
            Vente de parts - {subscription.fund}{subscription.part ? ` (${subscription.part})` : ''}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button type="text" size="small" icon={<CodeOutlined />} onClick={() => setCodeOpen(true)} style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}>
              Code
            </Button>
            <Button
              type="text"
              size="small"
              icon={<LinkOutlined />}
              onClick={onCopyLink}
              style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
            >
              Copier le lien
            </Button>
          </div>
        </div>
      }
      width={640}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>

        {isCallFund && (
          <Field label="Montant appelé et payé">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${calledPct}%`, height: '100%', background: 'var(--ih-primary)', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)', whiteSpace: 'nowrap' }}>
                {formatEur(subscription.called)} / {formatEur(subscription.amount)} ({calledPct}%)
              </span>
            </div>
          </Field>
        )}

        {nav && (
          <Field label={`Valeur actuelle d'une part ${formatEur(nav)}`}>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>
              Basée sur la dernière valorisation en date du {subscription.navDate ?? '—'}
            </div>
          </Field>
        )}

        <Field label="Prix de vente souhaité (par part) :">
          {minPrice && maxPrice && (
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 8 }}>
              Doit être compris entre <strong>-10,00%</strong> et <strong>+15,00%</strong> soit{' '}
              <strong>{formatEur(minPrice)}</strong> et <strong>{formatEur(maxPrice)}</strong>
            </div>
          )}
          <InputNumber
            style={{ width: '100%' }}
            min={minPrice ?? 0}
            max={maxPrice ?? undefined}
            value={salePrice ?? (nav ?? undefined)}
            onChange={setSalePrice}
            decimalSeparator=","
            addonAfter="€"
          />
        </Field>

        <Field label="Nombre de parts que vous souhaitez vendre :">
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            max={totalShares ?? undefined}
            value={partsCount ?? 1}
            onChange={setPartsCount}
          />
        </Field>

        <Field label="Date de fin de validité de l'offre :">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="JJ/MM/AAAA" />
        </Field>

        <Field label="RIB du vendeur :">
          <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 8 }}>
            Document bancaire pour la transmission des fonds suite à la cession (PDF, JPG…)
          </div>
          <Upload
            maxCount={1}
            beforeUpload={file => { setRibFile(file); return false; }}
            onRemove={() => setRibFile(null)}
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>
              {ribFile ? ribFile.name : 'Déposer votre RIB'}
            </Button>
          </Upload>
        </Field>

        {isCallFund && engagementTransferred > 0 && (
          <div style={{ fontSize: 13, color: 'var(--ih-text-primary)' }}>
            ⚠ Attention : en vendant ces parts, l&apos;acheteur reprend aussi votre engagement futur de{' '}
            <strong>{formatEur(engagementTransferred)}</strong>
            {totalShares && totalShares > effectiveParts && (
              <span style={{ color: 'var(--ih-text-secondary)', fontWeight: 400 }}>
                {' '}({formatEur(remainingEngagement / totalShares)} / part)
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
            Montant total de la vente : {formatEur(totalSale)}
          </div>
          {isCallFund && (
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
              Montant net estimé après transfert d&apos;engagement : {formatEur(netAmount)}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--ih-border)', paddingTop: 16 }}>
          <Button
            type="primary"
            style={{ width: '100%' }}
            disabled={!ribFile}
            onClick={() => { onClose(); reset(); }}
          >
            Mettre en vente
          </Button>
        </div>
      </div>
    </Modal>

    <Drawer open={codeOpen} onClose={() => setCodeOpen(false)} title="Code — SellModal" width={640} zIndex={1100}>
      <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
        {SELL_MODAL_CODE}
      </SyntaxHighlighter>
    </Drawer>
    </>
  );
}

function RedemptionOnboardingModal({ open, onClose, subscription }: { open: boolean; onClose: () => void; subscription: Subscription | null }) {
  if (!subscription) return null;
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Rachat libre" width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', padding: '24px 0 8px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ih-bg)', border: '1px solid var(--ih-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RollbackOutlined style={{ fontSize: 22, color: 'var(--ih-primary)' }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ih-text-primary)', marginBottom: 6 }}>
            Demande de rachat — {subscription.fund}{subscription.part ? ` (${subscription.part})` : ''}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ih-text-secondary)', lineHeight: 1.6, maxWidth: 340 }}>
            Ce bouton redirige l&apos;investisseur vers l&apos;onboarding de demande de rachat configuré pour ce fonds.
          </div>
        </div>
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '10px 16px', fontSize: 12, color: '#92400e', width: '100%', textAlign: 'left', lineHeight: 1.6 }}>
          <strong>Note développeur :</strong> Redirection vers l&apos;onboarding de rachat v1 (paramétré au niveau du fonds / des parts). Le reste du workflow (validation, signature, paiement) est géré dans le back-office.
        </div>
        <Button type="primary" style={{ width: '100%' }} onClick={onClose}>
          Accéder à l&apos;onboarding de rachat
        </Button>
        <Button style={{ width: '100%' }} onClick={onClose}>Annuler</Button>
      </div>
    </Modal>
  );
}

type RedemptionStatus = 'to_sign' | 'valid';

const REDEMPTION_STATUS_LABEL: Record<RedemptionStatus, string> = {
  to_sign: 'À signer',
  valid: 'Validé',
};
const REDEMPTION_STATUS_COLOR: Record<RedemptionStatus, string> = {
  to_sign: 'orange',
  valid: 'success',
};

function RedemptionHistoryModal({ open, onClose, subscription }: { open: boolean; onClose: () => void; subscription: Subscription | null }) {
  if (!subscription) return null;
  const items = allRedemptions.filter(r => r.subscriptionId === subscription.id);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Fermer</Button>}
      title={`Historique des rachats — Souscription ${subscription.fund}${subscription.part ? ` · ${subscription.part}` : ''}`}
      width={720}
    >
      <Table
        dataSource={items}
        rowKey="id"
        size="middle"
        pagination={false}
        style={{ marginTop: 8 }}
        columns={[
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: v => <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>{v}</span>,
          },
          {
            title: 'Nombre de parts',
            dataIndex: 'shares',
            key: 'shares',
            render: v => <span style={{ fontSize: 13 }}>{v.toLocaleString('fr-FR')}</span>,
          },
          {
            title: 'Montant',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right' as const,
            render: v => <span style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{formatEur(v)}</span>,
          },
          {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (v: RedemptionStatus) => (
              <span style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: v === 'to_sign' ? '#FFF7ED' : '#F0FDF4',
                color: v === 'to_sign' ? '#d97706' : '#16a34a',
                border: `1px solid ${v === 'to_sign' ? '#FED7AA' : '#BBF7D0'}`,
              }}>
                {REDEMPTION_STATUS_LABEL[v] ?? v}
              </span>
            ),
          },
          {
            title: 'Documents',
            dataIndex: 'docName',
            key: 'docName',
            render: (v: string | null) => v
              ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{v}</span>
                  <Button type="text" size="small" icon={<DownloadOutlined />} style={{ color: 'var(--ih-primary)', padding: 0 }} />
                </div>
              )
              : <span style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>Aucun document</span>,
          },
        ]}
      />
    </Modal>
  );
}

export function SubscriptionTable({ data }: SubscriptionTableProps) {
  const [fundFilter, setFundFilter] = useState<string | undefined>(undefined);
  const [partFilter, setPartFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';
  const isDistributor = persona === 'distributor';

  const modalType = searchParams.get('modal');
  const modalId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const sellTarget = modalType === 'sell' && modalId ? (data.find(d => d.id === modalId) ?? null) : null;
  const redeemTarget = modalType === 'redeem' && modalId ? (data.find(d => d.id === modalId) ?? null) : null;
  const historyTarget = modalType === 'redemption-history' && modalId ? (data.find(d => d.id === modalId) ?? null) : null;

  function openModal(type: string, record: Subscription) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', type);
    params.set('id', String(record.id));
    router.replace(`${pathname}?${params.toString()}`);
  }

  function closeModal() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('id');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const openSell = (r: Subscription) => openModal('sell', r);
  const closeSell = closeModal;

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      messageApi.success('Lien copié !');
    });
  }

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

  const baseColumns: ColumnsType<Subscription> = [
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
    ...(isDistributor ? [{
      title: 'Investisseur',
      key: 'investor',
      sorter: (a: Subscription, b: Subscription) => (a.investor ?? '').localeCompare(b.investor ?? ''),
      render: (_: unknown, record: Subscription) => (
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ih-text-primary)', whiteSpace: 'nowrap' }}>
          {record.investor ?? '—'}
        </span>
      ),
    }] : []),
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
      render: (v, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <StatusBadge status={v} />
          {isDistributor && v === 'study' && (
            <span
              onClick={() => router.push(`/subscriptions/${record.id}/validation?persona=${persona}`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                color: '#92400e',
                background: 'rgba(251,191,36,0.2)',
                border: '1px solid rgba(245,158,11,0.5)',
                borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
            >
              <AuditOutlined style={{ fontSize: 10 }} />
              Validation requise
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 60,
      align: 'right' as const,
      render: (_, record) => {
        const hasRedemptions = allRedemptions.some(r => r.subscriptionId === record.id);
        const validItems: MenuProps['items'] = [
          { key: 'sell', label: 'Vendre', icon: <ShoppingOutlined />, onClick: () => openSell(record) },
          { key: 'redeem', label: 'Rachat libre', icon: <RollbackOutlined />, onClick: () => openModal('redeem', record) },
          ...(hasRedemptions ? [{ key: 'redemption-history', label: 'Historique des rachats', icon: <HistoryOutlined />, onClick: () => openModal('redemption-history', record) }] : []),
          { key: 'view', label: 'Voir', icon: <EyeOutlined /> },
        ];
        const studyItems: MenuProps['items'] = [
          {
            key: 'validate',
            label: 'Valider le dossier',
            icon: <CheckCircleOutlined />,
            onClick: () => router.push(`/subscriptions/${record.id}/validation?persona=${persona}`),
          },
          { key: 'view', label: 'Voir', icon: <EyeOutlined /> },
        ];
        const otherItems: MenuProps['items'] = [
          { key: 'view', label: 'Voir', icon: <EyeOutlined /> },
          { key: 'edit', label: 'Modifier', icon: <EditOutlined /> },
          { key: 'delete', label: 'Supprimer', icon: <DeleteOutlined />, danger: true },
        ];
        const items = record.status === 'valid'
          ? validItems
          : (isDistributor && record.status === 'study')
            ? studyItems
            : otherItems;
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  const summaryColSpanLabel = isDistributor ? 4 : 3;
  const summaryIndexAmount = isDistributor ? 4 : 3;
  const summaryIndexCalled = isDistributor ? 5 : 4;
  const summaryIndexDistributed = isDistributor ? 6 : 5;
  const summaryIndexTrailer = isDistributor ? 7 : 6;

  return (
    <div>
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
            { value: 'study', label: 'Étude du dossier' },
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
          columns={baseColumns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => `${total} souscription${total > 1 ? 's' : ''}` }}
          size="middle"
          style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}
          onRow={(record) => ({
            style: isDistributor && record.status === 'study'
              ? { background: 'rgba(251,191,36,0.05)', borderLeft: '3px solid #f59e0b' }
              : {},
          })}
          summary={() => (
            <Table.Summary.Row style={{ background: '#fff', fontWeight: 600 }}>
              <Table.Summary.Cell index={0} colSpan={summaryColSpanLabel}>
                <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>Total</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={summaryIndexAmount} align="right">
                <span style={{ fontWeight: 700 }}>{formatEur(totals.amount)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={summaryIndexCalled} align="right">
                <span>{formatEur(totals.called)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={summaryIndexDistributed} align="right">
                <span>{formatEur(totals.distributed)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={summaryIndexTrailer} colSpan={3} />
            </Table.Summary.Row>
          )}
        />
      </ConfigProvider>

      {contextHolder}
      <SellModal
        subscription={sellTarget}
        open={sellTarget !== null}
        onClose={closeSell}
        onCopyLink={copyLink}
      />
      <RedemptionOnboardingModal
        open={redeemTarget !== null}
        onClose={closeModal}
        subscription={redeemTarget}
      />
      <RedemptionHistoryModal
        open={historyTarget !== null}
        onClose={closeModal}
        subscription={historyTarget}
      />
    </div>
  );
}
