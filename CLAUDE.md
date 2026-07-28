# CLAUDE.md — Portail Investisseur InvestHub (Prototype)

## Contexte du projet

Prototype interactif du **portail investisseur InvestHub** — SaaS B2B Private Equity.
Destiné à des démonstrations commerciales et tests UX avec les GPs clients.

Ce prototype reproduit fidèlement les pages clés du portail LP (Limited Partner) en utilisant des données fictives. Chaque composant/widget expose son code source via un bouton **"Show code"**.

---

## Stack technique

| Couche | Choix |
|---|---|
| Framework | **Next.js 14** (App Router) |
| UI Library | **Ant Design 5.x** (`antd`) |
| Styling | **Tailwind CSS** (utilitaires) + CSS Modules pour le branding |
| Language | **TypeScript** |
| State | `useState` / `useContext` (pas de Redux — projet proto) |
| Icons | `@ant-design/icons` |
| Charts | **visx** (`@visx`) — lib Airbnb, D3 + React (graphiques performances) |
| Code display | **react-syntax-highlighter** (pour le "Show code" sur chaque widget) |
| Déploiement | **Vercel** |

---

## Architecture des fichiers

```
/
├── app/
│   ├── layout.tsx               # Layout global avec Sidebar + Header
│   ├── page.tsx                 # Redirect → /home
│   ├── home/page.tsx            # Page Home (widgets KPI, fonds en vedette)
│   ├── subscriptions/page.tsx   # Mes souscriptions
│   ├── documents/page.tsx       # Mes documents
│   ├── secondary-market/page.tsx # Marché secondaire
│   ├── design-system/page.tsx   # Design System — catalogue exhaustif de tous les widgets
│   └── globals.css              # Thème InvestHub + variables CSS
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Shell global (sidebar + contenu)
│   │   ├── Sidebar.tsx          # Navigation latérale
│   │   └── TopBar.tsx           # Header haut (version navbar)
│   │
│   ├── widgets/                 # Chaque widget est autonome + "Show code"
│   │   ├── WidgetWrapper.tsx    # HOC : encapsule chaque widget avec le bouton Show Code
│   │   ├── KpiCard.tsx          # Carte KPI (engagement, appelé, distribué, valorisation)
│   │   ├── FundCard.tsx         # Carte fonds (image, titre, description, CTA)
│   │   ├── SubscriptionTable.tsx # Tableau des souscriptions + filtres
│   │   ├── DocumentExplorer.tsx # Explorateur documents (arborescence + liste)
│   │   ├── SecondaryMarketCard.tsx # Carte offre marché secondaire
│   │   └── PerformanceChart.tsx # Graphique de performance (visx)
│   │
│   └── shared/
│       ├── StatusBadge.tsx      # Badge statut souscription (coloré)
│       ├── ShowCodeButton.tsx   # Bouton + drawer pour afficher le code source
│       └── PageHeader.tsx       # Titre de page standardisé
│
├── data/
│   └── mock.ts                  # Toutes les données fictives (fonds, souscriptions, docs)
│
├── lib/
│   └── theme.ts                 # Configuration thème Ant Design (tokens couleurs InvestHub)
│
└── CLAUDE.md                    # Ce fichier
```

---

## Thème InvestHub

### Palette de couleurs

```ts
// lib/theme.ts
export const investHubTheme = {
  token: {
    colorPrimary: '#0D3D56',       // Bleu marine InvestHub
    colorPrimaryHover: '#1A5C7A',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
};

// Variables CSS globales
:root {
  --ih-primary: #0D3D56;
  --ih-primary-light: #1A5C7A;
  --ih-accent: #CBFF99;           // Lime InvestHub
  --ih-bg: #F5F7FA;
  --ih-bg-card: #FFFFFF;
  --ih-text-primary: #1A1A2E;
  --ih-text-secondary: #6B7280;
  --ih-border: #E5E7EB;
  --ih-sidebar-bg: #0D3D56;
  --ih-sidebar-text: #FFFFFF;
}
```

### Typographie

- **Titres** : `DM Sans` (700)
- **Corps** : `DM Sans` (400/500)
- Import Google Fonts dans `layout.tsx`

---

## Pattern clé — WidgetWrapper (Show Code)

