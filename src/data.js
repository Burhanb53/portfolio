export const CONTACT = {
  name: 'Burhanuddin Bohra',
  email: 'burhanb53.work@gmail.com',
  phone: '+971 56 270 8253',
  tel: '+971562708253',
  whatsapp: '971562708253',
  linkedin: 'https://linkedin.com/in/burhanb53',
  github: 'https://github.com/Burhanb53',
  linktree: 'https://linktr.ee/burhanb53',
  city: 'Dubai, UAE',
  tz: 'Asia/Dubai',
};

/* Services, written so a client gets it at a glance: name → outcome → three highlighted benefits.
   <b>…</b> in a benefit is shown highlighted. */
export const SERVICES = [
  {
    id: 'web', icon: 'web', name: 'Websites', goal: 'Get more customers',
    title: 'that win you customers',
    benefits: ['Found on <b>Google</b> by new customers', 'Visitors turn into <b>enquiries & sales</b>', '<b>Online booking</b>, payments & store'],
    stack: ['Next.js', 'React.js', 'Node.js'],
  },
  {
    id: 'mobile', icon: 'mobile', name: 'Mobile Apps', goal: 'Increase sales',
    title: 'that bring customers back',
    benefits: ['<b>Repeat orders</b> & loyal customers', '<b>Push offers</b> that drive sales', 'One app for <b>Android & iPhone</b>'],
    stack: ['Flutter', 'Firebase', 'Node.js'],
  },
  {
    id: 'devops', icon: 'cloud', name: 'Servers & Cloud', goal: 'Run without breakdowns',
    title: 'that keep your business running',
    benefits: ['<b>Fast</b> pages, <b>no downtime</b>', '<b>Secure</b>, backed-up business data', '<b>Scales</b> as your business grows'],
    stack: ['Docker', 'Kubernetes', 'Terraform'],
  },
  {
    id: 'ai', icon: 'ai', name: 'Automation & AI', goal: 'Save hours every week',
    title: 'that does the repetitive work',
    benefits: ['<b>24/7 replies</b> to customers on WhatsApp', '<b>No more</b> manual data entry', 'Follow-ups & reports <b>on autopilot</b>'],
    stack: ['LangChain', 'n8n', 'WhatsApp'],
  },
];

export const SKILLS = [
  { t: 'Frontend & web', a: '#22d3ee', logo: 'React.js', s: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'PHP', 'CodeIgniter'] },
  { t: 'Backend & APIs', a: '#a3e635', logo: 'Node.js', s: ['Node.js', 'Express.js', 'REST APIs', 'RabbitMQ', 'Redis'] },
  { t: 'Mobile', a: '#38bdf8', logo: 'Flutter', s: ['Flutter', 'Dart', 'React Native', 'Firebase'] },
  { t: 'Databases', a: '#fbbf24', logo: 'PostgreSQL', s: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase'] },
  { t: 'DevOps & cloud', a: '#a78bfa', logo: 'Kubernetes', s: ['Docker', 'Kubernetes', 'Helm', 'Jenkins', 'AWS', 'Terraform', 'Linux', 'Nginx', 'GitHub Actions', 'Prometheus', 'SonarQube'] },
  { t: 'AI & tools', a: '#f472b6', logo: 'n8n', s: ['RAG', 'LangChain', 'n8n', 'Git', 'GitHub', 'Postman', 'Vercel'] },
];

export const JOURNEY = [
  {
    c: '#a78bfa', when: 'Mar 2026 – present', role: 'Co-Founder & Lead Developer', org: 'Tripez Pvt. Ltd.',
    b: ['Designed the architecture of an AI-powered travel platform', 'Built the secure Node.js backend with RabbitMQ & Redis', 'Built the complete Next.js website and booking flow'],
  },
  {
    c: '#22d3ee', when: 'Oct 2025 – Apr 2026', role: 'Software Developer, DevOps & Cloud', org: 'RoboMQ Pvt. Ltd.',
    b: ['Automated CI/CD pipelines for zero-downtime deployments', 'Kubernetes, Helm and Prometheus for product infrastructure', 'AWS infrastructure with Terraform, plus a RAG assistant for the website'],
  },
  {
    c: '#a3e635', when: 'Jun 2024 – present', role: 'Freelance Software Developer', org: 'Clients in UAE & India',
    b: ['Web apps, websites and mobile apps for e-commerce, finance, education and communities', 'Next.js, Flutter and PHP, from requirements to deployment'],
  },
  {
    c: '#fbbf24', when: '2022 – 2026', role: 'B.Tech, AI & Data Science', org: 'Poornima Institute of Engineering & Technology, Jaipur',
    b: ['Machine learning, data science and full-stack projects'],
  },
];

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'app', label: 'Web apps' },
  { id: 'site', label: 'Websites' },
  { id: 'mobile', label: 'Mobile' },
];

