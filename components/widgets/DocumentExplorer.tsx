'use client';
import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { Typography, Tooltip, Badge, Button, Checkbox, Empty, Input } from 'antd';
import {
  EyeOutlined, DownloadOutlined, ShareAltOutlined,
  AppstoreOutlined, UnorderedListOutlined,
  FolderOutlined, FolderOpenOutlined,
  FilePdfOutlined, FileExcelOutlined, FileWordOutlined, FileTextOutlined,
  BarChartOutlined, SafetyCertificateOutlined, BankOutlined, AuditOutlined, DollarOutlined,
  RightOutlined, DownOutlined, CloseOutlined,
  ClockCircleOutlined, CheckCircleFilled,
  SearchOutlined, InboxOutlined,
} from '@ant-design/icons';

interface Document {
  id: number;
  fund: string;
  category: string;
  name: string;
  type: string;
  size: string;
  addedAt: string;
  isNew: boolean;
}

interface DocumentExplorerProps {
  documents: Document[];
}

const CATEGORIES: Record<string, { label: string; color: string; icon: ReactNode }> = {
  reporting: { label: 'Reporting', color: '#4F46E5', icon: <BarChartOutlined /> },
  legal: { label: 'Juridique', color: '#0891B2', icon: <SafetyCertificateOutlined /> },
  souscriptions: { label: 'Souscriptions', color: '#059669', icon: <FileTextOutlined /> },
  appels_fonds: { label: 'Appels de fonds', color: '#D97706', icon: <BankOutlined /> },
  fiscalite: { label: 'Fiscalité', color: '#DC2626', icon: <AuditOutlined /> },
  distributions: { label: 'Distributions', color: '#7C3AED', icon: <DollarOutlined /> },
};

const FILE_TYPES: Record<string, { bg: string; color: string; icon: ReactNode }> = {
  PDF: { bg: '#FEE2E2', color: '#DC2626', icon: <FilePdfOutlined /> },
  XLSX: { bg: '#DCFCE7', color: '#059669', icon: <FileExcelOutlined /> },
  DOCX: { bg: '#DBEAFE', color: '#2563EB', icon: <FileWordOutlined /> },
};

const MOCK_VERSIONS = [
  { version: 'v3', date: '15/04/2026', current: true },
  { version: 'v2', date: '10/01/2026', current: false },
  { version: 'v1', date: '15/06/2025', current: false },
];

interface TreeSelection {
  fund: string | null;
  category: string | null;
}

function FileTypeIcon({ type, size = 20 }: { type: string; size?: number }) {
  const config = FILE_TYPES[type] ?? FILE_TYPES.PDF;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size + 8, height: size + 8, borderRadius: 6,
      background: config.bg, color: config.color, fontSize: size * 0.7,
    }}>
      {config.icon}
    </span>
  );
}

function CategoryTag({ category }: { category: string }) {
  const cat = CATEGORIES[category];
  if (!cat) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 10,
      background: cat.color + '12', color: cat.color,
      fontSize: 11, fontWeight: 600, lineHeight: '18px',
    }}>
      {cat.icon}
      {cat.label}
    </span>
  );
}

function NewDot() {
  return (
    <span className="doc-new-pulse" style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: '#22C55E', flexShrink: 0,
    }} />
  );
}

function Breadcrumb({ selection, onNavigate }: {
  selection: TreeSelection;
  onNavigate: (sel: TreeSelection) => void;
}) {
  const parts: { label: string; onClick: () => void }[] = [
    { label: 'Tous les documents', onClick: () => onNavigate({ fund: null, category: null }) },
  ];
  if (selection.fund) {
    parts.push({ label: selection.fund, onClick: () => onNavigate({ fund: selection.fund, category: null }) });
  }
  if (selection.category && CATEGORIES[selection.category]) {
    parts.push({ label: CATEGORIES[selection.category].label, onClick: () => {} });
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <RightOutlined style={{ fontSize: 9, color: 'var(--ih-text-secondary)' }} />}
          <span
            onClick={i < parts.length - 1 ? p.onClick : undefined}
            style={{
              color: i < parts.length - 1 ? 'var(--ih-primary)' : 'var(--ih-text-primary)',
              fontWeight: i === parts.length - 1 ? 600 : 400,
              cursor: i < parts.length - 1 ? 'pointer' : 'default',
            }}
          >
            {p.label}
          </span>
        </span>
      ))}
    </div>
  );
}

