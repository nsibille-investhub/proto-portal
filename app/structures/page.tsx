'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card, Tag, Typography, Button, Badge, Drawer, Empty, Progress, Tooltip,
  Form, Input, Select, Steps, Divider, Radio, Alert, Space, message,
} from 'antd';
import {
  BankOutlined, UserOutlined, FileTextOutlined,
  EnvironmentOutlined, PlusOutlined, CodeOutlined,
  CheckCircleOutlined, ClockCircleOutlined, StopOutlined,
  SafetyCertificateOutlined, ExclamationCircleOutlined,
  SearchOutlined, ArrowLeftOutlined, ArrowRightOutlined,
  LoadingOutlined, GlobalOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageHeader } from '@/components/shared/PageHeader';
import { investmentStructures, subscriptions } from '@/data/mock';
import { STRUCTURES_PAGE_CODE } from '@/lib/code-sources';

const { Text, Title } = Typography;

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

const LEGAL_FORMS_MORAL = [
  { value: 'SCI', label: 'SCI — Société Civile Immobilière' },
  { value: 'SAS', label: 'SAS — Société par Actions Simplifiée' },
  { value: 'SARL', label: 'SARL — Société à Responsabilité Limitée' },
  { value: 'SA', label: 'SA — Société Anonyme' },
  { value: 'SNC', label: 'SNC — Société en Nom Collectif' },
  { value: 'SCA', label: 'SCA — Société en Commandite par Actions' },
  { value: 'EURL', label: 'EURL — Entreprise Unipersonnelle' },
  { value: 'Association', label: 'Association loi 1901' },
  { value: 'Fondation', label: 'Fondation' },
  { value: 'Autre', label: 'Autre' },
];

const COUNTRIES = [
  'France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco',
  'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Pays-Bas',
];

interface InseeResult {
  name: string;
  siren: string;
  siret: string;
  legalForm: string;
  nafCode: string;
  nafLabel: string;
  address: string;
  postalCode: string;
  city: string;
  capital: number;
  rcs: string;
}

