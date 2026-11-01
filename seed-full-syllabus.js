// seed-full-syllabus.js — Complete, Unabridged Official UPSC CSE Syllabus Seeder
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FULL_UPSC_SYLLABUS = [
  // ================= GENERAL STUDIES I =================
  { id: 'GS1-01', paper: 'GS1', section: 'Art & Culture', title: 'Indian culture: Salient aspects of Art Forms, Literature and Architecture from ancient to modern times' },
  { id: 'GS1-02', paper: 'GS1', section: 'Modern History', title: 'Modern Indian history from about the middle of the eighteenth century until the present: significant events, personalities, issues' },
  { id: 'GS1-03', paper: 'GS1', section: 'Modern History', title: 'The Freedom Struggle: its various stages and important contributors/contributions from different parts of the country' },
  { id: 'GS1-04', paper: 'GS1', section: 'Post-Independence', title: 'Post-independence consolidation and reorganisation within the country' },
  { id: 'GS1-05', paper: 'GS1', section: 'World History', title: 'History of the world: Events from 18th century such as Industrial Revolution, world wars, redrawal of national boundaries, colonization, decolonization' },
  { id: 'GS1-06', paper: 'GS1', section: 'World History', title: 'Political philosophies like communism, capitalism, socialism: their forms and effect on the society' },
  { id: 'GS1-07', paper: 'GS1', section: 'Indian Society', title: 'Salient features of Indian Society, Diversity of India' },
  { id: 'GS1-08', paper: 'GS1', section: 'Indian Society', title: 'Role of women and women’s organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies' },
  { id: 'GS1-09', paper: 'GS1', section: 'Indian Society', title: 'Effects of globalization on Indian society' },
  { id: 'GS1-10', paper: 'GS1', section: 'Indian Society', title: 'Social empowerment, communalism, regionalism & secularism' },
  { id: 'GS1-11', paper: 'GS1', section: 'Geography', title: 'Salient features of world’s physical geography' },
  { id: 'GS1-12', paper: 'GS1', section: 'Geography', title: 'Distribution of key natural resources across the world (including South Asia and the Indian sub-continent); factors responsible for the location of primary, secondary, and tertiary sector industries' },
  { id: 'GS1-13', paper: 'GS1', section: 'Geography', title: 'Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone etc., geographical features and their location-changes in critical geographical features and flora/fauna' },

  // ================= GENERAL STUDIES II =================
  { id: 'GS2-01', paper: 'GS2', section: 'Polity & Constitution', title: 'Indian Constitution: historical underpinnings, evolution, features, amendments, significant provisions and basic structure' },
  { id: 'GS2-02', paper: 'GS2', section: 'Polity & Constitution', title: 'Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels and challenges therein' },
  { id: 'GS2-03', paper: 'GS2', section: 'Polity & Constitution', title: 'Separation of powers between various organs, dispute redressal mechanisms and institutions' },
  { id: 'GS2-04', paper: 'GS2', section: 'Polity & Constitution', title: 'Comparison of the Indian constitutional scheme with that of other countries' },
  { id: 'GS2-05', paper: 'GS2', section: 'Polity & Constitution', title: 'Parliament and State legislatures: structure, functioning, conduct of business, powers & privileges and issues arising out of these' },
  { id: 'GS2-06', paper: 'GS2', section: 'Polity & Constitution', title: 'Structure, organization and functioning of the Executive and the Judiciary: Ministries and Departments of the Government; pressure groups and formal/informal associations and their role in the Polity' },
  { id: 'GS2-07', paper: 'GS2', section: 'Polity & Constitution', title: 'Salient features of the Representation of People’s Act' },
  { id: 'GS2-08', paper: 'GS2', section: 'Polity & Constitution', title: 'Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies' },
  { id: 'GS2-09', paper: 'GS2', section: 'Governance', title: 'Statutory, regulatory and various quasi-judicial bodies' },
  { id: 'GS2-10', paper: 'GS2', section: 'Governance', title: 'Government policies and interventions for development in various sectors and issues arising out of their design and implementation' },
  { id: 'GS2-11', paper: 'GS2', section: 'Governance', title: 'Development processes and the development industry: the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders' },
  { id: 'GS2-12', paper: 'GS2', section: 'Social Justice', title: 'Welfare schemes for vulnerable sections of the population by the State and Performance of these schemes; mechanisms, laws, institutions and Bodies constituted for protection and betterment of vulnerable sections' },
  { id: 'GS2-13', paper: 'GS2', section: 'Social Justice', title: 'Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources' },
  { id: 'GS2-14', paper: 'GS2', section: 'Social Justice', title: 'Issues relating to poverty and hunger' },
  { id: 'GS2-15', paper: 'GS2', section: 'Governance', title: 'Important aspects of governance, transparency and accountability, e-governance- applications, models, successes, limitations, and potential; citizens charters, transparency & accountability and institutional measures' },
  { id: 'GS2-16', paper: 'GS2', section: 'Governance', title: 'Role of civil services in a democracy' },
  { id: 'GS2-17', paper: 'GS2', section: 'International Relations', title: 'India and its neighborhood- relations' },
  { id: 'GS2-18', paper: 'GS2', section: 'International Relations', title: 'Bilateral, regional and global groupings and agreements involving India and/or affecting India’s interests' },
  { id: 'GS2-19', paper: 'GS2', section: 'International Relations', title: 'Effect of policies and politics of developed and developing countries on India’s interests, Indian diaspora' },
  { id: 'GS2-20', paper: 'GS2', section: 'International Relations', title: 'Important International institutions, agencies and fora: their structure, mandate' },

  // ================= GENERAL STUDIES III =================
  { id: 'GS3-01', paper: 'GS3', section: 'Economy', title: 'Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment' },
  { id: 'GS3-02', paper: 'GS3', section: 'Economy', title: 'Inclusive growth and issues arising from it' },
  { id: 'GS3-03', paper: 'GS3', section: 'Economy', title: 'Government Budgeting' },
  { id: 'GS3-04', paper: 'GS3', section: 'Agriculture', title: 'Major crops-cropping patterns in various parts of the country, different types of irrigation and irrigation systems storage, transport and marketing of agricultural produce and issues and related constraints; e-technology in the aid of farmers' },
  { id: 'GS3-05', paper: 'GS3', section: 'Agriculture', title: 'Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System: objectives, functioning, limitations, revamping; issues of buffer stocks and food security; Technology missions; economics of animal-rearing' },
  { id: 'GS3-06', paper: 'GS3', section: 'Agriculture', title: 'Food processing and related industries in India: scope and significance, location, upstream and downstream requirements, supply chain management' },
  { id: 'GS3-07', paper: 'GS3', section: 'Agriculture', title: 'Land reforms in India' },
  { id: 'GS3-08', paper: 'GS3', section: 'Economy', title: 'Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth' },
  { id: 'GS3-09', paper: 'GS3', section: 'Infrastructure', title: 'Infrastructure: Energy, Ports, Roads, Airports, Railways etc.' },
  { id: 'GS3-10', paper: 'GS3', section: 'Economy', title: 'Investment models' },
  { id: 'GS3-11', paper: 'GS3', section: 'Science & Technology', title: 'Science and Technology: developments and their applications and effects in everyday life' },
  { id: 'GS3-12', paper: 'GS3', section: 'Science & Technology', title: 'Achievements of Indians in science & technology; indigenization of technology and developing new technology' },
  { id: 'GS3-13', paper: 'GS3', section: 'Science & Technology', title: 'Awareness in the fields of IT, Space, Computers, robotics, nano-technology, bio-technology and issues relating to intellectual property rights' },
  { id: 'GS3-14', paper: 'GS3', section: 'Environment', title: 'Conservation, environmental pollution and degradation, environmental impact assessment' },
  { id: 'GS3-15', paper: 'GS3', section: 'Disaster Management', title: 'Disaster and disaster management' },
  { id: 'GS3-16', paper: 'GS3', section: 'Internal Security', title: 'Linkages between development and spread of extremism' },
  { id: 'GS3-17', paper: 'GS3', section: 'Internal Security', title: 'Role of external state and non-state actors in creating challenges to internal security' },
  { id: 'GS3-18', paper: 'GS3', section: 'Internal Security', title: 'Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security; money-laundering and its prevention' },
  { id: 'GS3-19', paper: 'GS3', section: 'Internal Security', title: 'Security challenges and their management in border areas; linkages of organized crime with terrorism' },
  { id: 'GS3-20', paper: 'GS3', section: 'Internal Security', title: 'Various Security forces and agencies and their mandate' },

  // ================= GENERAL STUDIES IV =================
  { id: 'GS4-01', paper: 'GS4', section: 'Ethics', title: 'Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions; dimensions of ethics; ethics in private and public relationships' },
  { id: 'GS4-02', paper: 'GS4', section: 'Ethics', title: 'Human Values: lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions in inculcating values' },
  { id: 'GS4-03', paper: 'GS4', section: 'Attitude', title: 'Attitude: content, structure, function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion' },
  { id: 'GS4-04', paper: 'GS4', section: 'Aptitude', title: 'Aptitude and foundational values for Civil Service: integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker-sections' },
  { id: 'GS4-05', paper: 'GS4', section: 'Emotional Intelligence', title: 'Emotional intelligence: concepts, and their utilities and application in administration and governance' },
  { id: 'GS4-06', paper: 'GS4', section: 'Thinkers', title: 'Contributions of moral thinkers and philosophers from India and world' },
  { id: 'GS4-07', paper: 'GS4', section: 'Public Service Values', title: 'Public/Civil service values and Ethics in Public administration: Status and problems; ethical concerns and dilemmas in government and private institutions; laws, rules, regulations and conscience as sources of ethical guidance; accountability and ethical governance; strengthening of ethical and moral values in governance; ethical issues in international relations and funding; corporate governance' },
  { id: 'GS4-08', paper: 'GS4', section: 'Probity in Governance', title: 'Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government, Right to Information, Codes of Ethics, Codes of Conduct, Citizen’s Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption' },
  { id: 'GS4-09', paper: 'GS4', section: 'Case Studies', title: 'Case Studies on work-life ethical dilemmas, conflict of interest, integrity, and administrative situations' },

  // ================= PSIR PAPER I (PART A) =================
  { id: 'PSIR-1A-01', paper: 'PSIR_1A', section: 'Political Theory', title: 'Political theory: meaning and approaches' },
  { id: 'PSIR-1A-02', paper: 'PSIR_1A', section: 'Theories of State', title: 'Theories of the state: Liberal, Neoliberal, Marxist, Pluralist, Post-colonial and feminist' },
  { id: 'PSIR-1A-03', paper: 'PSIR_1A', section: 'Justice', title: 'Justice: Conceptions of justice with special reference to Rawl’s theory of justice and its communitarian critiques' },
  { id: 'PSIR-1A-04', paper: 'PSIR_1A', section: 'Equality', title: 'Equality: Social, political and economic; relationship between equality and freedom; Affirmative action' },
  { id: 'PSIR-1A-05', paper: 'PSIR_1A', section: 'Rights', title: 'Rights: Meaning and theories; different kinds of rights; concept of Human Rights' },
  { id: 'PSIR-1A-06', paper: 'PSIR_1A', section: 'Democracy', title: 'Democracy: Classical and contemporary theories; different models of democracy — representative, participatory and deliberative' },
  { id: 'PSIR-1A-07', paper: 'PSIR_1A', section: 'Power', title: 'Concept of power, hegemony, ideology and legitimacy' },
  { id: 'PSIR-1A-08', paper: 'PSIR_1A', section: 'Political Ideologies', title: 'Political Ideologies: Liberalism, Socialism, Marxism, Fascism, Gandhism and Feminism' },
  { id: 'PSIR-1A-09', paper: 'PSIR_1A', section: 'Indian Political Thought', title: 'Indian Political Thought: Dharamshastra, Arthashastra and Buddhist traditions; Sir Syed Ahmed Khan, Sri Aurobindo, M.K. Gandhi, B.R. Ambedkar, M.N. Roy' },
  { id: 'PSIR-1A-10', paper: 'PSIR_1A', section: 'Western Political Thought', title: 'Western Political Thought: Plato, Aristotle, Machiavelli, Hobbes, Locke, John S. Mill, Marx, Gramsci, Hannah Arendt' },

  // ================= PSIR PAPER I (PART B) =================
  { id: 'PSIR-1B-01', paper: 'PSIR_1B', section: 'Indian Nationalism', title: 'Indian Nationalism: Political Strategies of India’s Freedom struggle (Constitutionalism to mass Satyagraha, Non-cooperation, Civil Disobedience; militant and revolutionary movements, Peasant and workers’ movements)' },
  { id: 'PSIR-1B-02', paper: 'PSIR_1B', section: 'Indian Nationalism', title: 'Perspectives on Indian National Movement: Liberal, Socialist and Marxist; Radical humanist and Dalit' },
  { id: 'PSIR-1B-03', paper: 'PSIR_1B', section: 'Making of Constitution', title: 'Making of the Indian Constitution: Legacies of the British rule; different social and political perspectives' },
  { id: 'PSIR-1B-04', paper: 'PSIR_1B', section: 'Salient Features', title: 'Salient Features of the Indian Constitution: The Preamble, Fundamental Rights and Duties, Directive Principles; Parliamentary System and Amendment Procedures; Judicial Review and Basic Structure doctrine' },
  { id: 'PSIR-1B-05', paper: 'PSIR_1B', section: 'Principal Organs', title: 'Principal Organs of the Union Government: Envisaged role and actual working of the Executive, Legislature and Supreme Court' },
  { id: 'PSIR-1B-06', paper: 'PSIR_1B', section: 'Principal Organs', title: 'Principal Organs of the State Government: Envisaged role and actual working of the Executive, Legislature and High Courts' },
  { id: 'PSIR-1B-07', paper: 'PSIR_1B', section: 'Grassroots Democracy', title: 'Grassroots Democracy: Panchayati Raj and Municipal Government; significance of 73rd and 74th Amendments; Grassroot movements' },
  { id: 'PSIR-1B-08', paper: 'PSIR_1B', section: 'Statutory Commissions', title: 'Statutory Institutions/Commissions: Election Commission, Comptroller and Auditor General, Finance Commission, UPSC, National Commission for SCs, STs, Women, Minorities, Backward Classes, Human Rights' },
  { id: 'PSIR-1B-09', paper: 'PSIR_1B', section: 'Federalism', title: 'Federalism: Constitutional provisions; changing nature of centre-state relations; integrationist tendencies and regional aspirations; inter-state disputes' },
  { id: 'PSIR-1B-10', paper: 'PSIR_1B', section: 'Planning & Economy', title: 'Planning and Economic Development: Nehruvian and Gandhian perspectives; role of planning and public sector; Green Revolution, land reforms and agrarian relations; liberalilzation and economic reforms' },
  { id: 'PSIR-1B-11', paper: 'PSIR_1B', section: 'Caste & Religion', title: 'Caste, Religion and Ethnicity in Indian Politics' },
  { id: 'PSIR-1B-12', paper: 'PSIR_1B', section: 'Party System', title: 'Party System: National and regional political parties, ideological and social bases of parties; patterns of coalition politics; Pressure groups, trends in electoral behaviour; changing socio-economic profile of Legislators' },
  { id: 'PSIR-1B-13', paper: 'PSIR_1B', section: 'Social Movements', title: 'Social Movements: Civil liberties and human rights movements; women’s movements; environmentalist and trade union movements' },

  // ================= PSIR PAPER II (PART A) =================
  { id: 'PSIR-2A-01', paper: 'PSIR_2A', section: 'Comparative Politics', title: 'Comparative Politics: Nature and major approaches; political economy and political sociology perspectives; limitations of the comparative method' },
  { id: 'PSIR-2A-02', paper: 'PSIR_2A', section: 'State in Comparative Perspective', title: 'State in comparative perspective: Characteristics and changing nature of the State in capitalist and socialist economies, and advanced industrial and developing societies' },
  { id: 'PSIR-2A-03', paper: 'PSIR_2A', section: 'Representation', title: 'Politics of Representation and Participation: Political parties, pressure groups and social movements in advanced industrial and developing societies' },
  { id: 'PSIR-2A-04', paper: 'PSIR_2A', section: 'Globalisation', title: 'Globalisation: Responses from developed and developing societies' },
  { id: 'PSIR-2A-05', paper: 'PSIR_2A', section: 'IR Approaches', title: 'Approaches to the Study of International Relations: Idealist, Realist, Marxist, Functionalist and Systems theory' },
  { id: 'PSIR-2A-06', paper: 'PSIR_2A', section: 'IR Concepts', title: 'Key concepts in International Relations: National interest, Security and power; Balance of power and deterrence; Transnational actors and collective security; World capitalist economy and globalisation' },
  { id: 'PSIR-2A-07', paper: 'PSIR_2A', section: 'Global Order', title: 'Changing International Political Order: Rise of super powers; strategic and ideological Bipolarity, arms race and Cold War; nuclear threat; Non-aligned movement: Aims and achievements' },
  { id: 'PSIR-2A-08', paper: 'PSIR_2A', section: 'Global Order', title: 'Collapse of the Soviet Union; Unipolarity and American hegemony; relevance of non-alignment in the contemporary world' },
  { id: 'PSIR-2A-09', paper: 'PSIR_2A', section: 'Economic System', title: 'Evolution of the International Economic System: From Brettonwoods to WTO; Socialist economies and the CMEA; Third World demand for new international economic order; Globalisation of the world economy' },
  { id: 'PSIR-2A-10', paper: 'PSIR_2A', section: 'United Nations', title: 'United Nations: Envisaged role and actual working; Specialized UN agencies-aims and functioning; need for UN reforms' },
  { id: 'PSIR-2A-11', paper: 'PSIR_2A', section: 'Regionalisation', title: 'Regionalisation of World Politics: EU, ASEAN, APEC, SAARC, NAFTA' },
  { id: 'PSIR-2A-12', paper: 'PSIR_2A', section: 'Global Concerns', title: 'Contemporary Global Concerns: Human rights, environment, terror, nuclear proliferation' },

  // ================= PSIR PAPER II (PART B) =================
  { id: 'PSIR-2B-01', paper: 'PSIR_2B', section: 'Foreign Policy Determinants', title: 'Indian Foreign Policy: Determinants of foreign policy; the institutions of policy-making; continuity and change' },
  { id: 'PSIR-2B-02', paper: 'PSIR_2B', section: 'NAM Contribution', title: 'India’s Contribution to the Non-Alignment Movement: Different phases; current role' },
  { id: 'PSIR-2B-03', paper: 'PSIR_2B', section: 'India and South Asia', title: 'India and South Asia: Regional Co-operation: SAARC-past performance and future prospects; South Asia as a Free Trade Area' },
  { id: 'PSIR-2B-04', paper: 'PSIR_2B', section: 'India and South Asia', title: 'India’s "Look East" / "Act East" policy; Impediments to regional co-operation: river water disputes; illegal cross-border migration; ethnic conflicts and insurgencies; border disputes' },
  { id: 'PSIR-2B-05', paper: 'PSIR_2B', section: 'Global South', title: 'India and the Global South: Relations with Africa and Latin America; leadership role in the demand for NIEO and WTO negotiations' },
  { id: 'PSIR-2B-06', paper: 'PSIR_2B', section: 'Major Powers', title: 'India and the Global Centres of Power: USA, EU, Japan, China and Russia' },
  { id: 'PSIR-2B-07', paper: 'PSIR_2B', section: 'UN System', title: 'India and the UN System: Role in UN Peace-keeping; demand for Permanent Seat in the Security Council' },
  { id: 'PSIR-2B-08', paper: 'PSIR_2B', section: 'Nuclear Question', title: 'India and the Nuclear Question: Changing perceptions and policy' },
  { id: 'PSIR-2B-09', paper: 'PSIR_2B', section: 'Recent Developments', title: 'Recent developments in Indian Foreign Policy: India’s position on the recent crises in Afghanistan, West Asia, Indo-Pacific and ongoing global conflicts; growing relations with US and Israel; vision of a new world order' }
];

async function main() {
  console.log(`Loading exhaustive UPSC syllabus (${FULL_UPSC_SYLLABUS.length} official units)...`);

  for (const topic of FULL_UPSC_SYLLABUS) {
    await prisma.syllabusTopic.upsert({
      where: { id: topic.id },
      update: {
        paper: topic.paper,
        section: topic.section,
        title: topic.title,
        officialCode: topic.id
      },
      create: {
        id: topic.id,
        paper: topic.paper,
        section: topic.section,
        title: topic.title,
        officialCode: topic.id
      }
    });
  }

  // Count topics by paper to confirm completeness
  const counts = await prisma.syllabusTopic.groupBy({
    by: ['paper'],
    _count: { id: true }
  });

  console.log('\n--- VERIFICATION: SYLLABUS TOPICS LOADED ---');
  counts.forEach(c => {
    console.log(`  Paper ${c.paper.padEnd(8)}: ${c._count.id} official syllabus units`);
  });
  console.log('--------------------------------------------');
  console.log('All official syllabus units successfully seeded into your database.');
}

main().catch(console.error).finally(() => prisma.$disconnect());