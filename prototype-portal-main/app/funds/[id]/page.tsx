'use client';
import { Suspense, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Tag, InputNumber, Select } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, DownloadOutlined, PictureOutlined, SwapOutlined } from '@ant-design/icons';
import { funds, secondaryMarket } from '@/data/mock';

const MOCK_INVESTORS = [
  { value: 'inv-1', label: 'Martin Dupont' },
  { value: 'inv-2', label: 'Sophie Leclerc' },
  { value: 'inv-3', label: 'Pierre Fontaine' },
  { value: 'inv-4', label: 'Claire Moreau' },
];

function eur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(v);
}

function FundDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';
  const isDistributor = persona === 'distributor';

  const offerId = searchParams.get('offerId') ? Number(searchParams.get('offerId')) : null;
  const secondaryOffer = offerId ? (secondaryMarket.find(s => s.id === offerId) ?? null) : null;

  const fund = funds.find(f => f.id === Number(params.id));
  const [selectedClass, setSelectedClass] = useState(fund?.shareClasses[0]?.id ?? 'A');
  const [amount, setAmount] = useState<number | null>(null);
  // sharesInput unused — secondary market offers are fixed-quantity
  const [investor, setInvestor] = useState<string | null>(null);

  if (!fund) {
    return <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ih-text-secondary)' }}>Fonds introuvable.</div>;
  }

  const isCallFund = fund.fundType === 'call';
  const currentClass = fund.shareClasses.find(c => c.id === selectedClass) ?? fund.shareClasses[0];
  const minimum = currentClass?.minimumSubscription ?? 0;
  const shareValue = currentClass?.shareValue ?? 0;
  const engagementPerShare = (currentClass as { engagementPerShare?: number })?.engagementPerShare;
  const canSubscribe = amount !== null && amount >= minimum && (!isDistributor || investor !== null);
  const selectedInvestor = MOCK_INVESTORS.find(i => i.value === investor);

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ih-text-secondary)', fontSize: 14, marginBottom: 28, padding: 0 }}
      >
        <ArrowLeftOutlined /> Retour
      </button>

      {/* Main layout: image left, panel right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 52, alignItems: 'start' }}>

        {/* Left */}
        <div>
          {/* Hero image */}
          <div style={{ borderRadius: 12, overflow: 'hidden', height: 420, background: '#E5E7EB', marginBottom: 40 }}>
            {fund.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fund.image} alt={fund.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #0E2A32, #1a4050)' }}>
                <PictureOutlined style={{ fontSize: 64, color: 'rgba(255,255,255,0.3)' }} />
              </div>
            )}
          </div>

          {/* About */}
          {fund.about && fund.about.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ih-text-primary)', marginBottom: 14 }}>À propos de la souscription</h2>
              <ul style={{ paddingLeft: 20, color: 'var(--ih-text-secondary)', lineHeight: 1.9, margin: 0 }}>
                {fund.about.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {/* Long description */}
          {fund.longDescription && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ih-text-primary)', marginBottom: 12 }}>Description</h2>
              <p style={{ color: 'var(--ih-text-secondary)', lineHeight: 1.85, margin: 0 }}>{fund.longDescription}</p>
            </div>
          )}
        </div>

        {/* Right panel — secondary offer OR subscription */}
        {secondaryOffer ? (
          // ── Secondary market purchase panel ──────────────────────────────
          (() => {
            const isCallOffer = secondaryOffer.fundType === 'call';
            const calledPct = (secondaryOffer as { calledPct?: number }).calledPct ?? 0;
            const engPer = (secondaryOffer as { engagementPerShare?: number }).engagementPerShare ?? 0;
            const qty = secondaryOffer.shares;
            const toPay = qty * secondaryOffer.price;
            const toCall = isCallOffer ? qty * engPer : 0;
            const total = toPay + toCall;
            const canCommit = !isDistributor || investor !== null;
            const selectedInvestorSec = MOCK_INVESTORS.find(i => i.value === investor);
            return (
              <div style={{ position: 'sticky', top: 32, background: 'white', borderRadius: 12, border: '1px solid var(--ih-border)', padding: 28 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <SwapOutlined style={{ color: '#059669', fontSize: 14 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Opportunité secondaire
                  </span>
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ih-text-primary)', margin: '0 0 10px' }}>
                  {secondaryOffer.fund} — {secondaryOffer.part}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--ih-border)' }}>
                  <CalendarOutlined style={{ color: 'var(--ih-text-secondary)', fontSize: 13 }} />
                  <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>
                    Disponible jusqu&apos;au {secondaryOffer.validUntil}
                  </span>
                </div>

                {/* Distributor — investor selector */}
                {isDistributor && (
                  <div style={{ marginBottom: 20, padding: '12px 14px', background: '#F0F7FF', borderRadius: 8, border: '1px solid #BAD7FF' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0050A0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Achat pour un client
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

                {/* Called % progress */}
                {isCallOffer && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>Montant appelé et payé</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{calledPct}%</span>
                    </div>
                    <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3 }}>
                      <div style={{ width: `${calledPct}%`, height: '100%', background: 'var(--ih-primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                )}

                {/* Part badge */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 8 }}>Type de part</div>
                  <div
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 44, height: 44, borderRadius: 8,
                      background: 'var(--ih-primary)', color: 'white', fontWeight: 700, fontSize: 15,
                    }}
                  >
                    {secondaryOffer.part.replace('PART ', '')}
                  </div>
                </div>

                {/* Price per share */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 2 }}>Prix par part</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{eur(secondaryOffer.price)}</div>
                  {secondaryOffer.navPerShare && (
                    <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginTop: 2 }}>
                      VL : {eur(secondaryOffer.navPerShare)}{secondaryOffer.navDate ? ` (${secondaryOffer.navDate})` : ''}
                    </div>
                  )}
                </div>

                {/* Shares — fixed, read-only */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 6 }}>Nombre de parts</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', border: '1px solid var(--ih-border)', borderRadius: 6, background: 'var(--ih-bg)' }}>
                    <span style={{ fontSize: 12, color: 'var(--ih-text-secondary)', borderRight: '1px solid var(--ih-border)', paddingRight: 10 }}>Parts</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ih-text-primary)' }}>{secondaryOffer.shares.toLocaleString('fr-FR')}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginTop: 4 }}>Offre globale — quantité non modifiable</div>
                </div>

                {/* Engagement warning */}
                {isCallOffer && engPer > 0 && qty > 0 && (
                  <div style={{ marginBottom: 16, padding: '10px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
                    ⚠ En achetant ces parts, vous reprenez l&apos;engagement non appelé du vendeur. Des appels de fonds futurs pourront être émis jusqu&apos;à hauteur de {eur(toCall)}.
                  </div>
                )}

                {/* Amounts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--ih-text-secondary)' }}>À payer :</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{eur(toPay)}</span>
                </div>
                {isCallOffer && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 14, color: 'var(--ih-text-secondary)' }}>Restant à appeler :</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>{eur(toCall)}</span>
                  </div>
                )}

                {/* CTA */}
                <Button
                  type="primary"
                  style={{ width: '100%', height: 48, fontSize: 15, fontWeight: 700 }}
                  disabled={!canCommit}
                >
                  {isDistributor
                    ? selectedInvestorSec
                      ? `S${isCallOffer ? '\'engager' : 'ouscrire'} pour ${selectedInvestorSec.label} — ${eur(total)}`
                      : 'Sélectionner un investisseur'
                    : `${isCallOffer ? 'S\'engager' : 'Acheter'} pour ${eur(total)}`}
                </Button>
              </div>
            );
          })()
        ) : (
          // ── Standard subscription panel ──────────────────────────────────
          <div style={{ position: 'sticky', top: 32, background: 'white', borderRadius: 12, border: '1px solid var(--ih-border)', padding: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ih-text-primary)', margin: '0 0 10px' }}>{fund.name}</h1>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {fund.closeDate && (
              <Tag icon={<CalendarOutlined />} color="blue" style={{ fontSize: 12 }}>Jusqu&apos;au {fund.closeDate}</Tag>
            )}
            <Tag color={isCallFund ? 'orange' : 'green'} style={{ fontSize: 12 }}>
              {isCallFund ? 'Fonds à appel' : 'Paiement direct'}
            </Tag>
          </div>

          {/* Distributor — investor selector */}
          {isDistributor && (
            <div style={{ marginBottom: 20, padding: '12px 14px', background: '#F0F7FF', borderRadius: 8, border: '1px solid #BAD7FF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0050A0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Souscription pour un client
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

          {/* Share class selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 8 }}>Catégorie de part</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {fund.shareClasses.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => { setSelectedClass(sc.id); setAmount(null); }}
                  style={{
                    width: 44, height: 44, borderRadius: 8,
                    border: `2px solid ${selectedClass === sc.id ? 'var(--ih-primary)' : 'var(--ih-border)'}`,
                    background: selectedClass === sc.id ? 'var(--ih-primary)' : 'white',
                    color: selectedClass === sc.id ? 'white' : 'var(--ih-text-primary)',
                    fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  }}
                >
                  {sc.id}
                </button>
              ))}
            </div>
          </div>

          {/* Share value + minimum */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 2 }}>Valeur de la part</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{eur(shareValue)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 2 }}>Souscription minimum</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ih-text-primary)' }}>{eur(minimum)}</div>
            </div>
          </div>

          {/* Call fund notice */}
          {isCallFund && engagementPerShare && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, fontSize: 13, color: '#92400E' }}>
              Engagement par part : <strong>{eur(engagementPerShare)}</strong> — libéré progressivement sur appels de la SG.
            </div>
          )}

          {/* Direct fund notice */}
          {!isCallFund && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 13, color: '#166534' }}>
              Paiement intégral à la souscription.
            </div>
          )}

          {/* Amount input */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 6 }}>Montant de souscription</div>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              value={amount}
              onChange={setAmount}
              addonAfter="€"
              decimalSeparator=","
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              status={amount !== null && amount < minimum ? 'error' : undefined}
            />
            <div style={{ fontSize: 12, color: amount !== null && amount < minimum ? '#ff4d4f' : 'var(--ih-text-secondary)', marginTop: 4 }}>
              Minimum {eur(minimum)}
            </div>
          </div>

          {/* CTA */}
          <Button
            type="primary"
            style={{ width: '100%', marginTop: 20, height: 44, fontSize: 15 }}
            disabled={!canSubscribe}
          >
            {isDistributor
              ? selectedInvestor ? `Souscrire pour ${selectedInvestor.label}` : 'Souscrire pour —'
              : 'Souscrire'}
          </Button>

          {/* Docs */}
          {fund.docs && fund.docs.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--ih-border)' }}>
              <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginBottom: 10 }}>Documents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fund.docs.map(doc => (
                  <Button key={doc} icon={<DownloadOutlined />} style={{ justifyContent: 'flex-start' }}>{doc}</Button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default function FundDetailPage() {
  return (
    <Suspense fallback={null}>
      <FundDetailInner />
    </Suspense>
  );
}
