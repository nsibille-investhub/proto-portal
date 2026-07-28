'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input, Segmented } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const PERSONAS = [
  { label: 'LP', value: 'lp' },
  { label: 'Distributeur', value: 'distributor' },
];

interface NavItem {
  key: string;
  label: string;
  path: string;
  distributorOnly?: boolean;
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Home', path: '/home' },
  { key: 'documents', label: 'My documents', path: '/documents' },
  { key: 'subscriptions', label: 'My subscriptions', path: '/subscriptions' },
  { key: 'partners', label: 'Mes partenaires', path: '/partners', distributorOnly: true },
  { key: 'performances', label: 'My Performances', path: '/performances' },
  { key: 'funds', label: 'Our funds', path: '/funds' },
  { key: 'secondary-market', label: 'Marché secondaire', path: '/secondary-market' },
  { key: 'design-system', label: '⚙ Design System', path: '/design-system' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';

  function handlePersonaChange(value: string | number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('persona', String(value));
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 0 16px 0' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>
          InvestHub<sup style={{ fontSize: 10 }}>®</sup>
        </div>
        <div style={{ color: 'var(--ih-accent)', fontSize: 11, marginTop: 2, fontWeight: 500 }}>
          Prototype
        </div>
      </div>

      {/* Persona switcher */}
      <div style={{ padding: '12px 12px 4px' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Vue
        </div>
        <Segmented
          value={persona}
          onChange={handlePersonaChange}
          options={PERSONAS}
          block
          style={{ background: 'rgba(255,255,255,0.08)', fontSize: 12 }}
        />
      </div>

      {/* Search */}
      <div style={{ padding: '12px 12px 8px' }}>
        <Input
          prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
          placeholder="Rechercher"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white',
            borderRadius: 6,
          }}
        />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {navItems.filter(item => !item.distributorOnly || persona === 'distributor').map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== '/home' && pathname.startsWith(item.path));
          const href = persona !== 'lp' ? `${item.path}?persona=${persona}` : item.path;
          return (
            <Link key={item.key} href={href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 20px',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 13.5,
                  transition: 'all 0.15s',
                  borderRadius: 0,
                }}
              >
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom user actions */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 20px',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 13.5,
          }}
        >
          <span>Profil</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 20px',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 13.5,
          }}
        >
          <span>Se déconnecter</span>
        </div>
      </div>
    </div>
  );
}
