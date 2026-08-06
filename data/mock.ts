export const funds = [
  {
    id: 1,
    name: 'Impact Growth II',
    closeDate: '25/02/2029',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    fundType: 'call' as const,
    description: [
      'Financement early-stage pour startups innovantes',
      "Accompagnement stratégique et accès à un réseau d'experts",
      'Focus sur des modèles scalables et à fort potentiel',
    ],
    about: [
      'Seed to Series A uniquement : tickets de 500k€ à 5M€ dans les meilleures startups deep-tech & B2B SaaS européennes.',
      'Thèse climate-positive : 100% des sociétés en portefeuille doivent démontrer un impact CO₂ net négatif sous 5 ans.',
      "Club des ex-fondateurs : 40 entrepreneurs à succès co-investissent et accompagnent le portefeuille.",
    ],
    longDescription: "Impact Growth II (vintage 2025, cible 150M€) s'appuie sur le succès du premier véhicule en affinant la thèse : seules les entreprises technologiques capables de décarboner l'industrie ou de réinventer les infrastructures logicielles B2B passent le filtre de sélection. Le fonds mise sur des prises de participation minoritaires (10–30%) avant Series B, avec un budget réservé pour suivre les tours ultérieurs. La SG s'appuie sur un conseil scientifique de 12 experts climat pour valider chaque investissement.",
    shareClasses: [
      { id: 'A', label: 'Part A', shareValue: 10000, minimumSubscription: 100000, engagementPerShare: 4500 },
      { id: 'B', label: 'Part B', shareValue: 25000, minimumSubscription: 250000, engagementPerShare: 11000 },
    ],
    docs: ['One Pager Venture II', 'Deck Venture II'],
  },
  {
    id: 2,
    name: 'Flex II',
    closeDate: '02/12/2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    fundType: 'direct' as const,
    description: ["Capital pour accélérer l'expansion et structurer la croissance"],
    about: [
      "Stratégie flexible combinant dette privée et equity selon les opportunités de marché.",
      "Cible des PME en phase de croissance avec EBITDA positif et besoin de financement structuré.",
      "Horizon d'investissement court (3–5 ans) avec distributions régulières.",
    ],
    longDescription: "Flex II est un fonds à paiement direct dont l'objectif est de fournir des solutions de financement souples à des PME européennes en croissance. Contrairement aux fonds à appel classiques, l'investissement est libéré intégralement à la souscription, ce qui simplifie le suivi de trésorerie pour les investisseurs.",
    shareClasses: [
      { id: 'A', label: 'Part A', shareValue: 1000, minimumSubscription: 10000 },
      { id: 'B', label: 'Part B', shareValue: 5000, minimumSubscription: 50000 },
    ],
    docs: [],
  },
  {
    id: 3,
    name: 'Venture I',
    closeDate: undefined,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80',
    fundType: 'call' as const,
    description: ['Solutions hybrides entre capital-développement et dette privée'],
    about: ['Approche hybride entre capital-développement et dette privée.', 'Portefeuille diversifié de 15 à 20 participations.'],
    longDescription: "Venture I est le fonds historique d'InvestHub, clôturé en 2022. Le portefeuille est en phase de gestion active.",
    shareClasses: [
      { id: 'A', label: 'Part A', shareValue: 5000, minimumSubscription: 50000, engagementPerShare: 2000 },
    ],
    docs: [],
  },
  { id: 4, name: 'Fonds A', closeDate: undefined, image: null, fundType: 'direct' as const, description: [], about: [], longDescription: '', shareClasses: [{ id: 'A', label: 'Part A', shareValue: 1000, minimumSubscription: 5000 }], docs: [] },
  { id: 5, name: 'Fonds B', closeDate: undefined, image: null, fundType: 'call' as const, description: [], about: [], longDescription: '', shareClasses: [{ id: 'A', label: 'Part A', shareValue: 2000, minimumSubscription: 20000, engagementPerShare: 800 }], docs: [] },
  {
    id: 6,
    name: 'Fonds Secondaire',
    closeDate: undefined,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    fundType: 'call' as const,
    description: ['Cession de parts sur le marché secondaire', 'Capital partiellement appelé — engagement résiduel à reprendre'],
    about: [
      'Millésime 2021, en phase de gestion active avec 42% du capital appelé à ce jour.',
      'Stratégie diversifiée couvrant 12 participations dans les secteurs tech et industrie.',
      'Prochains appels de fonds estimés sur 24 mois, horizon de cession 2028.',
    ],
    longDescription: "Fonds Secondaire est un véhicule fermé dont des parts sont proposées à la cession par des investisseurs existants via la plateforme de marché secondaire InvestHub. L'acheteur reprend l'engagement non appelé du cédant et bénéficie d'une exposition immédiate au portefeuille sous-jacent.",
    shareClasses: [
      { id: 'A', label: 'Part A', shareValue: 118.50, minimumSubscription: 118.50, engagementPerShare: 68.50 },
      { id: 'B', label: 'Part B', shareValue: 118.50, minimumSubscription: 118.50, engagementPerShare: 68.50 },
    ],
    docs: [],
  },
];

