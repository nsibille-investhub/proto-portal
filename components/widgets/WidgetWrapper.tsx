'use client';
import { ShowCodeButton } from '@/components/shared/ShowCodeButton';

interface WidgetWrapperProps {
  title: string;
  codeSource: string;
  children: React.ReactNode;
}

export function WidgetWrapper({ title, codeSource, children }: WidgetWrapperProps) {
  return (
    <div style={{ position: 'relative', paddingTop: 0 }}>
      <ShowCodeButton title={title} code={codeSource} />
      {children}
    </div>
  );
}
