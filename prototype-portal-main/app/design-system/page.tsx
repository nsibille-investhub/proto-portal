'use client';
import { Anchor, Typography, Divider, Card, Tag, Badge, Button, Input, Select, Tabs, Table, Alert, Modal, Drawer, Tooltip, Switch, Checkbox, Radio, Progress, Timeline, Avatar, Statistic, Space, Row, Col, Steps, Breadcrumb, Pagination, Skeleton, Empty, Spin, Result, Rate } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  HomeOutlined, FolderOutlined, FileTextOutlined, LineChartOutlined,
  TeamOutlined, BankOutlined, ContactsOutlined, ReadOutlined,
  GlobalOutlined, QuestionCircleOutlined, SwapOutlined, AppstoreOutlined,
  UserOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined, EditOutlined,
  ArrowUpOutlined, SearchOutlined, PlusOutlined, BellOutlined,
} from '@ant-design/icons';
import { useState, Suspense, type ReactNode } from 'react';
import { KpiCard } from '@/components/widgets/KpiCard';
import { FundCard } from '@/components/widgets/FundCard';
import { SecondaryMarketCard } from '@/components/widgets/SecondaryMarketCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SubscriptionTable } from '@/components/widgets/SubscriptionTable';
import { DocumentExplorer } from '@/components/widgets/DocumentExplorer';
import { PerformanceChart } from '@/components/widgets/PerformanceChart';
import { PageHeader } from '@/components/shared/PageHeader';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { funds, subscriptions, documents, navPerformance } from '@/data/mock';

const { Title, Text, Paragraph } = Typography;

function DesignSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 64 }}>
      <Divider orientation="left" style={{ marginBottom: 32 }}>
        <Title level={3} style={{ margin: 0, color: 'var(--ih-primary)' }}>{title}</Title>
      </Divider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <Title level={5} style={{ color: 'var(--ih-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>{title}</Title>
      {children}
    </div>
  );
}

const colors = [
  { name: '--ih-primary', hex: '#0E2A32', label: 'Primary (bleu marine)' },
  { name: '--ih-primary-light', hex: '#1a4050', label: 'Primary light' },
  { name: '--ih-accent', hex: '#CBFF99', label: 'Accent (lime)' },
  { name: '--ih-bg', hex: '#F5F7FA', label: 'Background' },
  { name: '--ih-bg-card', hex: '#FFFFFF', label: 'Card background' },
  { name: '--ih-text-primary', hex: '#1A1A2E', label: 'Text primary' },
  { name: '--ih-text-secondary', hex: '#6B7280', label: 'Text secondary' },
  { name: '--ih-border', hex: '#E5E7EB', label: 'Border' },
];

const mockTableData = [
  { key: 1, name: 'Ligne de données 1', date: '04/05/2026', value: '10 000 €', status: 'valid' },
  { key: 2, name: 'Ligne de données 2', date: '01/05/2026', value: '25 000 €', status: 'in_progress' },
  { key: 3, name: 'Ligne de données 3', date: '15/04/2026', value: '5 000 €', status: 'to_sign' },
];

const tableColumns: ColumnsType<typeof mockTableData[0]> = [
  { title: 'Nom', dataIndex: 'name', sorter: true },
  { title: 'Date', dataIndex: 'date' },
  { title: 'Valeur', dataIndex: 'value', align: 'right' },
  { title: 'Statut', dataIndex: 'status', render: (v) => <StatusBadge status={v} /> },
  { title: 'Actions', key: 'actions', render: () => <Space><Button type="text" icon={<EyeOutlined />} size="small" /><Button type="text" icon={<DeleteOutlined />} size="small" danger /></Space> },
];

