import { PageHeader } from '@/components/shared/PageHeader';
import { Empty } from 'antd';

export default function ExternalNewsPage() {
  return (
    <div>
      <PageHeader title="External News" />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Empty description="Section disponible prochainement." />
      </div>
    </div>
  );
}