**Chaque widget du portail DOIT être encapsulé dans `<WidgetWrapper>`.**

Ce composant ajoute :
- Un bouton **"< / > Show code"** en haut à droite du widget
- Un `Drawer` Ant Design qui s'ouvre et affiche le code source du widget avec coloration syntaxique (`react-syntax-highlighter` / thème `oneLight`)
- Le code affiché est le **vrai code source** du composant (importé comme string via `raw-loader` ou inline)

```tsx
// Exemple d'usage
<WidgetWrapper
  title="KPI Cards"
  componentName="KpiCard"
  codeSource={KpiCardCode}  // string du code source
>
  <KpiCard ... />
</WidgetWrapper>
```

```tsx
// components/widgets/WidgetWrapper.tsx
import { Button, Drawer } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function WidgetWrapper({ title, children, codeSource }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Button
        icon={<CodeOutlined />}
        size="small"
        onClick={() => setOpen(true)}
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
      >
        Show code
      </Button>
      {children}
      <Drawer title={`Code — ${title}`} open={open} onClose={() => setOpen(false)} width={640}>
        <SyntaxHighlighter language="tsx" style={oneLight}>
          {codeSource}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
```

---

## Pages à construire

### 1. `/home` — Home

**Layout** : Sidebar gauche + contenu principal

**Widgets** :
- `KpiCard` × 4 (Engagement total, Total appelé, Total distribué, Valorisation)
- `FundCard` × 3 (fonds en vedette, grille 3 colonnes)
- `PerformanceChart` (courbe NAV globale — visx `LinePath` + `AxisBottom`)
- Bloc "Derniers documents" (liste 3 items)

---

### 2. `/subscriptions` — Mes souscriptions

**Widgets** :
- `KpiCard` × 4 (en-tête résumé)
- Filtres Ant Design : `Select` (Fonds, Parts, Statut)
- `SubscriptionTable` : tableau Ant Design avec colonnes :
  - Type (icône investisseur) · Fonds + Part · Date · Montant · Appelé · Distribué · Valorisation · **Statut** (badge coloré) · Actions

**Statuts et couleurs** :
- `Souscription à envoyer en signature` → badge orange
- `Souscription en cours` → badge bleu
- `Valide` → badge vert

---

### 3. `/documents` — Mes documents

**Widgets** :
- Barre de recherche (`Input.Search` Ant Design)
- `DocumentExplorer` :
  - Colonne gauche : arborescence (`Tree` Ant Design) avec dossiers par fonds
  - Colonne droite : liste des documents avec colonnes Nom · Ajouté le · Taille · Badge "New" · Actions (œil + téléchargement)

---

### 4. `/secondary-market` — Marché secondaire

**Widgets** :
- Info banner : `Alert` Ant Design — "Vous pouvez vendre vos parts depuis la page souscriptions"
- Tabs par fonds (`Tabs` Ant Design)
- `SecondaryMarketCard` : carte par offre avec
  - Nom du fonds + catégorie de part
  - Nombre de parts · Prix de cession · Offre valable jusqu'au
  - Boutons `Détails` (outlined) + `Acheter` (primary)

---

## Données fictives — `data/mock.ts`

