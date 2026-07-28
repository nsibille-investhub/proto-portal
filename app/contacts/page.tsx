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
  EllipsisOutlined, CodeOutlined, ExclamationCircleFilled, MinusCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  lpContacts, funds, subscriptions, notificationTypes, structures, contactRoles,
  type LpContact, type ContactStructureRole,
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
  const [structureRoleRows, setStructureRoleRows] = useState<ContactStructureRole[]>([]);
  const [allFunds, setAllFunds] = useState(false);
  const [allSubscriptions, setAllSubscriptions] = useState(false);
  const [allNotifications, setAllNotifications] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

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
    setStructureRoleRows([]);
    setAllFunds(false);
    setAllSubscriptions(false);
    setAllNotifications(false);
    setSelectedNotifications([]);
    form.resetFields();
    setModalOpen(true);
  }

  function openEdit(contact: LpContact) {
    setEditingContact(contact);
    setHasPortalAccess(contact.hasPortalAccess);
    setStructureRoleRows(contact.structureRoles);
    setAllFunds(contact.fundRestrictions === 'all');
    setAllSubscriptions(contact.subscriptionRestrictions === 'all');
    setAllNotifications(contact.notifications === 'all');
    setSelectedNotifications(contact.notifications === 'all' ? [] : contact.notifications);
    form.setFieldsValue({
      lastName: contact.lastName,
      firstName: contact.firstName,
      email: contact.email,
      phone: contact.phone,
      language: contact.language,
      hasPortalAccess: contact.hasPortalAccess,
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

  const hasNotifications = allNotifications || selectedNotifications.length > 0;
  const showAccessRules = hasPortalAccess || hasNotifications;

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
        structureRoles: showAccessRules ? structureRoleRows.filter(r => r.structureId) : [],
        fundRestrictions: showAccessRules ? (allFunds ? 'all' : (values.fundRestrictions ?? [])) : [],
        subscriptionRestrictions: showAccessRules ? (allSubscriptions ? 'all' : (values.subscriptionRestrictions ?? [])) : [],
        notifications: showAccessRules ? (allNotifications ? 'all' : (values.notifications ?? [])) : [],
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
      title: 'Accès Fonds',
      key: 'fundRestrictions',
      width: 180,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return formatRestrictions(r.fundRestrictions, 'Tous les fonds');
      },
    },
    {
      title: 'Accès Souscriptions',
      key: 'subscriptionRestrictions',
      width: 190,
      render: (_, r) => {
        if (!r.hasPortalAccess) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return formatRestrictions(r.subscriptionRestrictions, 'Toutes', subscriptionLookup);
      },
    },
    {
      title: 'Structures / Rôles',
      key: 'structureRoles',
      width: 220,
      render: (_, r) => {
        if (r.structureRoles.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        const structureLookup: Record<string, string> = {};
        structures.forEach(s => { structureLookup[s.value] = s.label; });
        const roleLookup: Record<string, string> = {};
        contactRoles.forEach(cr => { roleLookup[cr.value] = cr.label; });
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {r.structureRoles.slice(0, 2).map(sr => (
              <div key={sr.structureId} style={{ fontSize: 12, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 500 }}>{structureLookup[sr.structureId] ?? sr.structureId}</span>
                {sr.roles.length > 0 && (
                  <span style={{ color: 'var(--ih-text-secondary)', marginLeft: 4 }}>
                    ({sr.roles.map(rv => roleLookup[rv] ?? rv).join(', ')})
                  </span>
                )}
              </div>
            ))}
            {r.structureRoles.length > 2 && (
              <Text type="secondary" style={{ fontSize: 11 }}>+{r.structureRoles.length - 2} autre(s)</Text>
            )}
          </div>
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

          <Form.Item style={{ marginBottom: 8 }}>
            <Checkbox
              checked={hasPortalAccess}
              onChange={e => setHasPortalAccess(e.target.checked)}
            >
              <span style={{ fontWeight: 500 }}>Accès espace investisseur</span>
            </Checkbox>
          </Form.Item>

          {/* Notifications — always visible */}
          <Form.Item label="Notifications" style={{ marginBottom: 12 }}>
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
                  onChange={(vals: string[]) => setSelectedNotifications(vals)}
                />
              </Form.Item>
            )}
          </Form.Item>

          {showAccessRules && (
            <>
              <Divider style={{ margin: '4px 0 16px' }} />
              <Title level={5} style={{ margin: '0 0 16px', fontSize: 14 }}>Règles d&apos;accès</Title>

              {/* Structure / Rôle table */}
              <Form.Item label="Rattacher aux structures">
                <div style={{
                  border: '1px solid var(--ih-border)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  {structureRoleRows.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 32px',
                      gap: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--ih-text-secondary)',
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderBottom: '1px solid var(--ih-border)',
                    }}>
                      <span>Structure</span>
                      <span>Rôle(s)</span>
                      <span />
                    </div>
                  )}
                  {structureRoleRows.map((row, idx) => {
                    const usedStructures = structureRoleRows
                      .filter((_, i) => i !== idx)
                      .map(r => r.structureId);
                    const availableStructures = structureOptions.filter(
                      o => !usedStructures.includes(o.value)
                    );
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 32px',
                          gap: 8,
                          padding: '8px 12px',
                          alignItems: 'center',
                          borderBottom: idx < structureRoleRows.length - 1 ? '1px solid var(--ih-border)' : undefined,
                        }}
                      >
                        <Select
                          size="small"
                          placeholder="Structure"
                          value={row.structureId || undefined}
                          options={availableStructures}
                          onChange={(val) => {
                            const updated = [...structureRoleRows];
                            updated[idx] = { ...updated[idx], structureId: val };
                            setStructureRoleRows(updated);
                          }}
                          style={{ width: '100%' }}
                        />
                        <Select
                          size="small"
                          mode="multiple"
                          placeholder="Rôle(s)"
                          value={row.roles}
                          options={contactRoles}
                          onChange={(vals) => {
                            const updated = [...structureRoleRows];
                            updated[idx] = { ...updated[idx], roles: vals };
                            setStructureRoleRows(updated);
                          }}
                          style={{ width: '100%' }}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            setStructureRoleRows(prev => prev.filter((_, i) => i !== idx));
                          }}
                        />
                      </div>
                    );
                  })}
                  <div style={{ padding: '8px 12px' }}>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setStructureRoleRows(prev => [...prev, { structureId: '', roles: [] }]);
                      }}
                      disabled={structureRoleRows.length >= structures.length}
                      style={{ width: '100%' }}
                    >
                      Ajouter une structure
                    </Button>
                  </div>
                </div>
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