export const subscriptions = [
  { id: 1, fund: 'Fonds Licorne VI', part: 'Part A', date: '15/01/2025', amount: 100000, called: 0, distributed: 0, valuation: null, status: 'to_sign', fundType: 'call' as const, investor: 'Sophie Blanchard' },
  { id: 2, fund: 'Fonds Licorne VI', part: 'Part C', date: '15/01/2025', amount: 100, called: 0, distributed: 0, valuation: null, status: 'in_progress', fundType: 'call' as const, investor: 'Marc Lefebvre' },
  { id: 3, fund: 'Fonds Licorne VI', part: 'Part A', date: '15/01/2025', amount: 300000, called: 75000, distributed: 0, valuation: null, status: 'valid', fundType: 'call' as const, navPerShare: 1080, navDate: '30/04/2026', shares: 300, investor: 'Hélène Rousseau' },
  { id: 4, fund: 'Flex II', part: null, date: '03/02/2025', amount: 100, called: 100, distributed: 0, valuation: null, status: 'valid', fundType: 'direct' as const, navPerShare: 105.50, navDate: '30/04/2026', shares: 1, investor: 'Paul Moreau' },
  { id: 5, fund: 'Flex II', part: 'A1', date: '09/07/2025', amount: 250000, called: 0, distributed: 0, valuation: null, status: 'in_progress', fundType: 'direct' as const, investor: 'Claire Fontaine' },
  { id: 6, fund: 'Impact Growth II', part: 'Part A', date: '12/04/2026', amount: 50000, called: 0, distributed: 0, valuation: null, status: 'study', fundType: 'call' as const, investor: 'Jean-Pierre Durand' },
];

export const kycValidations: Record<number, {
  investorName: string;
  part: string;
  partValue: number;
  entryFees: number;
  sections: {
    id: string;
    title: string;
    fields: { question: string; answer: string }[];
  }[];
}> = {
  6: {
    investorName: 'Jean-Pierre Durand',
    part: 'Part A',
    partValue: 50000,
    entryFees: 0,
    sections: [
      {
        id: 'identity',
        title: 'Identité',
        fields: [
          { question: 'Prénom*', answer: 'Jean-Pierre' },
          { question: 'Nom*', answer: 'Durand' },
          { question: 'Soumis à l\'IFI*', answer: 'Non' },
        ],
      },
      {
        id: 'address',
        title: 'Coordonnées',
        fields: [
          { question: 'Adresse*', answer: '8 rue de la République' },
          { question: 'Code postal*', answer: '69001' },
          { question: 'Ville*', answer: 'Lyon' },
          { question: 'Pays*', answer: 'France' },
        ],
      },
      {
        id: 'profile',
        title: 'Profil investisseur',
        fields: [
          { question: "Catégorie d'investisseur*", answer: 'Professionnel par nature' },
          { question: 'Revenus annuels*', answer: 'Entre 100 000 € et 300 000 €' },
          { question: 'Expérience en investissement*', answer: 'Plus de 5 ans' },
        ],
      },
    ],
  },
};

export const kycDocuments: Record<number, {
  id: string;
  name: string;
  sentAt: string;
  expiresAt: string | null;
  expired?: boolean;
}[]> = {
  6: [
    { id: 'doc1', name: "Document d'identité valide et complet du souscripteur", sentAt: '19/05/2026 16:10', expiresAt: '01/01/1970', expired: true },
    { id: 'doc2', name: 'Justificatif de domicile de moins de 3 mois', sentAt: '19/05/2026 16:10', expiresAt: null },
    { id: 'doc3', name: "Avis d'imposition justifiant de l'origine des fonds et/ou du domicile", sentAt: '19/05/2026 16:10', expiresAt: null },
    { id: 'doc4', name: "Justificatif d'origine des fonds — Succession / Donation", sentAt: '19/05/2026 16:10', expiresAt: null },
    { id: 'doc5', name: 'RIB de distribution', sentAt: '19/05/2026 16:10', expiresAt: null },
  ],
};

