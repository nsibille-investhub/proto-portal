'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Card, Tabs, Form, Input, Select, Button, Tag, Typography, Divider, Table,
  Drawer, Descriptions, Space, Statistic, Modal, message, Tooltip, Badge,
} from 'antd';
import {
  ArrowLeftOutlined, CodeOutlined, BankOutlined, UserOutlined, SyncOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined,
  ClockCircleOutlined, StopOutlined, SearchOutlined, SafetyCertificateOutlined,
  TeamOutlined, CrownOutlined, FileTextOutlined, ExclamationCircleFilled,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  investmentStructures, lpContacts, subscriptions, userProfiles,
  type InvestmentStructure, type StructureContact, type StructureUbo, type StructureKeyPerson,
} from '@/data/mock';
import { STRUCTURE_DETAIL_CODE } from '@/lib/code-sources';

const { Text, Title } = Typography;
const { confirm } = Modal;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: 'Active', color: 'success', icon: <CheckCircleOutlined /> },
  en_cours: { label: 'En cours', color: 'processing', icon: <ClockCircleOutlined /> },
  inactive: { label: 'Inactive', color: 'default', icon: <StopOutlined /> },
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrateur', color: 'blue' },
  viewer: { label: 'Lecteur', color: 'default' },
  signatory: { label: 'Signataire', color: 'purple' },
  accountant: { label: 'Comptable', color: 'cyan' },
};

