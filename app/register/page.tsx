'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form, Input, Button, Typography, Select, Checkbox, Divider, Steps, message, Progress,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, LockOutlined,
  EyeInvisibleOutlined, EyeOutlined, ArrowLeftOutlined, CheckCircleFilled,
} from '@ant-design/icons';
import { useAuth } from '@/lib/auth-context';

const { Text, Title } = Typography;

const COUNTRIES = [
  { value: 'FR', label: 'France' },
  { value: 'BE', label: 'Belgique' },
  { value: 'CH', label: 'Suisse' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'GB', label: 'Royaume-Uni' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'ES', label: 'Espagne' },
  { value: 'IT', label: 'Italie' },
  { value: 'NL', label: 'Pays-Bas' },
  { value: 'PT', label: 'Portugal' },
  { value: 'MC', label: 'Monaco' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'OTHER', label: 'Autre' },
];

const HOW_DID_YOU_HEAR = [
  { value: 'gp_referral', label: 'Recommandation d\'un GP / Gérant' },
  { value: 'advisor', label: 'Mon conseiller financier' },
  { value: 'event', label: 'Un événement / conférence' },
  { value: 'press', label: 'Presse / médias' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'web_search', label: 'Recherche web' },
  { value: 'word_of_mouth', label: 'Bouche à oreille' },
  { value: 'other', label: 'Autre' },
];

