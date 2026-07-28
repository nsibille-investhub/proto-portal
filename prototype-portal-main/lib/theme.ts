import type { ThemeConfig } from 'antd';

export const investHubTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0E2A32',
    colorPrimaryHover: '#1a4050',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 14,
  },
  components: {
    Button: {
      // Primary: navy filled, no shadow
      colorPrimary: '#0E2A32',
      colorPrimaryHover: '#1a4050',
      colorPrimaryActive: '#091e24',
      primaryColor: '#ffffff',
      primaryShadow: 'none',
      // Default (secondary): white + border, no shadow
      defaultBorderColor: '#D1D5DB',
      defaultColor: '#1A1A2E',
      defaultBg: '#ffffff',
      defaultHoverBorderColor: '#0E2A32',
      defaultHoverColor: '#0E2A32',
      defaultHoverBg: '#ffffff',
      defaultShadow: 'none',
      boxShadow: 'none',
      dangerShadow: 'none',
    },
  },
};