```ts
// Fonds
export const funds = [
  { id: 1, name: 'Impact Growth II', closeDate: '25/02/2029', image: '/funds/impact-growth.jpg',
    description: ['Financement early-stage pour startups innovantes', 'Accompagnement stratégique', 'Focus sur des modèles à fort potentiel'],
    docs: ['One Pager Venture II', 'Deck Venture II'] },
  { id: 2, name: 'Flex II', closeDate: '02/12/2026', image: '/funds/flex.jpg', description: ['Capital pour accélérer l\'expansion'] },
  { id: 3, name: 'Venture I', image: '/funds/venture.jpg', description: ['Solutions hybrides entre capital-développement'] },
  { id: 4, name: 'Fonds A', image: null, description: [] },
  { id: 5, name: 'Fonds B', image: null, description: [] },
];

// Souscriptions (données fictives - PAS de données réelles)
export const subscriptions = [
  { id: 1, fund: 'Fonds Licorne VI', part: 'Part A', date: '15/01/2025', amount: 100000, called: 0, distributed: 0, valuation: null, status: 'to_sign' },
  { id: 2, fund: 'Fonds Licorne VI', part: 'Part C', date: '15/01/2025', amount: 100, called: 0, distributed: 0, valuation: null, status: 'in_progress' },
  { id: 3, fund: 'Fonds Licorne VI', part: 'Part A', date: '15/01/2025', amount: 300000, called: 0, distributed: 0, valuation: null, status: 'valid' },
  { id: 4, fund: 'Flex II', part: null, date: '03/02/2025', amount: 100, called: 9.90, distributed: 0, valuation: null, status: 'valid' },
  { id: 5, fund: 'Flex II', part: 'A1', date: '09/07/2025', amount: 250000, called: 0, distributed: 0, valuation: null, status: 'in_progress' },
];

// KPIs globaux
export const portfolioKpis = {
  totalEngagement: 300100,
  totalCalled: 10,
  totalDistributed: 0,
  valuation: 125,
};

// Documents (données fictives)
export const documents = [
  { id: 1, fund: 'Fonds A', name: 'DOC - FONDS A', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 2, fund: 'Fonds A', name: 'DOC - FONDS A - Souscription S1', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 3, fund: 'Fonds A', name: 'DOC - FONDS A - Souscription S2', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 4, fund: 'Fonds B', name: 'DOC - FONDS B - Notice', type: 'PDF', size: '210.00 Ko', addedAt: '01/05/2026', isNew: false },
  { id: 5, fund: 'Fonds B', name: 'DOC - FONDS B - Bulletin S1', type: 'PDF', size: '145.00 Ko', addedAt: '01/05/2026', isNew: false },
];

// Marché secondaire
export const secondaryMarket = [
  { id: 1, fund: 'Fonds Secondaire', part: 'PART A', shares: 1000, price: 100, validUntil: '30/08/2026' },
];
```

---

## Navigation — Sidebar

```ts
export const navItems = [
  { key: 'home',             label: 'Home',               icon: 'HomeOutlined',        path: '/home' },
  { key: 'documents',        label: 'My documents',       icon: 'FolderOutlined',      path: '/documents' },
  { key: 'subscriptions',    label: 'My subscriptions',   icon: 'FileTextOutlined',    path: '/subscriptions' },
  { key: 'performances',     label: 'My Performances',    icon: 'LineChartOutlined',   path: '/performances' },
  { key: 'contacts',         label: 'My contacts',        icon: 'TeamOutlined',        path: '/contacts' },
  { key: 'funds',            label: 'Our funds',          icon: 'BankOutlined',        path: '/funds' },
  { key: 'ih-contacts',      label: 'InvestHub contacts', icon: 'ContactsOutlined',    path: '/ih-contacts' },
  { key: 'news',             label: 'News',               icon: 'ReadOutlined',        path: '/news' },
  { key: 'external-news',    label: 'External News',      icon: 'GlobalOutlined',      path: '/external-news' },
  { key: 'faq',              label: 'FAQ',                icon: 'QuestionCircleOutlined', path: '/faq' },
  { key: 'secondary-market', label: 'Marché secondaire',  icon: 'SwapOutlined',        path: '/secondary-market' },
  // Séparateur interne — section réservée équipe InvestHub
  { key: 'design-system',   label: '⚙ Design System',    icon: 'AppstoreOutlined',    path: '/design-system', devOnly: true },
];
```

---

### 5. `/design-system` — Design System

Page interne de référence — **catalogue exhaustif de tous les widgets et composants** du portail InvestHub. Accessible depuis le bas de la sidebar (icône ⚙, flag `devOnly: true` — visible en permanence dans le proto).

**Objectif** : permettre à l'équipe produit et aux GPs en démo de visualiser chaque composant isolément, avec son code source visible via "Show code".

---

#### Structure de la page

La page est organisée en **sections thématiques** avec des ancres (`#`), une **Table des matières** fixe sur la droite (sticky `Anchor` Ant Design), et un fil d'Ariane en haut.

