'use client';
import { Suspense, useState } from 'react';
import { Alert, Button, Drawer, Modal, Select, Tabs, Tag } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { SecondaryMarketCard } from '@/components/widgets/SecondaryMarketCard';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { secondaryMarket } from '@/data/mock';
import { SECONDARY_MARKET_CARD_CODE, BUY_MODAL_CODE } from '@/lib/code-sources';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Offer = typeof secondaryMarket[number];

const MOCK_INVESTORS = [
  { value: 'inv-1', label: 'Martin Dupont' },
  { value: 'inv-2', label: 'Sophie Leclerc' },
  { value: 'inv-3', label: 'Pierre Fontaine' },
  { value: 'inv-4', label: 'Claire Moreau' },
];

function eur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);
}

function BuyModal({ offer, open, onClose, isDistributor }: { offer: Offer | null; open: boolean; onClose: () => void; isDistributor: boolean }) {
  const [investor, setInvestor] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);

  if (!offer) return null;

  const isCall = offer.fundType === 'call';
  const totalValue = offer.navPerShare ? offer.navPerShare * offer.shares : null;
  const totalToPay = offer.price * offer.shares;
  const totalEngagement = (offer as { engagementPerShare?: number }).engagementPerShare
    ? (offer as { engagementPerShare: number }).engagementPerShare * offer.shares
    : null;
  const totalExposure = totalEngagement ? totalToPay + totalEngagement : null;
  const selectedInvestor = MOCK_INVESTORS.find(i => i.value === investor);
  const canConfirm = !isDistributor || investor !== null;

  function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--ih-border)' }}>
        <span style={{ color: 'var(--ih-text-secondary)', fontSize: 13 }}>{label}</span>
        <span style={{ fontWeight: highlight ? 700 : 600, fontSize: highlight ? 15 : 14, color: 'var(--ih-text-primary)' }}>{value}</span>
      </div>
    );
  }

  return (
    <>
    <Modal
      open={open}
      onCancel={() => { onClose(); setInvestor(null); }}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ih-text-primary)' }}>
              Confirmation d&apos;achat — {offer.fund} ({offer.part})
            </div>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', fontWeight: 400, marginTop: 2 }}>
              <Tag color={isCall ? 'orange' : 'green'} style={{ fontSize: 11 }}>
                {isCall ? 'Fonds à appel' : 'Paiement direct'}
              </Tag>
            </div>
          </div>
          <Button type="text" size="small" icon={<CodeOutlined />} onClick={() => setCodeOpen(true)} style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}>
            Code
          </Button>
        </div>
      }
      width={520}
    >
      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Distributor — investor selector */}
        {isDistributor && (
          <div style={{ marginBottom: 20, padding: '12px 14px', background: '#F0F7FF', border: '1px solid #BAD7FF', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0050A0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Achat pour le compte d&apos;un client
            </div>
            <Select
              placeholder="Sélectionner un investisseur"
              style={{ width: '100%' }}
              value={investor}
              onChange={setInvestor}
              options={MOCK_INVESTORS}
              showSearch
              filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </div>
        )}

        {/* Recap */}
        <div>
          <Row label="Nombre de parts" value={offer.shares.toLocaleString('fr-FR')} />
          {offer.navPerShare && (
            <Row label={`Valeur par part${offer.navDate ? ` (${offer.navDate})` : ''}`} value={eur(offer.navPerShare)} highlight />
          )}
          <Row label="Prix de cession par part" value={eur(offer.price)} />
          {totalValue && <Row label="Valeur totale à date" value={eur(totalValue)} />}
          <Row label="Montant total à payer" value={eur(totalToPay)} highlight />
          {offer.validUntil && <Row label="Offre valable jusqu'au" value={offer.validUntil} />}
        </div>

        {/* Call fund — engagement section */}
        {isCall && totalEngagement !== null && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 6 }}>Engagement futur repris à l&apos;achat</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#78350F' }}>
              <span>Engagement total transféré</span>
              <strong>{eur(totalEngagement)}</strong>
            </div>
            {totalExposure !== null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#78350F', marginTop: 4 }}>
                <span>Exposition économique totale</span>
                <strong>{eur(totalExposure)}</strong>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 24, borderTop: '1px solid var(--ih-border)', paddingTop: 16 }}>
          <Button
            type="primary"
            style={{ width: '100%', height: 44, fontSize: 15 }}
            disabled={!canConfirm}
            onClick={() => { onClose(); setInvestor(null); }}
          >
            {isDistributor
              ? selectedInvestor ? `Confirmer l'achat pour ${selectedInvestor.label}` : 'Confirmer l\'achat pour —'
              : 'Confirmer l\'achat'}
          </Button>
          {isDistributor && !investor && (
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', textAlign: 'center', marginTop: 8 }}>
              Sélectionnez un investisseur pour confirmer
            </div>
          )}
        </div>
      </div>
    </Modal>

    <Drawer open={codeOpen} onClose={() => setCodeOpen(false)} title="Code — BuyModal" width={640} zIndex={1100}>
      <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
        {BUY_MODAL_CODE}
      </SyntaxHighlighter>
    </Drawer>
    </>
  );
}

function SecondaryMarketInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const persona = searchParams.get('persona') ?? 'lp';
  const isDistributor = persona === 'distributor';

  const modalType = searchParams.get('modal');
  const modalId = searchParams.get('id') ? Number(searchParams.get('id')) : null;
  const buyTarget = modalType === 'buy' && modalId ? (secondaryMarket.find(s => s.id === modalId) ?? null) : null;

  function openBuyModal(offer: Offer) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'buy');
    params.set('id', String(offer.id));
    router.replace(`${pathname}?${params.toString()}`);
  }

  function openDetails(offer: Offer) {
    router.push(`/funds/${offer.fundId}?offerId=${offer.id}&persona=${persona}`);
  }

  function closeModal() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('id');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const fundNames = Array.from(new Set(secondaryMarket.map(s => s.fund)));
  const [activeFund, setActiveFund] = useState(fundNames[0]);

  return (
    <div>
      <PageHeader title="Marché secondaire" subtitle="Achetez et vendez des parts de fonds" />

      <Alert
        type="info"
        message="Vous pouvez vendre vos parts depuis la page souscriptions"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <WidgetWrapper title="SecondaryMarketCard" codeSource={SECONDARY_MARKET_CARD_CODE}>
        <div style={{ paddingTop: 40 }}>
          <Tabs
            activeKey={activeFund}
            onChange={setActiveFund}
            items={fundNames.map(fund => ({ key: fund, label: fund }))}
            style={{ marginBottom: 0 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, paddingTop: 24 }}>
            {secondaryMarket.filter(s => s.fund === activeFund).map(offer => (
              <SecondaryMarketCard
                key={offer.id}
                {...offer}
                onBuy={() => openBuyModal(offer)}
                onDetails={() => openDetails(offer)}
              />
            ))}
          </div>
        </div>
      </WidgetWrapper>

      <BuyModal
        offer={buyTarget}
        open={buyTarget !== null}
        onClose={closeModal}
        isDistributor={isDistributor}
      />
    </div>
  );
}

export default function SecondaryMarketPage() {
  return (
    <Suspense fallback={null}>
      <SecondaryMarketInner />
    </Suspense>
  );
}