function getPasswordStrength(pw: string): { pct: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { pct: 20, label: 'Faible', color: '#ff4d4f' };
  if (score <= 2) return { pct: 40, label: 'Moyen', color: '#faad14' };
  if (score <= 3) return { pct: 60, label: 'Bon', color: '#1677ff' };
  if (score <= 4) return { pct: 80, label: 'Fort', color: '#52c41a' };
  return { pct: 100, label: 'Excellent', color: '#52c41a' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const pwStrength = getPasswordStrength(password);

  function handleNext() {
    const fieldsStep0 = ['email', 'firstName', 'lastName', 'phone', 'country'];
    const fieldsStep1 = ['password', 'confirmPassword', 'howDidYouHear', 'isProfessional', 'acceptCgu'];

    const fields = step === 0 ? fieldsStep0 : fieldsStep1;
    form.validateFields(fields).then(() => {
      if (step === 0) {
        setStep(1);
      } else {
        handleSubmit();
      }
    });
  }

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  }

  function handleGoToPortal() {
    login();
    router.push('/home');
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.55) saturate(0.7)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,61,86,0.4) 0%, rgba(0,0,0,0.3) 100%)' }} />

        <div style={{ position: 'relative', width: 480, background: '#fff', borderRadius: 16, padding: '56px 40px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', textAlign: 'center' }}>
          <CheckCircleFilled style={{ fontSize: 56, color: '#52c41a', marginBottom: 20 }} />
          <Title level={3} style={{ marginBottom: 8 }}>Compte cr&eacute;&eacute; avec succ&egrave;s</Title>
          <Text type="secondary" style={{ fontSize: 15, display: 'block', marginBottom: 32 }}>
            Votre compte investisseur a &eacute;t&eacute; cr&eacute;&eacute;. Vous pouvez maintenant acc&eacute;der &agrave; votre espace personnel.
          </Text>
          <Button
            type="primary"
            size="large"
            block
            onClick={handleGoToPortal}
            style={{ borderRadius: 8, height: 46, fontWeight: 600, fontSize: 15 }}
          >
            Acc&eacute;der &agrave; mon espace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55) saturate(0.7)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,61,86,0.4) 0%, rgba(0,0,0,0.3) 100%)' }} />

      {/* Registration card */}
      <div
        style={{
          position: 'relative',
          width: 520,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 16,
          padding: '40px 40px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ih-primary)', letterSpacing: '-0.5px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="12" width="4" height="18" rx="1" fill="var(--ih-primary)" />
                <rect x="9" y="6" width="4" height="24" rx="1" fill="var(--ih-primary)" />
                <rect x="16" y="2" width="4" height="28" rx="1" fill="var(--ih-primary)" />
                <rect x="23" y="8" width="4" height="22" rx="1" fill="var(--ih-primary)" />
              </svg>
              InvestHub<sup style={{ fontSize: 10, verticalAlign: 'super' }}>&reg;</sup>
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Cr&eacute;er un compte investisseur</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Remplissez le formulaire pour acc&eacute;der &agrave; votre espace
          </Text>
        </div>

        <Steps
          current={step}
          size="small"
          style={{ marginBottom: 28 }}
          items={[
            { title: 'Informations' },
            { title: 'S&eacute;curit&eacute; & CGU' },
          ]}
        />

        <Form form={form} layout="vertical" requiredMark>
          {step === 0 && (
            <>
              <Form.Item
                name="email"
                label="Adresse email"
                rules={[
                  { required: true, message: 'Adresse email requise' },
                  { type: 'email', message: 'Format d\'email invalide' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                  placeholder="votre@email.com"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Form.Item
                  name="firstName"
                  label="Pr&eacute;nom"
                  rules={[{ required: true, message: 'Prénom requis' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                    placeholder="Pr&eacute;nom"
                    size="large"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Nom"
                  rules={[{ required: true, message: 'Nom requis' }]}
                >
                  <Input
                    placeholder="Nom"
                    size="large"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="phone"
                label="Num&eacute;ro de t&eacute;l&eacute;phone"
                rules={[{ required: true, message: 'Numéro de téléphone requis' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                  placeholder="+33 6 12 34 56 78"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="country"
                label="Pays de r&eacute;sidence"
                rules={[{ required: true, message: 'Pays requis' }]}
              >
                <Select
                  placeholder="S&eacute;lectionnez votre pays"
                  options={COUNTRIES}
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </>
          )}

          {step === 1 && (
            <>
              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[
                  { required: true, message: 'Mot de passe requis' },
                  { min: 8, message: 'Minimum 8 caractères' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (!/[A-Z]/.test(value)) return Promise.reject('Au moins une majuscule');
                      if (!/[0-9]/.test(value)) return Promise.reject('Au moins un chiffre');
                      if (!/[^A-Za-z0-9]/.test(value)) return Promise.reject('Au moins un caractère spécial');
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                  placeholder="Cr&eacute;ez votre mot de passe"
                  size="large"
                  style={{ borderRadius: 8 }}
                  iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Item>
              {password.length > 0 && (
                <div style={{ marginTop: -16, marginBottom: 16 }}>
                  <Progress
                    percent={pwStrength.pct}
                    showInfo={false}
                    strokeColor={pwStrength.color}
                    size="small"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Text style={{ fontSize: 11, color: pwStrength.color }}>{pwStrength.label}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>Min. 8 car., 1 majuscule, 1 chiffre, 1 sp&eacute;cial</Text>
                  </div>
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label="Confirmer le mot de passe"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Confirmation requise' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject('Les mots de passe ne correspondent pas');
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                  placeholder="Confirmez votre mot de passe"
                  size="large"
                  style={{ borderRadius: 8 }}
                  iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="howDidYouHear"
                label="Comment avez-vous entendu parler de nous ?"
                rules={[{ required: true, message: 'Ce champ est requis' }]}
              >
                <Select
                  placeholder="S&eacute;lectionnez une option"
                  options={HOW_DID_YOU_HEAR}
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Divider style={{ margin: '16px 0' }} />

              <Form.Item
                name="isProfessional"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject('Vous devez confirmer être un investisseur professionnel'),
                  },
                ]}
                style={{ marginBottom: 8 }}
              >
                <Checkbox>
                  <span style={{ fontSize: 13 }}>
                    Je d&eacute;clare &ecirc;tre un <strong>investisseur professionnel</strong> au sens de la r&eacute;glementation en vigueur *
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="acceptCgu"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject('Vous devez accepter les CGU'),
                  },
                ]}
                style={{ marginBottom: 8 }}
              >
                <Checkbox>
                  <span style={{ fontSize: 13 }}>
                    J&apos;accepte les{' '}
                    <a href="#" style={{ color: 'var(--ih-primary)' }}>Conditions G&eacute;n&eacute;rales d&apos;Utilisation</a> *
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="acceptMarketing"
                valuePropName="checked"
                style={{ marginBottom: 20 }}
              >
                <Checkbox>
                  <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>
                    J&apos;accepte de recevoir des informations commerciales
                  </span>
                </Checkbox>
              </Form.Item>
            </>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            {step > 0 && (
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => setStep(0)}
                style={{ borderRadius: 8, height: 46 }}
              >
                Retour
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handleNext}
              style={{ borderRadius: 8, height: 46, fontWeight: 600, fontSize: 15 }}
            >
              {step === 0 ? 'Continuer' : 'Valider mon inscription'}
            </Button>
          </div>
        </Form>

        <Divider style={{ margin: '24px 0 16px' }} />

        <div style={{ textAlign: 'center' }}>
          <Button
            type="link"
            onClick={() => router.push('/login')}
            style={{ color: 'var(--ih-primary)', fontWeight: 500, fontSize: 14 }}
          >
            J&apos;ai d&eacute;j&agrave; un compte — Se connecter
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            InvestHub.cloud &copy; {new Date().getFullYear()}
          </Text>
        </div>
      </div>
    </div>
  );
}
