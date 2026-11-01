export interface CurrentAffairItem {
  id: string;
  headline: string;
  date: string;
  source: string;
  sourceUrl: string;
  gsLink: string;
  psirLink: string;
  prelimsFact: string;
  mainsDimension: string;
  isLive: boolean;
}

// Bypasses local Node.js SSL certificate verification for Indian .gov.in servers
if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function analyzeHeadline(title: string, desc: string): {
  gsLink: string;
  psirLink: string;
  prelimsFact: string;
  mainsDimension: string;
} {
  const text = (title + ' ' + desc).toLowerCase();

  // 1. Bilateral / Head of State / Diplomatic Visits
  if (text.includes('president') || text.includes('prince') || text.includes('diplomat') || text.includes('bilateral') || text.includes('foreign') || text.includes('mou') || text.includes('ambassador')) {
    return {
      gsLink: 'GS2: Bilateral, Regional and Global Groupings and Agreements involving India',
      psirLink: 'PSIR 2B: India and Global Centres of Power / Diplomatic Statecraft',
      prelimsFact: 'Nodal Body: Ministry of External Affairs. Constitutional Provision: Article 51 (DPSP to foster respect for international law and treaty obligations). Under Article 253, Parliament has exclusive power to make any law for implementing international treaties or agreements.',
      mainsDimension: 'Examines diplomatic protocol, bilateral trade diversification, and strategic engagement with European and Global South partners.'
    };
  }

  // 2. Health / Welfare / Preventive Healthcare
  if (text.includes('health') || text.includes('medical') || text.includes('hospital') || text.includes('swachh') || text.includes('welfare') || text.includes('campaign')) {
    return {
      gsLink: 'GS2: Issues Relating to Development and Management of Social Sector: Health & Human Resources',
      psirLink: 'PSIR 1B: Public Policy and Administrative Delivery in Welfare State',
      prelimsFact: 'Nodal Body: Ministry of Health & Family Welfare. Public health and sanitation is primarily an Entry 6 matter under the State List (Seventh Schedule). Special Campaign 2.0/3.0/4.0 is overseen by the Department of Administrative Reforms and Public Grievances (DARPG).',
      mainsDimension: 'Evaluates the shift from curative to preventive primary healthcare, workplace wellness frameworks, and institutional grievance redressing.'
    };
  }

  // 3. Parliamentary Affairs, Bills & Statutes
  if (text.includes('bill') || text.includes('act') || text.includes('ordinance') || text.includes('parliament') || text.includes('standing committee') || text.includes('legislative')) {
    return {
      gsLink: 'GS2: Parliament and State Legislatures — Structure, Functioning & Conduct of Business',
      psirLink: 'PSIR 1B: Principal Organs of Union Government (Parliamentary Scrutiny)',
      prelimsFact: 'Legislative Procedure: Article 107 & 108. An Ordinance promulgated under Article 123 must be approved by Parliament within 6 weeks of reassembly. Standing Committees are non-statutory bodies governed by the Rules of Procedure of the respective House.',
      mainsDimension: 'Analyses the decline of pre-legislative consultative processes, delegated legislation oversight, and parliamentary scrutiny.'
    };
  }

  // 4. Judicial & Constitutional
  if (text.includes('court') || text.includes('judge') || text.includes('bench') || text.includes('verdict') || text.includes('tribunal') || text.includes('justice')) {
    return {
      gsLink: 'GS2: Structure, Organization and Functioning of the Judiciary',
      psirLink: 'PSIR 1B: Judicial Review, Basic Structure & Transformative Constitutionalism',
      prelimsFact: 'Article 131 gives Supreme Court exclusive original jurisdiction in Centre-State disputes. Article 142 empowers the Court to pass any decree necessary for doing "complete justice". Advisory jurisdiction lies under Article 143.',
      mainsDimension: 'Examines constitutional balance between judicial activism and legislative supremacy, judicial appointments, and systemic case disposal backlogs.'
    };
  }

  // 5. Economy & Finance
  if (text.includes('rbi') || text.includes('inflation') || text.includes('tax') || text.includes('gst') || text.includes('trade') || text.includes('gdp') || text.includes('bank') || text.includes('fund')) {
    return {
      gsLink: 'GS3: Indian Economy and issues relating to Planning, Resource Mobilization & Growth',
      psirLink: 'PSIR 1B: Political Economy of Planning and Public Sector Reforms',
      prelimsFact: 'Statutory Body: Reserve Bank of India operates under RBI Act 1934. Monetary Policy Committee (Section 45ZB) targets headline CPI (4% +/- 2%), not WPI. Finance Commission is constituted every 5 years under Article 280.',
      mainsDimension: 'Balancing fiscal consolidation with public capital expenditure and domestic credit transmission.'
    };
  }

  // 6. Environment & S&T
  if (text.includes('climate') || text.includes('forest') || text.includes('green') || text.includes('solar') || text.includes('space') || text.includes('isro') || text.includes('species')) {
    return {
      gsLink: 'GS3: Environment, Ecology & Science and Technology Developments',
      psirLink: 'PSIR 2A: Transnational Environmental Concerns and Global Climate Governance',
      prelimsFact: 'Statutory Framework: Environment (Protection) Act, 1986 was enacted under Article 253 to implement 1972 Stockholm Conference decisions. National Green Tribunal (NGT) was established under NGT Act 2010.',
      mainsDimension: 'Evaluates common but differentiated responsibilities (CBDR), indigenous technological innovation, and sustainable ecological transitions.'
    };
  }

  // Default Governance Profile
  return {
    gsLink: 'GS2: Government Policies and Interventions for Development in Various Sectors',
    psirLink: 'PSIR 1B: Public Policy and Administrative Delivery Mechanisms',
    prelimsFact: 'Central Sector Schemes are 100% funded by the Union Government, while Centrally Sponsored Schemes are cost-shared with States (typically 60:40 or 90:10 for special category states).',
    mainsDimension: 'Structural evaluation of executive program delivery, accountability indices, and digital governance penetration.'
  };
}

