'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Table, Button, Dropdown, Modal, Form, Input, Select, Checkbox, Switch,
  Tag, Typography, Divider, Space, Drawer, message,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined,
  EllipsisOutlined, CodeOutlined, ExclamationCircleFilled,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  lpContacts, funds, subscriptions, notificationTypes, structures,
  type LpContact,
} from '@/data/mock';
import { CONTACTS_PAGE_CODE } from '@/lib/code-sources';

const { Text, Title } = Typography;
const { confirm } = Modal;

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

function formatRestrictions(value: string[] | number[] | 'all', allLabel: string, lookup?: Record<number, string>): React.ReactNode {
  if (value === 'all') return <Tag color="green">Tous</Tag>;
  if (!value || value.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
  const labels = lookup
    ? (value as number[]).map(id => lookup[id] ?? `#${id}`)
    : (value as string[]);
  if (labels.length <= 2) {
    return (
      <Space size={4} wrap>
        {labels.map(l => <Tag key={String(l)} style={{ fontSize: 11 }}>{l}</Tag>)}
      </Space>
    );
  }
  return (
    <Space size={4} wrap>
      <Tag style={{ fontSize: 11 }}>{labels[0]}</Tag>
      <Tag style={{ fontSize: 11 }}>+{labels.length - 1}</Tag>
    </Space>
  );
}

function ContactsContent() {
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona') ?? 'lp';

  const [contacts, setContacts] = useState<LpContact[]>(lpContacts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<LpContact | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [form] = Form.useForm();
  const [hasPortalAccess, setHasPortalAccess] = useState(false);
  const [allStructures, setAllStructures] = useState(false);
  const [allFunds, setAllFunds] = useState(false);
  const [allSubscriptions, setAllSubscriptions] = useState(false);
  const [allNotifications, setAllNotifications] = useState(false);

  const subscriptionLookup: Record<number, string> = {};
  subscriptions.forEach(s => {
    subscriptionLookup[s.id] = `${s.fund}${s.part ? ` — ${s.part}` : ''}`;
  });

  const fundOptions = funds.map(f => ({ value: f.name, label: f.name }));
  const subscriptionOptions = subscriptions.map(s => ({
    value: s.id,
    label: `${s.fund}${s.part ? ` — ${s.part}` : ''}`,
  }));
  const structureOptions = structures.map(s => ({ value: s.value, label: s.label }));

  function openAdd() {
    setEditingContact(null);
    setHasPortalAccess(false);
    setAllStructures(false);
    setAllFunds(false);
    setAllSubscriptions(false);
    setAllNotifications(false);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(contact: LpContact) {
    setEditingContact(contact);
    setHasPortalAccess(contact.hasPortalAccess);
    setAllStructures(contact.structures === 'all');
    setAllFunds(contact.fundRestrictions === 'all');
    setAllSubscriptions(contact.subscriptionRestrictions === 'all');
    setAllNotifications(contact.notifications === 'all');
    form.setFieldsValue({
      lastName: contact.lastName,
      firstName: contact.firstName,
      email: contact.email,
      phone: contact.phone,
      language: contact.language,
      hasPortalAccess: contact.hasPortalAccess,
      structures: contact.structures === 'all' ? [] : contact.structures,
      fundRestrictions: contact.fundRestrictions === 'all' ? [] : contact.fundRestrictions,
      subscriptionRestrictions: contact.subscriptionRestrictions === 'all' ? [] : contact.subscriptionRestrictions,
      notifications: contact.notifications === 'all' ? [] : contact.notifications,
    });
    setModalOpen(true);
  }

  function handleDelete(contact: LpContact) {
    confirm({
      title: 'Supprimer ce contact ?',
      icon: <ExclamationCircleFilled />,
      content: `${contact.firstName} ${contact.lastName} sera définitivement supprimé.`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        setContacts(prev => prev.filter(c => c.id !== contact.id));
        message.success('Contact supprimé');
      },
    });
  }

  function handleResetPassword(contact: LpContact) {
    confirm({
      title: 'Réinitialiser le mot de passe ?',
      icon: <SyncOutlined />,
      content: `Un email de réinitialisation sera envoyé à ${contact.email}.`,
      okText: 'Réinitialiser',
      cancelText: 'Annuler',
      onOk() {
        message.success(`Email de réinitialisation envoyé à ${contact.email}`);
      },
    });
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      const contactData: LpContact = {
        id: editingContact?.id ?? Math.max(0, ...contacts.map(c => c.id)) + 1,
        lastName: values.lastName,
        firstName: values.firstName,
        email: values.email,
        phone: values.phone ?? '',
        language: values.language ?? 'fr',
        hasPortalAccess: hasPortalAccess,
        structures: hasPortalAccess ? (allStructures ? 'all' : (values.structures ?? [])) : [],
        fundRestrictions: hasPortalAccess ? (allFunds ? 'all' : (values.fundRestrictions ?? [])) : [],
        subscriptionRestrictions: hasPortalAccess ? (allSubscriptions ? 'all' : (values.subscriptionRestrictions ?? [])) : [],
        notifications: hasPortalAccess ? (allNotifications ? 'all' : (values.notifications ?? [])) : [],
      };

      if (editingContact) {
        setContacts(prev => prev.map(c => c.id === editingContact.id ? contactData : c));
        message.success('Contact modifié');
      } else {
        setContacts(prev => [...prev, contactData]);
        message.success('Contact ajouté');
      }
      setModalOpen(false);
    });
  }

  const columns: ColumnsType<LpContact> = [
    {
      title: 'Nom',
      key: 'name',
      width: 160,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ih-text-primary)' }}>
            {r.lastName} {r.firstName}
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: v => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Communications',
      key: 'notifications',
      width: 160,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>Pas d'accès portail</Text>;
        return formatRestrictions(r.notifications, 'Toutes');
      },
    },
    {
      title: 'Restrictions Fonds',
      key: 'fundRestrictions',
      width: 180,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return formatRestrictions(r.fundRestrictions, 'Tous les fonds');
      },
    },
    {
      title: 'Restrictions Souscriptions',
      key: 'subscriptionRestrictions',
      width: 190,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return formatRestrictions(r.subscriptionRestrictions, 'Toutes', subscriptionLookup);
      },
    },
    {
      title: 'Restrictions Structures',
      key: 'structures',
      width: 180,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const structureLookup: Record<string, string> = {};
        structures.forEach(s => { structureLookup[s.value] = s.label; });
        if (r.structures === 'all') return <Tag color="green">Toutes</Tag>;
        if (r.structures.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const labels = r.structures.map(v => structureLookup[v] ?? v);
        if (labels.length <= 1) return <Tag style={{ fontSize: 11 }}>{labels[0]}</Tag>;
        return (
          <Space size={4} wrap>
            <Tag style={{ fontSize: 11 }}>{labels[0]}</Tag>
            <Tag style={{ fontSize: 11 }}>+{labels.length - 1}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Modifier',
                onClick: () => openEdit(record),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Supprimer',
                danger: true,
                onClick: () => handleDelete(record),
              },
              { type: 'divider' },
              {
                key: 'reset',
                icon: <SyncOutlined />,
                label: 'Réinitialiser le mot de passe',
                onClick: () => handleResetPassword(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader
          title="Mes contacts supplémentaires"
          subtitle="Gérez les contacts qui ont accès à votre espace investisseur"
        />
        <Space>
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={() => setCodeOpen(true)}
            style={{ color: 'var(--ih-text-secondary)', fontSize: 12 }}
          >
            Show code
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAdd}
            style={{ borderRadius: 8 }}
          >
            Ajouter
          </Button>
        </Space>
      </div>

      <div style={{
        background: 'var(--ih-bg-card)',
        borderRadius: 12,
        border: '1px solid var(--ih-border)',
        padding: 0,
        overflow: 'hidden',
      }}>
        <Table
          dataSource={contacts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
          size="middle"
        />
      </div>

      {/* Modal Ajouter / Modifier */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {editingContact ? 'Modifier le contact' : 'Ajouter un contact'}
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {editingContact
                ? "Mettez à jour les informations de l'investisseur"
                : "Ajoutez un nouveau contact à votre espace"}
            </Text>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              {editingContact ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        }
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" requiredMark style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="lastName"
              label="Nom"
              rules={[{ required: true, message: 'Requis' }]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
            <Form.Item
              name="firstName"
              label="Prénom"
              rules={[{ required: true, message: 'Requis' }]}
            >
              <Input placeholder="Entrez le prénom" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Requis' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input placeholder="contact@example.com" />
          </Form.Item>

          <Form.Item name="phone" label="Téléphone">
            <Input placeholder="+33 6 12 34 56 78" />
          </Form.Item>

          <Divider style={{ margin: '8px 0 16px' }} />
          <Title level={5} style={{ margin: '0 0 16px', fontSize: 14 }}>Préférences</Title>

          <Form.Item name="language" label="Langue" rules={[{ required: true }]}>
            <Select options={LANGUAGES} placeholder="Sélectionnez la langue" />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={hasPortalAccess}
              onChange={e => setHasPortalAccess(e.target.checked)}
            >
              <span style={{ fontWeight: 500 }}>Accès espace investisseur</span>
            </Checkbox>
          </Form.Item>

          {hasPortalAccess && (
            <>
              <Divider style={{ margin: '4px 0 16px' }} />

              {/* Structures */}
              <Form.Item label="Rattacher aux structures">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: allStructures ? 0 : 8 }}>
                  <Switch
                    size="small"
                    checked={allStructures}
                    onChange={setAllStructures}
                  />
                  <Text style={{ fontSize: 13 }}>Toutes les structures</Text>
                </div>
                {!allStructures && (
                  <Form.Item name="structures" noStyle>
                    <Select
                      mode="multiple"
                      placeholder="Sélectionnez les structures"
                      options={structureOptions}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              </Form.Item>

              {/* Fonds */}
              <Form.Item label="Fonds">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: allFunds ? 0 : 8 }}>
                  <Switch
                    size="small"
                    checked={allFunds}
                    onChange={setAllFunds}
                  />
                  <Text style={{ fontSize: 13 }}>Tous les fonds</Text>
                </div>
                {!allFunds && (
                  <Form.Item name="fundRestrictions" noStyle>
                    <Select
                      mode="multiple"
                      placeholder="Sélectionnez les fonds"
                      options={fundOptions}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              </Form.Item>

              {/* Souscriptions */}
              <Form.Item label="Souscriptions">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: allSubscriptions ? 0 : 8 }}>
                  <Switch
                    size="small"
                    checked={allSubscriptions}
                    onChange={setAllSubscriptions}
                  />
                  <Text style={{ fontSize: 13 }}>Toutes les souscriptions</Text>
                </div>
                {!allSubscriptions && (
                  <Form.Item name="subscriptionRestrictions" noStyle>
                    <Select
                      mode="multiple"
                      placeholder="Sélectionnez les souscriptions"
                      options={subscriptionOptions}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              </Form.Item>

              {/* Notifications */}
              <Form.Item label="Notifications">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: allNotifications ? 0 : 8 }}>
                  <Switch
                    size="small"
                    checked={allNotifications}
                    onChange={setAllNotifications}
                  />
                  <Text style={{ fontSize: 13 }}>Toutes les notifications</Text>
                </div>
                {!allNotifications && (
                  <Form.Item name="notifications" noStyle>
                    <Select
                      mode="multiple"
                      placeholder="Sélectionnez les groupes"
                      options={notificationTypes}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* Code drawer */}
      <Drawer
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="Code — ContactsPage"
        width={680}
      >
        <SyntaxHighlighter language="tsx" style={oneLight} customStyle={{ fontSize: 12 }}>
          {CONTACTS_PAGE_CODE}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={null}>
      <ContactsContent />
    </Suspense>
  );
}