```
/design-system
├── #fondamentaux        → Couleurs, typographie, espacements, icônes
├── #kpis                → KPI Cards (toutes variantes)
├── #tables              → Tables et tableaux de données
├── #cards               → Fund Card, Secondary Market Card
├── #badges-statuts      → StatusBadge (toutes valeurs)
├── #navigation          → Sidebar, Tabs, Breadcrumb, Pagination
├── #formulaires         → Inputs, Select, DatePicker, Checkbox, Radio
├── #feedback            → Alert, Notification, Modal, Drawer, Tooltip
├── #charts              → LinePath (NAV), BarStack, Pie (visx)
├── #documents           → DocumentExplorer, file row, tree
└── #divers              → Timeline, Carousel, Button (toutes variantes), Tag
```

---

#### Détail de chaque section

**`#fondamentaux` — Fondamentaux**

- **Palette couleurs** : grille de swatches pour chaque variable CSS (`--ih-primary`, `--ih-accent`, etc.) avec valeur hex copiable au clic
- **Typographie** : prévisualisation de chaque niveau (H1 → H4, body, caption, label) avec DM Sans
- **Espacements** : règle visuelle des tokens d'espacement (4, 8, 12, 16, 24, 32, 48, 64px)
- **Icônes** : grille des icônes Ant Design utilisées dans le projet avec leur nom

```tsx
// Exemple swatch couleur
<div style={{ background: 'var(--ih-primary)', width: 80, height: 80, borderRadius: 8 }} />
<code>#0D3D56</code>
<span>--ih-primary</span>
```

---

**`#kpis` — KPI Cards**

Toutes les variantes du composant `KpiCard` :

| Variante | Description |
|---|---|
| `default` | Valeur + label + icône (usage standard) |
| `trend-up` | Avec indicateur de tendance haussière (vert + flèche) |
| `trend-down` | Avec indicateur de tendance baissière (rouge + flèche) |
| `loading` | État skeleton (Ant Design `Skeleton`) |
| `empty` | Valeur à `0 €` ou `—` |
| `currency` | Formatage `fr-FR` avec `€` |
| `percentage` | Formatage `%` (TRI, DPI…) |

```tsx
interface KpiCardProps {
  label: string;           // "Engagement total"
  value: number | string;  // 300100
  format?: 'currency' | 'percentage' | 'number';
  trend?: number;          // +2.3 → vert, -1.5 → rouge
  icon?: ReactNode;
  loading?: boolean;
  tooltip?: string;        // info bulle (icône ?)
}
```

---

**`#tables` — Tables**

Toutes les variantes de tableaux :

| Composant | Usage |
|---|---|
| `SubscriptionTable` | Tableau souscriptions complet (colonnes, tri, filtres, pagination) |
| `SimpleDataTable` | Table générique avec colonnes configurables |
| `DocumentListTable` | Liste documents (nom, date, taille, actions) |
| `EmptyTable` | État vide avec illustration et CTA |
| `LoadingTable` | État skeleton sur 5 lignes |

Chaque table doit démontrer :
- Tri par colonne (`sorter`)
- Pagination (`pagination`)
- État vide (`locale.emptyText`)
- État chargement (`loading`)
- Lignes avec actions (icônes œil, téléchargement, suppression)

---

**`#cards` — Cards**

| Composant | Variante |
|---|---|
| `FundCard` | Avec image · Sans image (placeholder) · Avec date de clôture · Sans date |
| `SecondaryMarketCard` | Offre standard · Offre expirante (date proche, badge warning) |
| `DocumentCard` | Vue grille (alternative à la liste) |
| `NewsCard` | Carte actualité (titre, date, extrait, lien) |

---

**`#badges-statuts` — Badges & Statuts**

Toutes les valeurs du `StatusBadge` :

| Clé | Label | Couleur Ant Design |
|---|---|---|
| `to_sign` | Souscription à envoyer en signature | `warning` (orange) |
| `in_progress` | Souscription en cours | `processing` (bleu) |
| `valid` | Valide | `success` (vert) |
| `rejected` | Refusée | `error` (rouge) |
| `draft` | Brouillon | `default` (gris) |
| `new` | New | badge `New` (vert clair) |

Afficher également :
- `Tag` Ant Design (toutes couleurs)
- `Badge` avec compteur (ex : `Souscriptions 3`)

---

**`#navigation` — Navigation**

- **Sidebar** : rendu complet avec tous les items, état actif simulé
- **Tabs** : variantes `line` (défaut), `card`, `editable-card`
- **Breadcrumb** : exemple `Home / My subscriptions / Fonds Licorne VI`
- **Pagination** : composant seul, différentes tailles
- **Steps** : pour les parcours (ex : étapes de souscription)

