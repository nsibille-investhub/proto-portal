'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Divider, Segmented } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/auth-context';

const { Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState<string | number>('investor');

  function handleLogin() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (portalType === 'distributor') {
        login();
        router.push('/home?persona=distributor');
      } else {
        login();
      }
    }, 800);
  }

  const isDistributor = portalType === 'distributor';

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(13,61,86,0.4) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: 440,
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px 36px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ih-primary)', letterSpacing: '-0.5px', marginBottom: 4 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="12" width="4" height="18" rx="1" fill="var(--ih-primary)" />
                <rect x="9" y="6" width="4" height="24" rx="1" fill="var(--ih-primary)" />
                <rect x="16" y="2" width="4" height="28" rx="1" fill="var(--ih-primary)" />
                <rect x="23" y="8" width="4" height="22" rx="1" fill="var(--ih-primary)" />
              </svg>
              {'InvestHub'}
              <sup style={{ fontSize: 12, verticalAlign: 'super' }}>{'®'}</sup>
            </span>
          </div>
        </div>

        {/* Portal type switcher */}
        <div style={{ marginBottom: 28 }}>
          <Segmented
            value={portalType}
            onChange={setPortalType}
            options={[
              { label: 'Espace Investisseur', value: 'investor' },
              { label: 'Espace Distributeur', value: 'distributor' },
            ]}
            block
            style={{ fontSize: 13 }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ih-text-primary)' }}>
            Bienvenue
          </div>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Entrez vos identifiants de connexion
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Veuillez entrer votre identifiant' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Entrez votre identifiant"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Entrez votre mot de passe"
              size="large"
              style={{ borderRadius: 8 }}
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
            <Button type="link" style={{ padding: 0, fontSize: 13, color: 'var(--ih-primary)' }}>
              {'Mot de passe oublié ?'}
            </Button>
          </div>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                borderRadius: 8,
                height: 46,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '20px 0' }} />

        <Button
          block
          size="large"
          onClick={() => router.push(isDistributor ? '/register?type=distributor' : '/register')}
          style={{
            borderRadius: 8,
            height: 44,
            fontWeight: 500,
            fontSize: 14,
            borderColor: 'var(--ih-primary)',
            color: 'var(--ih-primary)',
          }}
        >
          {isDistributor ? 'Devenir distributeur' : 'Not an LP yet ?'}
        </Button>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {'InvestHub.cloud © ' + new Date().getFullYear()}
          </Text>
        </div>
      </div>
    </div>
  );
}