export const portfolioKpis = {
  totalEngagement: 300100,
  totalCalled: 10,
  totalDistributed: 0,
  valuation: 125,
};

export const documents = [
  // Impact Growth II — Reporting
  { id: 1, fund: 'Impact Growth II', category: 'reporting', name: 'Rapport trimestriel T1 2026', type: 'PDF', size: '2.4 Mo', addedAt: '15/04/2026', isNew: true },
  { id: 2, fund: 'Impact Growth II', category: 'reporting', name: 'Rapport annuel 2025', type: 'PDF', size: '8.1 Mo', addedAt: '28/02/2026', isNew: false },
  { id: 3, fund: 'Impact Growth II', category: 'reporting', name: 'Factsheet Q1 2026', type: 'PDF', size: '540 Ko', addedAt: '15/04/2026', isNew: true },
  { id: 23, fund: 'Impact Growth II', category: 'reporting', name: 'Rapport annuel 2024', type: 'PDF', size: '7.8 Mo', addedAt: '01/03/2025', isNew: false },
  { id: 24, fund: 'Impact Growth II', category: 'reporting', name: 'Factsheet Q4 2025', type: 'PDF', size: '510 Ko', addedAt: '15/01/2026', isNew: false },
  // Impact Growth II — Juridique
  { id: 4, fund: 'Impact Growth II', category: 'legal', name: 'DICI Impact Growth II', type: 'PDF', size: '1.2 Mo', addedAt: '10/01/2026', isNew: false },
  { id: 5, fund: 'Impact Growth II', category: 'legal', name: 'Règlement du fonds', type: 'PDF', size: '890 Ko', addedAt: '10/01/2025', isNew: false },
  // Impact Growth II — Souscriptions
  { id: 6, fund: 'Impact Growth II', category: 'souscriptions', name: 'Bulletin de souscription Part A', type: 'PDF', size: '320 Ko', addedAt: '12/04/2026', isNew: true },
  { id: 7, fund: 'Impact Growth II', category: 'souscriptions', name: 'Attestation de souscription', type: 'PDF', size: '180 Ko', addedAt: '12/04/2025', isNew: false },
  // Impact Growth II — Appels de fonds
  { id: 8, fund: 'Impact Growth II', category: 'appels_fonds', name: "Avis d'appel de fonds #3", type: 'PDF', size: '275 Ko', addedAt: '01/04/2026', isNew: true },
  { id: 25, fund: 'Impact Growth II', category: 'appels_fonds', name: "Avis d'appel de fonds #2", type: 'PDF', size: '260 Ko', addedAt: '15/10/2025', isNew: false },
  { id: 26, fund: 'Impact Growth II', category: 'appels_fonds', name: "Avis d'appel de fonds #1", type: 'PDF', size: '245 Ko', addedAt: '01/06/2025', isNew: false },
  // Flex II — Reporting
  { id: 9, fund: 'Flex II', category: 'reporting', name: 'Reporting mensuel Mars 2026', type: 'XLSX', size: '1.8 Mo', addedAt: '05/04/2026', isNew: true },
  { id: 10, fund: 'Flex II', category: 'reporting', name: 'Rapport semestriel S2 2025', type: 'PDF', size: '5.3 Mo', addedAt: '15/01/2026', isNew: false },
  { id: 27, fund: 'Flex II', category: 'reporting', name: 'Reporting mensuel Décembre 2025', type: 'XLSX', size: '1.6 Mo', addedAt: '10/01/2026', isNew: false },
  { id: 28, fund: 'Flex II', category: 'reporting', name: 'Rapport semestriel S1 2025', type: 'PDF', size: '4.9 Mo', addedAt: '20/07/2025', isNew: false },
  // Flex II — Souscriptions
  { id: 11, fund: 'Flex II', category: 'souscriptions', name: 'Confirmation de souscription', type: 'PDF', size: '210 Ko', addedAt: '03/02/2025', isNew: false },
  // Flex II — Fiscalité
  { id: 12, fund: 'Flex II', category: 'fiscalite', name: 'IFU 2025', type: 'PDF', size: '420 Ko', addedAt: '15/03/2026', isNew: true },
  { id: 13, fund: 'Flex II', category: 'fiscalite', name: 'Attestation fiscale 2025', type: 'PDF', size: '185 Ko', addedAt: '15/03/2026', isNew: false },
  { id: 29, fund: 'Flex II', category: 'fiscalite', name: 'IFU 2024', type: 'PDF', size: '395 Ko', addedAt: '20/03/2025', isNew: false },
  // Flex II — Distributions
  { id: 14, fund: 'Flex II', category: 'distributions', name: 'Avis de distribution Q4 2025', type: 'PDF', size: '290 Ko', addedAt: '20/01/2026', isNew: false },
  { id: 30, fund: 'Flex II', category: 'distributions', name: 'Avis de distribution Q2 2025', type: 'PDF', size: '275 Ko', addedAt: '15/07/2025', isNew: false },
  // Venture I
  { id: 15, fund: 'Venture I', category: 'reporting', name: 'Rapport annuel 2025', type: 'PDF', size: '6.7 Mo', addedAt: '01/03/2026', isNew: false },
  { id: 16, fund: 'Venture I', category: 'legal', name: 'Statuts du fonds', type: 'PDF', size: '1.5 Mo', addedAt: '15/06/2022', isNew: false },
  { id: 17, fund: 'Venture I', category: 'appels_fonds', name: 'Récapitulatif appels de fonds', type: 'XLSX', size: '980 Ko', addedAt: '10/02/2026', isNew: false },
  { id: 18, fund: 'Venture I', category: 'distributions', name: 'Avis de distribution annuelle 2025', type: 'PDF', size: '310 Ko', addedAt: '15/02/2026', isNew: false },
  // Fonds Secondaire
  { id: 19, fund: 'Fonds Secondaire', category: 'reporting', name: 'NAV Report Q1 2026', type: 'XLSX', size: '1.1 Mo', addedAt: '20/04/2026', isNew: true },
  { id: 20, fund: 'Fonds Secondaire', category: 'legal', name: "Notice d'information", type: 'PDF', size: '2.3 Mo', addedAt: '01/09/2025', isNew: false },
  { id: 21, fund: 'Fonds Secondaire', category: 'souscriptions', name: 'Bulletin de cession Part A', type: 'PDF', size: '340 Ko', addedAt: '15/05/2026', isNew: true },
  { id: 22, fund: 'Fonds Secondaire', category: 'appels_fonds', name: "Calendrier prévisionnel d'appels", type: 'PDF', size: '150 Ko', addedAt: '01/01/2026', isNew: false },
];

