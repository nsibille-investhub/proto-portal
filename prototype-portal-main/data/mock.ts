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
  { id: 1, fund: 'FONDS A', name: 'DOC - FONDS A', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 2, fund: 'FONDS A', name: 'DOC - FONDS A - Souscription S1', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 3, fund: 'FONDS A', name: 'DOC - FONDS A - Souscription S2', type: 'PDF', size: '383.31 Ko', addedAt: '04/05/2026', isNew: true },
  { id: 4, fund: 'FONDS B', name: 'DOC - FONDS B - Notice', type: 'PDF', size: '210.00 Ko', addedAt: '01/05/2026', isNew: false },
  { id: 5, fund: 'FONDS B', name: 'DOC - FONDS B - Bulletin S1', type: 'PDF', size: '145.00 Ko', addedAt: '01/05/2026', isNew: false },
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

export const navPerformance = Array.from({ length: 24 }, (_, i) => {
  const date = new Date(2024, i, 1);
  return {
    date: date.toISOString().split('T')[0],
    nav: 100 + Math.round(Math.sin(i / 3) * 15 + i * 2.5),
  };
});
