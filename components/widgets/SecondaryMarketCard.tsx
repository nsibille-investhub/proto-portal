'use client';
import { Button, Tag } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

interface SecondaryMarketCardProps {
  fund: string;
  part: string;
  shares: number;
  price: number;
  validUntil: string;
  image?: string | null;
  navPerShare?: number;
  navDate?: string;
  status?: 'available' | 'pending';
  pendingSince?: string;
  fundType?: 'call' | 'direct';
  calledPct?: number;
  engagementPerShare?: number;
  onBuy?: () => void;
  onDetails?: () => void;
}

function eur(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);
}

function Row({ label, value, highlight, warning }: { label: string; value: string; highlight?: boolean; warning?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid var(--ih-border)' }}>
      <span style={{ color: warning ? '#d97706' : 'var(--ih-text-secondary)', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: highlight || warning ? 700 : 600, fontSize: highlight ? 15 : 14, color: warning ? '#d97706' : 'var(--ih-text-primary)' }}>{value}</span>
    </div>
  );
}

export function SecondaryMarketCard({ fund, part, shares, price, validUntil, image, navPerShare, navDate, status = 'available', pendingSince, fundType = 'direct', calledPct, engagementPerShare, onBuy, onDetails }: SecondaryMarketCardProps) {
  const totalValue = navPerShare ? navPerShare * shares : null;
  const totalToPay = price * shares;
  const totalEngagement = engagementPerShare ? engagementPerShare * shares : null;
  const totalExposure = totalEngagement ? totalToPay + totalEngagement : null;
  const isPending = status === 'pending';
  const isCall = fundType === 'call';

  return (
    <div style={{
      background: isPending ? '#F3F4F6' : 'var(--ih-bg-card)',
      border: `1px solid ${isPending ? '#D1D5DB' : 'var(--ih-border)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      width: 360,
      display: 'flex',
      flexDirection: 'column',
      opacity: isPending ? 0.85 : 1,
      position: 'relative',
    }}>
      {/* Fund photo */}
      <div style={{ height: 140, background: '#E5E7EB', position: 'relative', flexShrink: 0 }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={fund} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isPending ? 'grayscale(60%)' : 'none' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #0E2A32, #1a4050)' }}>
            <PictureOutlined style={{ fontSize: 36, color: 'rgba(255,255,255,0.4)' }} />
          </div>
        )}

        {/* Badge type de fonds */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <Tag
            style={{ margin: 0, fontWeight: 600, fontSize: 11, borderRadius: 20 }}
            color={isCall ? 'blue' : 'green'}
          >
            {isCall ? 'Fonds à appel' : 'Paiement direct'}
          </Tag>
        </div>

        {isPending && (
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(0,0,0,0.6)', color: 'white',
            fontSize: 12, fontWeight: 600, padding: '4px 10px',
            borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#faad14', display: 'inline-block' }} />
            Achat en cours{pendingSince ? ` · depuis le ${pendingSince}` : ''}
          </div>
        )}
      </div>

      {/* Header */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ih-text-primary)' }}>{fund}</div>
        <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', fontWeight: 500, marginTop: 2 }}>{part}</div>
      </div>

      {/* Info rows */}
      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Row label="Nombre de parts" value={shares.toLocaleString('fr-FR')} />
        {navPerShare && <Row label={`Valeur par part${navDate ? ` (${navDate})` : ''}`} value={eur(navPerShare)} highlight />}

        {/* Barre d'appel — fonds à appel uniquement */}
        {isCall && calledPct !== undefined && (
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--ih-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ color: 'var(--ih-text-secondary)', fontSize: 13 }}>Capital appelé</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-primary)' }}>{calledPct}%</span>
            </div>
            <div style={{ height: 5, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${calledPct}%`, height: '100%', background: 'var(--ih-primary)', borderRadius: 3 }} />
            </div>
          </div>
        )}

        <Row label="Prix par part (cession)" value={eur(price)} />
        {totalValue && <Row label="Valeur totale à date" value={eur(totalValue)} highlight />}
        <Row label="Montant total à payer" value={eur(totalToPay)} />

        {/* Engagement restant — fonds à appel */}
        {isCall && totalEngagement !== null && (
          <Row label="Engagement restant à reprendre" value={eur(totalEngagement)} warning />
        )}
        {isCall && totalExposure !== null && (
          <Row label="Exposition économique totale" value={eur(totalExposure)} />
        )}

        <Row label="Offre valable jusqu'au" value={validUntil} />
      </div>

      {/* Avertissement engagement */}
      {isCall && totalEngagement !== null && (
        <div style={{ margin: '8px 20px 0', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
          ⚠ En achetant ces parts, vous reprenez l&apos;engagement non appelé du vendeur. Des appels de fonds futurs pourront être émis jusqu&apos;à hauteur de {eur(totalEngagement)}.
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 20px' }}>
        <Button style={{ flex: 1 }} disabled={isPending} onClick={onDetails}>Détails</Button>
        <Button type="primary" style={{ flex: 1 }} disabled={isPending} onClick={onBuy}>
          {isPending ? 'Achat en cours' : 'Acheter'}
        </Button>
      </div>
    </div>
  );
}