export const secondaryMarket = [
  {
    id: 1,
    fundId: 6,
    fund: 'Fonds Secondaire',
    part: 'PART A',
    shares: 1000,
    price: 100,
    validUntil: '30/08/2026',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    navPerShare: 118.50,
    navDate: '30/04/2026',
    status: 'available' as const,
    fundType: 'call' as const,
    calledPct: 42,
    engagementPerShare: 68.50,
  },
  {
    id: 2,
    fundId: 6,
    fund: 'Fonds Secondaire',
    part: 'PART B',
    shares: 500,
    price: 95,
    validUntil: '15/07/2026',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    navPerShare: 118.50,
    navDate: '30/04/2026',
    status: 'pending' as const,
    pendingSince: '12/05/2026',
    fundType: 'call' as const,
    calledPct: 42,
    engagementPerShare: 68.50,
  },
  {
    id: 3,
    fundId: 1,
    fund: 'Impact Growth II',
    part: 'PART A',
    shares: 250,
    price: 210,
    validUntil: '01/09/2026',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
    navPerShare: 198.75,
    navDate: '30/04/2026',
    status: 'available' as const,
    fundType: 'direct' as const,
  },
];

export const redemptions = [
  { id: 1, subscriptionId: 3, date: '28/04/2026', shares: 50, amount: 54000, status: 'to_sign' as const, docName: null },
  { id: 2, subscriptionId: 3, date: '15/03/2026', shares: 30, amount: 32400, status: 'to_sign' as const, docName: 'Bulletin rachat S1' },
  { id: 3, subscriptionId: 3, date: '10/01/2026', shares: 20, amount: 21600, status: 'valid' as const, docName: 'Bulletin rachat S2' },
];

export const partners = [
  { id: 1, name: 'Cabinet Dupont & Associés', email: 'contact@cabinet-dupont.fr', activatedFunds: ['Impact Growth II', 'Flex II'], investorsCount: 12, subscriptionsCount: 8, status: 'active' as const, siren: '123 456 789', orias: '12 001 234', city: 'Paris' },
  { id: 2, name: 'Leclerc Patrimoine', email: 'p.leclerc@patrimoine-conseil.fr', activatedFunds: ['Flex II'], investorsCount: 5, subscriptionsCount: 3, status: 'active' as const, siren: '987 654 321', orias: '12 005 678', city: 'Lyon' },
  { id: 3, name: 'Fontaine Invest', email: 'contact@fontaine-invest.fr', activatedFunds: ['Impact Growth II'], investorsCount: 3, subscriptionsCount: 2, status: 'pending' as const, siren: '456 789 123', orias: '12 009 012', city: 'Bordeaux' },
];

