'use client';
import { useState, useMemo } from 'react';
import { Table, Tag, Space, Typography, Tooltip, ConfigProvider } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { DocumentIcon, FolderIcon } from '@/components/shared/Icons';
import type { ColumnsType } from 'antd/es/table';

interface Document {
  id: number;
  fund: string;
  name: string;
  type: string;
  size: string;
  addedAt: string;
  isNew: boolean;
}

interface DocumentExplorerProps {
  documents: Document[];
}

export function DocumentExplorer({ documents }: DocumentExplorerProps) {
  const funds = useMemo(() => Array.from(new Set(documents.map(d => d.fund))), [documents]);
  const [selectedFund, setSelectedFund] = useState<string>(funds[0] ?? '');

  const filtered = useMemo(() =>
    documents.filter(d => d.fund === selectedFund),
    [documents, selectedFund]
  );

  const columns: ColumnsType<Document> = [
    {
      title: 'Nom',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, doc) => (
        <Space>
          <DocumentIcon size={22} />
          <div>
            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              {doc.name}
              {doc.isNew && (
                <Tag
                  style={{
                    borderRadius: 12, fontSize: 11, padding: '0 6px',
                    border: '1px solid #d9d9d9', color: 'var(--ih-text-primary)',
                    background: 'white',
                  }}
                >
                  New
                </Tag>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>{doc.type}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ajouté le',
      dataIndex: 'addedAt',
      sorter: (a, b) => a.addedAt.localeCompare(b.addedAt),
    },
    {
      title: 'Taille',
      dataIndex: 'size',
    },
    {
      key: 'actions',
      width: 80,
      render: () => (
        <Space size={12}>
          <Tooltip title="Aperçu"><EyeOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 16 }} /></Tooltip>
          <Tooltip title="Télécharger"><DownloadOutlined style={{ color: 'var(--ih-text-secondary)', cursor: 'pointer', fontSize: 16 }} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Tree panel */}
      <div style={{
        width: 280, flexShrink: 0,
        background: 'var(--ih-bg-card)', borderRadius: 12,
        border: '1px solid var(--ih-border)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 16px 8px' }}>
          <Typography.Text style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-secondary)', display: 'block' }}>
            Documents ({documents.length})
          </Typography.Text>
        </div>
        <div>
          {funds.map(fund => {
            const count = documents.filter(d => d.fund === fund).length;
            const isActive = fund === selectedFund;
            return (
              <div
                key={fund}
                onClick={() => setSelectedFund(fund)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: isActive ? '#F0F2F5' : 'transparent',
                  color: isActive ? 'var(--ih-text-primary)' : 'var(--ih-text-secondary)',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 13.5,
                  transition: 'background 0.15s',
                  userSelect: 'none',
                }}
              >
                <FolderIcon size={16} />
                <span>{fund} ({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* File list */}
      <div style={{ flex: 1, background: 'var(--ih-bg-card)', borderRadius: 12, border: '1px solid var(--ih-border)', padding: 16 }}>
        <ConfigProvider theme={{ components: { Table: { rowSelectedBg: '#F0F2F5', rowSelectedHoverBg: '#e8eaed' } } }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={false}
          showHeader={!!filtered.length}
          locale={{ emptyText: 'Aucun document' }}
          rowSelection={{ type: 'checkbox' }}
        />
        </ConfigProvider>
      </div>
    </div>
  );
}
