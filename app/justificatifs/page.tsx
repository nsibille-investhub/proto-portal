'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Table, Button, Tag, Typography, Badge, Alert, Drawer, Upload, Tooltip, Card, Space, message,
} from 'antd';
import {
  DownloadOutlined, UploadOutlined, EyeOutlined, CodeOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CloseCircleOutlined, WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  investmentStructures,
  type KycDocument,
} from '@/data/mock';
import { JUSTIFICATIFS_PAGE_CODE } from '@/lib/code-sources';

const { Text } = Typography;

const DOC_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  validated: { label: 'Validé', color: 'success', icon: <CheckCircleOutlined /> },
  pending_review: { label: 'En attente de revue', color: 'processing', icon: <ClockCircleOutlined /> },
  rejected: { label: 'Refusé', color: 'error', icon: <CloseCircleOutlined /> },
  expired: { label: 'Expiré', color: 'error', icon: <WarningOutlined /> },
  missing: { label: 'Manquant', color: 'warning', icon: <ExclamationCircleOutlined /> },
};

function getActionCount(docs: KycDocument[]): number {
  return docs.filter(d => d.status === 'expired' || d.status === 'missing' || d.status === 'rejected').length;
}

function DocTable({ documents, title }: { documents: KycDocument[]; title?: string }) {
  const actionCount = getActionCount(documents);

  const columns: ColumnsType<KycDocument> = [
    {
      title: 'Document',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      render: (name: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>{name}</span>
          {record.status === 'expired' && (
            <Tag color="error" style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}>Expiré</Tag>
          )}
          {record.status === 'missing' && (
            <Tag color="warning" style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}>À fournir</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Date de soumission',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      width: 180,
      render: (v: string | null) =>
        v ? <span style={{ fontSize: 13 }}>{v}</span> : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      filters: [
        { text: 'Validé', value: 'validated' },
        { text: 'En attente', value: 'pending_review' },
        { text: 'Expiré', value: 'expired' },
        { text: 'Manquant', value: 'missing' },
        { text: 'Refusé', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const cfg = DOC_STATUS_CONFIG[status];
        if (!cfg) return status;
        return (
          <Tag
            icon={cfg.icon}
            color={cfg.color}
            style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Date de validité',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 150,
      render: (v: string | null) =>
        v ? <span style={{ fontSize: 13 }}>{v}</span> : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      align: 'right' as const,
      render: (_: unknown, record: KycDocument) => {
        if (record.status === 'missing') {
          return (
            <Upload
              showUploadList={false}
              beforeUpload={() => {
                message.success(`Upload simulé pour "${record.name}"`);
                return false;
              }}
            >
              <Button
                type="primary"
                size="small"
                icon={<UploadOutlined />}
                style={{ borderRadius: 6 }}
              >
                Déposer
              </Button>
            </Upload>
          );
        }
        return (
          <Space size={4}>
            <Tooltip title="Visualiser">
              <Button type="text" size="small" icon={<EyeOutlined />} />
            </Tooltip>
            <Tooltip title="Télécharger">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => message.info('Téléchargement simulé')}
              />
            </Tooltip>
            {(record.status === 'expired' || record.status === 'rejected') && (
              <Upload
                showUploadList={false}
                beforeUpload={() => {
                  message.success(`Remplacement simulé pour "${record.name}"`);
                  return false;
                }}
              >
                <Tooltip title="Remplacer le document">
                  <Button type="text" size="small" icon={<UploadOutlined />} style={{ color: 'var(--ih-primary)' }} />
                </Tooltip>
              </Upload>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      size="small"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          {actionCount > 0 && (
            <Badge count={actionCount} style={{ backgroundColor: '#ff4d4f' }} />
          )}
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto', fontWeight: 400 }}>
            {documents.length} document{documents.length > 1 ? 's' : ''}
          </Text>
        </div>
      }
      style={{
        borderRadius: 12,
        border: '1px solid var(--ih-border)',
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Table
        dataSource={documents}
        columns={columns}
        rowKey="id"
        pagination={documents.length > 6 ? { pageSize: 6, size: 'small' } : false}
        size="middle"
      />
    </Card>
  );
}

function JustificatifsContent() {
  const searchParams = useSearchParams();
  const _persona = searchParams.get('persona') ?? 'lp';
  const [codeOpen, setCodeOpen] = useState(false);

  const { commonDocs, structureBlocks, totalActions } = useMemo(() => {
    const commonDocMap = new Map<string, KycDocument>();

    investmentStructures.forEach(structure => {
      structure.kyc.documents
        .filter(d => d.category === 'common')
        .forEach(doc => {
          const existing = commonDocMap.get(doc.id);
          if (!existing) {
            commonDocMap.set(doc.id, { ...doc });
          } else {
            const priority: Record<string, number> = { missing: 4, expired: 3, rejected: 2, pending_review: 1, validated: 0 };
            if ((priority[doc.status] ?? 0) > (priority[existing.status] ?? 0)) {
              commonDocMap.set(doc.id, { ...doc });
            }
          }
        });
    });

    const common = Array.from(commonDocMap.values());

    const blocks = investmentStructures.map(structure => ({
      id: structure.id,
      name: structure.name,
      type: structure.type,
      legalForm: structure.legalForm,
      kycStatus: structure.kyc.status,
      documents: structure.kyc.documents.filter(d => d.category === 'structure'),
    }));

    const total = getActionCount(common) + blocks.reduce((sum, b) => sum + getActionCount(b.documents), 0);

    return { commonDocs: common, structureBlocks: blocks, totalActions: total };
  }, []);

  const KYC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    complete: { label: 'Complet', color: 'success' },
    in_progress: { label: 'En cours', color: 'processing' },
    action_required: { label: 'Action requise', color: 'error' },
    not_started: { label: 'Non démarré', color: 'default' },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader
          title="Mes justificatifs"
          subtitle="Documents nécessaires au KYC pour vos structures d'investissement"
        />
        <Button
          type="text"
          icon={<CodeOutlined />}
          onClick={() => setCodeOpen(true)}
          style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
        >
          Show code
        </Button>
      </div>

      {totalActions > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          message={
            <span style={{ fontWeight: 600 }}>
              {totalActions} document{totalActions > 1 ? 's' : ''} nécessite{totalActions > 1 ? 'nt' : ''} votre attention
            </span>
          }
          description="Des documents sont expirés, manquants ou refusés. Veuillez les mettre à jour pour maintenir votre conformité KYC."
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <DocTable
          title="Tronc commun"
          documents={commonDocs}
        />

        {structureBlocks.map(block => {
          const statusCfg = KYC_STATUS_CONFIG[block.kycStatus];
          const titleLabel = block.type === 'physical'
            ? `${block.name} (personne physique)`
            : `${block.name} (${block.legalForm})`;
          return (
            <Card
              key={block.id}
              size="small"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{titleLabel}</span>
                  {statusCfg && (
                    <Tag color={statusCfg.color} style={{ fontSize: 11 }}>{statusCfg.label}</Tag>
                  )}
                  {getActionCount(block.documents) > 0 && (
                    <Badge count={getActionCount(block.documents)} style={{ backgroundColor: '#ff4d4f' }} />
                  )}
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto', fontWeight: 400 }}>
                    {block.documents.length} document{block.documents.length > 1 ? 's' : ''} spécifique{block.documents.length > 1 ? 's' : ''}
                  </Text>
                </div>
              }
              style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }}
              styles={{ body: { padding: 0 } }}
            >
              {block.documents.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 28, color: '#52c41a', marginBottom: 8 }} />
                  <div style={{ color: 'var(--ih-text-secondary)', fontSize: 13 }}>
                    Aucun document spécifique requis pour cette structure
                  </div>
                </div>
              ) : (
                <Table
                  dataSource={block.documents}
                  columns={[
                    {
                      title: 'Document',
                      dataIndex: 'name',
                      key: 'name',
                      width: 320,
                      render: (name: string, record: KycDocument) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>{name}</span>
                          {record.status === 'expired' && (
                            <Tag color="error" style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}>Expiré</Tag>
                          )}
                          {record.status === 'missing' && (
                            <Tag color="warning" style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}>À fournir</Tag>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: 'Date de soumission',
                      dataIndex: 'uploadedAt',
                      key: 'uploadedAt',
                      width: 180,
                      render: (v: string | null) =>
                        v ? <span style={{ fontSize: 13 }}>{v}</span> : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
                    },
                    {
                      title: 'Statut',
                      dataIndex: 'status',
                      key: 'status',
                      width: 180,
                      render: (status: string) => {
                        const cfg = DOC_STATUS_CONFIG[status];
                        if (!cfg) return status;
                        return (
                          <Tag
                            icon={cfg.icon}
                            color={cfg.color}
                            style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            {cfg.label}
                          </Tag>
                        );
                      },
                    },
                    {
                      title: 'Date de validité',
                      dataIndex: 'expiresAt',
                      key: 'expiresAt',
                      width: 150,
                      render: (v: string | null) =>
                        v ? <span style={{ fontSize: 13 }}>{v}</span> : <Text type="secondary" style={{ fontSize: 13 }}>—</Text>,
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      width: 140,
                      align: 'right' as const,
                      render: (_: unknown, record: KycDocument) => {
                        if (record.status === 'missing') {
                          return (
                            <Upload
                              showUploadList={false}
                              beforeUpload={() => {
                                message.success(`Upload simulé pour "${record.name}"`);
                                return false;
                              }}
                            >
                              <Button type="primary" size="small" icon={<UploadOutlined />} style={{ borderRadius: 6 }}>
                                Déposer
                              </Button>
                            </Upload>
                          );
                        }
                        return (
                          <Space size={4}>
                            <Tooltip title="Visualiser">
                              <Button type="text" size="small" icon={<EyeOutlined />} />
                            </Tooltip>
                            <Tooltip title="Télécharger">
                              <Button
                                type="text"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => message.info('Téléchargement simulé')}
                              />
                            </Tooltip>
                            {(record.status === 'expired' || record.status === 'rejected') && (
                              <Upload
                                showUploadList={false}
                                beforeUpload={() => {
                                  message.success(`Remplacement simulé pour "${record.name}"`);
                                  return false;
                                }}
                              >
                                <Tooltip title="Remplacer le document">
                                  <Button type="text" size="small" icon={<UploadOutlined />} style={{ color: 'var(--ih-primary)' }} />
                                </Tooltip>
                              </Upload>
                            )}
                          </Space>
                        );
                      },
                    },
                  ]}
                  rowKey="id"
                  pagination={block.documents.length > 6 ? { pageSize: 6, size: 'small' } : false}
                  size="middle"
                />
              )}
            </Card>
          );
        })}
      </div>

      <Drawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Code — JustificatifsPage"
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {JUSTIFICATIFS_PAGE_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}

export default function JustificatifsPage() {
  return (
    <Suspense fallback={null}>
      <JustificatifsContent />
    </Suspense>
  );
}