---

**`#formulaires` — Formulaires**

Tous les champs de saisie utilisés dans le portail :

| Composant | Variantes |
|---|---|
| `Input` | Default · Disabled · Error · With prefix icon · Search |
| `Select` | Default · Multi-select · Disabled · Loading |
| `DatePicker` | Seul · RangePicker |
| `Checkbox` | Single · Group · Indeterminate |
| `Radio` | Group horizontal · Group vertical |
| `Switch` | Default · Small · Disabled |
| `Upload` | Drag & drop zone |
| `Form` | Exemple formulaire complet avec validation |

---

**`#feedback` — Feedback & Overlays**

| Composant | Description |
|---|---|
| `Alert` | Info · Success · Warning · Error (avec et sans icône, closable) |
| `Modal` | Standard · Confirmation (avec boutons Valider / Annuler) |
| `Drawer` | Gauche · Droite (comme le Show Code) · Large (640px) |
| `Tooltip` | Sur icône ? · Sur texte · Placement top/bottom/left/right |
| `Notification` | Toast success · Toast error · Toast info |
| `Spin / Skeleton` | Loading global · Skeleton card · Skeleton table |
| `Empty` | Illustration vide avec CTA |
| `Result` | Succès souscription · Erreur 404 |

---

**`#charts` — Charts & Graphiques**

Tous les graphiques visx utilisés dans le portail :

| Composant | Package visx | Données mockées |
|---|---|---|
| `PerformanceLineChart` | `@visx/shape` `LinePath` + `@visx/axis` + `@visx/scale` | Courbe NAV mensuelle sur 24 mois |
| `CapitalCallBarChart` | `@visx/shape` `BarStack` + `@visx/group` | Appels de fonds trimestriels (barres empilées) |
| `AllocationPieChart` | `@visx/shape` `Pie` + `@visx/legend` | Répartition par fonds (camembert) |
| `CashFlowAreaChart` | `@visx/shape` `AreaClosed` + `@visx/gradient` | Flux prévisionnels (area chart avec dégradé) |
| `DpiRvpiBar` | `@visx/shape` `Bar` + `@visx/group` `Group` | DPI vs RVPI par fonds (barres groupées) |

> visx est bas niveau : chaque graphique combine plusieurs packages (`@visx/scale`, `@visx/axis`, `@visx/shape`, `@visx/tooltip`, `@visx/responsive`). Utiliser `@visx/visx` (bundle complet) pour simplifier l'installation.

Chaque graphique doit être :
- Responsive via `@visx/responsive` `ParentSize`
- Avec tooltip custom via `@visx/tooltip` `useTooltip`
- Avec axes via `@visx/axis` `AxisBottom` + `AxisLeft`
- Avec couleurs du thème InvestHub (`--ih-primary`, `--ih-accent`)

---

**`#documents` — Explorateur de documents**

- `DocumentExplorer` complet (Tree + liste)
- `FileRow` : ligne de document seule (avec badge New, actions)
- `FolderTree` : arborescence seule

---

**`#divers` — Divers**

| Composant | Description |
|---|---|
| `Button` | Primary · Default · Danger · Ghost · Link · Dashed · toutes tailles (sm/md/lg) · avec icône · loading |
| `Timeline` | Frise chronologique (historique opérations) |
| `Carousel` | Diaporama (images fonds) |
| `Tag` | Toutes couleurs + versions closable |
| `Divider` | Horizontal · Vertical · Avec texte |
| `Avatar` | Initiales · Icône · Tailles |
| `Statistic` | Ant Design `Statistic` (valeur large + label) |
| `Progress` | Barre progression linéaire · Cercle (% appelé) |
| `Rate` | Non utilisé mais disponible |

---

#### Layout de la page Design System