export const userProfiles = {
  lp: {
    email: 'cyril.chomette@investhub.cloud',
    firstName: 'Cyril',
    lastName: 'Chomette',
    phone: '0033660432754',
    country: 'France',
    role: 'LP' as const,
  },
  distributor: {
    email: 'marie.laurent@patrimoine-conseil.fr',
    firstName: 'Marie',
    lastName: 'Laurent',
    phone: '0033145789012',
    country: 'France',
    company: 'Cabinet Laurent & Associés',
    orias: '12 003 456',
    role: 'Distributeur' as const,
  },
};

export const notificationTypes = [
  { value: 'capital_calls', label: 'Appels de fonds' },
  { value: 'reporting', label: 'Reporting trimestriel / annuel' },
  { value: 'distributions', label: 'Distributions' },
  { value: 'documents', label: 'Nouveaux documents' },
  { value: 'subscriptions', label: 'Souscriptions' },
  { value: 'secondary_market', label: 'Marché secondaire' },
  { value: 'nav_updates', label: 'Mises à jour NAV' },
  { value: 'compliance', label: 'Conformité / KYC' },
];

export const structures = [
  { value: 'sci_chomette', label: 'SCI Chomette Patrimoine' },
  { value: 'holding_cc', label: 'Holding CC Invest' },
  { value: 'pp_chomette', label: 'Cyril Chomette (personne physique)' },
];

export interface LpContact {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  language: 'fr' | 'en';
  hasPortalAccess: boolean;
  structures: string[] | 'all';
  fundRestrictions: string[] | 'all';
  subscriptionRestrictions: number[] | 'all';
  notifications: string[] | 'all';
}

export const lpContacts: LpContact[] = [
  {
    id: 1,
    lastName: 'Cavallaro',
    firstName: 'Deborah',
    email: 'deborah.cavallaro+65@investhub.cloud',
    phone: '+33 6 12 34 56 78',
    language: 'fr',
    hasPortalAccess: true,
    structures: ['sci_chomette', 'holding_cc'],
    fundRestrictions: ['Impact Growth II', 'Flex II'],
    subscriptionRestrictions: [1, 3],
    notifications: ['capital_calls', 'reporting', 'distributions'],
  },
  {
    id: 2,
    lastName: 'Moreau',
    firstName: 'Antoine',
    email: 'antoine.moreau@cabinet-gestion.fr',
    phone: '+33 1 45 67 89 01',
    language: 'fr',
    hasPortalAccess: true,
    structures: 'all',
    fundRestrictions: 'all',
    subscriptionRestrictions: 'all',
    notifications: 'all',
  },
  {
    id: 3,
    lastName: 'Bernard',
    firstName: 'Sophie',
    email: 'sophie.bernard@notaire-bernard.fr',
    phone: '+33 4 78 90 12 34',
    language: 'fr',
    hasPortalAccess: false,
    structures: [],
    fundRestrictions: [],
    subscriptionRestrictions: [],
    notifications: [],
  },
  {
    id: 4,
    lastName: 'Fischer',
    firstName: 'Thomas',
    email: 'thomas.fischer@compliance-partners.eu',
    phone: '+33 6 98 76 54 32',
    language: 'en',
    hasPortalAccess: true,
    structures: ['pp_chomette'],
    fundRestrictions: ['Venture I', 'Fonds Secondaire'],
    subscriptionRestrictions: [4, 5],
    notifications: ['compliance', 'documents', 'nav_updates'],
  },
];

export interface StructureContact {
  contactId: number;
  role: 'admin' | 'viewer' | 'signatory' | 'accountant';
}

export interface StructureUbo {
  contactId: number;
  ownershipPct: number;
  directHolding: boolean;
  declarationDate: string;
}

export interface StructureKeyPerson {
  contactId: number;
  function: string;
  startDate: string;
}

export interface KycDocument {
  id: string;
  name: string;
  category: 'common' | 'structure';
  status: 'validated' | 'pending_review' | 'rejected' | 'expired' | 'missing';
  uploadedAt: string | null;
  expiresAt: string | null;
  comment?: string;
}

