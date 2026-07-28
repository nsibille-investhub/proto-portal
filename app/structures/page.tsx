'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Tag, Typography, Button, Badge, Drawer, Empty, Progress, Tooltip } from 'antd';
import {
  BankOutlined, UserOutlined, FileTextOutlined,
  EnvironmentOutlined, PlusOutlined, CodeOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined,
  SafetyCertificateOutlined, WarningOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageHeader } from '@/components/shared/PageHeader';
import { investmentStructures, subscriptions, userProfiles } from '@/data/mock';
import { STRUCTURES_PAGE_CODE } from '@/lib/code-sources';

const { Text } = Typography;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: 'Active', color: 'success', icon: <CheckCircleOutlined /> },
  en_cours: { label: 'En cours', color: 'processing', icon: <ClockCircleOutlined /> },
  inactive: { label: 'Inactive', color: 'default', icon: <StopOutlined /> },
};

const KYC_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  complete: { label: 'KYC Complet', color: 'success', icon: <CheckCircleOutlined /> },
  in_progress: { label: 'KYC En cours', color: 'processing', icon: <ClockCircleOutlined /> },
  action_required: { label: 'Action requise', color: 'warning', icon: <ExclamationCircleOutlined /> },
  not_started: { label: 'KYC Non démarré', color: 'default', icon: <StopOutlined /> },
};

export default function StructuresPage() {
  return (
    <Suspense fallback={null}>
      <StructuresContent />
    </Suspense>
  );
}

function StructuresContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const persona = searchParams.get('persona') ?? 'lp';
  const [codeOpen, setCodeOpen] = useState(false);

  function getStructureKpis(structure: typeof investmentStructures[0]) {
    const linkedSubs = subscriptions.filter(s => structure.subscriptionIds.includes(s.id));
    const totalEngagement = linkedSubs.reduce((sum, s) => sum + s.amount, 0);
    return { subsCount: linkedSubs.length, totalEngagement };
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }

  function getKycSummary(structure: typeof investmentStructures[0]) {
    const docs = structure.kyc.documents;
    const issues = docs.filter(d => d.status === 'expired' || d.status === 'rejected' || d.status === 'missing').length;
    const pending = docs.filter(d => d.status === 'pending_review').length;
    return { issues, pending };
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <PageHeader
          title="Mes structures"
          subtitle="Gérez vos structures d'investissement et leurs informations réglementaires"
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={() => setCodeOpen(true)}
            style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
          >
            Show code
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
            Nouvelle structure
          </Button>
        </div>
      </div>

      {investmentStructures.length === 0 ? (
        <Empty description="Aucune structure d'investissement" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {investmentStructures.map(structure => {
            const { subsCount, totalEngagement } = getStructureKpis(structure);
            const statusCfg = STATUS_CONFIG[structure.status] ?? STATUS_CONFIG.active;
            const kycCfg = KYC_STATUS_CONFIG[structure.kyc.status] ?? KYC_STATUS_CONFIG.not_started;
            const { issues, pending } = getKycSummary(structure);

            return (
              <Card
                key={structure.id}
                hoverable
                onClick={() => {
                  const base = `/structures/${structure.id}`;
                  router.push(persona !== 'lp' ? `${base}?persona=${persona}` : base);
                }}
                style={{
                  borderRadius: 12,
                  border: '1px solid var(--ih-border)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                styles={{ body: { padding: 24 } }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: structure.type === 'moral'
                          ? 'linear-gradient(135deg, var(--ih-primary), var(--ih-primary-light))'
                          : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {structure.type === 'moral'
                        ? <BankOutlined style={{ color: 'white', fontSize: 20 }} />
                        : <UserOutlined style={{ color: 'white', fontSize: 20 }} />
                      }
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 15, display: 'block', lineHeight: 1.3 }}>
                        {structure.name}
                      </Text>
                      <Tag style={{ marginTop: 4, fontSize: 11 }}>{structure.legalForm}</Tag>
                    </div>
                  </div>
                  <Tag icon={statusCfg.icon} color={statusCfg.color} style={{ marginLeft: 8 }}>
                    {statusCfg.label}
                  </Tag>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {structure.siren && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>SIREN</Text>
                      <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{structure.siren}</Text>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EnvironmentOutlined style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {structure.city}{structure.country !== 'France' ? `, ${structure.country}` : ''}
                    </Text>
                  </div>
                </div>

                {/* KYC Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: structure.kyc.status === 'complete'
                      ? 'rgba(82, 196, 26, 0.06)'
                      : structure.kyc.status === 'action_required'
                        ? 'rgba(250, 173, 20, 0.06)'
                        : 'rgba(22, 119, 255, 0.06)',
                    borderRadius: 8,
                    marginBottom: 12,
                    border: `1px solid ${
                      structure.kyc.status === 'complete'
                        ? 'rgba(82, 196, 26, 0.15)'
                        : structure.kyc.status === 'action_required'
                          ? 'rgba(250, 173, 20, 0.15)'
                          : 'rgba(22, 119, 255, 0.15)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SafetyCertificateOutlined style={{
                      fontSize: 14,
                      color: structure.kyc.status === 'complete'
                        ? '#52c41a'
                        : structure.kyc.status === 'action_required'
                          ? '#faad14'
                          : '#1677ff',
                    }} />
                    <div>
                      <Tag
                        color={kycCfg.color}
                        icon={kycCfg.icon}
                        style={{ margin: 0, fontSize: 11 }}
                      >
                        {kycCfg.label}
                      </Tag>
                      {issues > 0 && (
                        <Text type="secondary" style={{ fontSize: 10, marginLeft: 6 }}>
                          {issues} doc{issues > 1 ? 's' : ''} {issues > 1 ? 'à traiter' : 'à traiter'}
                        </Text>
                      )}
                      {issues === 0 && pending > 0 && (
                        <Text type="secondary" style={{ fontSize: 10, marginLeft: 6 }}>
                          {pending} en attente de validation
                        </Text>
                      )}
                    </div>
                  </div>
                  <Tooltip title={`${structure.kyc.completionPct}% complété`}>
                    <Progress
                      type="circle"
                      percent={structure.kyc.completionPct}
                      size={32}
                      strokeColor={
                        structure.kyc.status === 'complete'
                          ? '#52c41a'
                          : structure.kyc.status === 'action_required'
                            ? '#faad14'
                            : '#1677ff'
                      }
                      format={(pct) => <span style={{ fontSize: 10 }}>{pct}</span>}
                    />
                  </Tooltip>
                </div>

                {/* Mini KPIs */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 8,
                    padding: 12,
                    background: 'var(--ih-bg)',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <UserOutlined style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }} />
                      <Text strong style={{ fontSize: 18 }}>{structure.contacts.length}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 10 }}>Contacts</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <FileTextOutlined style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }} />
                      <Text strong style={{ fontSize: 18 }}>{subsCount}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 10 }}>Souscriptions</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 13, color: 'var(--ih-primary)' }}>
                      {formatCurrency(totalEngagement)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 10 }}>Engagement</Text>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Drawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Code — StructuresPage"
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {STRUCTURES_PAGE_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
