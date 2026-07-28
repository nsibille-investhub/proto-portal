'use client';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FundCardGrid } from '@/components/widgets/FundCardGrid';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { funds } from '@/data/mock';
import { FUND_CARD_CODE } from '@/lib/code-sources';

export default function FundsPage() {
  return (
    <div>
      <PageHeader title="Nos fonds" subtitle="Découvrez l'ensemble de nos fonds d'investissement" />
      <WidgetWrapper title="FundCard" codeSource={FUND_CARD_CODE}>
        <div style={{ paddingTop: 40 }}>
          <Suspense fallback={null}>
            <FundCardGrid funds={funds} columns={3} />
          </Suspense>
        </div>
      </WidgetWrapper>
    </div>
  );
}