const anchorItems = [
  { key: 'fondamentaux', href: '#fondamentaux', title: 'Fondamentaux' },
  { key: 'kpis', href: '#kpis', title: 'KPI Cards' },
  { key: 'tables', href: '#tables', title: 'Tables' },
  { key: 'cards', href: '#cards', title: 'Cards' },
  { key: 'badges-statuts', href: '#badges-statuts', title: 'Badges & Statuts' },
  { key: 'navigation', href: '#navigation', title: 'Navigation' },
  { key: 'formulaires', href: '#formulaires', title: 'Formulaires' },
  { key: 'feedback', href: '#feedback', title: 'Feedback' },
  { key: 'charts', href: '#charts', title: 'Charts' },
  { key: 'documents', href: '#documents', title: 'Documents' },
  { key: 'divers', href: '#divers', title: 'Divers' },
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <PageHeader
          title="Design System"
          subtitle="Catalogue exhaustif de tous les composants du portail InvestHub"
        />

        {/* FONDAMENTAUX */}
        <DesignSection id="fondamentaux" title="Fondamentaux">
          <SubSection title="Palette de couleurs">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {colors.map(c => (
                <div key={c.name} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--ih-border)', cursor: 'pointer' }}
                  onClick={() => navigator.clipboard?.writeText(c.hex)}>
                  <div style={{ background: c.hex, height: 72 }} />
                  <div style={{ padding: '10px 12px', background: 'white' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ih-text-primary)' }}>{c.label}</div>
                    <code style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }}>{c.hex}</code>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{c.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Typographie">
            <Card style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Title level={1} style={{ margin: 0 }}>H1 — Titre principal (32px Bold)</Title>
                <Title level={2} style={{ margin: 0 }}>H2 — Titre de page (24px Bold)</Title>
                <Title level={3} style={{ margin: 0 }}>H3 — Titre de section (20px Bold)</Title>
                <Title level={4} style={{ margin: 0 }}>H4 — Sous-titre (16px Bold)</Title>
                <Divider style={{ margin: '4px 0' }} />
                <Text style={{ fontSize: 15 }}>Body — Texte courant (15px Regular) — DM Sans 400</Text>
                <Text style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>Caption — Texte secondaire (13px Regular)</Text>
                <Text strong style={{ fontSize: 13 }}>Label — Étiquette (13px Medium)</Text>
                <code style={{ fontSize: 12, background: '#F5F7FA', padding: '4px 8px', borderRadius: 4 }}>Code — Monospace (12px)</code>
              </div>
            </Card>
          </SubSection>

          <SubSection title="Espacements">
            <Card style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
                {[4, 8, 12, 16, 24, 32, 48, 64].map(size => (
                  <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: size, height: size, background: 'var(--ih-primary)', borderRadius: 2, opacity: 0.8 }} />
                    <code style={{ fontSize: 10 }}>{size}px</code>
                  </div>
                ))}
              </div>
            </Card>
          </SubSection>

          <SubSection title="Icônes Ant Design">
            <Card style={{ borderRadius: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16 }}>
                {[
                  { icon: <HomeOutlined />, name: 'HomeOutlined' },
                  { icon: <FolderOutlined />, name: 'FolderOutlined' },
                  { icon: <FileTextOutlined />, name: 'FileTextOutlined' },
                  { icon: <LineChartOutlined />, name: 'LineChartOutlined' },
                  { icon: <TeamOutlined />, name: 'TeamOutlined' },
                  { icon: <BankOutlined />, name: 'BankOutlined' },
                  { icon: <ContactsOutlined />, name: 'ContactsOutlined' },
                  { icon: <ReadOutlined />, name: 'ReadOutlined' },
                  { icon: <GlobalOutlined />, name: 'GlobalOutlined' },
                  { icon: <QuestionCircleOutlined />, name: 'QuestionCircleOutlined' },
                  { icon: <SwapOutlined />, name: 'SwapOutlined' },
                  { icon: <AppstoreOutlined />, name: 'AppstoreOutlined' },
                  { icon: <UserOutlined />, name: 'UserOutlined' },
                  { icon: <DownloadOutlined />, name: 'DownloadOutlined' },
                  { icon: <EyeOutlined />, name: 'EyeOutlined' },
                  { icon: <SearchOutlined />, name: 'SearchOutlined' },
                ].map(item => (
                  <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 22, color: 'var(--ih-primary)' }}>{item.icon}</span>
                    <span style={{ fontSize: 10, color: 'var(--ih-text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </SubSection>
        </DesignSection>

        {/* KPI CARDS */}
        <DesignSection id="kpis" title="KPI Cards">
          <WidgetWrapper title="KpiCard — toutes variantes" codeSource={`export function KpiCard({ label, value, format, trend, icon, loading, tooltip }) {
  if (loading) return <Card><Skeleton /></Card>;
  return (
    <Card style={{ borderRadius: 12 }}>
      <div style={{ fontSize: 13, color: '#6B7280' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{formatValue(value, format)}</div>
      {trend !== undefined && (
        <div style={{ color: trend >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(trend).toFixed(1)} %
        </div>
      )}
    </Card>
  );
}`}>
            <div style={{ paddingTop: 40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                <KpiCard label="Défaut" value={300100} format="currency" icon={<BankOutlined />} />
                <KpiCard label="Tendance haussière" value={10} format="currency" trend={2.3} icon={<ArrowUpOutlined />} />
                <KpiCard label="Tendance baissière" value={8500} format="currency" trend={-1.5} icon={<LineChartOutlined />} />
                <KpiCard label="TRI net" value={12.4} format="percentage" icon={<LineChartOutlined />} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <KpiCard label="Chargement" value={0} loading />
                <KpiCard label="Vide (0 €)" value={0} format="currency" />
                <KpiCard label="Avec tooltip" value={42000} format="currency" tooltip="Info complémentaire sur cet indicateur" />
                <KpiCard label="DPI" value={0.85} format="number" trend={0.05} />
              </div>
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* TABLES */}
        <DesignSection id="tables" title="Tables">
          <WidgetWrapper title="SubscriptionTable — complet" codeSource={`// SubscriptionTable with filters, sort, pagination, summary row
<Table
  dataSource={filtered}
  columns={columns}
  rowKey="id"
  pagination={{ pageSize: 10 }}
  summary={() => <Table.Summary.Row>...</Table.Summary.Row>}
/>`}>
            <div style={{ paddingTop: 40 }}>
              <Suspense fallback={null}><SubscriptionTable data={subscriptions} /></Suspense>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="SimpleDataTable — générique" codeSource={`<Table dataSource={data} columns={columns} rowKey="key" size="middle" />`}>
            <div style={{ paddingTop: 40 }}>
              <Table
                dataSource={mockTableData}
                columns={tableColumns}
                rowKey="key"
                size="middle"
                pagination={{ pageSize: 5, showTotal: (t) => `${t} lignes` }}
                style={{ borderRadius: 12, overflow: 'hidden' }}
              />
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="EmptyTable / LoadingTable" codeSource={`// Empty state
<Table locale={{ emptyText: <Empty description="Aucune donnée" /> }} />
// Loading state
<Table loading={true} />`}>
            <div style={{ paddingTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>État vide</Text>
                <Table dataSource={[]} columns={tableColumns.slice(0, 3)} locale={{ emptyText: <Empty description="Aucune donnée" /> }} style={{ borderRadius: 12, overflow: 'hidden' }} />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>État chargement</Text>
                <Table dataSource={[]} columns={tableColumns.slice(0, 3)} loading style={{ borderRadius: 12, overflow: 'hidden' }} />
              </div>
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* CARDS */}
        <DesignSection id="cards" title="Cards">
          <WidgetWrapper title="FundCard — variantes" codeSource={`// FundCard avec image, date de clôture, description et docs
export function FundCard({ name, closeDate, image, description, docs }) {
  return (
    <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
      <img src={image} alt={name} style={{ objectFit: 'cover' }} />
      {closeDate && <Tag>Jusqu'au {closeDate}</Tag>}
      <h3>{name}</h3>
      <ul>{description.map(d => <li>{d}</li>)}</ul>
      <Button type="primary" block>Voir plus ></Button>
    </Card>
  );
}`}>
            <Suspense fallback={null}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, paddingTop: 40 }}>
                <FundCard {...funds[0]} detailHref={`/funds/${funds[0].id}`} />
                <FundCard {...funds[2]} detailHref={`/funds/${funds[2].id}`} />
                <FundCard {...funds[3]} detailHref={`/funds/${funds[3].id}`} />
              </div>
            </Suspense>
          </WidgetWrapper>

          <WidgetWrapper title="SecondaryMarketCard" codeSource={`export function SecondaryMarketCard({ fund, part, shares, price, validUntil }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>{fund}</div>
      <div style={{ fontSize: 13, color: '#6B7280' }}>{part}</div>
      <div>Nombre de parts : {shares}</div>
      <div>Prix de cession : {price} €</div>
      <div>Offre valable jusqu'au {validUntil}</div>
      <Button>Détails</Button>
      <Button type="primary">Acheter</Button>
    </div>
  );
}`}>
            <div style={{ paddingTop: 40 }}>
              <SecondaryMarketCard fund="Fonds Secondaire" part="PART A" shares={1000} price={100} validUntil="30/08/2026" />
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* BADGES ET STATUTS */}
        <DesignSection id="badges-statuts" title="Badges & Statuts">
          <WidgetWrapper title="StatusBadge — toutes valeurs" codeSource={`const statusConfig = {
  to_sign: { label: 'Souscription à envoyer en signature', color: 'orange' },
  in_progress: { label: 'Souscription en cours', color: 'processing' },
  valid: { label: 'Valide', color: 'success' },
  rejected: { label: 'Refusée', color: 'error' },
  draft: { label: 'Brouillon', color: 'default' },
};
export function StatusBadge({ status }) {
  const config = statusConfig[status];
  return <Tag color={config.color}>{config.label}</Tag>;
}`}>
            <div style={{ paddingTop: 40 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                {['to_sign', 'in_progress', 'valid', 'rejected', 'draft'].map(s => (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                    <StatusBadge status={s} />
                    <code style={{ fontSize: 10, color: '#9CA3AF' }}>{s}</code>
                  </div>
                ))}
              </div>
              <Divider />
              <Text strong style={{ display: 'block', marginBottom: 12 }}>Tags Ant Design</Text>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple','default'].map(c => (
                  <Tag key={c} color={c}>{c}</Tag>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Badge avec compteur</Text>
                <Space size={24}>
                  <Badge count={3}><Button>Souscriptions</Button></Badge>
                  <Badge count={12}><Button>Documents</Button></Badge>
                  <Badge dot><BellOutlined style={{ fontSize: 20 }} /></Badge>
                </Space>
              </div>
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* NAVIGATION */}
        <DesignSection id="navigation" title="Navigation">
          <WidgetWrapper title="Tabs — variantes" codeSource={`<Tabs
  type="line"
  items={[
    { key: '1', label: 'Onglet 1', children: <div>Contenu 1</div> },
    { key: '2', label: 'Onglet 2', children: <div>Contenu 2</div> },
  ]}
/>`}>
            <div style={{ paddingTop: 40 }}>
              <SubSection title="Tabs line (défaut)">
                <Tabs items={[
                  { key: '1', label: 'Impact Growth II', children: <Text>Contenu du fonds Impact Growth II</Text> },
                  { key: '2', label: 'Flex II', children: <Text>Contenu du fonds Flex II</Text> },
                  { key: '3', label: 'Venture I', children: <Text>Contenu du fonds Venture I</Text> },
                ]} />
              </SubSection>
              <SubSection title="Tabs card">
                <Tabs type="card" items={[
                  { key: '1', label: 'Tous', children: <Text>Tous les éléments</Text> },
                  { key: '2', label: 'En cours', children: <Text>Éléments en cours</Text> },
                  { key: '3', label: 'Validés', children: <Text>Éléments validés</Text> },
                ]} />
              </SubSection>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Breadcrumb & Pagination" codeSource={`<Breadcrumb items={[
  { title: 'Home' },
  { title: 'Mes souscriptions' },
  { title: 'Fonds Licorne VI' },
]} />`}>
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Breadcrumb items={[{ title: 'Home' }, { title: 'Mes souscriptions' }, { title: 'Fonds Licorne VI' }]} />
              <Pagination total={50} pageSize={10} showTotal={(t) => `${t} éléments`} />
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Steps — parcours de souscription" codeSource={`<Steps items={[
  { title: 'Initiation', description: 'Données personnelles' },
  { title: 'Documents', description: 'KYC / AML' },
  { title: 'Signature', description: 'Signature électronique' },
  { title: 'Validation', description: 'Confirmation GP' },
]} current={1} />`}>
            <div style={{ paddingTop: 40 }}>
              <Steps current={1} items={[
                { title: 'Initiation', description: 'Données personnelles' },
                { title: 'Documents', description: 'KYC / AML' },
                { title: 'Signature', description: 'Signature électronique' },
                { title: 'Validation', description: 'Confirmation GP' },
              ]} />
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* FORMULAIRES */}
        <DesignSection id="formulaires" title="Formulaires">
          <WidgetWrapper title="Inputs" codeSource={`<Input placeholder="Default" />
<Input placeholder="Avec icône" prefix={<UserOutlined />} />
<Input placeholder="Disabled" disabled />
<Input placeholder="Erreur" status="error" />
<Input.Search placeholder="Recherche" />`}>
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Row gutter={16}>
                <Col span={8}><Input placeholder="Input par défaut" /></Col>
                <Col span={8}><Input placeholder="Avec icône" prefix={<UserOutlined />} /></Col>
                <Col span={8}><Input placeholder="Disabled" disabled /></Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}><Input placeholder="Erreur" status="error" /></Col>
                <Col span={8}><Input.Search placeholder="Recherche..." allowClear /></Col>
                <Col span={8}><Input.Password placeholder="Mot de passe" /></Col>
              </Row>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Select, Checkbox, Radio, Switch" codeSource={`<Select placeholder="Sélectionner" options={options} />
<Select mode="multiple" placeholder="Multi-select" />
<Checkbox>Accepter les conditions</Checkbox>
<Radio.Group options={radioOptions} />
<Switch defaultChecked />`}>
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Select</Text>
                  <Select placeholder="Sélectionner un fonds" style={{ width: '100%' }}
                    options={funds.map(f => ({ value: f.id, label: f.name }))} />
                </Col>
                <Col span={8}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Multi-select</Text>
                  <Select mode="multiple" placeholder="Sélectionner des statuts" style={{ width: '100%' }}
                    options={[{ value: 'valid', label: 'Valide' }, { value: 'in_progress', label: 'En cours' }]} />
                </Col>
                <Col span={8}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Switch</Text>
                  <Space direction="vertical">
                    <Switch defaultChecked />
                    <Switch />
                    <Switch disabled defaultChecked />
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Checkbox</Text>
                  <Space direction="vertical">
                    <Checkbox defaultChecked>Accepter les conditions</Checkbox>
                    <Checkbox>Recevoir les communications</Checkbox>
                    <Checkbox disabled>Option désactivée</Checkbox>
                  </Space>
                </Col>
                <Col span={8}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Radio Group</Text>
                  <Radio.Group defaultValue="a">
                    <Space direction="vertical">
                      <Radio value="a">Part A</Radio>
                      <Radio value="b">Part B</Radio>
                      <Radio value="c" disabled>Part C (indisponible)</Radio>
                    </Space>
                  </Radio.Group>
                </Col>
              </Row>
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* FEEDBACK */}
        <DesignSection id="feedback" title="Feedback & Overlays">
          <WidgetWrapper title="Alert — variantes" codeSource={`<Alert type="info" message="Information" showIcon />
<Alert type="success" message="Succès" showIcon />
<Alert type="warning" message="Attention" showIcon />
<Alert type="error" message="Erreur" showIcon closable />`}>
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Alert type="info" message="Information" description="Vous pouvez vendre vos parts depuis la page souscriptions." showIcon />
              <Alert type="success" message="Souscription validée" description="Votre souscription a été enregistrée avec succès." showIcon />
              <Alert type="warning" message="Action requise" description="Des documents supplémentaires sont requis pour finaliser votre souscription." showIcon closable />
              <Alert type="error" message="Erreur" description="Une erreur est survenue lors du traitement de votre demande." showIcon closable />
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Modal & Drawer" codeSource={`const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Ouvrir Modal</Button>
<Modal open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
  <p>Contenu de la modal</p>
</Modal>`}>
            <div style={{ paddingTop: 40, display: 'flex', gap: 12 }}>
              <Button type="primary" onClick={() => setModalOpen(true)}>Ouvrir une Modal</Button>
              <Button onClick={() => setDrawerOpen(true)}>Ouvrir un Drawer</Button>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Tooltip" codeSource={`<Tooltip title="Texte d'aide" placement="top">
  <Button>Survolez-moi</Button>
</Tooltip>`}>
            <div style={{ paddingTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(['top', 'bottom', 'left', 'right'] as const).map(p => (
                <Tooltip key={p} title={`Tooltip ${p}`} placement={p}>
                  <Button>{p}</Button>
                </Tooltip>
              ))}
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Skeleton & Spin & Empty" codeSource={`<Skeleton active />
<Spin size="large" />
<Empty description="Aucune donnée disponible" />`}>
            <div style={{ paddingTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <Card style={{ borderRadius: 12 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Skeleton</Text>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
              <Card style={{ borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ display: 'block', marginBottom: 12 }}>Spin</Text>
                  <Spin size="large" />
                </div>
              </Card>
              <Card style={{ borderRadius: 12 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Empty</Text>
                <Empty description="Aucune donnée disponible" />
              </Card>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Result" codeSource={`<Result status="success" title="Souscription envoyée" subTitle="Votre souscription a été transmise." />`}>
            <div style={{ paddingTop: 40 }}>
              <Result
                status="success"
                title="Souscription envoyée avec succès"
                subTitle="Votre souscription a été transmise au GP. Vous recevrez une confirmation sous 48h."
                extra={[<Button type="primary" key="home">Retour</Button>, <Button key="sub">Voir mes souscriptions</Button>]}
              />
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* CHARTS */}
        <DesignSection id="charts" title="Charts & Graphiques">
          <WidgetWrapper title="PerformanceChart — LinePath visx" codeSource={`import { LinePath } from '@visx/shape';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ParentSize } from '@visx/responsive';
import { useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { curveMonotoneX } from '@visx/curve';

export function PerformanceChart({ data, height = 280 }) {
  const xScale = scalePoint({ domain: data.map(d => d.date), range: [0, innerWidth] });
  const yScale = scaleLinear({ domain: [minNav - 10, maxNav + 10], range: [innerHeight, 0] });
  return (
    <ParentSize>
      {({ width }) => (
        <svg width={width} height={height}>
          <LinePath data={data} x={d => xScale(d.date)} y={d => yScale(d.nav)}
            stroke="#0E2A32" strokeWidth={2.5} curve={curveMonotoneX} />
          <AxisBottom scale={xScale} />
          <AxisLeft scale={yScale} />
        </svg>
      )}
    </ParentSize>
  );
}`}>
            <Card style={{ borderRadius: 12, paddingTop: 32 }}>
              <Title level={5} style={{ marginBottom: 4 }}>Courbe NAV — 24 mois</Title>
              <Text style={{ color: 'var(--ih-text-secondary)', fontSize: 13, display: 'block', marginBottom: 16 }}>
                Packages : @visx/shape, @visx/scale, @visx/axis, @visx/grid, @visx/responsive, @visx/tooltip
              </Text>
              <PerformanceChart data={navPerformance} height={280} />
            </Card>
          </WidgetWrapper>
        </DesignSection>

        {/* DOCUMENTS */}
        <DesignSection id="documents" title="Explorateur de documents">
          <WidgetWrapper title="DocumentExplorer — complet" codeSource={`// DocumentExplorer uses Ant Design Tree + Table
// Left panel: folder tree grouped by fund
// Right panel: document list with name, date, size, actions
export function DocumentExplorer({ documents }) {
  const [selectedFund, setSelectedFund] = useState(funds[0]);
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Tree treeData={treeData} onSelect={keys => setSelectedFund(String(keys[0]))} />
      <Table
        dataSource={filtered}
        columns={[
          { title: 'Nom', render: (_, doc) => <><FileIcon /> {doc.name} {doc.isNew && <Tag>New</Tag>}</> },
          { title: 'Ajouté le', dataIndex: 'addedAt' },
          { title: 'Taille', dataIndex: 'size' },
          { title: 'Actions', render: () => <><EyeOutlined /> <DownloadOutlined /></> },
        ]}
        rowKey="id"
      />
    </div>
  );
}`}>
            <div style={{ paddingTop: 40 }}>
              <DocumentExplorer documents={documents} />
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* DIVERS */}
        <DesignSection id="divers" title="Divers">
          <WidgetWrapper title="Button — toutes variantes" codeSource={`// Primary, Default, Danger, Ghost, Link, Dashed — toutes tailles
<Button type="primary">Primary</Button>
<Button>Default</Button>
<Button danger>Danger</Button>
<Button type="dashed">Dashed</Button>
<Button type="link">Link</Button>
<Button type="primary" loading>Loading</Button>
<Button type="primary" icon={<PlusOutlined />}>Avec icône</Button>`}>
            <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button danger>Danger</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="link">Link</Button>
                <Button type="primary" ghost>Ghost</Button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button type="primary" size="small">Small</Button>
                <Button type="primary">Medium (défaut)</Button>
                <Button type="primary" size="large">Large</Button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button type="primary" icon={<PlusOutlined />}>Avec icône</Button>
                <Button type="primary" loading>Loading</Button>
                <Button type="primary" disabled>Disabled</Button>
                <Button icon={<DownloadOutlined />}>Télécharger</Button>
                <Button type="primary" icon={<EyeOutlined />} shape="circle" />
              </div>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Progress" codeSource={`<Progress percent={65} strokeColor="#0E2A32" />
<Progress type="circle" percent={75} strokeColor="#CBFF99" />`}>
            <div style={{ paddingTop: 40, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Linéaire</Text>
                <Progress percent={65} strokeColor="var(--ih-primary)" />
                <Progress percent={100} status="success" style={{ marginTop: 8 }} />
                <Progress percent={45} status="exception" style={{ marginTop: 8 }} />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Circulaire</Text>
                <Space>
                  <Progress type="circle" percent={75} strokeColor="var(--ih-primary)" size={80} />
                  <Progress type="circle" percent={100} size={80} />
                </Space>
              </div>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Timeline & Avatar & Statistic" codeSource={`<Timeline items={[
  { children: 'Souscription créée — 15/01/2025' },
  { children: 'Document KYC reçu — 20/01/2025' },
  { children: 'Signature complétée — 25/01/2025', color: 'green' },
]} />
<Avatar>AB</Avatar>
<Statistic title="Valorisation totale" value={300100} suffix="€" />`}>
            <div style={{ paddingTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Timeline</Text>
                <Timeline items={[
                  { children: 'Souscription créée — 15/01/2025' },
                  { children: 'Document KYC reçu — 20/01/2025', color: 'blue' },
                  { children: 'Signature complétée — 25/01/2025', color: 'green' },
                  { children: 'Validation GP en attente', color: 'orange' },
                ]} />
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Avatars</Text>
                <Space direction="vertical">
                  <Avatar style={{ backgroundColor: 'var(--ih-primary)' }}>AB</Avatar>
                  <Avatar icon={<UserOutlined />} />
                  <Avatar size="large" style={{ backgroundColor: 'var(--ih-accent)', color: 'var(--ih-primary)' }}>GP</Avatar>
                  <Space>
                    <Avatar size="small" style={{ backgroundColor: '#87d068' }}>S</Avatar>
                    <Avatar style={{ backgroundColor: '#1677ff' }}>M</Avatar>
                    <Avatar size="large" style={{ backgroundColor: '#f56a00' }}>L</Avatar>
                  </Space>
                </Space>
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Statistic</Text>
                <Space direction="vertical" size={16}>
                  <Statistic title="Engagement total" value={300100} suffix="€" valueStyle={{ color: 'var(--ih-primary)', fontWeight: 700 }} />
                  <Statistic title="TRI net" value={12.4} suffix="%" precision={1} valueStyle={{ color: '#52c41a' }} prefix={<ArrowUpOutlined />} />
                </Space>
              </div>
            </div>
          </WidgetWrapper>

          <WidgetWrapper title="Divider & Tag" codeSource={`<Divider>Titre</Divider>
<Tag color="blue">Étiquette</Tag>
<Tag closable>Closable</Tag>`}>
            <div style={{ paddingTop: 40 }}>
              <Divider>Avec texte</Divider>
              <Divider orientation="left">Aligné à gauche</Divider>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                <Tag color="blue">Blue</Tag>
                <Tag color="green">Green</Tag>
                <Tag color="orange">Orange</Tag>
                <Tag closable>Closable</Tag>
                <Tag icon={<BankOutlined />} color="var(--ih-primary)">Custom</Tag>
              </div>
            </div>
          </WidgetWrapper>
        </DesignSection>

        <Modal
          title="Confirmation"
          open={modalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          okText="Valider"
          cancelText="Annuler"
        >
          <Paragraph>Êtes-vous sûr de vouloir effectuer cette action ?</Paragraph>
          <Alert type="warning" message="Cette action est irréversible." showIcon />
        </Modal>

        <Drawer
          title="Code — Exemple de Drawer"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={480}
        >
          <Paragraph>Ce drawer est utilisé pour afficher le code source des composants (Show Code).</Paragraph>
          <Alert type="info" message="Largeur standard : 640px" showIcon />
        </Drawer>
      </div>

      {/* Table of contents */}
      <div style={{ width: 180, flexShrink: 0, position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
        <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)' }} styles={{ body: { padding: '12px 0' } }}>
          <div style={{ padding: '0 16px 8px', borderBottom: '1px solid var(--ih-border)', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, color: 'var(--ih-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sections
            </Text>
          </div>
          <Anchor
            affix={false}
            items={anchorItems}
            style={{ padding: '0 8px' }}
          />
        </Card>
      </div>
    </div>
  );
}
