'use client';

import { useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, Divider, Typography, message, ConfigProvider } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  CopyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/shared/PageHeader';
import { WidgetWrapper } from '@/components/widgets/WidgetWrapper';
import { partners as partnersData, funds } from '@/data/mock';

interface Partner {
  id: number;
  name: string;
  email: string;
  activatedFunds: string[];
  investorsCount: number;
  subscriptionsCount: number;
  status: 'active' | 'pending';
  siren: string;
  orias: string;
  city: string;
}

const PARTNERS_TABLE_CODE = `// PartnersTable component — partners list with actions
export function PartnersTable({ data }: { data: Partner[] }) {
  const columns: ColumnsType<Partner> = [
    {
      title: 'Nom',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
              {record.name}
            </span>
            <Tag color={record.status === 'active' ? 'success' : 'warning'}>
              {record.status === 'active' ? 'Actif' : 'En attente'}
            </Tag>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)' }}>{record.city}</div>
        </div>
      ),
    },
    // ...
  ];
  return <Table dataSource={data} columns={columns} rowKey="id" />;
}`;

export default function PartnersPage() {
  const [partnerList, setPartnerList] = useState<Partner[]>(partnersData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  function handleEdit(record: Partner) {
    setEditingPartner(record);
    form.setFieldsValue({
      email: record.email,
      entityName: record.name,
      siren: record.siren,
      orias: record.orias,
      funds: record.activatedFunds,
      city: record.city,
    });
    setModalOpen(true);
  }

  function handleDelete(record: Partner) {
    Modal.confirm({
      title: 'Supprimer ce partenaire ?',
      content: `« ${record.name} » sera retiré de votre réseau.`,
      okText: 'Supprimer',
      okButtonProps: { danger: true },
      cancelText: 'Annuler',
      onOk: () => {
        setPartnerList((prev) => prev.filter((p) => p.id !== record.id));
        messageApi.success('Partenaire supprimé');
      },
    });
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingPartner(null);
    form.resetFields();
  }

  function handleSubmit() {
    form.validateFields().then((values) => {
      if (editingPartner) {
        setPartnerList((prev) =>
          prev.map((p) =>
            p.id === editingPartner.id
              ? {
                  ...p,
                  name: values.entityName,
                  email: values.email,
                  siren: values.siren,
                  orias: values.orias,
                  activatedFunds: values.funds ?? [],
                  city: values.city,
                }
              : p
          )
        );
        messageApi.success('Partenaire mis à jour');
      } else {
        const newPartner: Partner = {
          id: Date.now(),
          name: values.entityName,
          email: values.email,
          siren: values.siren,
          orias: values.orias,
          activatedFunds: values.funds ?? [],
          investorsCount: 0,
          subscriptionsCount: 0,
          status: 'pending',
          city: values.city,
        };
        setPartnerList((prev) => [...prev, newPartner]);
        messageApi.success('Partenaire créé avec succès !');
      }
      handleCloseModal();
    });
  }

  const fundOptions = funds.map((f) => ({ value: f.name, label: f.name }));

  function handleCopyLink() {
    navigator.clipboard
      .writeText('https://investhub.cloud/register?network=DIST-4829')
      .then(() => messageApi.success('Lien copié !'));
  }

  const columns: ColumnsType<Partner> = [
    {
      title: 'Nom',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
              {record.name}
            </span>
            <Tag color={record.status === 'active' ? 'success' : 'warning'} style={{ margin: 0 }}>
              {record.status === 'active' ? 'Actif' : 'En attente'}
            </Tag>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ih-text-secondary)', marginTop: 2 }}>
            {record.city}
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (v: string) => (
        <span style={{ fontSize: 13, color: 'var(--ih-text-secondary)' }}>{v}</span>
      ),
    },
    {
      title: 'Fonds activés',
      dataIndex: 'activatedFunds',
      key: 'activatedFunds',
      render: (funds: string[]) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {funds.map((f) => (
            <Tag key={f} color="blue" style={{ margin: 0, fontSize: 12 }}>
              {f}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Nb investisseurs',
      dataIndex: 'investorsCount',
      key: 'investorsCount',
      align: 'center',
      sorter: (a, b) => a.investorsCount - b.investorsCount,
      render: (v: number) => (
        <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
      ),
    },
    {
      title: 'Nb souscriptions',
      dataIndex: 'subscriptionsCount',
      key: 'subscriptionsCount',
      align: 'center',
      sorter: (a, b) => a.subscriptionsCount - b.subscriptionsCount,
      render: (v: number) => (
        <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button type="text" size="small" icon={<EditOutlined />} style={{ color: 'var(--ih-primary)' }} onClick={() => handleEdit(record)} />
          <Button type="text" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      <PageHeader
        title="Mes partenaires"
        subtitle="Gérez votre réseau de partenaires affiliés"
      />

      {/* Partners table widget */}
      <WidgetWrapper title="PartnersTable" codeSource={PARTNERS_TABLE_CODE}>
        <div style={{ paddingTop: 40 }}>
          {/* Header row with action button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 16,
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { setEditingPartner(null); setModalOpen(true); }}
              style={{ background: 'var(--ih-primary)', borderColor: 'var(--ih-primary)' }}
            >
              Nouveau partenaire
            </Button>
          </div>

          <ConfigProvider theme={{ token: { colorFillAlter: '#ffffff' } }}>
            <Table
              dataSource={partnerList}
              columns={columns}
              rowKey="id"
              size="middle"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total) =>
                  `${total} partenaire${total > 1 ? 's' : ''}`,
              }}
              style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}
              locale={{
                emptyText: (
                  <div style={{ padding: '32px 0', color: 'var(--ih-text-secondary)', fontSize: 14 }}>
                    Aucun partenaire affilié — créez votre premier partenaire
                  </div>
                ),
              }}
            />
          </ConfigProvider>
        </div>
      </WidgetWrapper>

      {/* Share link widget */}
      <div
        style={{
          marginTop: 24,
          background: 'white',
          border: '1px solid var(--ih-border)',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <ShareAltOutlined style={{ fontSize: 18, color: 'var(--ih-primary)' }} />
          <Typography.Title
            level={5}
            style={{ margin: 0, color: 'var(--ih-text-primary)', fontWeight: 700 }}
          >
            Partagez votre lien de réseau
          </Typography.Title>
        </div>
        <Typography.Text
          style={{
            color: 'var(--ih-text-secondary)',
            fontSize: 13,
            display: 'block',
            marginBottom: 16,
          }}
        >
          Partagez ce lien avec un partenaire existant pour l&apos;intégrer automatiquement à votre réseau.
        </Typography.Text>
        <div style={{ display: 'flex', gap: 8, maxWidth: 560 }}>
          <Input
            readOnly
            value="https://investhub.cloud/register?network=DIST-4829"
            style={{ flex: 1, fontSize: 13 }}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopyLink}
            style={{ borderColor: 'var(--ih-primary)', color: 'var(--ih-primary)' }}
          >
            Copier le lien
          </Button>
        </div>
      </div>

      {/* Nouveau partenaire modal */}
      <Modal
        open={modalOpen}
        onCancel={handleCloseModal}
        title={
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ih-text-primary)' }}>
            {editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
          </span>
        }
        width={640}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              type="primary"
              style={{ background: 'var(--ih-primary)', borderColor: 'var(--ih-primary)' }}
              onClick={handleSubmit}
            >
              {editingPartner ? 'Enregistrer' : 'Créer le partenaire'}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>

          {/* Section 1 — Informations entité */}
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Text style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-secondary)' }}>
              Informations entité
            </Typography.Text>
          </Divider>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email requis' }]}>
            <Input placeholder="contact@cabinet.fr" />
          </Form.Item>

          <Form.Item label="Nom de l'entité" name="entityName" rules={[{ required: true, message: "Nom de l'entité requis" }]}>
            <Input placeholder="Cabinet Dupont & Associés" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item label="SIREN" name="siren" rules={[{ required: true, message: 'SIREN requis' }]}>
              <Input placeholder="123 456 789" />
            </Form.Item>
            <Form.Item label="Numéro ORIAS" name="orias" rules={[{ required: true, message: 'ORIAS requis' }]}>
              <Input placeholder="12 001 234" />
            </Form.Item>
          </div>

          <Form.Item label="Fonds" name="funds">
            <Select
              mode="multiple"
              placeholder="Sélectionner des fonds"
              options={fundOptions}
              allowClear
            />
          </Form.Item>

          {/* Section 2 — Contact principal */}
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Text style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-secondary)' }}>
              Contact principal
            </Typography.Text>
          </Divider>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item label="Prénom" name="firstName" rules={[{ required: true, message: 'Prénom requis' }]}>
              <Input placeholder="Jean" />
            </Form.Item>
            <Form.Item label="Nom" name="lastName" rules={[{ required: true, message: 'Nom requis' }]}>
              <Input placeholder="Dupont" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item label="Téléphone" name="phone" rules={[{ required: true, message: 'Téléphone requis' }]}>
              <Input placeholder="+33 6 12 34 56 78" />
            </Form.Item>
            <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Mot de passe requis' }]}>
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </div>

          {/* Section 3 — Adresse */}
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Text style={{ fontSize: 13, fontWeight: 600, color: 'var(--ih-text-secondary)' }}>
              Adresse
            </Typography.Text>
          </Divider>

          <Form.Item label="Adresse" name="address" rules={[{ required: true, message: 'Adresse requise' }]}>
            <Input placeholder="12 rue de la Paix" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Form.Item
              label="Code postal"
              name="postalCode"
              rules={[{ required: true, message: 'Requis' }]}
              style={{ flex: '0 0 120px' }}
            >
              <Input placeholder="75001" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              label="Ville"
              name="city"
              rules={[{ required: true, message: 'Ville requise' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Paris" />
            </Form.Item>
          </div>

        </Form>
      </Modal>
    </div>
  );
}