export const PROJECTS = [
  {
    id: 'tripez', t: 'Tripez', cat: 'AI travel platform', role: 'Co-founder · architecture, backend & web', kind: 'app', featured: true,
    url: 'https://tripez.in', host: 'tripez.in', c: '#a78bfa', img: 'img/tripez.webp',
    d: 'Plan a trip with AI and book flights, hotels, trains and packages in one place. TripAI builds personalised itineraries, and one-click cart checkout books the whole trip.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'RabbitMQ', 'Redis', 'AI'], cta: 'Visit live site',
  },
  {
    id: 'outreach', t: 'Outreach Desk', cat: 'Cold email & campaign SaaS', role: 'Product design & full-stack build', kind: 'app', featured: true,
    url: 'https://company-outreach-desk.vercel.app', host: 'company-outreach-desk.vercel.app', c: '#f472b6', img: 'img/outreach.webp',
    d: 'Cold email, follow-ups and campaigns in one place. Send from your own mailboxes, run follow-up sequences in the same thread, and track every reply in an inbox, a pipeline and automations.',
    tags: ['SaaS', 'Email sequences', 'Automations', 'A/B tests'], cta: 'Visit live site',
  },
  {
    id: 'budget', t: 'Budget & Hisaab', cat: 'Personal finance web app', role: 'Full-stack build', kind: 'app',
    url: 'https://www.budgetandhisaab.com', host: 'budgetandhisaab.com', c: '#22d3ee', img: 'img/budget.webp',
    d: 'Double-entry personal books: bank accounts and credit cards, statement imports, budgets, goals and insights, with net-worth and income-vs-expense charts.',
    tags: ['Web app', 'Double-entry', 'Statement import', 'Charts'], cta: 'Visit live site',
  },
  {
    id: 'hissab', t: 'Hissab Book', cat: 'Billing & accounting mobile app', role: 'Flutter app + Node.js API', kind: 'mobile',
    url: 'https://drive.google.com/uc?export=download&id=1dNO8XJvgd_Tr---YAtthvw16k2GocrE4', host: 'Android app', c: '#fbbf24',
    phone: ['img/hissab-1.webp', 'img/hissab-2.webp', 'img/hissab-3.webp', 'img/hissab-4.webp'],
    d: 'Billing, accounting and balance tracking for local businesses, with purchase and sales insights and WhatsApp notifications.',
    tags: ['Flutter', 'Node.js', 'Express.js', 'MongoDB'], cta: 'Download APK',
  },
  {
    id: 'factory', t: 'Factory Ledger', cat: 'Manufacturing accounting software', role: 'Private client build', kind: 'app',
    host: 'private client software', c: '#a3e635', img: 'img/factory.webp',
    d: 'Accounting for a manufacturing business: sales bills, quotations, delivery challans, credit and debit notes, suppliers, payments, and live to-collect and to-pay balances with profit tracking over time.',
    tags: ['Sales & purchases', 'GST / non-GST', 'Ledgers', 'Reports'],
  },
  {
    id: 'alyusr', t: 'AlYusr', cat: 'Community management system', role: 'Full-stack build', kind: 'app',
    url: 'https://tanzeem.in', host: 'tanzeem.in', c: '#38bdf8', img: 'img/alyusr.webp',
    d: 'Runs a whole Jamaat on one platform: Mumineen records, Raza & Miqaat, funds, Madresa and every Umoor department, with role-based access and WhatsApp reminders.',
    tags: ['PHP CodeIgniter', 'MySQL', 'RBAC', 'WhatsApp'], cta: 'Visit live site',
  },
  {
    id: 'oudaan', t: 'Oudaan Fragrances', cat: 'E-commerce store', role: 'Design & development', kind: 'site',
    url: 'https://www.oudaanfragrances.com', host: 'oudaanfragrances.com', c: '#fb7185', img: 'img/oudaan.webp',
    d: 'Luxury storefront for attars, eau de parfum and bakhoor, with collections, gift sets, samples, wishlist and cart.',
    tags: ['E-commerce', 'Catalogue', 'Checkout'], cta: 'Visit live site',
  },
  {
    id: 'vishal', t: 'Vishal Yatra', cat: 'Travel agency website', role: 'Design & development', kind: 'site',
    url: 'https://vishalyatra.vercel.app', host: 'vishalyatra.vercel.app', c: '#facc15', img: 'img/vishalyatra.webp',
    d: 'Travel agency site with packages, destinations, experiences, hotels, traveller stories and reviews, plus a plan-my-trip flow.',
    tags: ['Travel', 'Packages', 'Lead capture'], cta: 'Visit live site',
  },
  {
    id: 'college', t: 'Harish Anjana PG College', cat: 'Bilingual college website', role: 'Design & development', kind: 'site',
    url: 'https://www.harishanjanacollege.com', host: 'harishanjanacollege.com', c: '#818cf8', img: 'img/college.webp',
    d: 'Hindi + English website for a postgraduate college in Rajasthan, with courses, admissions, faculty, notices, events, gallery and an online apply flow.',
    tags: ['Education', 'Hindi / English', 'Admissions'], cta: 'Visit live site',
  },
];

export const MARQUEE = ['Next.js', 'React.js', 'Node.js', 'Flutter', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitHub Actions', 'n8n', 'TypeScript'];
