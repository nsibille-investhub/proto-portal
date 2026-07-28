'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Form, Input, Select, Button, Typography, Divider, Drawer } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  GlobalOutlined,
  UserOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  CodeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { userProfiles } from '@/data/mock';
import { PROFILE_PAGE_CODE } from '@/lib/code-sources';

const { Title, Text } = Typography;

const COUNTRIES = [
  'France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco',
  'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Pays-Bas',
];

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';
  const profile = persona === 'distributor' ? userProfiles.distributor : userProfiles.lp;
  const [codeOpen, setCodeOpen] = useState(false);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: 'var(--ih-text-primary)' }}>Mon profil</Title>
          <Text style={{ color: 'var(--ih-text-secondary)', fontSize: 13.5 }}>
            Gérez vos informations personnelles et vos identifiants de connexion
          </Text>
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

      {/* Identifiants de connexion */}
      <Card
        style={{
          borderRadius: 12,
          border: '1px solid var(--ih-border)',
          marginBottom: 24,
        }}
      >
        <Title level={5} style={{ margin: '0 0 20px', color: 'var(--ih-text-primary)' }}>
          Identifiants de connexion
        </Title>

        <Form layout="vertical" requiredMark={false}>
          <Form.Item label={<Text strong style={{ fontSize: 13 }}>Email</Text>}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input
                prefix={<MailOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                value={profile.email}
                disabled
                style={{ flex: 1, borderRadius: 8 }}
              />
              <Button type="primary" style={{ borderRadius: 8 }}>Modifier</Button>
            </div>
          </Form.Item>

          <Form.Item label={<Text strong style={{ fontSize: 13 }}>Mot de passe</Text>}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input.Password
                prefix={<LockOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                value="••••••••"
                disabled
                iconRender={() => <EyeInvisibleOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                style={{ flex: 1, borderRadius: 8 }}
              />
              <Button type="primary" style={{ borderRadius: 8 }}>Modifier</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      {/* Détails du contact */}
      <Card
        style={{
          borderRadius: 12,
          border: '1px solid var(--ih-border)',
          marginBottom: 24,
        }}
      >
        <Title level={5} style={{ margin: '0 0 20px', color: 'var(--ih-text-primary)' }}>
          Détails du contact
        </Title>

        <Form layout="vertical" requiredMark={false}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label={<Text strong style={{ fontSize: 13 }}>Prénom</Text>}>
              <Input
                prefix={<UserOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                defaultValue={profile.firstName}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item label={<Text strong style={{ fontSize: 13 }}>Nom</Text>}>
              <Input
                prefix={<UserOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                defaultValue={profile.lastName}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </div>

          <Form.Item label={<Text strong style={{ fontSize: 13 }}>Numéro de téléphone</Text>}>
            <Input
              prefix={<PhoneOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
              defaultValue={profile.phone}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item label={<Text strong style={{ fontSize: 13 }}>Pays</Text>}>
            <Select
              defaultValue={profile.country}
              style={{ borderRadius: 8 }}
              suffixIcon={<GlobalOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
              options={COUNTRIES.map(c => ({ value: c, label: c }))}
            />
          </Form.Item>

          {/* Champs distributeur uniquement */}
          {persona === 'distributor' && 'company' in profile && (
            <>
              <Divider style={{ margin: '12px 0 20px' }} />

              <Form.Item label={<Text strong style={{ fontSize: 13 }}>Société</Text>}>
                <Input
                  prefix={<BankOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                  defaultValue={profile.company}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item label={<Text strong style={{ fontSize: 13 }}>N° ORIAS</Text>}>
                <Input
                  prefix={<SafetyCertificateOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                  defaultValue={profile.orias}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="primary" size="large" style={{ borderRadius: 8, minWidth: 160 }}>
              Sauvegarder
            </Button>
          </div>
        </Form>
      </Card>

      {/* Code drawer */}
      <Drawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Code — ProfilePage"
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {PROFILE_PAGE_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