```tsx
// app/design-system/page.tsx — structure générale
export default function DesignSystemPage() {
  return (
    <div style={{ display: 'flex', gap: 32 }}>
      {/* Contenu principal — sections empilées */}
      <div style={{ flex: 1 }}>
        <PageHeader title="Design System" subtitle="Catalogue de tous les composants du portail InvestHub" />

        {/* Chaque section */}
        <DesignSection id="fondamentaux" title="Fondamentaux">
          <ColorPalette />
          <TypographyShowcase />
          <SpacingRuler />
        </DesignSection>

        <DesignSection id="kpis" title="KPI Cards">
          <WidgetWrapper title="KpiCard" codeSource={KpiCardCode}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <KpiCard label="Engagement total" value={300100} format="currency" />
              <KpiCard label="Total appelé" value={10} format="currency" trend={2.3} />
              <KpiCard label="Total distribué" value={0} format="currency" />
              <KpiCard label="TRI net" value={12.4} format="percentage" trend={-0.5} />
            </div>
          </WidgetWrapper>
        </DesignSection>

        {/* ... autres sections */}
      </div>

      {/* Table des matières — sticky droite */}
      <Anchor
        style={{ position: 'sticky', top: 24, width: 200, flexShrink: 0 }}
        items={[
          { key: 'fondamentaux', href: '#fondamentaux', title: 'Fondamentaux' },
          { key: 'kpis', href: '#kpis', title: 'KPI Cards' },
          { key: 'tables', href: '#tables', title: 'Tables' },
          { key: 'cards', href: '#cards', title: 'Cards' },
          { key: 'badges-statuts', href: '#badges-statuts', title: 'Badges & Statuts' },
          { key: 'navigation', href: '#navigation', title: 'Navigation' },
          { key: 'formulaires', href: '#formulaires', title: 'Formulaires' },
          { key: 'feedback', href: '#feedback', title: 'Feedback' },
          { key: 'charts', href: '#charts', title: 'Charts' },
          { key: 'documents', href: '#documents', title: 'Documents' },
          { key: 'divers', href: '#divers', title: 'Divers' },
        ]}
      />
    </div>
  );
}
```

#### Composant `DesignSection` (helper)

```tsx
// Wrapper de section avec titre ancrable + séparateur
function DesignSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 64 }}>
      <Divider orientation="left">
        <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
      </Divider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </section>
  );
}
```

---

## Règles de développement

### Qualité du code
- **TypeScript strict** — pas de `any`
- Composants **fonctionnels uniquement** (hooks)
- Props typées avec `interface`
- Pas de données réelles — uniquement `data/mock.ts`

### Ant Design
- Utiliser `ConfigProvider` avec `investHubTheme` au niveau root
- Préférer les composants Ant Design natifs (Table, Tree, Tabs, Card, Badge, Drawer, Alert…)
- Ne pas surcharger les styles Ant Design — utiliser les `token` de thème

### Show Code
- **Chaque widget sur chaque page** doit avoir son bouton "Show code"
- Le code affiché doit être le **vrai code TypeScript** du composant
- Utiliser `next-raw-loader` ou stocker le code comme template string dans un fichier `*.code.ts` adjacent

### Responsive
- Le prototype est **desktop-first** (1280px+)
- La sidebar est fixe à 220px de large
- Pas besoin de mobile pour ce proto

### Sécurité des données
- ⚠️ **AUCUNE donnée réelle** dans le code (noms de clients, montants réels, emails, IBAN)
- Toutes les données sont fictives et déclarées dans `data/mock.ts`

---

## Commandes utiles

```bash
# Installation
npx create-next-app@latest investhub-portal --typescript --tailwind --app
cd investhub-portal
npm install antd @ant-design/icons @visx/visx react-syntax-highlighter @types/react-syntax-highlighter

# Dev
npm run dev

# Build + déploiement Vercel
vercel deploy
```

---

## Initialisation du projet avec Claude Code

Pour démarrer, demander à Claude Code :

```
"Crée le projet Next.js 14 avec Ant Design 5 et Tailwind CSS selon le CLAUDE.md.
Commence par :
1. Le layout global (AppLayout + Sidebar avec le thème InvestHub bleu marine)
2. Le WidgetWrapper avec Show Code (Drawer + SyntaxHighlighter)
3. La page /home avec les 4 KpiCards et la grille de FundCards
4. La page /design-system avec toutes les sections et la table des matières Anchor
Utilise uniquement les données de data/mock.ts"
```

---

*CLAUDE.md v1.1 — InvestHub Portal Prototype — Confidentiel interne*