export async function fetchVerifiedCurrentAffairs(): Promise<CurrentAffairItem[]> {
  const items: CurrentAffairItem[] = [];

  // 1. Official National English PIB Feed (Regid=1 for National New Delhi English)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Regid=1 & Lang=1 enforces New Delhi National English Releases
    const res = await fetch('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EnglishNewsClient/1.0',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
        const block = match[1];
        const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/);
        const linkMatch = block.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || block.match(/<link>(.*?)<\/link>/);
        const descMatch = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || block.match(/<description>(.*?)<\/description>/);
        const dateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);

        const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
        let link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : 'https://pib.gov.in/allRel.aspx?lang=1';
        const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : '';
        const dateStr = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // CRITICAL: Reject any Devanagari/Hindi characters [\u0900-\u097F]
        const hasHindi = /[\u0900-\u097F]/.test(title);

        if (title.length > 15 && !hasHindi) {
          if (!link.startsWith('http')) link = 'https://pib.gov.in/allRel.aspx?lang=1';
          if (link.includes('pib.gov.in') && !link.includes('lang=')) {
            link += (link.includes('?') ? '&' : '?') + 'lang=1';
          }

          const analysis = analyzeHeadline(title, desc);

          items.push({
            id: 'PIB-ENG-' + Date.now() + '-' + items.length,
            headline: title,
            date: dateStr,
            source: 'Press Information Bureau (Official National English)',
            sourceUrl: link,
            gsLink: analysis.gsLink,
            psirLink: analysis.psirLink,
            prelimsFact: analysis.prelimsFact,
            mainsDimension: analysis.mainsDimension,
            isLive: true
          });
        }
      }
    }
  } catch (e) {
    // Continue to PRS Legislative if PIB times out
  }

  // 2. If PIB had few English items, fetch official PRS Legislative English feed
  if (items.length < 4) {
    try {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 3500);

      const resPrs = await fetch('https://prsindia.org/rss.xml', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EnglishNewsClient/1.0' },
        signal: controller2.signal,
        cache: 'no-store'
      });

      clearTimeout(timeout2);

      if (resPrs.ok) {
        const prsXml = await resPrs.text();
        const prsRegex = /<item>([\s\S]*?)<\/item>/g;
        let prsMatch;

        while ((prsMatch = prsRegex.exec(prsXml)) !== null && items.length < 6) {
          const b = prsMatch[1];
          const tMatch = b.match(/<title>(.*?)<\/title>/);
          const lMatch = b.match(/<link>(.*?)<\/link>/);
          const dMatch = b.match(/<description>(.*?)<\/description>/);

          const t = tMatch ? tMatch[1].replace(/&amp;/g, '&').trim() : '';
          const l = lMatch ? lMatch[1].trim() : 'https://prsindia.org/billtrack';
          const d = dMatch ? dMatch[1].replace(/<[^>]+>/g, '').trim() : '';

          if (t.length > 15 && !/[\u0900-\u097F]/.test(t)) {
            const analysis = analyzeHeadline(t, d);
            items.push({
              id: 'PRS-ENG-' + Date.now() + '-' + items.length,
              headline: t,
              date: new Date().toISOString().split('T')[0],
              source: 'PRS Legislative Research (Parliament of India)',
              sourceUrl: l,
              gsLink: analysis.gsLink,
              psirLink: analysis.psirLink,
              prelimsFact: analysis.prelimsFact,
              mainsDimension: analysis.mainsDimension,
              isLive: true
            });
          }
        }
      }
    } catch (e) {
      // Handled
    }
  }

  if (items.length > 0) {
    return items;
  }

  // 3. Fallback High-Yield National English Repository
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'SOV-01',
      headline: 'Cabinet Committee on Economic Affairs: Review of Agricultural Procurement Logistics and Support Prices',
      date: today,
      source: 'Press Information Bureau (Official National English)',
      sourceUrl: 'https://pib.gov.in/allRel.aspx?lang=1',
      gsLink: 'GS3: Major Crops, Minimum Support Price (MSP) & Agricultural Marketing',
      psirLink: 'PSIR 1B: Political Economy of Indian Agriculture and Agrarian Relations',
      prelimsFact: 'Commission for Agricultural Costs and Prices (CACP) is an advisory body under the Ministry of Agriculture. MSP is announced for 22 mandated crops + Fair and Remunerative Price (FRP) for sugarcane. MSP has NO statutory backing under any Act of Parliament.',
      mainsDimension: 'Examines economic trade-offs of legalizing MSP, crop diversification away from water-intensive monocultures, and FCI food subsidy fiscal deficits.',
      isLive: false
    },
    {
      id: 'SOV-02',
      headline: 'Ministry of External Affairs: Indo-Pacific Maritime Domain Awareness and Strategic Logistics Agreements',
      date: today,
      source: 'Ministry of External Affairs (Official English Releases)',
      sourceUrl: 'https://www.mea.gov.in/press-releases.htm',
      gsLink: 'GS2: Bilateral, Regional and Global Groupings involving India',
      psirLink: 'PSIR 2B: Strategic Autonomy, Quad and Major Power Relations',
      prelimsFact: 'Reciprocal logistics agreements (LEMOA with US, RELOS with Russia, pacts with France & Japan) allow military port access for refuelling, but do NOT constitute a mutual defence treaty. India retains sovereign strategic autonomy.',
      mainsDimension: 'Analyses the reconciliation of continental border security priorities with maritime multilateral partnerships in the Indian Ocean.',
      isLive: false
    }
  ];
}