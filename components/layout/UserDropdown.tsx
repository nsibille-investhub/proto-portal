'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { userProfiles } from '@/data/mock';
import type { MenuProps } from 'antd';

export function UserDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';
  const profile = persona === 'distributor' ? userProfiles.distributor : userProfiles.lp;

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  const profileHref = persona !== 'lp' ? `/profile?persona=${persona}` : '/profile';

  const items: MenuProps['items'] = [
    {
      key: 'name',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>
            {profile.email}
          </div>
        </div>
      ),
      disabled: true,
      style: { cursor: 'default', opacity: 1 },
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mon profil',
      onClick: () => router.push(profileHref),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Se déconnecter',
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 8,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--ih-bg)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <Avatar
          size={34}
          style={{
            background: 'var(--ih-primary)',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {initials}
        </Avatar>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-primary)' }}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }}>
            {persona === 'distributor' ? 'Distributeur' : 'Investisseur'}
          </div>
        </div>
      </div>
    </Dropdown>
  );
}