function TreePanel({ documents, selection, onSelect, expandedFunds, onToggleFund }: {
  documents: Document[];
  selection: TreeSelection;
  onSelect: (sel: TreeSelection) => void;
  expandedFunds: Set<string>;
  onToggleFund: (fund: string) => void;
}) {
  const tree = useMemo(() => {
    const fundMap = new Map<string, Map<string, number>>();
    for (const doc of documents) {
      if (!fundMap.has(doc.fund)) fundMap.set(doc.fund, new Map());
      const cats = fundMap.get(doc.fund)!;
      cats.set(doc.category, (cats.get(doc.category) ?? 0) + 1);
    }
    return fundMap;
  }, [documents]);

  const newCount = useMemo(() => documents.filter(d => d.isNew).length, [documents]);

  const isRootActive = !selection.fund && !selection.category;

  return (
    <div style={{
      width: 260, flexShrink: 0,
      background: 'var(--ih-bg-card)', borderRadius: 12,
      border: '1px solid var(--ih-border)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <Typography.Text style={{ fontSize: 11, fontWeight: 700, color: 'var(--ih-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Explorateur
        </Typography.Text>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {/* Root: All documents */}
        <div
          className="doc-tree-item"
          onClick={() => onSelect({ fund: null, category: null })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', fontSize: 13,
            fontWeight: isRootActive ? 600 : 500,
            color: isRootActive ? 'var(--ih-primary)' : 'var(--ih-text-primary)',
            background: isRootActive ? 'rgba(13, 61, 86, 0.06)' : 'transparent',
            borderLeft: isRootActive ? '3px solid var(--ih-primary)' : '3px solid transparent',
          }}
        >
          <InboxOutlined style={{ fontSize: 15 }} />
          <span style={{ flex: 1 }}>Tous les documents</span>
          <span style={{ fontSize: 12, color: 'var(--ih-text-secondary)', fontWeight: 400 }}>{documents.length}</span>
          {newCount > 0 && (
            <Badge count={newCount} size="small" style={{ backgroundColor: '#22C55E' }} />
          )}
        </div>

        <div style={{ height: 1, background: 'var(--ih-border)', margin: '6px 16px' }} />

        {/* Fund nodes */}
        {Array.from(tree.entries()).map(([fund, cats]) => {
          const isExpanded = expandedFunds.has(fund);
          const isFundActive = selection.fund === fund && !selection.category;
          const fundTotal = Array.from(cats.values()).reduce((s, c) => s + c, 0);
          const fundNewCount = documents.filter(d => d.fund === fund && d.isNew).length;

          return (
            <div key={fund}>
              <div
                className="doc-tree-item"
                onClick={() => {
                  onToggleFund(fund);
                  onSelect({ fund, category: null });
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px 7px 16px', fontSize: 13,
                  fontWeight: isFundActive ? 600 : 500,
                  color: isFundActive ? 'var(--ih-primary)' : 'var(--ih-text-primary)',
                  background: isFundActive ? 'rgba(13, 61, 86, 0.06)' : 'transparent',
                  borderLeft: isFundActive ? '3px solid var(--ih-primary)' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 10, width: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ih-text-secondary)', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <RightOutlined />
                </span>
                {isExpanded ? <FolderOpenOutlined style={{ fontSize: 14, color: '#D97706' }} /> : <FolderOutlined style={{ fontSize: 14, color: '#D97706' }} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fund}</span>
                <span style={{ fontSize: 12, color: 'var(--ih-text-secondary)', fontWeight: 400 }}>{fundTotal}</span>
                {fundNewCount > 0 && <NewDot />}
              </div>

              {/* Categories */}
              <div
                className="doc-tree-children"
                style={{
                  maxHeight: isExpanded ? 300 : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                {Array.from(cats.entries()).map(([cat, count]) => {
                  const catConfig = CATEGORIES[cat];
                  if (!catConfig) return null;
                  const isCatActive = selection.fund === fund && selection.category === cat;
                  const catNewCount = documents.filter(d => d.fund === fund && d.category === cat && d.isNew).length;
                  return (
                    <div
                      key={cat}
                      className="doc-tree-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect({ fund, category: cat });
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px 6px 50px', fontSize: 12.5,
                        fontWeight: isCatActive ? 600 : 400,
                        color: isCatActive ? catConfig.color : 'var(--ih-text-secondary)',
                        background: isCatActive ? catConfig.color + '0A' : 'transparent',
                        borderLeft: isCatActive ? `3px solid ${catConfig.color}` : '3px solid transparent',
                      }}
                    >
                      <span style={{ color: catConfig.color, fontSize: 12 }}>{catConfig.icon}</span>
                      <span style={{ flex: 1 }}>{catConfig.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--ih-text-secondary)', fontWeight: 400 }}>{count}</span>
                      {catNewCount > 0 && <NewDot />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocumentCard({ doc, isSelected, onSelect, onPreview }: {
  doc: Document;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onPreview: (doc: Document) => void;
}) {
  const fileType = FILE_TYPES[doc.type] ?? FILE_TYPES.PDF;
  return (
    <div
      className="doc-card"
      onClick={() => onPreview(doc)}
      style={{
        background: 'var(--ih-bg-card)',
        borderRadius: 12,
        border: isSelected ? '2px solid var(--ih-primary)' : '1px solid var(--ih-border)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Color stripe */}
      <div style={{ height: 4, background: fileType.color }} />

      {/* Checkbox */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(doc.id, e.target.checked)}
        />
      </div>

      {/* New indicator */}
      {doc.isNew && (
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <NewDot />
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '20px 16px 16px' }}>
        {/* File icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: fileType.bg, color: fileType.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, marginBottom: 12,
        }}>
          {fileType.icon}
        </div>

        {/* Title */}
        <div style={{
          fontWeight: 600, fontSize: 13, lineHeight: '18px',
          color: 'var(--ih-text-primary)', marginBottom: 8,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: 36,
        }}>
          {doc.name}
        </div>

        {/* Category tag */}
        <div style={{ marginBottom: 10 }}>
          <CategoryTag category={doc.category} />
        </div>

        {/* Metadata */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, color: 'var(--ih-text-secondary)',
        }}>
          <span>{doc.addedAt}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ih-text-secondary)', flexShrink: 0 }} />
          <span>{doc.size}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ih-text-secondary)', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, color: fileType.color }}>{doc.type}</span>
        </div>
      </div>
    </div>
  );
}

function DocumentListRow({ doc, isSelected, onSelect, onPreview, isActive }: {
  doc: Document;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onPreview: (doc: Document) => void;
  isActive: boolean;
}) {
  const fileType = FILE_TYPES[doc.type] ?? FILE_TYPES.PDF;
  return (
    <div
      className="doc-list-row"
      onClick={() => onPreview(doc)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        background: isActive ? 'rgba(13, 61, 86, 0.04)' : 'transparent',
        borderBottom: '1px solid var(--ih-border)',
        borderLeft: isActive ? '3px solid var(--ih-primary)' : '3px solid transparent',
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(doc.id, e.target.checked)}
        />
      </div>

      <FileTypeIcon type={doc.type} size={18} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontWeight: 500, fontSize: 13, color: 'var(--ih-text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {doc.name}
          </span>
          {doc.isNew && <NewDot />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <CategoryTag category={doc.category} />
          <span style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }}>{doc.fund}</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', width: 90, flexShrink: 0, textAlign: 'right' }}>
        {doc.addedAt}
      </div>

      <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', width: 70, flexShrink: 0, textAlign: 'right' }}>
        {doc.size}
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Aperçu">
          <EyeOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 15 }} />
        </Tooltip>
        <Tooltip title="Télécharger">
          <DownloadOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 15 }} />
        </Tooltip>
      </div>
    </div>
  );
}

function PreviewPanel({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const fileType = FILE_TYPES[doc.type] ?? FILE_TYPES.PDF;
  const cat = CATEGORIES[doc.category];
  return (
    <div
      className="doc-preview-slide"
      style={{
        width: 360, flexShrink: 0,
        background: 'var(--ih-bg-card)', borderRadius: 12,
        border: '1px solid var(--ih-border)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--ih-border)',
      }}>
        <Typography.Text style={{ fontWeight: 600, fontSize: 13, color: 'var(--ih-text-secondary)' }}>
          Détails du document
        </Typography.Text>
        <CloseOutlined
          onClick={onClose}
          style={{ fontSize: 14, color: 'var(--ih-text-secondary)', cursor: 'pointer' }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Large file type visual */}
        <div style={{
          width: '100%', height: 120, borderRadius: 12,
          background: `linear-gradient(135deg, ${fileType.bg}, ${fileType.color}15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, color: fileType.color, marginBottom: 20,
        }}>
          {fileType.icon}
        </div>

        {/* Document name */}
        <Typography.Title level={5} style={{ margin: '0 0 12px', fontSize: 15, lineHeight: '22px' }}>
          {doc.name}
        </Typography.Title>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {cat && <CategoryTag category={doc.category} />}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 10,
            background: '#F3F4F6', color: 'var(--ih-text-secondary)',
            fontSize: 11, fontWeight: 500,
          }}>
            <FolderOutlined style={{ fontSize: 10 }} />
            {doc.fund}
          </span>
        </div>

        {/* Metadata grid */}
        <div style={{
          background: '#F9FAFB', borderRadius: 10, padding: 14,
          display: 'flex', flexDirection: 'column', gap: 10,
          marginBottom: 20,
        }}>
          {[
            { label: 'Type', value: doc.type, accent: fileType.color },
            { label: 'Taille', value: doc.size },
            { label: 'Ajouté le', value: doc.addedAt },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span style={{ color: 'var(--ih-text-secondary)' }}>{label}</span>
              <span style={{ fontWeight: 600, color: accent ?? 'var(--ih-text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <Button type="primary" icon={<DownloadOutlined />} style={{ flex: 1 }}>
            Télécharger
          </Button>
          <Button icon={<EyeOutlined />} style={{ flex: 1 }}>
            Aperçu
          </Button>
          <Tooltip title="Partager">
            <Button icon={<ShareAltOutlined />} />
          </Tooltip>
        </div>

        {/* Version history */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, color: 'var(--ih-text-secondary)',
            marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>
            <ClockCircleOutlined />
            Historique des versions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MOCK_VERSIONS.map((v, i) => (
              <div key={v.version} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: i < MOCK_VERSIONS.length - 1 ? '1px solid var(--ih-border)' : 'none',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: v.current ? 'var(--ih-primary)' : '#F3F4F6',
                  color: v.current ? '#fff' : 'var(--ih-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {v.current ? <CheckCircleFilled /> : v.version.replace('v', '')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: v.current ? 600 : 400, color: 'var(--ih-text-primary)' }}>
                    {v.version} {v.current && '(actuelle)'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ih-text-secondary)' }}>{v.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkActionBar({ count, onClear }: { count: number; onClear: () => void }) {
  if (count === 0) return null;
  return (
    <div className="doc-bulk-bar" style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '12px 24px', borderRadius: 16,
      background: 'var(--ih-primary)', color: '#fff',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
      zIndex: 100, fontSize: 13,
    }}>
      <span style={{ fontWeight: 600 }}>{count} document{count > 1 ? 's' : ''} sélectionné{count > 1 ? 's' : ''}</span>
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.3)' }} />
      <Button
        size="small"
        icon={<DownloadOutlined />}
        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 500 }}
      >
        Télécharger tout
      </Button>
      <Button
        size="small"
        icon={<ShareAltOutlined />}
        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 500 }}
      >
        Partager
      </Button>
      <CloseOutlined onClick={onClear} style={{ cursor: 'pointer', fontSize: 13, opacity: 0.7 }} />
    </div>
  );
}

function QuickFilters({ active, onSelect, counts }: {
  active: string;
  onSelect: (f: string) => void;
  counts: Record<string, number>;
}) {
  const filters = [
    { key: 'all', label: 'Tous', count: counts.all },
    { key: 'new', label: 'Nouveaux', count: counts.new, dotColor: '#22C55E' },
    { key: 'PDF', label: 'PDF', count: counts.PDF, dotColor: '#DC2626' },
    { key: 'XLSX', label: 'XLSX', count: counts.XLSX, dotColor: '#059669' },
  ];

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {filters.map(f => {
        if (f.key !== 'all' && f.count === 0) return null;
        const isActive = active === f.key;
        return (
          <div
            key={f.key}
            onClick={() => onSelect(f.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', userSelect: 'none',
              transition: 'all 0.15s ease',
              background: isActive ? 'var(--ih-primary)' : '#F3F4F6',
              color: isActive ? '#fff' : 'var(--ih-text-secondary)',
              border: isActive ? '1px solid var(--ih-primary)' : '1px solid transparent',
            }}
          >
            {f.dotColor && !isActive && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.dotColor }} />
            )}
            {f.label}
            <span style={{
              fontSize: 11, fontWeight: 600,
              opacity: isActive ? 0.8 : 0.6,
            }}>
              {f.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DocumentExplorer({ documents }: DocumentExplorerProps) {
  const [selection, setSelection] = useState<TreeSelection>({ fund: null, category: null });
  const [expandedFunds, setExpandedFunds] = useState<Set<string>>(() => new Set(Array.from(new Set(documents.map(d => d.fund))).slice(0, 1)));
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [quickFilter, setQuickFilter] = useState('all');
  const [search, setSearch] = useState('');

  const toggleFund = useCallback((fund: string) => {
    setExpandedFunds(prev => {
      const next = new Set(prev);
      if (next.has(fund)) next.delete(fund);
      else next.add(fund);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let result = documents;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.fund.toLowerCase().includes(q) ||
        (CATEGORIES[d.category]?.label.toLowerCase().includes(q))
      );
    }

    if (selection.fund) {
      result = result.filter(d => d.fund === selection.fund);
    }
    if (selection.category) {
      result = result.filter(d => d.category === selection.category);
    }

    if (quickFilter === 'new') {
      result = result.filter(d => d.isNew);
    } else if (quickFilter === 'PDF' || quickFilter === 'XLSX') {
      result = result.filter(d => d.type === quickFilter);
    }

    return result;
  }, [documents, selection, quickFilter, search]);

  const filterCounts = useMemo(() => {
    let base = documents;
    if (selection.fund) base = base.filter(d => d.fund === selection.fund);
    if (selection.category) base = base.filter(d => d.category === selection.category);
    if (search) {
      const q = search.toLowerCase();
      base = base.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.fund.toLowerCase().includes(q) ||
        (CATEGORIES[d.category]?.label.toLowerCase().includes(q))
      );
    }
    return {
      all: base.length,
      new: base.filter(d => d.isNew).length,
      PDF: base.filter(d => d.type === 'PDF').length,
      XLSX: base.filter(d => d.type === 'XLSX').length,
    };
  }, [documents, selection, search]);

  const handleSelect = useCallback((id: number, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 12, minHeight: 500 }}>
        {/* Tree panel */}
        <TreePanel
          documents={documents}
          selection={selection}
          onSelect={(sel) => {
            setSelection(sel);
            setQuickFilter('all');
            setPreviewDoc(null);
          }}
          expandedFunds={expandedFunds}
          onToggleFund={toggleFund}
        />

        {/* Main content */}
        <div style={{
          flex: 1, minWidth: 0,
          background: 'var(--ih-bg-card)', borderRadius: 12,
          border: '1px solid var(--ih-border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Toolbar */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--ih-border)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {/* Top row: breadcrumb + search + view toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Breadcrumb selection={selection} onNavigate={setSelection} />
              <div style={{ flex: 1 }} />
              <Input
                prefix={<SearchOutlined style={{ color: 'var(--ih-text-secondary)' }} />}
                placeholder="Rechercher..."
                allowClear
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 200, borderRadius: 8 }}
              />
              <div style={{
                display: 'flex', background: '#F3F4F6', borderRadius: 8,
                padding: 2, gap: 2,
              }}>
                <Tooltip title="Vue grille">
                  <div
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                      background: viewMode === 'grid' ? '#fff' : 'transparent',
                      boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      color: viewMode === 'grid' ? 'var(--ih-primary)' : 'var(--ih-text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <AppstoreOutlined style={{ fontSize: 14 }} />
                  </div>
                </Tooltip>
                <Tooltip title="Vue liste">
                  <div
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                      background: viewMode === 'list' ? '#fff' : 'transparent',
                      boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      color: viewMode === 'list' ? 'var(--ih-primary)' : 'var(--ih-text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <UnorderedListOutlined style={{ fontSize: 14 }} />
                  </div>
                </Tooltip>
              </div>
            </div>
            {/* Quick filters */}
            <QuickFilters active={quickFilter} onSelect={setQuickFilter} counts={filterCounts} />
          </div>

          {/* Document area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
                <Empty
                  description="Aucun document trouvé"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : viewMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: previewDoc ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: 12, padding: 16,
              }}>
                {filtered.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedIds.has(doc.id)}
                    onSelect={handleSelect}
                    onPreview={setPreviewDoc}
                  />
                ))}
              </div>
            ) : (
              <div>
                {/* List header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 16px', borderBottom: '1px solid var(--ih-border)',
                  fontSize: 11, fontWeight: 600, color: 'var(--ih-text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.03em',
                }}>
                  <div style={{ width: 22 }} />
                  <div style={{ width: 26 }} />
                  <div style={{ flex: 1 }}>Nom</div>
                  <div style={{ width: 90, textAlign: 'right' }}>Ajouté le</div>
                  <div style={{ width: 70, textAlign: 'right' }}>Taille</div>
                  <div style={{ width: 48 }} />
                </div>
                {filtered.map(doc => (
                  <DocumentListRow
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedIds.has(doc.id)}
                    onSelect={handleSelect}
                    onPreview={setPreviewDoc}
                    isActive={previewDoc?.id === doc.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        {previewDoc && (
          <PreviewPanel doc={previewDoc} onClose={() => setPreviewDoc(null)} />
        )}
      </div>

      {/* Bulk action bar */}
      <BulkActionBar count={selectedIds.size} onClear={() => setSelectedIds(new Set())} />
    </div>
  );
}