const SUB_STATUS: Record<string, { label: string; color: string }> = {
  to_sign: { label: 'A signer', color: 'warning' },
  in_progress: { label: 'En cours', color: 'processing' },
  valid: { label: 'Valide', color: 'success' },
  study: { label: 'En étude', color: 'default' },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function getContactName(contactId: number): string {
  if (contactId === 0) {
    return `${userProfiles.lp.firstName} ${userProfiles.lp.lastName}`;
  }
  const contact = lpContacts.find(c => c.id === contactId);
  return contact ? `${contact.firstName} ${contact.lastName}` : `Contact #${contactId}`;
}

function getContactEmail(contactId: number): string {
  if (contactId === 0) return userProfiles.lp.email;
  const contact = lpContacts.find(c => c.id === contactId);
  return contact?.email ?? '';
}

export default function StructureDetailPage() {
  return (
    <Suspense fallback={null}>
      <StructureDetailContent />
    </Suspense>
  );
}

function StructureDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const persona = searchParams.get('persona') ?? 'lp';
  const structureId = params.id as string;
  const structure = investmentStructures.find(s => s.id === structureId);

  const [codeOpen, setCodeOpen] = useState(false);
  const [inseeLoading, setInseeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('identification');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [uboModalOpen, setUboModalOpen] = useState(false);
  const [keyPersonModalOpen, setKeyPersonModalOpen] = useState(false);

  if (!structure) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Title level={4} style={{ color: 'var(--ih-text-secondary)' }}>Structure introuvable</Title>
        <Button onClick={() => router.back()}>Retour</Button>
      </div>
    );
  }

  const linkedSubs = subscriptions.filter(s => structure.subscriptionIds.includes(s.id));
  const totalEngagement = linkedSubs.reduce((sum, s) => sum + s.amount, 0);
  const totalCalled = linkedSubs.reduce((sum, s) => sum + s.called, 0);
  const totalDistributed = linkedSubs.reduce((sum, s) => sum + s.distributed, 0);
  const statusCfg = STATUS_CONFIG[structure.status] ?? STATUS_CONFIG.active;

  function handleInseeSync() {
    setInseeLoading(true);
    setTimeout(() => {
      setInseeLoading(false);
      message.success('Synchronisation INSEE terminée — données à jour');
    }, 1500);
  }

  const backHref = persona !== 'lp' ? `/structures?persona=${persona}` : '/structures';

  const contactColumns: ColumnsType<StructureContact> = [
    {
      title: 'Nom',
      dataIndex: 'contactId',
      render: (id: number) => (
        <Space>
          <UserOutlined style={{ color: 'var(--ih-text-secondary)' }} />
          <Text strong>{getContactName(id)}</Text>
          {id === 0 && <Tag color="green" style={{ fontSize: 10 }}>Vous</Tag>}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'contactId',
      key: 'email',
      render: (id: number) => <Text type="secondary" style={{ fontSize: 12 }}>{getContactEmail(id)}</Text>,
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      render: (role: string) => {
        const cfg = ROLE_LABELS[role] ?? { label: role, color: 'default' };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '',
      width: 80,
      render: (_: unknown, record: StructureContact) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              confirm({
                title: 'Retirer ce contact ?',
                icon: <ExclamationCircleFilled />,
                content: `${getContactName(record.contactId)} sera retiré de cette structure.`,
                okText: 'Retirer',
                okType: 'danger',
                cancelText: 'Annuler',
                onOk() { message.success('Contact retiré'); },
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const uboColumns: ColumnsType<StructureUbo> = [
    {
      title: 'Bénéficiaire',
      dataIndex: 'contactId',
      render: (id: number) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: 'var(--ih-primary)' }} />
          <Text strong>{getContactName(id)}</Text>
          {id === 0 && <Tag color="green" style={{ fontSize: 10 }}>Vous</Tag>}
        </Space>
      ),
    },
    {
      title: 'Détention',
      dataIndex: 'ownershipPct',
      render: (pct: number) => <Text strong style={{ color: 'var(--ih-primary)' }}>{pct}%</Text>,
      sorter: (a, b) => b.ownershipPct - a.ownershipPct,
    },
    {
      title: 'Type',
      dataIndex: 'directHolding',
      render: (direct: boolean) => (
        <Tag color={direct ? 'blue' : 'orange'}>{direct ? 'Directe' : 'Indirecte'}</Tag>
      ),
    },
    {
      title: 'Date de déclaration',
      dataIndex: 'declarationDate',
    },
    {
      title: '',
      width: 80,
      render: (_: unknown, record: StructureUbo) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              confirm({
                title: 'Retirer ce bénéficiaire ?',
                icon: <ExclamationCircleFilled />,
                content: `${getContactName(record.contactId)} sera retiré des UBO.`,
                okText: 'Retirer',
                okType: 'danger',
                cancelText: 'Annuler',
                onOk() { message.success('UBO retiré'); },
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const keyPeopleColumns: ColumnsType<StructureKeyPerson> = [
    {
      title: 'Nom',
      dataIndex: 'contactId',
      render: (id: number) => (
        <Space>
          <CrownOutlined style={{ color: '#faad14' }} />
          <Text strong>{getContactName(id)}</Text>
          {id === 0 && <Tag color="green" style={{ fontSize: 10 }}>Vous</Tag>}
        </Space>
      ),
    },
    {
      title: 'Fonction',
      dataIndex: 'function',
      render: (fn: string) => <Tag>{fn}</Tag>,
    },
    {
      title: 'Depuis le',
      dataIndex: 'startDate',
    },
    {
      title: '',
      width: 80,
      render: (_: unknown, record: StructureKeyPerson) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              confirm({
                title: 'Retirer cette personne ?',
                icon: <ExclamationCircleFilled />,
                content: `${getContactName(record.contactId)} sera retiré des personnes clés.`,
                okText: 'Retirer',
                okType: 'danger',
                cancelText: 'Annuler',
                onOk() { message.success('Personne clé retirée'); },
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const subscriptionColumns: ColumnsType<typeof subscriptions[0]> = [
    {
      title: 'Fonds',
      dataIndex: 'fund',
      render: (fund: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{fund}</Text>
          {record.part && <Text type="secondary" style={{ fontSize: 11 }}>{record.part}</Text>}
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Engagement',
      dataIndex: 'amount',
      render: (v: number) => formatCurrency(v),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Appelé',
      dataIndex: 'called',
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      render: (status: string) => {
        const cfg = SUB_STATUS[status] ?? { label: status, color: 'default' };
        return <Badge status={cfg.color as 'success' | 'processing' | 'warning' | 'default'} text={cfg.label} />;
      },
    },
  ];

  const tabItems = [
    {
      key: 'identification',
      label: (
        <span><BankOutlined style={{ marginRight: 6 }} />Identification</span>
      ),
      children: (
        <Card style={{ border: '1px solid var(--ih-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title level={5} style={{ margin: 0 }}>Identification réglementaire</Title>
            <Button
              icon={<SyncOutlined spin={inseeLoading} />}
              loading={inseeLoading}
              onClick={handleInseeSync}
              style={{ borderRadius: 8 }}
            >
              Synchroniser INSEE
            </Button>
          </div>

          <Form layout="vertical" requiredMark={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Dénomination sociale</Text>}>
                <Input defaultValue={structure.name} style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Forme juridique</Text>}>
                <Select
                  defaultValue={structure.legalForm}
                  style={{ borderRadius: 8 }}
                  options={[
                    { value: 'SCI', label: 'SCI' },
                    { value: 'SAS', label: 'SAS' },
                    { value: 'SARL', label: 'SARL' },
                    { value: 'SA', label: 'SA' },
                    { value: 'SNC', label: 'SNC' },
                    { value: 'Personne physique', label: 'Personne physique' },
                  ]}
                />
              </Form.Item>
            </div>

            {structure.type === 'moral' && (
              <>
                <Divider style={{ margin: '8px 0 20px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>SIREN</Text>}>
                    <Input
                      defaultValue={structure.siren}
                      style={{ borderRadius: 8, fontFamily: 'monospace' }}
                      suffix={
                        <Tooltip title="Rechercher sur INSEE">
                          <SearchOutlined
                            style={{ cursor: 'pointer', color: 'var(--ih-primary)' }}
                            onClick={handleInseeSync}
                          />
                        </Tooltip>
                      }
                    />
                  </Form.Item>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>SIRET</Text>}>
                    <Input defaultValue={structure.siret} style={{ borderRadius: 8, fontFamily: 'monospace' }} />
                  </Form.Item>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>RCS</Text>}>
                    <Input defaultValue={structure.rcs} style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>Capital social</Text>}>
                    <Input
                      defaultValue={structure.capital.toLocaleString('fr-FR')}
                      suffix="EUR"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>Code NAF</Text>}>
                    <Input defaultValue={structure.nafCode} style={{ borderRadius: 8, fontFamily: 'monospace' }} />
                  </Form.Item>
                  <Form.Item label={<Text strong style={{ fontSize: 13 }}>Libellé NAF</Text>}>
                    <Input defaultValue={structure.nafLabel} style={{ borderRadius: 8 }} disabled />
                  </Form.Item>
                </div>
              </>
            )}

            <Divider style={{ margin: '8px 0 20px' }} />
            <Title level={5} style={{ margin: '0 0 16px' }}>Adresse</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 20px' }}>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Adresse</Text>}>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                  defaultValue={structure.address}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Code postal</Text>}>
                <Input defaultValue={structure.postalCode} style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Ville</Text>}>
                <Input defaultValue={structure.city} style={{ borderRadius: 8 }} />
              </Form.Item>
            </div>
            <Form.Item label={<Text strong style={{ fontSize: 13 }}>Pays</Text>} style={{ maxWidth: 300 }}>
              <Select
                defaultValue={structure.country}
                options={['France', 'Belgique', 'Suisse', 'Luxembourg'].map(c => ({ value: c, label: c }))}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button type="primary" size="large" style={{ borderRadius: 8, minWidth: 160 }}>
                Sauvegarder
              </Button>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: 'contacts',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 6 }} />
          Contacts
          <Badge count={structure.contacts.length} style={{ marginLeft: 8, backgroundColor: 'var(--ih-primary)' }} />
        </span>
      ),
      children: (
        <Card style={{ border: '1px solid var(--ih-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>Contacts rattachés</Title>
            <Space>
              <Button icon={<PlusOutlined />} onClick={() => setContactModalOpen(true)} style={{ borderRadius: 8 }}>
                Rattacher un contact
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setContactModalOpen(true)} style={{ borderRadius: 8 }}>
                Créer un contact
              </Button>
            </Space>
          </div>
          <Table
            dataSource={structure.contacts}
            columns={contactColumns}
            rowKey="contactId"
            pagination={false}
            size="middle"
          />
        </Card>
      ),
    },
    {
      key: 'ubo',
      label: (
        <span>
          <SafetyCertificateOutlined style={{ marginRight: 6 }} />
          UBO
          <Badge count={structure.ubos.length} style={{ marginLeft: 8, backgroundColor: 'var(--ih-primary)' }} />
        </span>
      ),
      children: (
        <Card style={{ border: '1px solid var(--ih-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>Bénéficiaires effectifs (UBO)</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setUboModalOpen(true)} style={{ borderRadius: 8 }}>
              Ajouter un UBO
            </Button>
          </div>
          {structure.ubos.length > 0 ? (
            <>
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--ih-bg)', borderRadius: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total détention déclarée :{' '}
                  <Text strong style={{ color: 'var(--ih-primary)' }}>
                    {structure.ubos.reduce((s, u) => s + u.ownershipPct, 0)}%
                  </Text>
                </Text>
              </div>
              <Table
                dataSource={structure.ubos}
                columns={uboColumns}
                rowKey="contactId"
                pagination={false}
                size="middle"
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">Aucun bénéficiaire effectif déclaré</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Les personnes physiques ne nécessitent pas de déclaration UBO
              </Text>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'key-people',
      label: (
        <span>
          <CrownOutlined style={{ marginRight: 6 }} />
          Personnes clés
          <Badge count={structure.keyPeople.length} style={{ marginLeft: 8, backgroundColor: 'var(--ih-primary)' }} />
        </span>
      ),
      children: (
        <Card style={{ border: '1px solid var(--ih-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>Dirigeants et personnes clés</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setKeyPersonModalOpen(true)} style={{ borderRadius: 8 }}>
              Ajouter une personne clé
            </Button>
          </div>
          {structure.keyPeople.length > 0 ? (
            <Table
              dataSource={structure.keyPeople}
              columns={keyPeopleColumns}
              rowKey={(r) => `${r.contactId}-${r.function}`}
              pagination={false}
              size="middle"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">Aucune personne clé déclarée</Text>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'subscriptions',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 6 }} />
          Souscriptions
          <Badge count={linkedSubs.length} style={{ marginLeft: 8, backgroundColor: 'var(--ih-primary)' }} />
        </span>
      ),
      children: (
        <Card style={{ border: '1px solid var(--ih-border)', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>Souscriptions rattachées</Title>
          </div>
          {linkedSubs.length > 0 ? (
            <Table
              dataSource={linkedSubs}
              columns={subscriptionColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">Aucune souscription rattachée à cette structure</Text>
            </div>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Back + title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(backHref)}
            style={{ color: 'var(--ih-text-secondary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: structure.type === 'moral'
                    ? 'linear-gradient(135deg, var(--ih-primary), var(--ih-primary-light))'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {structure.type === 'moral'
                  ? <BankOutlined style={{ color: 'white', fontSize: 18 }} />
                  : <UserOutlined style={{ color: 'white', fontSize: 18 }} />
                }
              </div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{structure.name}</Title>
                <Space size={8}>
                  <Tag>{structure.legalForm}</Tag>
                  <Tag icon={statusCfg.icon} color={statusCfg.color}>{statusCfg.label}</Tag>
                  {structure.siren && (
                    <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                      SIREN {structure.siren}
                    </Text>
                  )}
                </Space>
              </div>
            </div>
          </div>
        </div>
        <Button
          type="text"
          icon={<CodeOutlined />}
          onClick={() => setCodeOpen(true)}
          style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
        >
          Show code
        </Button>
      </div>

      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }} styles={{ body: { padding: '16px 20px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: 12 }}>Engagement total</Text>}
            value={totalEngagement}
            formatter={(v) => formatCurrency(Number(v))}
            valueStyle={{ fontSize: 22, fontWeight: 700, color: 'var(--ih-primary)' }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }} styles={{ body: { padding: '16px 20px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: 12 }}>Total appelé</Text>}
            value={totalCalled}
            formatter={(v) => formatCurrency(Number(v))}
            valueStyle={{ fontSize: 22, fontWeight: 700 }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }} styles={{ body: { padding: '16px 20px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: 12 }}>Total distribué</Text>}
            value={totalDistributed}
            formatter={(v) => formatCurrency(Number(v))}
            valueStyle={{ fontSize: 22, fontWeight: 700 }}
          />
        </Card>
        <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }} styles={{ body: { padding: '16px 20px' } }}>
          <Statistic
            title={<Text type="secondary" style={{ fontSize: 12 }}>Souscriptions</Text>}
            value={linkedSubs.length}
            valueStyle={{ fontSize: 22, fontWeight: 700 }}
          />
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 32 }}
      />

      {/* Add contact modal */}
      <Modal
        open={contactModalOpen}
        onCancel={() => setContactModalOpen(false)}
        title="Rattacher un contact"
        footer={[
          <Button key="cancel" onClick={() => setContactModalOpen(false)}>Annuler</Button>,
          <Button key="ok" type="primary" onClick={() => { setContactModalOpen(false); message.success('Contact ajouté'); }}>
            Rattacher
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Contact existant">
            <Select
              showSearch
              placeholder="Rechercher un contact..."
              optionFilterProp="label"
              options={lpContacts.map(c => ({
                value: c.id,
                label: `${c.firstName} ${c.lastName} — ${c.email}`,
              }))}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item label="Rôle">
            <Select
              defaultValue="viewer"
              options={Object.entries(ROLE_LABELS).map(([value, cfg]) => ({ value, label: cfg.label }))}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add UBO modal */}
      <Modal
        open={uboModalOpen}
        onCancel={() => setUboModalOpen(false)}
        title="Ajouter un bénéficiaire effectif"
        footer={[
          <Button key="cancel" onClick={() => setUboModalOpen(false)}>Annuler</Button>,
          <Button key="ok" type="primary" onClick={() => { setUboModalOpen(false); message.success('UBO ajouté'); }}>
            Ajouter
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Contact">
            <Select
              showSearch
              placeholder="Rechercher un contact..."
              optionFilterProp="label"
              options={[
                { value: 0, label: `${userProfiles.lp.firstName} ${userProfiles.lp.lastName} (Vous)` },
                ...lpContacts.map(c => ({
                  value: c.id,
                  label: `${c.firstName} ${c.lastName}`,
                })),
              ]}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="Pourcentage de détention">
              <Input type="number" suffix="%" defaultValue={25} style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item label="Type de détention">
              <Select
                defaultValue="direct"
                options={[
                  { value: 'direct', label: 'Directe' },
                  { value: 'indirect', label: 'Indirecte' },
                ]}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Add key person modal */}
      <Modal
        open={keyPersonModalOpen}
        onCancel={() => setKeyPersonModalOpen(false)}
        title="Ajouter une personne clé"
        footer={[
          <Button key="cancel" onClick={() => setKeyPersonModalOpen(false)}>Annuler</Button>,
          <Button key="ok" type="primary" onClick={() => { setKeyPersonModalOpen(false); message.success('Personne clé ajoutée'); }}>
            Ajouter
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Contact">
            <Select
              showSearch
              placeholder="Rechercher un contact..."
              optionFilterProp="label"
              options={[
                { value: 0, label: `${userProfiles.lp.firstName} ${userProfiles.lp.lastName} (Vous)` },
                ...lpContacts.map(c => ({
                  value: c.id,
                  label: `${c.firstName} ${c.lastName}`,
                })),
              ]}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item label="Fonction">
            <Select
              placeholder="Sélectionner une fonction..."
              options={[
                { value: 'Gérant', label: 'Gérant' },
                { value: 'Président', label: 'Président' },
                { value: 'Directeur Général', label: 'Directeur Général' },
                { value: 'Directeur Financier', label: 'Directeur Financier' },
                { value: 'Secrétaire Général', label: 'Secrétaire Général' },
                { value: 'Administrateur', label: 'Administrateur' },
                { value: 'Commissaire aux comptes', label: 'Commissaire aux comptes' },
              ]}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Code drawer */}
      <Drawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Code — StructureDetailPage"
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {STRUCTURE_DETAIL_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
