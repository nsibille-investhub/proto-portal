'use client';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/widgets/KpiCard';
import { SubscriptionTable } from '@/components/widgets/SubscriptionTable';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { subscriptions, portfolioKpis } from '@/data/mock';
import { KPI_CARD_CODE, SUBSCRIPTION_TABLE_CODE } from '@/lib/code-sources';

export default function SubscriptionsPage() {
  return (
    <div>
      <PageHeader title="Mes souscriptions" />

      <WidgetWrapper title="KpiCard" codeSource={KPI_CARD_CODE}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32, paddingTop: 40 }}>
          <KpiCard label="Engagement total" value={portfolioKpis.totalEngagement} format="currency" tooltip="Montant total engagé" />
          <KpiCard label="Total appelé" value={portfolioKpis.totalCalled} format="currency" tooltip="Montant total appelé" />
          <KpiCard label="Total distribué" value={portfolioKpis.totalDistributed} format="currency" tooltip="Montant total distribué" />
          <KpiCard label="Valorisation" value={portfolioKpis.valuation} format="currency" tooltip="Valorisation du portefeuille" />
        </div>
      </WidgetWrapper>

      <WidgetWrapper title="SubscriptionTable" codeSource={SUBSCRIPTION_TABLE_CODE}>
        <div style={{ paddingTop: 40 }}>
          <Suspense fallback={null}><SubscriptionTable data={subscriptions} /></Suspense>
        </div>
      </WidgetWrapper>
    </div>
  );
}
