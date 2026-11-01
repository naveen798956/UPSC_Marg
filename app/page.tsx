'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Map as MapIcon, BookOpen, Globe, 
  FileText, HelpCircle, Edit3, Clock, RotateCcw, 
  Search, RefreshCw, Bookmark, Sparkles, ExternalLink
} from 'lucide-react';

// Complete Official Syllabus Taxonomy
const OFFICIAL_SYLLABUS = [
  // GS-1
  { id: 'GS1-01', paper: 'GS1', section: 'Art & Culture', title: 'Indian culture: Salient aspects of Art Forms, Literature and Architecture from ancient to modern times', source: 'Nitin Singhania / NCERT Class 11 Fine Arts' },
  { id: 'GS1-02', paper: 'GS1', section: 'Modern History', title: 'Modern Indian history from about the middle of the eighteenth century until the present: significant events, personalities, issues', source: 'Spectrum (Rajiv Ahir) / Bipan Chandra' },
  { id: 'GS1-03', paper: 'GS1', section: 'Freedom Struggle', title: 'The Freedom Struggle: its various stages and important contributors/contributions from different parts of the country', source: 'Spectrum / Bipan Chandra (India’s Struggle for Independence)' },
  { id: 'GS1-04', paper: 'GS1', section: 'Post-Independence', title: 'Post-independence consolidation and reorganisation within the country', source: 'NCERT Class 12 Politics in India since Independence' },
  { id: 'GS1-05', paper: 'GS1', section: 'World History', title: 'History of the world: Industrial Revolution, world wars, redrawal of national boundaries, colonization, decolonization', source: 'Norman Lowe / NCERT World History' },
  { id: 'GS1-06', paper: 'GS1', section: 'World History', title: 'Political philosophies like communism, capitalism, socialism: their forms and effect on society', source: 'Norman Lowe / Class 9-10 NCERT' },
  { id: 'GS1-07', paper: 'GS1', section: 'Society', title: 'Salient features of Indian Society, Diversity of India', source: 'NCERT Class 12 Indian Society / Ram Ahuja' },
  { id: 'GS1-08', paper: 'GS1', section: 'Society', title: 'Role of women and women’s organizations, population issues, poverty, urbanization, problems and remedies', source: 'NCERT / Current Affairs & NITI Aayog' },
  { id: 'GS1-09', paper: 'GS1', section: 'Society', title: 'Effects of globalization on Indian society', source: 'NCERT Class 12 Social Change and Development in India' },
  { id: 'GS1-10', paper: 'GS1', section: 'Society', title: 'Social empowerment, communalism, regionalism & secularism', source: 'Ram Ahuja / NCERT Indian Society' },
  { id: 'GS1-11', paper: 'GS1', section: 'Geography', title: 'Salient features of world’s physical geography', source: 'GC Leong / NCERT Class 11 Fundamentals of Physical Geography' },
  { id: 'GS1-12', paper: 'GS1', section: 'Geography', title: 'Distribution of key natural resources across the world; location factors of primary, secondary, and tertiary industries', source: 'NCERT Class 12 Human Geography / GC Leong' },
  { id: 'GS1-13', paper: 'GS1', section: 'Geography', title: 'Important Geophysical phenomena: earthquakes, Tsunami, Volcanic activity, cyclones, flora/fauna changes', source: 'NCERT Class 11 / PMF IAS Geography' },

  // GS-2
  { id: 'GS2-01', paper: 'GS2', section: 'Constitution', title: 'Indian Constitution: historical underpinnings, evolution, features, amendments, significant provisions and basic structure', source: 'M. Laxmikanth (7th Ed) / DD Basu' },
  { id: 'GS2-02', paper: 'GS2', section: 'Federalism', title: 'Functions and responsibilities of Union and States, issues of federal structure, devolution of finances to local levels', source: 'M. Laxmikanth / Punchhi Commission Report' },
  { id: 'GS2-03', paper: 'GS2', section: 'Polity', title: 'Separation of powers between various organs, dispute redressal mechanisms and institutions', source: 'M. Laxmikanth / Subhash Kashyap' },
  { id: 'GS2-04', paper: 'GS2', section: 'Comparative Polity', title: 'Comparison of the Indian constitutional scheme with that of other countries (UK, USA, France, etc.)', source: 'M. Laxmikanth / DD Basu' },
  { id: 'GS2-05', paper: 'GS2', section: 'Parliament', title: 'Parliament and State legislatures: structure, functioning, conduct of business, powers & privileges and issues', source: 'M. Laxmikanth / PRS Legislative Research' },
  { id: 'GS2-06', paper: 'GS2', section: 'Executive & Judiciary', title: 'Structure, organization and functioning of Executive and Judiciary; Ministries; pressure groups and their role', source: 'M. Laxmikanth / Indian Express Law Columns' },
  { id: 'GS2-07', paper: 'GS2', section: 'Elections', title: 'Salient features of the Representation of People’s Act (RPA 1950 & 1951)', source: 'M. Laxmikanth / Election Commission Reports' },
  { id: 'GS2-08', paper: 'GS2', section: 'Constitutional Bodies', title: 'Appointment to various Constitutional posts, powers, functions and responsibilities of Constitutional Bodies', source: 'M. Laxmikanth' },
  { id: 'GS2-09', paper: 'GS2', section: 'Statutory Bodies', title: 'Statutory, regulatory and various quasi-judicial bodies (NGT, CCI, NHRC, SEBI, etc.)', source: 'M. Laxmikanth' },
  { id: 'GS2-10', paper: 'GS2', section: 'Governance', title: 'Government policies and interventions for development in various sectors and issues arising out of implementation', source: 'PIB / Yojana / NITI Aayog' },
  { id: 'GS2-11', paper: 'GS2', section: 'Civil Society', title: 'Development processes and industry: role of NGOs, SHGs, donor groups, institutional stakeholders', source: '2nd ARC 9th Report / Kurukshetra' },
  { id: 'GS2-12', paper: 'GS2', section: 'Social Justice', title: 'Welfare schemes for vulnerable sections; mechanisms, laws, institutions and Bodies for their protection', source: 'India Year Book / Ministry Websites' },
  { id: 'GS2-13', paper: 'GS2', section: 'Social Sector', title: 'Issues relating to development and management of Social Sector/Services: Health, Education, Human Resources', source: 'Economic Survey / NITI Aayog Strategy' },
  { id: 'GS2-14', paper: 'GS2', section: 'Social Justice', title: 'Issues relating to poverty and hunger; Global Hunger Index and national nutritional security', source: 'NITI Aayog / UNDP Reports' },
  { id: 'GS2-15', paper: 'GS2', section: 'Accountability', title: 'Important aspects of governance, transparency and accountability; e-governance; Citizen’s Charters, RTI', source: '2nd ARC 1st & 4th Reports' },
  { id: 'GS2-16', paper: 'GS2', section: 'Civil Services', title: 'Role of civil services in a democracy; reforms and administrative accountability', source: '2nd ARC 10th Report (Personnel Administration)' },
  { id: 'GS2-17', paper: 'GS2', section: 'International Relations', title: 'India and its neighborhood: bilateral relations, boundary disputes, cross-border infrastructure', source: 'MEA Annual Report / The Hindu IR Columns' },
  { id: 'GS2-18', paper: 'GS2', section: 'International Relations', title: 'Bilateral, regional and global groupings and agreements involving India (QUAD, BRICS, SCO, G20)', source: 'MEA Releases / C. Raja Mohan' },
  { id: 'GS2-19', paper: 'GS2', section: 'International Relations', title: 'Effect of policies of developed and developing countries on India’s interests, Indian diaspora', source: 'MEA Briefs / IDSA' },
  { id: 'GS2-20', paper: 'GS2', section: 'International Relations', title: 'Important International institutions, agencies and fora: UN, WTO, IMF, World Bank, their mandate', source: 'UN Official Website / Current Affairs' },

  // GS-3
  { id: 'GS3-01', paper: 'GS3', section: 'Economy', title: 'Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment', source: 'Sanjiv Verma / Nitin Singhania / Economic Survey' },
  { id: 'GS3-02', paper: 'GS3', section: 'Economy', title: 'Inclusive growth and issues arising from it; financial inclusion, JAM trinity', source: 'Economic Survey / NITI Aayog' },
  { id: 'GS3-03', paper: 'GS3', section: 'Economy', title: 'Government Budgeting: revenue, capital accounts, fiscal deficit, FRBM Act', source: 'Union Budget / Vivek Singh' },
  { id: 'GS3-04', paper: 'GS3', section: 'Agriculture', title: 'Major crops & cropping patterns; irrigation systems; storage, transport and marketing of agricultural produce', source: 'Ashok Dalwai Committee / NITI Aayog' },
  { id: 'GS3-05', paper: 'GS3', section: 'Agriculture', title: 'Farm subsidies, MSP, PDS functioning, buffer stocks, food security, technology missions, animal rearing', source: 'Economic Survey / Ramesh Singh' },
  { id: 'GS3-06', paper: 'GS3', section: 'Agriculture', title: 'Food processing and related industries: scope, location, upstream and downstream requirements, supply chain', source: 'Ministry of Food Processing / NITI Aayog' },
  { id: 'GS3-07', paper: 'GS3', section: 'Agriculture', title: 'Land reforms in India: historical context, abolition of intermediaries, tenancy reforms, ceiling laws', source: 'Bipan Chandra / Ramesh Singh' },
  { id: 'GS3-08', paper: 'GS3', section: 'Economy', title: 'Effects of liberalization on the economy: industrial policy changes and effects on growth', source: 'Economic Survey / Sanjiv Verma' },
  { id: 'GS3-09', paper: 'GS3', section: 'Infrastructure', title: 'Infrastructure: Energy, Ports, Roads, Airports, Railways, National Logistics Policy', source: 'India Infrastructure Report / NITI Aayog' },
  { id: 'GS3-10', paper: 'GS3', section: 'Economy', title: 'Investment models: PPP models (BOT, HAM, EPC), FDI policies', source: 'Economic Survey / Ramesh Singh' },
  { id: 'GS3-11', paper: 'GS3', section: 'Science & Tech', title: 'Science and Technology developments and their applications in everyday life', source: 'Current Affairs / The Hindu S&T' },
  { id: 'GS3-12', paper: 'GS3', section: 'Science & Tech', title: 'Achievements of Indians in S&T; indigenization of technology and developing new technology', source: 'ISRO, DRDO releases / Current Affairs' },
  { id: 'GS3-13', paper: 'GS3', section: 'Science & Tech', title: 'Awareness in IT, Space, Computers, Robotics, Nano-technology, Bio-technology, IPR issues', source: 'Current Affairs / Department of Science & Tech' },
  { id: 'GS3-14', paper: 'GS3', section: 'Environment', title: 'Conservation, environmental pollution, degradation, Environmental Impact Assessment (EIA)', source: 'Shankar IAS / PMF IAS Environment' },
  { id: 'GS3-15', paper: 'GS3', section: 'Disaster Mgmt', title: 'Disaster management: Sendai Framework, NDMA guidelines, disaster vulnerability profile', source: 'NDMA Releases / 2nd ARC 3rd Report' },
  { id: 'GS3-16', paper: 'GS3', section: 'Internal Security', title: 'Linkages between development and spread of extremism; LWE issues', source: 'Ashok Kumar IPS (Internal Security)' },
  { id: 'GS3-17', paper: 'GS3', section: 'Internal Security', title: 'Role of external state and non-state actors in creating challenges to internal security', source: 'Internal Security by Ashok Kumar' },
  { id: 'GS3-18', paper: 'GS3', section: 'Internal Security', title: 'Challenges through communication networks, social media, basics of cyber security; money-laundering', source: 'CERT-In / Ashok Kumar IPS' },
  { id: 'GS3-19', paper: 'GS3', section: 'Internal Security', title: 'Security challenges and management in border areas; linkages of organized crime with terrorism', source: 'Ministry of Home Affairs / IDSA' },
  { id: 'GS3-20', paper: 'GS3', section: 'Internal Security', title: 'Various Security forces and agencies and their mandate (CAPF, RAW, IB, NIA)', source: 'MHA Annual Report' },

  // GS-4
  { id: 'GS4-01', paper: 'GS4', section: 'Ethics', title: 'Ethics and Human Interface: Essence, determinants and consequences of ethics; dimensions of ethics', source: 'Lexicon for Ethics / Subba Rao' },
  { id: 'GS4-02', paper: 'GS4', section: 'Values', title: 'Human Values: lessons from lives of leaders, reformers, administrators; role of family, society, school', source: 'Lexicon / Michael Sandel' },
  { id: 'GS4-03', paper: 'GS4', section: 'Attitude', title: 'Attitude: content, structure, function; influence on behaviour; moral and political attitudes; persuasion', source: 'Lexicon / Psychology NCERT Class 12' },
  { id: 'GS4-04', paper: 'GS4', section: 'Aptitude', title: 'Aptitude and foundational values for Civil Service: integrity, impartiality, objectivity, empathy', source: '2nd ARC 4th Report / Lexicon' },
  { id: 'GS4-05', paper: 'GS4', section: 'EI', title: 'Emotional Intelligence: concepts, utilities, and application in administration and governance', source: 'Daniel Goleman / Lexicon' },
  { id: 'GS4-06', paper: 'GS4', section: 'Thinkers', title: 'Contributions of moral thinkers and philosophers from India and world (Socrates, Kant, Gandhi, Mill)', source: 'Lexicon / Justice by Michael Sandel' },
  { id: 'GS4-07', paper: 'GS4', section: 'Public Administration', title: 'Public/Civil service values and Ethics in Public administration: ethical dilemmas, laws, conscience', source: '2nd ARC 4th Report: Ethics in Governance' },
  { id: 'GS4-08', paper: 'GS4', section: 'Probity', title: 'Probity in Governance: concept of public service, RTI, Codes of Ethics, Citizen’s Charters, corruption', source: '2nd ARC 4th Report / CVC Guidelines' },
  { id: 'GS4-09', paper: 'GS4', section: 'Case Studies', title: 'Applied Case Studies on ethical dilemmas, conflict of interest, public pressure, and integrity', source: 'Previous 10 Years UPSC Ethics Case Studies' },

  // PSIR 1A
  { id: 'PSIR-1A-01', paper: 'PSIR_1A', section: 'Theory', title: 'Political theory: meaning and approaches (Normative, Empirical, Behavioral, Post-Behavioral, Marxist)', source: 'Andrew Heywood (Political Theory) / O.P. Gauba' },
  { id: 'PSIR-1A-02', paper: 'PSIR_1A', section: 'State', title: 'Theories of the state: Liberal, Neoliberal, Marxist, Pluralist, Post-colonial and feminist', source: 'Andrew Heywood / David Held' },
  { id: 'PSIR-1A-03', paper: 'PSIR_1A', section: 'Justice', title: 'Justice: Conceptions with special reference to Rawls (Theory of Justice) and communitarian critiques', source: 'Will Kymlicka / Michael Sandel / Amartya Sen' },
  { id: 'PSIR-1A-04', paper: 'PSIR_1A', section: 'Equality', title: 'Equality: Social, political, economic; relationship with freedom; Affirmative action; Dworkin, Walzer', source: 'Rajeev Bhargava / O.P. Gauba' },
  { id: 'PSIR-1A-05', paper: 'PSIR_1A', section: 'Rights', title: 'Rights: Meaning and theories; natural, legal, historical, human rights; three generations of rights', source: 'Andrew Heywood / O.P. Gauba' },
  { id: 'PSIR-1A-06', paper: 'PSIR_1A', section: 'Democracy', title: 'Democracy: Classical and contemporary theories; representative, participatory, deliberative models', source: 'David Held (Models of Democracy) / C.B. Macpherson' },
  { id: 'PSIR-1A-07', paper: 'PSIR_1A', section: 'Power', title: 'Concept of power, hegemony, ideology and legitimacy (Foucault, Gramsci, Lukes, Weber)', source: 'Steven Lukes / Michel Foucault / Heywood' },
  { id: 'PSIR-1A-08', paper: 'PSIR_1A', section: 'Ideologies', title: 'Political Ideologies: Liberalism, Socialism, Marxism, Fascism, Gandhism and Feminism', source: 'Andrew Heywood (Political Ideologies)' },
  { id: 'PSIR-1A-09', paper: 'PSIR_1A', section: 'IPT', title: 'Indian Political Thought: Dharmashastra, Arthashastra, Buddhist; Sir Syed, Aurobindo, Gandhi, Ambedkar, Roy', source: 'V.R. Mehta (Foundations of Indian Political Thought)' },
  { id: 'PSIR-1A-10', paper: 'PSIR_1A', section: 'WPT', title: 'Western Political Thought: Plato, Aristotle, Machiavelli, Hobbes, Locke, J.S. Mill, Marx, Gramsci, Arendt', source: 'Brian Nelson (Western Political Thought) / Shefali Jha' },

  // PSIR 1B
  { id: 'PSIR-1B-01', paper: 'PSIR_1B', section: 'Nationalism', title: 'Indian Nationalism: Political strategies of freedom struggle (Constitutionalism to Satyagraha, peasant/workers movements)', source: 'Bipan Chandra / Sekhar Bandyopadhyay' },
  { id: 'PSIR-1B-02', paper: 'PSIR_1B', section: 'Nationalism', title: 'Perspectives on Indian National Movement: Liberal, Socialist, Marxist, Radical humanist, Dalit', source: 'Bipan Chandra / Gail Omvedt' },
  { id: 'PSIR-1B-03', paper: 'PSIR_1B', section: 'Constitution Making', title: 'Making of the Constitution: Legacies of British rule; social and political perspectives in Constituent Assembly', source: 'Granville Austin (The Indian Constitution: Cornerstone of a Nation)' },
  { id: 'PSIR-1B-04', paper: 'PSIR_1B', section: 'Salient Features', title: 'Salient Features of Constitution: Preamble, Fundamental Rights, DPSP, Parliamentary system, Basic Structure', source: 'M. Laxmikanth / Granville Austin' },
  { id: 'PSIR-1B-05', paper: 'PSIR_1B', section: 'Organs of Union', title: 'Principal Organs of Union Government: Role and actual working of Executive, Legislature, Supreme Court', source: 'Oxford Companion to Indian Politics (Mehta & Jayal)' },
  { id: 'PSIR-1B-06', paper: 'PSIR_1B', section: 'Organs of State', title: 'Principal Organs of State Government: Executive, Legislature, High Courts, Role of Governor', source: 'M. Laxmikanth / Sarkaria & Punchhi Reports' },
  { id: 'PSIR-1B-07', paper: 'PSIR_1B', section: 'Grassroots', title: 'Grassroots Democracy: Panchayati Raj, 73rd and 74th Amendments, Grassroot movements', source: 'Kurukshetra / Kuldeep Mathur' },
  { id: 'PSIR-1B-08', paper: 'PSIR_1B', section: 'Commissions', title: 'Statutory Institutions: Election Commission, CAG, Finance Commission, UPSC, National Commissions', source: 'M. Laxmikanth' },
  { id: 'PSIR-1B-09', paper: 'PSIR_1B', section: 'Federalism', title: 'Federalism: Changing nature of Centre-State relations, regional aspirations, inter-state disputes', source: 'Ashutosh Varshney / M. Laxmikanth' },
  { id: 'PSIR-1B-10', paper: 'PSIR_1B', section: 'Economy & Politics', title: 'Planning and Economic Development: Nehruvian vs Gandhian models, Green revolution, LPG reforms', source: 'Francine Frankel / Bipan Chandra' },
  { id: 'PSIR-1B-11', paper: 'PSIR_1B', section: 'Identity Politics', title: 'Caste, Religion and Ethnicity in Indian Politics (M.N. Srinivas, Rajni Kothari, Paul Brass, Christophe Jaffrelot)', source: 'Rajni Kothari (Caste in Indian Politics)' },
  { id: 'PSIR-1B-12', paper: 'PSIR_1B', section: 'Party System', title: 'Party System: National/regional parties, coalition politics, pressure groups, electoral behaviour', source: 'Suhas Palshikar / Yogendra Yadav' },
  { id: 'PSIR-1B-13', paper: 'PSIR_1B', section: 'Social Movements', title: 'Social Movements: Civil liberties, human rights, women’s movements, environmental & trade union movements', source: 'Ghanshyam Shah (Social Movements in India)' },

  // PSIR 2A
  { id: 'PSIR-2A-01', paper: 'PSIR_2A', section: 'Comparative Politics', title: 'Comparative Politics: Nature, approaches (institutional, political economy, political sociology)', source: 'J.C. Johari / Rod Hague' },
  { id: 'PSIR-2A-02', paper: 'PSIR_2A', section: 'Comparative State', title: 'State in comparative perspective: Characteristics in capitalist, socialist, and developing societies', source: 'David Held / J.C. Johari' },
  { id: 'PSIR-2A-03', paper: 'PSIR_2A', section: 'Participation', title: 'Politics of Representation & Participation: Political parties, pressure groups, social movements', source: 'Rod Hague & Martin Harrop' },
  { id: 'PSIR-2A-04', paper: 'PSIR_2A', section: 'Globalisation', title: 'Globalisation: Responses from developed and developing societies', source: 'Joseph Stiglitz / Baylis & Smith' },
  { id: 'PSIR-2A-05', paper: 'PSIR_2A', section: 'IR Approaches', title: 'Approaches to International Relations: Classical Realism, Structural Realism, Liberalism, Marxism, Constructivism', source: 'Baylis, Smith & Owens (The Globalization of World Politics)' },
  { id: 'PSIR-2A-06', paper: 'PSIR_2A', section: 'IR Concepts', title: 'Key concepts in IR: National interest, Security, Balance of power, Deterrence, Transnational actors', source: 'Baylis & Smith / Andrew Heywood' },
  { id: 'PSIR-2A-07', paper: 'PSIR_2A', section: 'Global Order', title: 'Changing International Order: Rise of superpowers, Cold War, Bipolarity, Non-aligned movement', source: 'Baylis & Smith / John Young' },
  { id: 'PSIR-2A-08', paper: 'PSIR_2A', section: 'Post-Cold War', title: 'Collapse of Soviet Union, Unipolarity, American hegemony, relevance of non-alignment today', source: 'Andrew Heywood (Global Politics)' },
  { id: 'PSIR-2A-09', paper: 'PSIR_2A', section: 'Global Economy', title: 'Evolution of International Economic System: Bretton Woods, WTO, G20, NIEO demand', source: 'Baylis & Smith / Thomas Oatley' },
  { id: 'PSIR-2A-10', paper: 'PSIR_2A', section: 'United Nations', title: 'United Nations: Envisaged role, specialized agencies, working, and need for UN Security Council reforms', source: 'UN Official Briefs / Ramesh Thakur' },
  { id: 'PSIR-2A-11', paper: 'PSIR_2A', section: 'Regionalism', title: 'Regionalisation of World Politics: EU, ASEAN, APEC, SAARC, NAFTA/USMCA', source: 'Baylis & Smith / Current Affairs' },
  { id: 'PSIR-2A-12', paper: 'PSIR_2A', section: 'Global Concerns', title: 'Contemporary Global Concerns: Human rights, environment, climate change, terrorism, nuclear proliferation', source: 'Baylis & Smith / Andrew Heywood' },

  // PSIR 2B
  { id: 'PSIR-2B-01', paper: 'PSIR_2B', section: 'IFP Determinants', title: 'Indian Foreign Policy: Determinants, institutions of policy-making, strategic culture, continuity & change', source: 'David Malone (Does the Elephant Dance?) / S. Jaishankar' },
  { id: 'PSIR-2B-02', paper: 'PSIR_2B', section: 'NAM', title: 'India’s Contribution to Non-Alignment Movement: Different phases and contemporary relevance', source: 'C. Raja Mohan / Harsh V. Pant' },
  { id: 'PSIR-2B-03', paper: 'PSIR_2B', section: 'South Asia', title: 'India and South Asia: Regional cooperation, SAARC, South Asia Free Trade Area (SAFTA)', source: 'S.D. Muni / MEA Briefs' },
  { id: 'PSIR-2B-04', paper: 'PSIR_2B', section: 'Neighbourhood', title: 'Look East / Act East policy; Impediments: water disputes, cross-border migration, border conflicts', source: 'C. Raja Mohan / Harsh V. Pant' },
  { id: 'PSIR-2B-05', paper: 'PSIR_2B', section: 'Global South', title: 'India and the Global South: Relations with Africa and Latin America, leadership in WTO/climate negotiations', source: 'MEA Releases / Shashi Tharoor' },
  { id: 'PSIR-2B-06', paper: 'PSIR_2B', section: 'Major Powers', title: 'India and Global Centres of Power: USA, EU, Japan, China, and Russia', source: 'S. Jaishankar (The India Way) / Harsh V. Pant' },
  { id: 'PSIR-2B-07', paper: 'PSIR_2B', section: 'UN & India', title: 'India and the UN System: UN Peace-keeping contributions, claim for permanent seat in UNSC', source: 'Syed Akbaruddin / MEA Official Briefs' },
  { id: 'PSIR-2B-08', paper: 'PSIR_2B', section: 'Nuclear Question', title: 'India and the Nuclear Question: Evolution of doctrine, Credible Minimum Deterrence, No First Use (NFU)', source: 'Rajesh Rajagopalan / Bharat Karnad' },
  { id: 'PSIR-2B-09', paper: 'PSIR_2B', section: 'Recent Trends', title: 'Recent developments: Indo-Pacific, QUAD, West Asia (I2U2, IMEC), strategic autonomy, multipolar world vision', source: 'S. Jaishankar / MEA Strategic Briefs' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingNews, setSyncingNews] = useState(false);

  // Filters & Selected Papers
  const [selectedGsPaper, setSelectedGsPaper] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4'>('GS2');
  const [gsSearchQuery, setGsSearchQuery] = useState('');
  const [selectedPsirPaper, setSelectedPsirPaper] = useState<'PSIR_1A' | 'PSIR_1B' | 'PSIR_2A' | 'PSIR_2B'>('PSIR_1A');
  const [psirSearchQuery, setPsirSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('ALL');

  // Topic Status Tracking
  const [topicStatusMap, setTopicStatusMap] = useState<Record<string, 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED'>>({});

  // PYQ Interactive State
  const [selectedPyqOptions, setSelectedPyqOptions] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Mains Answer Lab State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Thinker Comparator
  const [thinkerA, setThinkerA] = useState('rawls');
  const [thinkerB, setThinkerB] = useState('nozick');

  // Flashcards & Notes
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [personalNotes, setPersonalNotes] = useState([
    {
      id: 'N-1',
      title: 'Kesavananda Bharati (1973) 7:6 Ratio Summary',
      tag: 'GS2 / PSIR-1B',
      content: 'Chief Justice Sikri: Basic structure includes supremacy of Constitution, republican & democratic form, secular character, separation of powers, and federal character.'
    },
    {
      id: 'N-2',
      title: 'Rawls vs Sen: Transcendental Institutionalism vs Nyaya',
      tag: 'PSIR-1A',
      content: 'Amartya Sen in The Idea of Justice (2009) critiques Rawlsian ideal institutions (Niti) as insufficient; justice requires removing manifest real-world injustices (Nyaya).'
    }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const loadData = async () => {
    try {
      const [taskRes, caRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/current-affairs/sync')
      ]);
      const taskData = await taskRes.json();
      const caData = await caRes.json();
      setTasks(taskData.tasks || []);
      setPyqs(taskData.pyqs || []);
      setCurrentAffairs(caData.items || []);
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id, status: nextStatus })
      });
    } catch (err) {
      console.error('Failed to save task update:', err);
    }
  };

  const getTopicStatus = (topicId: string) => {
    if (topicStatusMap[topicId]) return topicStatusMap[topicId];
    const hasCompletedTask = tasks.some(task => task.topicId === topicId && task.status === 'COMPLETED');
    return hasCompletedTask ? 'MASTERED' : 'NOT_STARTED';
  };

  const cycleTopicStatus = (topicId: string) => {
    const current = getTopicStatus(topicId);
    const next = current === 'NOT_STARTED' ? 'IN_PROGRESS' : current === 'IN_PROGRESS' ? 'MASTERED' : 'NOT_STARTED';
    setTopicStatusMap(prev => ({ ...prev, [topicId]: next }));
  };

  const handleLiveNewsSync = async () => {
    setSyncingNews(true);
    try {
      const res = await fetch('/api/current-affairs/sync');
      const data = await res.json();
      setCurrentAffairs(data.items || []);
    } catch (e) {
      alert('Could not sync live news feed.');
    } finally {
      setSyncingNews(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userContent: userAnswer, wordLimit: 250, marks: 15, paperCode: 'GS2' })
      });
      const data = await res.json();
      setAiEvaluation(data);
    } catch {
      alert('Evaluation server call failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const addNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    setPersonalNotes([
      { id: 'NOTE-' + Date.now(), title: newNoteTitle, tag: 'GS / PSIR', content: newNoteContent },
      ...personalNotes
    ]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  // Safe today tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const matchingToday = tasks.filter(t => t.scheduledDate === todayStr);
  const todayTasks = matchingToday.length > 0 ? matchingToday : tasks.slice(0, 3);

  // Thinker Data Bank
  const THINKER_DB: Record<string, { name: string; tradition: string; primaryWork: string; coreThesis: string; primaryCritic: string }> = {
    rawls: {
      name: 'John Rawls',
      tradition: 'Deontological Liberalism',
      primaryWork: 'A Theory of Justice (1971)',
      coreThesis: 'Justice as fairness. Uses Original Position & Veil of Ignorance. Lexical priority of basic equal liberties over difference principle (inequalities justified only if benefiting least advantaged).',
      primaryCritic: 'Robert Nozick (Entitlement Theory), Amartya Sen (Realisation-focused Nyaya), Michael Sandel (Unencumbered Self).'
    },
    nozick: {
      name: 'Robert Nozick',
      tradition: 'Libertarianism / Minarchism',
      primaryWork: 'Anarchy, State, and Utopia (1974)',
      coreThesis: 'Entitlement Theory of Justice: Holding is just if acquired through just initial acquisition or voluntary transfer. Rejects patterned redistribution as forced labor.',
      primaryCritic: 'G.A. Cohen (Marxist egalitarian), John Rawls.'
    },
    sen: {
      name: 'Amartya Sen',
      tradition: 'Capability Approach',
      primaryWork: 'The Idea of Justice (2009)',
      coreThesis: 'Realisation-focused comparison. Prioritises practical removal of manifest injustices (Nyaya) over constructing hypothetical ideal institutions (Niti). Focuses on substantive capabilities.',
      primaryCritic: 'Transcendental institutionalists who argue institutional benchmarks are necessary.'
    },
    machiavelli: {
      name: 'Niccolò Machiavelli',
      tradition: 'Political Realism',
      primaryWork: 'The Prince (1532)',
      coreThesis: 'Autonomy of politics from conventional Christian morality. Dual morality: the ruler must use both force (lion) and cunning (fox) for the preservation and glory of the state.',
      primaryCritic: 'Leo Strauss (critique of moral realism), Immanuel Kant.'
    },
    morgenthau: {
      name: 'Hans Morgenthau',
      tradition: 'Classical Realism (IR)',
      primaryWork: 'Politics Among Nations (1948)',
      coreThesis: 'International politics is governed by objective laws rooted in human nature. States define national interest in terms of power. Universal moral principles cannot be applied to state actions.',
      primaryCritic: 'Kenneth Waltz (Structural Realism), Alexander Wendt (Social Constructivism).'
    },
    waltz: {
      name: 'Kenneth Waltz',
      tradition: 'Neo-Realism / Structural Realism',
      primaryWork: 'Theory of International Politics (1979)',
      coreThesis: 'The international system is defined by anarchic structure, not human nature. Self-help system compels states to prioritize survival, balance of power, and relative gains over absolute gains.',
      primaryCritic: 'Robert Keohane (Neoliberal Institutionalism), Alexander Wendt.'
    }
  };

  const FLASHCARDS = [
    {
      q: 'What are the 5 non-derogable features of Basic Structure laid out in Kesavananda Bharati by CJI Sikri?',
      a: '1. Supremacy of Constitution\n2. Republican & Democratic form of Government\n3. Secular character\n4. Separation of Powers between Legislature, Executive & Judiciary\n5. Federal character of Constitution.'
    },
    {
      q: 'Differentiate between Rawlsian "Niti" and Sen’s "Nyaya" in theories of justice.',
      a: 'Niti refers to organizational correctness and institutional propriety (transcendental rules). Nyaya represents realized justice—what emerges in real people\'s lives and eliminating concrete deprivations.'
    },
    {
      q: 'Which constitutional article limits the jurisdiction of courts in Inter-State River Water Disputes?',
      a: 'Article 262(2) allows Parliament by law to bar the Supreme Court or any other court from exercising jurisdiction over disputes regarding inter-state rivers adjudicated under the 1956 Act.'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 z-20 select-none">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
            IAS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">UPSC Master</h1>
            <p className="text-[11px] text-amber-400 font-medium">GS + PSIR • CSE 2027</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'dashboard' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" /> Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('today')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'today' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Target className="w-4 h-4 text-emerald-400" /> Today's Study Plan
          </button>

          <button 
            onClick={() => setActiveTab('complete-plan')} 
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/60 transition`}
          >
            <div className="flex items-center gap-3">
              <MapIcon className="w-4 h-4 text-amber-400" /> Complete Plan Viewer
            </div>
            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase">Core</span>
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Syllabus & Subjects</div>
          <button 
            onClick={() => setActiveTab('gs-planner')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'gs-planner' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4 text-blue-300" /> GS Foundation (I–IV)
          </button>

          <button 
            onClick={() => setActiveTab('psir-planner')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'psir-planner' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Globe className="w-4 h-4 text-indigo-400" /> PSIR Optional Planner
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Practice & Output</div>
          <button 
            onClick={() => setActiveTab('current-affairs')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'current-affairs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-4 h-4 text-teal-400" /> Live Current Affairs
          </button>

          <button 
            onClick={() => setActiveTab('pyq')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'pyq' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Verified PYQs
          </button>

          <button 
            onClick={() => setActiveTab('mains-answer')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'mains-answer' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Edit3 className="w-4 h-4 text-rose-400" /> Mains Answer Writing
          </button>

          <button 
            onClick={() => setActiveTab('spaced-revision')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'spaced-revision' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" /> Spaced Revision Queue
          </button>

          <button 
            onClick={() => setActiveTab('notes-desk')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${activeTab === 'notes-desk' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Bookmark className="w-4 h-4 text-purple-400" /> Topic Notes & Citations
          </button>
        </nav>

        {/* Calendar Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-semibold">Prelims: 23 May '27</span>
            <span className="text-white font-bold">209d</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-indigo-400 font-medium">Mains: 20 Aug '27</span>
            <span className="text-slate-300">298d</span>
          </div>
        </div>
      </aside>

      {/* Main Execution Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Phase 2: Comprehensive GS + PSIR Completion
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'current-affairs' && (
              <button 
                onClick={handleLiveNewsSync} 
                disabled={syncingNews}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingNews ? 'animate-spin' : ''}`} />
                {syncingNews ? 'Connecting to PIB...' : 'Fetch Latest Online'}
              </button>
            )}
            <button 
              onClick={async () => {
                const res = await fetch('/api/schedule/rebalance', { method: 'POST' });
                const d = await res.json();
                alert(d.message || 'Timetable recalibrated.');
              }} 
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Rebalance Schedule
            </button>
          </div>
        </header>

        {/* View Router */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <Clock className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
              Loading verified preparation repository...
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Daily Completed</span>
                      <div className="text-2xl font-bold text-slate-800 mt-2">
                        {todayTasks.filter(t => t.status === 'COMPLETED').length} / {todayTasks.length}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Sessions Completed</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Prelims 2027</span>
                      <div className="text-2xl font-bold text-amber-600 mt-2">209 Days</div>
                      <p className="text-[11px] text-slate-400 mt-1">23 May 2027 (Official)</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Mains 2027</span>
                      <div className="text-2xl font-bold text-indigo-600 mt-2">298 Days</div>
                      <p className="text-[11px] text-slate-400 mt-1">20 August 2027</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Prelims Pivot</span>
                      <div className="text-xl font-bold text-rose-600 mt-2">01 March '27</div>
                      <p className="text-[11px] text-slate-400 mt-1">Mission Mode: 80% MCQs/CSAT</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">Today's Focus Tasks</h3>
                      <button onClick={() => setActiveTab('today')} className="text-xs font-semibold text-blue-600 hover:underline">
                        Open Full Study Guide →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {todayTasks.map((t) => (
                        <div key={t.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-100/70 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">Session {t.sessionNumber}</span>
                              <span className="text-xs font-bold text-slate-800">{t.subject}</span>
                              <span className="text-[11px] text-slate-500">• {t.durationHours} Hours</span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium">{t.actionTitle}</p>
                            <p className="text-[11px] text-slate-500 font-serif">Source: {t.primarySource}</p>
                          </div>
                          <button 
                            onClick={() => toggleTaskStatus(t.id)} 
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${t.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                          >
                            {t.status === 'COMPLETED' ? '✓ Mastered' : 'Mark Complete'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TODAY'S STUDY PLAN */}
              {activeTab === 'today' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Productive Routine: 8 Hours Structured</span>
                      <h3 className="text-lg font-bold text-slate-800">Today's Actionable Agenda & Study Instructions</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Syllabus-mapped readings, concrete micro-steps, and concept extraction.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                      Day Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {todayTasks.map((t, idx) => (
                      <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t.subject}</span>
                              <h4 className="text-sm font-bold text-slate-800">{t.actionTitle}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">{t.durationHours} Hours</span>
                            <button 
                              onClick={() => toggleTaskStatus(t.id)} 
                              className={`px-3 py-1 rounded text-xs font-semibold transition ${t.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                            >
                              {t.status === 'COMPLETED' ? '✓ Mastered' : 'Mark Completed'}
                            </button>
                          </div>
                        </div>

                        <div className="p-5 space-y-4 text-xs text-slate-700">
                          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60">
                            <strong className="text-amber-900 uppercase text-[10px] tracking-wide block mb-1">Authoritative Source:</strong>
                            <p className="font-serif text-slate-800 font-medium">{t.primarySource}</p>
                          </div>

                          <div>
                            <strong className="text-slate-800 uppercase text-[10px] tracking-wider block mb-1.5">How to Read & Step-by-Step Instructions:</strong>
                            <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px]">{t.stepNotes}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 items-center">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Core Concepts:</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] border border-slate-200 font-medium">{t.keyConcepts}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                            <span><strong>Target Output:</strong> {t.expectedOutput}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. COMPLETE PLAN VIEWER WITH ALL 6 PHASES */}
              {activeTab === 'complete-plan' && (
                <div className="space-y-4 max-w-6xl mx-auto">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Complete Date-wise Preparation Roadmap</h3>
                      <p className="text-xs text-slate-500">From Today through Prelims (23 May 2027) and Mains (20 August 2027)</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select 
                        value={selectedPhaseFilter}
                        onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                        className="border rounded p-1.5 text-xs text-slate-700 bg-white font-medium"
                      >
                        <option value="ALL">All Phases (Full 2026-2027 Roadmap)</option>
                        <option value="Phase 1">Phase 1: Foundation & NCERTs (Late 2026)</option>
                        <option value="Phase 2">Phase 2: Standard Books & Core Syllabus (Jan 2027)</option>
                        <option value="Phase 3">Phase 3: Integrated GS + PSIR Consolidation (Feb 2027)</option>
                        <option value="Phase 4">Phase 4: Prelims Mission Mode (Mar-May 2027)</option>
                        <option value="Phase 5">Phase 5: Mains Intensive Answer Writing (May-Jul 2027)</option>
                        <option value="Phase 6">Phase 6: Final Mains Simulations (Aug 2027)</option>
                      </select>

                      <button 
                        onClick={() => {
                          const csv = "Date,Subject,Action,Hours,Status\n" + tasks.map(t => `"${t.scheduledDate}","${t.subject}","${t.actionTitle}",${t.durationHours},${t.status}`).join('\n');
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'UPSC_Master_Plan_2026_2027.csv';
                          a.click();
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Phase</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Action Title</th>
                          <th className="p-3">Source</th>
                          <th className="p-3">Hours</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {tasks
                          .filter(t => selectedPhaseFilter === 'ALL' || t.phase.includes(selectedPhaseFilter))
                          .slice(0, 300)
                          .map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{t.scheduledDate}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium border border-blue-200">
                                {t.phase.split(':')[0]}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-slate-800">{t.subject}</td>
                            <td className="p-3 text-slate-600">{t.actionTitle}</td>
                            <td className="p-3 text-slate-500 font-serif text-[11px]">{t.primarySource}</td>
                            <td className="p-3 font-bold">{t.durationHours}h</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. INTERACTIVE GS FOUNDATION & FULL SYLLABUS DRILL-DOWN */}
              {activeTab === 'gs-planner' && (() => {
                const GS_TITLES: Record<string, string> = {
                  'GS1': 'GS-1: Indian Heritage, History, Society & World Geography',
                  'GS2': 'GS-2: Governance, Constitution, Polity, Social Justice & IR',
                  'GS3': 'GS-3: Economy, Agriculture, Environment, S&T & Internal Security',
                  'GS4': 'GS-4: Ethics, Integrity and Aptitude (Theory & Applied Case Studies)'
                };

                const currentTopics = OFFICIAL_SYLLABUS.filter(t => t.paper === selectedGsPaper);
                const filtered = currentTopics.filter(t => 
                  gsSearchQuery === '' || 
                  t.title.toLowerCase().includes(gsSearchQuery.toLowerCase()) || 
                  t.section.toLowerCase().includes(gsSearchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(gsSearchQuery.toLowerCase())
                );

                const getPaperStats = (paper: 'GS1' | 'GS2' | 'GS3' | 'GS4') => {
                  const paperTopics = OFFICIAL_SYLLABUS.filter(t => t.paper === paper);
                  const total = paperTopics.length;
                  const mastered = paperTopics.filter(t => getTopicStatus(t.id) === 'MASTERED').length;
                  const pct = Math.round((mastered / total) * 100);
                  return { total, mastered, pct };
                };

                return (
                  <div className="space-y-6 max-w-6xl mx-auto">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">General Studies Foundation (GS I–IV)</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click any subject card to inspect its full syllabus and toggle subtopic mastery.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200">
                        Official UPSC Taxonomy
                      </span>
                    </div>

                    {/* 4 Interactive Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['GS1', 'GS2', 'GS3', 'GS4'] as const).map((paper) => {
                        const stats = getPaperStats(paper);
                        const isSelected = selectedGsPaper === paper;
                        return (
                          <div 
                            key={paper}
                            onClick={() => setSelectedGsPaper(paper)}
                            className={`cursor-pointer p-4 rounded-xl border transition ${
                              isSelected 
                                ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/40' 
                                : 'bg-white border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-900 text-white">{paper}</span>
                              <span className="text-[11px] font-bold text-blue-600">{stats.pct}% Covered</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs mt-3 line-clamp-1">{GS_TITLES[paper].split(':')[1]}</h4>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                              <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${stats.pct}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                              <span><strong>{stats.mastered}</strong> / {stats.total} Units Done</span>
                              <span className="font-semibold text-blue-700">{isSelected ? 'Active View' : 'Explore →'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill-down syllabus list */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">{selectedGsPaper}</span>
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">{GS_TITLES[selectedGsPaper]}</h4>
                        </div>
                        <input 
                          type="text" 
                          placeholder={`Search in ${selectedGsPaper}...`}
                          value={gsSearchQuery}
                          onChange={(e) => setGsSearchQuery(e.target.value)}
                          className="border rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white w-full md:w-64"
                        />
                      </div>

                      <div className="space-y-3">
                        {filtered.map((topic, index) => {
                          const status = getTopicStatus(topic.id);
                          return (
                            <div 
                              key={topic.id}
                              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                                status === 'MASTERED' ? 'bg-emerald-50/50 border-emerald-200' : status === 'IN_PROGRESS' ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                                    #{index + 1} • {topic.id}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border">
                                    {topic.section}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed">{topic.title}</h5>
                                <p className="text-[11px] text-slate-500 font-serif"><strong>Recommended Source:</strong> {topic.source}</p>
                              </div>
                              <button
                                onClick={() => cycleTopicStatus(topic.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                                  status === 'MASTERED' ? 'bg-emerald-600 text-white' : status === 'IN_PROGRESS' ? 'bg-amber-500 text-slate-950' : 'bg-white border text-slate-700'
                                }`}
                              >
                                {status === 'MASTERED' && '✓ Mastered'}
                                {status === 'IN_PROGRESS' && '⏳ In Progress'}
                                {status === 'NOT_STARTED' && '○ Not Started'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 5. INTERACTIVE PSIR OPTIONAL PLANNER WITH FULL SYLLABUS DRILL-DOWN */}
              {activeTab === 'psir-planner' && (() => {
                const PSIR_TITLES: Record<string, string> = {
                  'PSIR_1A': 'Paper 1A: Political Theory & Western/Indian Thinkers',
                  'PSIR_1B': 'Paper 1B: Indian Government & Politics (IGP & Constitution)',
                  'PSIR_2A': 'Paper 2A: Comparative Politics & International Relations Theories',
                  'PSIR_2B': 'Paper 2B: India\'s Foreign Policy (Determinants, Bilateral & Nuclear Policy)'
                };

                const currentTopics = OFFICIAL_SYLLABUS.filter(t => t.paper === selectedPsirPaper);
                const filtered = currentTopics.filter(t => 
                  psirSearchQuery === '' || 
                  t.title.toLowerCase().includes(psirSearchQuery.toLowerCase()) || 
                  t.section.toLowerCase().includes(psirSearchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(psirSearchQuery.toLowerCase())
                );

                const getPsirStats = (paper: 'PSIR_1A' | 'PSIR_1B' | 'PSIR_2A' | 'PSIR_2B') => {
                  const paperTopics = OFFICIAL_SYLLABUS.filter(t => t.paper === paper);
                  const total = paperTopics.length;
                  const mastered = paperTopics.filter(t => getTopicStatus(t.id) === 'MASTERED').length;
                  const pct = Math.round((mastered / total) * 100);
                  return { total, mastered, pct };
                };

                return (
                  <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base md:text-lg">PSIR Optional Dedicated Command Centre</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                            500 Marks
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">Click any paper quadrant below to inspect its full syllabus and toggle subtopic mastery.</p>
                      </div>
                      <span className="px-3 py-1 bg-white/10 text-amber-300 font-bold text-xs rounded border border-white/20">
                        Official UPSC PSIR Taxonomy
                      </span>
                    </div>

                    {/* 4 Interactive Paper Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['PSIR_1A', 'PSIR_1B', 'PSIR_2A', 'PSIR_2B'] as const).map((paper) => {
                        const stats = getPsirStats(paper);
                        const isSelected = selectedPsirPaper === paper;
                        return (
                          <div 
                            key={paper}
                            onClick={() => setSelectedPsirPaper(paper)}
                            className={`cursor-pointer p-4 rounded-xl border transition ${
                              isSelected 
                                ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-400/40' 
                                : 'bg-white border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                                {paper.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] font-bold text-indigo-700">{stats.pct}% Covered</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs mt-3 line-clamp-1">{PSIR_TITLES[paper].split(':')[1]}</h4>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                              <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${stats.pct}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                              <span><strong>{stats.mastered}</strong> / {stats.total} Units Done</span>
                              <span className="font-semibold text-indigo-700">{isSelected ? 'Active View' : 'Explore →'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill-down syllabus list */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-700 text-white font-bold text-xs">
                            {selectedPsirPaper.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">{PSIR_TITLES[selectedPsirPaper]}</h4>
                        </div>
                        <input 
                          type="text" 
                          placeholder={`Search in ${selectedPsirPaper.replace('_', ' ')}...`}
                          value={psirSearchQuery}
                          onChange={(e) => setPsirSearchQuery(e.target.value)}
                          className="border rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white w-full md:w-64"
                        />
                      </div>

                      <div className="space-y-3">
                        {filtered.map((topic, index) => {
                          const status = getTopicStatus(topic.id);
                          return (
                            <div 
                              key={topic.id}
                              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                                status === 'MASTERED' ? 'bg-emerald-50/50 border-emerald-200' : status === 'IN_PROGRESS' ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                                    #{index + 1} • {topic.id}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border">
                                    {topic.section}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed">{topic.title}</h5>
                                <p className="text-[11px] text-slate-500 font-serif"><strong>Core Scholarly Reference:</strong> {topic.source}</p>
                              </div>
                              <button
                                onClick={() => cycleTopicStatus(topic.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                                  status === 'MASTERED' ? 'bg-emerald-600 text-white' : status === 'IN_PROGRESS' ? 'bg-amber-500 text-slate-950' : 'bg-white border text-slate-700'
                                }`}
                              >
                                {status === 'MASTERED' && '✓ Mastered'}
                                {status === 'IN_PROGRESS' && '⏳ In Progress'}
                                {status === 'NOT_STARTED' && '○ Not Started'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Thinker Comparison Matrix */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" /> Interactive Thinker Comparison Tool
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          <select 
                            value={thinkerA} 
                            onChange={(e) => setThinkerA(e.target.value)} 
                            className="border rounded p-1.5 bg-white font-semibold text-slate-700"
                          >
                            {Object.keys(THINKER_DB).map(k => (
                              <option key={k} value={k}>{THINKER_DB[k].name}</option>
                            ))}
                          </select>
                          <span className="font-bold text-slate-400">VS</span>
                          <select 
                            value={thinkerB} 
                            onChange={(e) => setThinkerB(e.target.value)} 
                            className="border rounded p-1.5 bg-white font-semibold text-slate-700"
                          >
                            {Object.keys(THINKER_DB).map(k => (
                              <option key={k} value={k}>{THINKER_DB[k].name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-bold text-blue-900 text-sm">{THINKER_DB[thinkerA]?.name}</h5>
                            <span className="text-[10px] font-semibold text-blue-700">{THINKER_DB[thinkerA]?.tradition}</span>
                          </div>
                          <p className="italic text-slate-600 font-serif">Major Work: {THINKER_DB[thinkerA]?.primaryWork}</p>
                          <div className="pt-2 border-t border-blue-100">
                            <strong className="block text-slate-800 mb-1">Core Theoretical Thesis:</strong>
                            <p className="leading-relaxed text-slate-700">{THINKER_DB[thinkerA]?.coreThesis}</p>
                          </div>
                          <div className="pt-2 border-t border-blue-100">
                            <strong className="block text-slate-800 mb-1">Primary Critics:</strong>
                            <p className="text-slate-600">{THINKER_DB[thinkerA]?.primaryCritic}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-bold text-indigo-900 text-sm">{THINKER_DB[thinkerB]?.name}</h5>
                            <span className="text-[10px] font-semibold text-indigo-700">{THINKER_DB[thinkerB]?.tradition}</span>
                          </div>
                          <p className="italic text-slate-600 font-serif">Major Work: {THINKER_DB[thinkerB]?.primaryWork}</p>
                          <div className="pt-2 border-t border-indigo-100">
                            <strong className="block text-slate-800 mb-1">Core Theoretical Thesis:</strong>
                            <p className="leading-relaxed text-slate-700">{THINKER_DB[thinkerB]?.coreThesis}</p>
                          </div>
                          <div className="pt-2 border-t border-indigo-100">
                            <strong className="block text-slate-800 mb-1">Primary Critics:</strong>
                            <p className="text-slate-600">{THINKER_DB[thinkerB]?.primaryCritic}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

    {/* 6. CURRENT AFFAIRS WITH GUARANTEED ENGLISH SOURCES & PRELIMS FACTS */}
              {activeTab === 'current-affairs' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-base">Current Affairs & Static Mapping</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentAffairs[0]?.isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                          {currentAffairs[0]?.isLive ? '● Live English Government Feed' : 'Verified Repository'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Official releases from PIB (New Delhi English) & PRS Legislative Research mapped to UPSC GS & PSIR.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleLiveNewsSync}
                        disabled={syncingNews}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm transition"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingNews ? 'animate-spin' : ''}`} />
                        {syncingNews ? 'Syncing...' : 'Fetch Latest English News'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentAffairs.map(item => (
                      <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm md:text-base leading-snug">{item.headline}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">{item.date}</span>
                        </div>

                        {/* Syllabus Mapping Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold border border-blue-200 text-[10px]">{item.gsLink}</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-800 rounded font-semibold border border-purple-200 text-[10px]">{item.psirLink}</span>
                        </div>

                        {/* Dedicated UPSC Prelims Facts Box */}
                        <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 text-slate-800 space-y-1.5 leading-relaxed">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <span>🎯</span> High-Yield UPSC Prelims Facts & Traps:
                          </div>
                          <p className="text-slate-700 font-sans leading-relaxed text-[11px] sm:text-xs">
                            {item.prelimsFact || 'Nodal Ministry / Statutory Authority provisions applicable. Review constitutional articles for option elimination.'}
                          </p>
                        </div>

                        {/* Mains Analytical Dimension */}
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700 leading-relaxed">
                          <strong className="text-slate-900 block text-[11px] uppercase tracking-wide">Mains Analytical Angle:</strong>
                          <p className="text-[11px] sm:text-xs">{item.mainsDimension}</p>
                        </div>

                        {/* English Source Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 text-[11px] text-slate-500 font-serif">
                          <span>Source: <strong>{item.source}</strong></span>
                          <a 
                            href={item.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-sans font-semibold text-xs transition shadow-sm"
                          >
                            Open Official English Release <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* 7. VERIFIED PYQ PRACTICE */}
              {activeTab === 'pyq' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">UPSC Official PYQ Practice Engine</h3>
                      <p className="text-xs text-slate-500">Genuine commission questions with option elimination and official answer keys.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded border border-amber-200">
                      Verified PYQ Bank
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pyqs.map(p => {
                      const options = p.optionsJson ? JSON.parse(p.optionsJson) : [];
                      const selected = selectedPyqOptions[p.id];
                      const revealed = revealedExplanations[p.id];

                      return (
                        <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                              UPSC {p.stage} {p.year} • {p.paper}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border">
                              Official Commission Question
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">{p.questionText}</p>

                          {options.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {options.map((opt: any) => {
                                const isSelected = selected === opt.id;
                                const isCorrect = opt.id === p.correctOption;
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => {
                                      setSelectedPyqOptions({ ...selectedPyqOptions, [p.id]: opt.id });
                                      setRevealedExplanations({ ...revealedExplanations, [p.id]: true });
                                    }}
                                    className={`w-full p-2.5 rounded border text-left flex items-center gap-2 transition ${
                                      isSelected
                                        ? isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                                        : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    <span className="font-bold">{opt.id})</span> {opt.text}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {revealed && p.explanation && (
                            <div className="p-3 bg-emerald-50 rounded border text-emerald-900 space-y-1">
                              <strong className="block text-xs text-emerald-950 font-bold">Official UPSC Answer: Option {p.correctOption}</strong>
                              <p className="leading-relaxed">{p.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 8. MAINS ANSWER WRITING & EVALUATION */}
              {activeTab === 'mains-answer' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-600 uppercase">Timed Practice: 15 Marks (250 Words)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded shadow-sm">
                            {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => setTimerActive(!timerActive)} 
                            className={`px-3 py-1 rounded text-xs font-semibold text-white transition ${timerActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          >
                            {timerActive ? 'Pause' : 'Start Timer'}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        "The doctrine of Basic Structure has not only preserved the ethos of the Indian Constitution but has also dynamically adapted to constitutional evolution. Discuss with reference to leading judicial pronouncements."
                      </h4>

                      <textarea 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full h-72 border rounded-lg p-3 text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Type your structured answer here (Introduction, Kesavananda Bharati context, S.R. Bommai/Minerva Mills adaptation, counterarguments, and Way Forward)..."
                      />

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">
                          Word Count: <strong className="text-slate-800">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong> / 250
                        </span>
                        <button 
                          onClick={evaluateAnswer} 
                          disabled={evaluating || !userAnswer.trim()}
                          className="px-4 py-2 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800 disabled:opacity-50 transition"
                        >
                          {evaluating ? 'Evaluating...' : 'Submit for UPSC Rubric Evaluation'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                      <h4 className="font-bold text-slate-800 text-sm border-b pb-2">UPSC 7-Criteria Scorecard</h4>
                      {aiEvaluation ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                            <span className="font-bold text-emerald-900 block text-sm">
                              Score: {aiEvaluation.awardedScore} / {aiEvaluation.totalMarks} ({aiEvaluation.percentage}%)
                            </span>
                            <span className="text-[11px] text-emerald-800">{aiEvaluation.evaluationBand}</span>
                          </div>
                          <div className="text-slate-600 space-y-1">
                            <p><strong>Words Written:</strong> {aiEvaluation.wordCount} words</p>
                            <p><strong>Word Compliance:</strong> {aiEvaluation.isWordCountCompliant ? 'Optimal' : 'Needs Adjustment'}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 leading-relaxed">
                          Start the timer, write your response to the 15-mark question, and submit to receive instant criteria-by-criteria scoring on directive relevance, constitutional citations, and structure.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 9. SPACED REVISION */}
              {activeTab === 'spaced-revision' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Spaced Repetition & Active Recall Desk</h3>
                      <p className="text-xs text-slate-500">Scheduled retrieval cues (Day 1, 3, 7, 14, 30) for high-yield retention.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                      Card {flashcardIndex + 1} of {FLASHCARDS.length}
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold text-amber-700 uppercase tracking-wide text-[10px]">Active Recall Question:</span>
                      <h4 className="text-sm font-bold text-slate-800 leading-relaxed">{FLASHCARDS[flashcardIndex].q}</h4>
                    </div>

                    {showFlashcardAnswer ? (
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-slate-800 space-y-2 leading-relaxed">
                        <strong className="block text-emerald-950 font-bold">Answer & Key Points:</strong>
                        <p className="whitespace-pre-line font-mono text-[11px]">{FLASHCARDS[flashcardIndex].a}</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowFlashcardAnswer(true)} 
                        className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition"
                      >
                        Show Answer & Recall Benchmark
                      </button>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <button 
                        onClick={() => {
                          setShowFlashcardAnswer(false);
                          setFlashcardIndex((flashcardIndex + 1) % FLASHCARDS.length);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700 transition"
                      >
                        Next Flashcard →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. TOPIC NOTES */}
              {activeTab === 'notes-desk' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Topic Notes & Case Law Citations</h3>
                      <p className="text-xs text-slate-500">Store concise high-yield notes, thinker quotes, and constitutional case citations.</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 text-sm">Add New High-Yield Revision Note</h4>
                    <input 
                      type="text" 
                      placeholder="Note Title / Judgement / Theory..." 
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full border rounded p-2 text-slate-800 font-semibold"
                    />
                    <textarea 
                      placeholder="Concise micro-summary, articles, committee names..." 
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full h-24 border rounded p-2 text-slate-800 font-mono"
                    />
                    <div className="flex justify-end">
                      <button onClick={addNote} className="px-4 py-1.5 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition">
                        Save to Repository
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {personalNotes.map(n => (
                      <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-slate-800 text-sm">{n.title}</h5>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold border">{n.tag}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-mono text-[11px]">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}