export interface KycQuestion {
  id: string;
  question: string;
  answer: string | null;
  status: 'validated' | 'pending' | 'rejected' | 'not_started';
}

export interface KycSection {
  id: string;
  title: string;
  category: 'common' | 'structure';
  questions: KycQuestion[];
}

export interface StructureKyc {
  status: 'complete' | 'in_progress' | 'action_required' | 'not_started';
  lastUpdated: string;
  completionPct: number;
  documents: KycDocument[];
  sections: KycSection[];
}

export interface InvestmentStructure {
  id: string;
  name: string;
  type: 'moral' | 'physical';
  legalForm: string;
  siren: string;
  siret: string;
  rcs: string;
  capital: number;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  createdAt: string;
  nafCode: string;
  nafLabel: string;
  status: 'active' | 'inactive' | 'en_cours';
  contacts: StructureContact[];
  ubos: StructureUbo[];
  keyPeople: StructureKeyPerson[];
  subscriptionIds: number[];
  kyc: StructureKyc;
}

const COMMON_DOCS_VALIDATED: KycDocument[] = [
  { id: 'common_id', name: "Pièce d'identité (CNI / Passeport)", category: 'common', status: 'validated', uploadedAt: '10/01/2024', expiresAt: '10/01/2034' },
  { id: 'common_domicile', name: 'Justificatif de domicile de moins de 3 mois', category: 'common', status: 'validated', uploadedAt: '15/04/2026', expiresAt: '15/07/2026' },
  { id: 'common_tax', name: "Avis d'imposition (dernière année)", category: 'common', status: 'validated', uploadedAt: '01/09/2025', expiresAt: null },
  { id: 'common_rib', name: 'RIB / IBAN de distribution', category: 'common', status: 'validated', uploadedAt: '10/01/2024', expiresAt: null },
  { id: 'common_lcbft', name: 'Questionnaire LCB-FT (lutte anti-blanchiment)', category: 'common', status: 'validated', uploadedAt: '10/01/2024', expiresAt: null },
  { id: 'common_ppe', name: 'Attestation PPE (Personne Politiquement Exposée)', category: 'common', status: 'validated', uploadedAt: '10/01/2024', expiresAt: '10/01/2027' },
];

const COMMON_SECTIONS_VALIDATED: KycSection[] = [
  {
    id: 'identity', title: 'Identité du souscripteur', category: 'common',
    questions: [
      { id: 'q_firstname', question: 'Prénom', answer: 'Cyril', status: 'validated' },
      { id: 'q_lastname', question: 'Nom', answer: 'Chomette', status: 'validated' },
      { id: 'q_birthdate', question: 'Date de naissance', answer: '15/03/1978', status: 'validated' },
      { id: 'q_nationality', question: 'Nationalité', answer: 'Française', status: 'validated' },
      { id: 'q_birthplace', question: 'Lieu de naissance', answer: 'Paris (75)', status: 'validated' },
    ],
  },
  {
    id: 'tax_residence', title: 'Résidence fiscale', category: 'common',
    questions: [
      { id: 'q_tax_country', question: 'Pays de résidence fiscale', answer: 'France', status: 'validated' },
      { id: 'q_tin', question: 'Numéro d\'identification fiscale (NIF)', answer: '1 78 03 75 108 042 35', status: 'validated' },
      { id: 'q_ifi', question: 'Assujetti à l\'IFI ?', answer: 'Non', status: 'validated' },
      { id: 'q_fatca', question: 'US Person (FATCA)', answer: 'Non', status: 'validated' },
    ],
  },
  {
    id: 'investor_profile', title: 'Profil investisseur', category: 'common',
    questions: [
      { id: 'q_category', question: 'Catégorie d\'investisseur', answer: 'Investisseur averti (article 423-49 RGAMF)', status: 'validated' },
      { id: 'q_experience', question: 'Expérience en capital-investissement', answer: 'Plus de 5 ans', status: 'validated' },
      { id: 'q_patrimony', question: 'Patrimoine financier estimé', answer: '> 500 000 €', status: 'validated' },
      { id: 'q_revenue', question: 'Revenus annuels nets', answer: '> 150 000 €', status: 'validated' },
      { id: 'q_risk', question: 'Tolérance au risque', answer: 'Élevée — accepte une perte en capital', status: 'validated' },
    ],
  },
];

