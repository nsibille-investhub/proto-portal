import { PageHeader } from '@/components/shared/PageHeader';
import { Empty } from 'antd';

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="News" />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Empty description="Section disponible prochainement." />
      </div>
    </div>
  );
}