const MOCK_INSEE_RESULTS: InseeResult[] = [
  {
    name: 'SCI du Parc Monceau',
    siren: '845 231 789',
    siret: '845 231 789 00015',
    legalForm: 'SCI',
    nafCode: '6820A',
    nafLabel: 'Location de logements',
    address: '12 avenue Hoche',
    postalCode: '75008',
    city: 'Paris',
    capital: 100000,
    rcs: 'Paris B 845 231 789',
  },
  {
    name: 'Patrimoine & Associés SAS',
    siren: '912 456 321',
    siret: '912 456 321 00024',
    legalForm: 'SAS',
    nafCode: '6420Z',
    nafLabel: 'Activités des sociétés holding',
    address: '45 rue de la République',
    postalCode: '69002',
    city: 'Lyon',
    capital: 500000,
    rcs: 'Lyon B 912 456 321',
  },
  {
    name: 'Invest Capital SARL',
    siren: '789 012 345',
    siret: '789 012 345 00031',
    legalForm: 'SARL',
    nafCode: '6630Z',
    nafLabel: 'Gestion de fonds',
    address: '8 place de la Bourse',
    postalCode: '33000',
    city: 'Bordeaux',
    capital: 250000,
    rcs: 'Bordeaux B 789 012 345',
  },
];

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

  const [createOpen, setCreateOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [structureType, setStructureType] = useState<'moral' | 'physical' | null>(null);
  const [form] = Form.useForm();
  const [inseeSearching, setInseeSearching] = useState(false);
  const [inseeResults, setInseeResults] = useState<InseeResult[]>([]);
  const [inseeQuery, setInseeQuery] = useState('');
  const [selectedInsee, setSelectedInsee] = useState<InseeResult | null>(null);

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

  function openCreate() {
    setCurrentStep(0);
    setStructureType(null);
    setInseeResults([]);
    setInseeQuery('');
    setSelectedInsee(null);
    form.resetFields();
    setCreateOpen(true);
  }

  function handleInseeSearch() {
    if (!inseeQuery.trim()) return;
    setInseeSearching(true);
    setInseeResults([]);
    setSelectedInsee(null);
    setTimeout(() => {
      const query = inseeQuery.toLowerCase();
      const results = MOCK_INSEE_RESULTS.filter(
        r => r.name.toLowerCase().includes(query)
          || r.siren.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
          || r.siret.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
      );
      setInseeResults(results.length > 0 ? results : MOCK_INSEE_RESULTS);
      setInseeSearching(false);
    }, 1200);
  }

  function selectInseeResult(result: InseeResult) {
    setSelectedInsee(result);
    form.setFieldsValue({
      name: result.name,
      legalForm: result.legalForm,
      siren: result.siren,
      siret: result.siret,
      rcs: result.rcs,
      nafCode: result.nafCode,
      nafLabel: result.nafLabel,
      capital: result.capital.toLocaleString('fr-FR'),
      address: result.address,
      postalCode: result.postalCode,
      city: result.city,
      country: 'France',
    });
  }

  function handleNext() {
    if (currentStep === 0 && !structureType) {
      message.warning('Veuillez sélectionner un type de structure');
      return;
    }
    if (currentStep === 1 && structureType === 'moral') {
      form.validateFields(['name', 'legalForm']).then(() => {
        setCurrentStep(s => s + 1);
      }).catch(() => {});
      return;
    }
    if (currentStep === 1 && structureType === 'physical') {
      form.validateFields(['firstName', 'lastName']).then(() => {
        setCurrentStep(s => s + 1);
      }).catch(() => {});
      return;
    }
    if (currentStep === 2) {
      form.validateFields(['address', 'postalCode', 'city', 'country']).then(() => {
        setCurrentStep(s => s + 1);
      }).catch(() => {});
      return;
    }
    setCurrentStep(s => s + 1);
  }

  function handleCreate() {
    message.success('Structure créée avec succès');
    setCreateOpen(false);
  }

  const moralSteps = [
    { title: 'Type' },
    { title: 'Identification' },
    { title: 'Adresse' },
    { title: 'Récapitulatif' },
  ];

  const physicalSteps = [
    { title: 'Type' },
    { title: 'Identité' },
    { title: 'Adresse' },
    { title: 'Récapitulatif' },
  ];

  const steps = structureType === 'physical' ? physicalSteps : moralSteps;

  function renderStepContent() {
    if (currentStep === 0) {
      return (
        <div style={{ padding: '20px 0' }}>
          <Title level={5} style={{ marginBottom: 20 }}>Quel type de structure souhaitez-vous créer ?</Title>
          <Radio.Group
            value={structureType}
            onChange={(e) => setStructureType(e.target.value)}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card
                hoverable
                onClick={() => setStructureType('moral')}
                style={{
                  borderRadius: 12,
                  border: structureType === 'moral' ? '2px solid var(--ih-primary)' : '1px solid var(--ih-border)',
                  cursor: 'pointer',
                  background: structureType === 'moral' ? 'rgba(13, 61, 86, 0.03)' : undefined,
                }}
                styles={{ body: { padding: '20px 24px' } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Radio value="moral" />
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--ih-primary), var(--ih-primary-light))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <BankOutlined style={{ color: 'white', fontSize: 22 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 15 }}>Personne morale</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      SCI, SAS, SARL, SA, holding, association... Recherche automatique via le SIRET ou le nom de l'entreprise (INSEE).
                    </Text>
                  </div>
                </div>
              </Card>

              <Card
                hoverable
                onClick={() => setStructureType('physical')}
                style={{
                  borderRadius: 12,
                  border: structureType === 'physical' ? '2px solid #6366f1' : '1px solid var(--ih-border)',
                  cursor: 'pointer',
                  background: structureType === 'physical' ? 'rgba(99, 102, 241, 0.03)' : undefined,
                }}
                styles={{ body: { padding: '20px 24px' } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Radio value="physical" />
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <UserOutlined style={{ color: 'white', fontSize: 22 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 15 }}>Personne physique</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Investissement en nom propre. Informations d'identité et d'adresse du souscripteur.
                    </Text>
                  </div>
                </div>
              </Card>
            </div>
          </Radio.Group>
        </div>
      );
    }

    if (currentStep === 1 && structureType === 'moral') {
      return (
        <div style={{ padding: '20px 0' }}>
          <Title level={5} style={{ marginBottom: 4 }}>Identification de la structure</Title>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
            Recherchez l'entreprise par SIRET ou nom pour pré-remplir automatiquement, ou saisissez les informations manuellement.
          </Text>

          {/* INSEE search */}
          <Card
            style={{
              borderRadius: 10,
              border: '1px dashed var(--ih-primary)',
              background: 'rgba(13, 61, 86, 0.02)',
              marginBottom: 24,
            }}
            styles={{ body: { padding: 16 } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <SearchOutlined style={{ color: 'var(--ih-primary)' }} />
              <Text strong style={{ fontSize: 13 }}>Recherche INSEE</Text>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                placeholder="SIRET, SIREN ou nom de l'entreprise..."
                value={inseeQuery}
                onChange={e => setInseeQuery(e.target.value)}
                onPressEnter={handleInseeSearch}
                style={{ borderRadius: 8, flex: 1 }}
                prefix={<SearchOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
              />
              <Button
                type="primary"
                onClick={handleInseeSearch}
                loading={inseeSearching}
                style={{ borderRadius: 8 }}
              >
                Rechercher
              </Button>
            </div>

            {inseeSearching && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <LoadingOutlined style={{ fontSize: 24, color: 'var(--ih-primary)' }} />
                <br />
                <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>Interrogation du registre INSEE...</Text>
              </div>
            )}

            {inseeResults.length > 0 && !inseeSearching && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {inseeResults.length} résultat{inseeResults.length > 1 ? 's' : ''} — sélectionnez pour pré-remplir
                </Text>
                {inseeResults.map(r => (
                  <Card
                    key={r.siret}
                    size="small"
                    hoverable
                    onClick={() => selectInseeResult(r)}
                    style={{
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: selectedInsee?.siret === r.siret
                        ? '2px solid var(--ih-primary)'
                        : '1px solid var(--ih-border)',
                      background: selectedInsee?.siret === r.siret ? 'rgba(13, 61, 86, 0.04)' : undefined,
                    }}
                    styles={{ body: { padding: '10px 14px' } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
                        <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            SIRET <span style={{ fontFamily: 'monospace' }}>{r.siret}</span>
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>{r.city}</Text>
                          <Tag style={{ fontSize: 10 }}>{r.legalForm}</Tag>
                        </div>
                      </div>
                      {selectedInsee?.siret === r.siret && (
                        <CheckCircleOutlined style={{ color: 'var(--ih-primary)', fontSize: 18 }} />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {selectedInsee && (
            <Alert
              type="success"
              showIcon
              message="Informations pré-remplies depuis le registre INSEE"
              description="Vérifiez les données ci-dessous et corrigez-les si nécessaire."
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form form={form} layout="vertical" requiredMark="optional">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="name" label={<Text strong style={{ fontSize: 13 }}>Dénomination sociale</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Input placeholder="Ex: SCI Patrimoine Dupont" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="legalForm" label={<Text strong style={{ fontSize: 13 }}>Forme juridique</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Select placeholder="Sélectionner..." options={LEGAL_FORMS_MORAL} style={{ borderRadius: 8 }} />
              </Form.Item>
            </div>

            <Divider style={{ margin: '4px 0 16px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="siren" label={<Text strong style={{ fontSize: 13 }}>SIREN</Text>}>
                <Input placeholder="000 000 000" style={{ borderRadius: 8, fontFamily: 'monospace' }} />
              </Form.Item>
              <Form.Item name="siret" label={<Text strong style={{ fontSize: 13 }}>SIRET</Text>}>
                <Input placeholder="000 000 000 00000" style={{ borderRadius: 8, fontFamily: 'monospace' }} />
              </Form.Item>
              <Form.Item name="rcs" label={<Text strong style={{ fontSize: 13 }}>RCS</Text>}>
                <Input placeholder="Paris B 000 000 000" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="capital" label={<Text strong style={{ fontSize: 13 }}>Capital social</Text>}>
                <Input placeholder="0" suffix="EUR" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="nafCode" label={<Text strong style={{ fontSize: 13 }}>Code NAF</Text>}>
                <Input placeholder="0000X" style={{ borderRadius: 8, fontFamily: 'monospace' }} />
              </Form.Item>
              <Form.Item name="nafLabel" label={<Text strong style={{ fontSize: 13 }}>Libellé NAF</Text>}>
                <Input placeholder="Activité principale" style={{ borderRadius: 8 }} disabled={!!selectedInsee} />
              </Form.Item>
            </div>
          </Form>
        </div>
      );
    }

    if (currentStep === 1 && structureType === 'physical') {
      return (
        <div style={{ padding: '20px 0' }}>
          <Title level={5} style={{ marginBottom: 4 }}>Identité du souscripteur</Title>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
            Renseignez les informations d'identité pour l'investissement en nom propre.
          </Text>

          <Form form={form} layout="vertical" requiredMark="optional">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="lastName" label={<Text strong style={{ fontSize: 13 }}>Nom</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Input prefix={<UserOutlined style={{ color: 'var(--ih-text-secondary)' }} />} placeholder="Nom de famille" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="firstName" label={<Text strong style={{ fontSize: 13 }}>Prénom</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Input prefix={<UserOutlined style={{ color: 'var(--ih-text-secondary)' }} />} placeholder="Prénom" style={{ borderRadius: 8 }} />
              </Form.Item>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="birthDate" label={<Text strong style={{ fontSize: 13 }}>Date de naissance</Text>}>
                <Input placeholder="JJ/MM/AAAA" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="nationality" label={<Text strong style={{ fontSize: 13 }}>Nationalité</Text>}>
                <Select placeholder="Sélectionner..." defaultValue="Française"
                  options={['Française', 'Belge', 'Suisse', 'Luxembourgeoise', 'Allemande', 'Britannique', 'Espagnole', 'Italienne'].map(n => ({ value: n, label: n }))}
                  style={{ borderRadius: 8 }} />
              </Form.Item>
            </div>
          </Form>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div style={{ padding: '20px 0' }}>
          <Title level={5} style={{ marginBottom: 4 }}>Adresse</Title>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
            {structureType === 'moral'
              ? "Adresse du siège social de la structure."
              : "Adresse de domiciliation du souscripteur."
            }
          </Text>

          <Form form={form} layout="vertical" requiredMark="optional">
            <Form.Item name="address" label={<Text strong style={{ fontSize: 13 }}>Adresse</Text>} rules={[{ required: true, message: 'Requis' }]}>
              <Input prefix={<EnvironmentOutlined style={{ color: 'var(--ih-text-secondary)' }} />} placeholder="Numéro et nom de rue" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item name="addressComplement" label={<Text strong style={{ fontSize: 13 }}>Complément d'adresse</Text>}>
              <Input placeholder="Bâtiment, étage, boîte postale..." style={{ borderRadius: 8 }} />
            </Form.Item>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0 16px' }}>
              <Form.Item name="postalCode" label={<Text strong style={{ fontSize: 13 }}>Code postal</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Input placeholder="75000" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item name="city" label={<Text strong style={{ fontSize: 13 }}>Ville</Text>} rules={[{ required: true, message: 'Requis' }]}>
                <Input placeholder="Paris" style={{ borderRadius: 8 }} />
              </Form.Item>
            </div>
            <Form.Item name="country" label={<Text strong style={{ fontSize: 13 }}>Pays</Text>} rules={[{ required: true, message: 'Requis' }]} initialValue="France">
              <Select
                options={COUNTRIES.map(c => ({ value: c, label: c }))}
                suffixIcon={<GlobalOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Form>
        </div>
      );
    }

    if (currentStep === 3) {
      const values = form.getFieldsValue(true);
      const isMoral = structureType === 'moral';
      return (
        <div style={{ padding: '20px 0' }}>
          <Title level={5} style={{ marginBottom: 4 }}>Récapitulatif</Title>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
            Vérifiez les informations avant de créer la structure.
          </Text>

          <Card style={{ borderRadius: 12, border: '1px solid var(--ih-border)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: isMoral
                    ? 'linear-gradient(135deg, var(--ih-primary), var(--ih-primary-light))'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isMoral
                  ? <BankOutlined style={{ color: 'white', fontSize: 22 }} />
                  : <UserOutlined style={{ color: 'white', fontSize: 22 }} />
                }
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {isMoral ? values.name : `${values.firstName} ${values.lastName}`}
                </Title>
                <Space size={8}>
                  <Tag>{isMoral ? values.legalForm : 'Personne physique'}</Tag>
                  <Tag color="processing" icon={<ClockCircleOutlined />}>En cours de création</Tag>
                </Space>
              </div>
            </div>

            {isMoral && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                  {values.siren && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>SIREN</Text>
                      <br />
                      <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{values.siren}</Text>
                    </div>
                  )}
                  {values.siret && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>SIRET</Text>
                      <br />
                      <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{values.siret}</Text>
                    </div>
                  )}
                  {values.rcs && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>RCS</Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>{values.rcs}</Text>
                    </div>
                  )}
                  {values.capital && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Capital social</Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>{values.capital} EUR</Text>
                    </div>
                  )}
                  {values.nafCode && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Code NAF</Text>
                      <br />
                      <Text style={{ fontSize: 13, fontFamily: 'monospace' }}>{values.nafCode}</Text>
                    </div>
                  )}
                  {values.nafLabel && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Activité</Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>{values.nafLabel}</Text>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isMoral && values.birthDate && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>Date de naissance</Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>{values.birthDate}</Text>
                  </div>
                  {values.nationality && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Nationalité</Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>{values.nationality}</Text>
                    </div>
                  )}
                </div>
              </>
            )}

            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Adresse</Text>
              <br />
              <Text style={{ fontSize: 13 }}>
                {values.address}
                {values.addressComplement ? `, ${values.addressComplement}` : ''}
              </Text>
              <br />
              <Text style={{ fontSize: 13 }}>{values.postalCode} {values.city}, {values.country}</Text>
            </div>
          </Card>

          <Alert
            type="info"
            showIcon
            message="Prochaine étape : KYC"
            description="Après la création, vous pourrez compléter le dossier KYC de cette structure (documents justificatifs, questionnaire réglementaire)."
            style={{ borderRadius: 8 }}
          />
        </div>
      );
    }

    return null;
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
          <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8 }} onClick={openCreate}>
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
                        width: 44, height: 44, borderRadius: 10,
                        background: structure.type === 'moral'
                          ? 'linear-gradient(135deg, var(--ih-primary), var(--ih-primary-light))'
                          : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: structure.kyc.status === 'complete'
                      ? 'rgba(82, 196, 26, 0.06)'
                      : structure.kyc.status === 'action_required'
                        ? 'rgba(250, 173, 20, 0.06)'
                        : 'rgba(22, 119, 255, 0.06)',
                    borderRadius: 8, marginBottom: 12,
                    border: `1px solid ${structure.kyc.status === 'complete'
                      ? 'rgba(82, 196, 26, 0.15)'
                      : structure.kyc.status === 'action_required'
                        ? 'rgba(250, 173, 20, 0.15)'
                        : 'rgba(22, 119, 255, 0.15)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SafetyCertificateOutlined style={{
                      fontSize: 14,
                      color: structure.kyc.status === 'complete' ? '#52c41a'
                        : structure.kyc.status === 'action_required' ? '#faad14' : '#1677ff',
                    }} />
                    <div>
                      <Tag color={kycCfg.color} icon={kycCfg.icon} style={{ margin: 0, fontSize: 11 }}>
                        {kycCfg.label}
                      </Tag>
                      {issues > 0 && (
                        <Text type="secondary" style={{ fontSize: 10, marginLeft: 6 }}>
                          {issues} doc{issues > 1 ? 's' : ''} a traiter
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
                      strokeColor={structure.kyc.status === 'complete' ? '#52c41a'
                        : structure.kyc.status === 'action_required' ? '#faad14' : '#1677ff'}
                      format={(pct) => <span style={{ fontSize: 10 }}>{pct}</span>}
                    />
                  </Tooltip>
                </div>

                {/* Mini KPIs */}
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                    padding: 12, background: 'var(--ih-bg)', borderRadius: 8,
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

      {/* Create structure drawer */}
      <Drawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PlusOutlined />
            <span>Nouvelle structure d'investissement</span>
          </div>
        }
        width={640}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => currentStep === 0 ? setCreateOpen(false) : setCurrentStep(s => s - 1)}
              icon={currentStep > 0 ? <ArrowLeftOutlined /> : undefined}
            >
              {currentStep === 0 ? 'Annuler' : 'Précédent'}
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext} style={{ borderRadius: 8 }}>
                Suivant <ArrowRightOutlined />
              </Button>
            ) : (
              <Button type="primary" onClick={handleCreate} style={{ borderRadius: 8 }}>
                <CheckCircleOutlined /> Créer la structure
              </Button>
            )}
          </div>
        }
      >
        <Steps
          current={currentStep}
          items={steps}
          size="small"
          style={{ marginBottom: 8 }}
        />
        {renderStepContent()}
      </Drawer>

      {/* Code drawer */}
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