export const investmentStructures: InvestmentStructure[] = [
  {
    id: 'sci_chomette',
    name: 'SCI Chomette Patrimoine',
    type: 'moral',
    legalForm: 'SCI',
    siren: '892 145 367',
    siret: '892 145 367 00012',
    rcs: 'Paris B 892 145 367',
    capital: 50000,
    address: '24 rue de Rivoli',
    postalCode: '75004',
    city: 'Paris',
    country: 'France',
    createdAt: '12/03/2019',
    nafCode: '6820A',
    nafLabel: 'Location de logements',
    status: 'active',
    contacts: [
      { contactId: 1, role: 'admin' },
      { contactId: 2, role: 'accountant' },
    ],
    ubos: [
      { contactId: 0, ownershipPct: 60, directHolding: true, declarationDate: '15/01/2024' },
      { contactId: 1, ownershipPct: 40, directHolding: true, declarationDate: '15/01/2024' },
    ],
    keyPeople: [
      { contactId: 0, function: 'Gérant', startDate: '12/03/2019' },
    ],
    subscriptionIds: [1, 3],
    kyc: {
      status: 'complete',
      lastUpdated: '15/04/2026',
      completionPct: 100,
      documents: [
        ...COMMON_DOCS_VALIDATED,
        { id: 'str_kbis', name: 'Extrait Kbis de moins de 3 mois', category: 'structure', status: 'validated', uploadedAt: '20/04/2026', expiresAt: '20/07/2026' },
        { id: 'str_statuts', name: 'Statuts à jour (certifiés conformes)', category: 'structure', status: 'validated', uploadedAt: '12/03/2024', expiresAt: null },
        { id: 'str_pv', name: 'PV de nomination du gérant', category: 'structure', status: 'validated', uploadedAt: '12/03/2019', expiresAt: null },
        { id: 'str_dbe', name: 'Déclaration des bénéficiaires effectifs (DBE)', category: 'structure', status: 'validated', uploadedAt: '15/01/2024', expiresAt: null },
        { id: 'str_bilan', name: 'Dernier bilan / liasse fiscale', category: 'structure', status: 'validated', uploadedAt: '30/06/2025', expiresAt: null },
      ],
      sections: [
        ...COMMON_SECTIONS_VALIDATED,
        {
          id: 'structure_info', title: 'Informations de la structure', category: 'structure',
          questions: [
            { id: 'q_denomination', question: 'Dénomination sociale', answer: 'SCI Chomette Patrimoine', status: 'validated' },
            { id: 'q_legal_form', question: 'Forme juridique', answer: 'Société Civile Immobilière', status: 'validated' },
            { id: 'q_siren', question: 'Numéro SIREN', answer: '892 145 367', status: 'validated' },
            { id: 'q_activity', question: 'Objet social', answer: 'Acquisition et gestion de biens immobiliers', status: 'validated' },
            { id: 'q_creation_date', question: 'Date de création', answer: '12/03/2019', status: 'validated' },
          ],
        },
        {
          id: 'origin_funds', title: 'Origine des fonds', category: 'structure',
          questions: [
            { id: 'q_origin', question: 'Source principale des fonds investis', answer: 'Revenus professionnels + patrimoine immobilier', status: 'validated' },
            { id: 'q_origin_detail', question: 'Détail complémentaire', answer: 'Cession partielle d\'un bien immobilier en 2022', status: 'validated' },
          ],
        },
      ],
    },
  },
  {
    id: 'holding_cc',
    name: 'Holding CC Invest',
    type: 'moral',
    legalForm: 'SAS',
    siren: '918 234 561',
    siret: '918 234 561 00018',
    rcs: 'Lyon B 918 234 561',
    capital: 200000,
    address: '15 place Bellecour',
    postalCode: '69002',
    city: 'Lyon',
    country: 'France',
    createdAt: '08/06/2021',
    nafCode: '6420Z',
    nafLabel: 'Activités des sociétés holding',
    status: 'active',
    contacts: [
      { contactId: 1, role: 'viewer' },
      { contactId: 2, role: 'admin' },
      { contactId: 4, role: 'signatory' },
    ],
    ubos: [
      { contactId: 0, ownershipPct: 100, directHolding: true, declarationDate: '20/06/2021' },
    ],
    keyPeople: [
      { contactId: 0, function: 'Président', startDate: '08/06/2021' },
      { contactId: 2, function: 'Directeur Général', startDate: '01/09/2022' },
    ],
    subscriptionIds: [2, 4, 5],
    kyc: {
      status: 'action_required',
      lastUpdated: '02/07/2026',
      completionPct: 68,
      documents: [
        ...COMMON_DOCS_VALIDATED.map(d =>
          d.id === 'common_domicile'
            ? { ...d, status: 'expired' as const, expiresAt: '15/04/2026', comment: 'Justificatif expiré — veuillez fournir un document de moins de 3 mois' }
            : d
        ),
        { id: 'str_kbis', name: 'Extrait Kbis de moins de 3 mois', category: 'structure' as const, status: 'expired' as const, uploadedAt: '10/01/2026', expiresAt: '10/04/2026', comment: 'Kbis expiré depuis le 10/04/2026' },
        { id: 'str_statuts', name: 'Statuts à jour (certifiés conformes)', category: 'structure' as const, status: 'validated' as const, uploadedAt: '08/06/2024', expiresAt: null },
        { id: 'str_pv', name: 'PV de nomination du président', category: 'structure' as const, status: 'validated' as const, uploadedAt: '08/06/2021', expiresAt: null },
        { id: 'str_dbe', name: 'Déclaration des bénéficiaires effectifs (DBE)', category: 'structure' as const, status: 'pending_review' as const, uploadedAt: '02/07/2026', expiresAt: null },
        { id: 'str_bilan', name: 'Dernier bilan / liasse fiscale', category: 'structure' as const, status: 'missing' as const, uploadedAt: null, expiresAt: null, comment: 'Bilan 2025 non encore transmis' },
        { id: 'str_vigilance', name: 'Attestation de vigilance URSSAF', category: 'structure' as const, status: 'missing' as const, uploadedAt: null, expiresAt: null },
      ],
      sections: [
        ...COMMON_SECTIONS_VALIDATED,
        {
          id: 'structure_info', title: 'Informations de la structure', category: 'structure',
          questions: [
            { id: 'q_denomination', question: 'Dénomination sociale', answer: 'Holding CC Invest', status: 'validated' },
            { id: 'q_legal_form', question: 'Forme juridique', answer: 'Société par Actions Simplifiée', status: 'validated' },
            { id: 'q_siren', question: 'Numéro SIREN', answer: '918 234 561', status: 'validated' },
            { id: 'q_activity', question: 'Objet social', answer: 'Prise de participations et gestion de portefeuille', status: 'validated' },
            { id: 'q_creation_date', question: 'Date de création', answer: '08/06/2021', status: 'validated' },
          ],
        },
        {
          id: 'origin_funds', title: 'Origine des fonds', category: 'structure',
          questions: [
            { id: 'q_origin', question: 'Source principale des fonds investis', answer: 'Apports en capital + compte courant d\'associé', status: 'validated' },
            { id: 'q_origin_detail', question: 'Détail complémentaire', answer: null, status: 'not_started' },
          ],
        },
      ],
    },
  },
  {
    id: 'pp_chomette',
    name: 'Cyril Chomette',
    type: 'physical',
    legalForm: 'Personne physique',
    siren: '',
    siret: '',
    rcs: '',
    capital: 0,
    address: '24 rue de Rivoli',
    postalCode: '75004',
    city: 'Paris',
    country: 'France',
    createdAt: '01/01/2020',
    nafCode: '',
    nafLabel: '',
    status: 'active',
    contacts: [
      { contactId: 4, role: 'viewer' },
    ],
    ubos: [],
    keyPeople: [],
    subscriptionIds: [6],
    kyc: {
      status: 'in_progress',
      lastUpdated: '20/07/2026',
      completionPct: 82,
      documents: [
        ...COMMON_DOCS_VALIDATED,
        { id: 'str_origin_funds', name: "Justificatif d'origine des fonds", category: 'structure', status: 'pending_review', uploadedAt: '20/07/2026', expiresAt: null },
        { id: 'str_patrimony', name: 'Déclaration de patrimoine', category: 'structure', status: 'missing', uploadedAt: null, expiresAt: null },
      ],
      sections: [
        ...COMMON_SECTIONS_VALIDATED,
        {
          id: 'origin_funds', title: 'Origine des fonds', category: 'structure',
          questions: [
            { id: 'q_origin', question: 'Source principale des fonds investis', answer: 'Revenus professionnels (activité salariée)', status: 'validated' },
            { id: 'q_origin_detail', question: 'Détail complémentaire', answer: null, status: 'pending' },
            { id: 'q_heritage', question: 'Héritage ou donation ?', answer: 'Non', status: 'validated' },
          ],
        },
      ],
    },
  },
];

export const navPerformance = Array.from({ length: 24 }, (_, i) => {
  const date = new Date(2024, i, 1);
  return {
    date: date.toISOString().split('T')[0],
    nav: 100 + Math.round(Math.sin(i / 3) * 15 + i * 2.5),
  };
});
