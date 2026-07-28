'use client';
import { useSearchParams } from 'next/navigation';
import { FundCard } from './FundCard';

interface Fund {
  id: number;
  name: string;
  closeDate?: string;
  image: string | null;
  description: string[];
  docs?: string[];
}

interface FundCardGridProps {
  funds: Fund[];
  columns?: number;
}

export function FundCardGrid({ funds, columns = 3 }: FundCardGridProps) {
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 20 }}>
      {funds.map(fund => (
        <FundCard
          key={fund.id}
          {...fund}
          detailHref={`/funds/${fund.id}?persona=${persona}`}
        />
      ))}
    </div>
  );
}
