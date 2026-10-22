/**
 * Centralised research data for the MO-SS033 Terminal Assessment website.
 * Every section reads from this file.
 * Nothing here is invented: each claim carries the reference key it comes from.
 */

export type RefKey =
  | 'adb2020' | 'adb2021' | 'dagooc2026' | 'dole' | 'huynh2026'
  | 'ilo2026a' | 'ilo2026b' | 'khan2026' | 'malaya2025' | 'moe2025'
  | 'mti2025' | 'psa2026' | 'ra10869' | 'ra11962' | 'ra12063'
  | 'tesda2025' | 'wsg';

/** A sentence and the sources it draws on. Rendered with its citation before the full stop. */
export interface Sentence { t: string; refs?: RefKey[] }

export interface Reference {
  key: RefKey; author: string; year: string; title: string;
  container?: string; url: string; note?: string;
  /** Part of a larger work (a news article, a chapter in a survey). APA 7 italicises
      the larger work, not the part, so the container is set in italics instead. */
  part?: boolean;
  /** For an undated page that changes over time, APA 7 adds the date it was read. */
  retrieved?: string;
}

export const REFERENCES: Reference[] = [
  { key:'adb2020', author:'Asian Development Bank', year:'2020',
    title:'Job creation and skills development in the Philippines (Technical assistance performance evaluation report)',
    container:'Independent Evaluation Department',
    url:'https://www.adb.org/documents/technical-assistance-performance-evaluation-report-job-creation-and-skills-development' },
  { key:'adb2021', author:'Asian Development Bank', year:'2021, June 29',
    title:'How the Philippines can prepare its workers for automation', container:'Development Asia',
    url:'https://development.asia/explainer/how-philippines-can-prepare-its-workers-automation' },
  { key:'dagooc2026', author:'Dagooc, E. M.', year:'2026, June 13',
    title:'Philippines BPO sector grows 4% to 1.68M despite AI fears', container:'The Freeman', part:true,
    url:'https://www.philstar.com/nation/2026/06/13/2534925/philippines-bpo-sector-grows-4-168m-despite-ai-fears' },
  { key:'dole', author:'Department of Labor and Employment', year:'n.d.',
    title:'JobStart Philippines Program', retrieved:'October 22, 2026', url:'https://jobstart.philjobnet.gov.ph/' },
  { key:'huynh2026', author:'Huynh, P.', year:'2026',
    title:'Generative AI and jobs in the Philippines: Labour market exposure and policy implications',
    container:'International Labour Organization',
    url:'https://www.ilo.org/publications/generative-ai-and-jobs-philippines-labour-market-exposure-and-policy' },
  { key:'ilo2026a', author:'International Labour Organization', year:'2026a, July 8',
    title:'AI may affect nearly 80 million workers in the ASEAN region, but large-scale job disruption not yet seen',
    url:'https://www.ilo.org/resource/news/ai-may-affect-nearly-80-million-workers-asean-region-large-scale-job' },
  { key:'ilo2026b', author:'International Labour Organization', year:'2026b',
    title:'Generative AI and labour markets in ASEAN: Significant exposure, limited disruption, uneven preparedness',
    url:'https://www.ilo.org/publications/generative-ai-and-labour-markets-asean-significant-exposure-limited' },
  { key:'khan2026', author:'Khan, A.', year:'2026, August 5',
    title:'Generative AI puts Philippines BPO jobs under pressure as government races to reskill workforce',
    container:'People Matters SEA',
    url:'https://sea.peoplemattersglobal.com/news/ai-and-emerging-tech/generative-ai-puts-philippines-bpo-jobs-under-pressure-as-government-races-to-reskill-workforce-51271' },
  { key:'malaya2025', author:'Isip, I.', year:'2025, May 21',
    title:'IT-BPM to kickstart govt-approved P740M upskill plan in H2', container:'Malaya Business Insight', part:true,
    url:'https://malaya.com.ph/business/business-news/it-bpm-to-kickstart-govt-approved-p740m-upskill-plan-in-h2' },
  { key:'moe2025', author:'Ministry of Education Singapore', year:'2025, November 5',
    title:'Considerations and efforts taken to increase usage of $500 SkillsFuture Credits before its expiry end-2025 [Parliamentary reply]',
    url:'https://www.moe.gov.sg/news/parliamentary-replies/20251105-considerations-and-efforts-taken-to-increase-usage-of-$500-skillsfuture-credits-before-its-expiry-end-2025' },
  { key:'mti2025', author:'Ministry of Trade and Industry Singapore', year:'2025, February 14',
    title:"Impact evaluation of Workforce Singapore's place-and-train Career Conversion Programme",
    container:'Economic Survey of Singapore', part:true,
    url:'https://www.meti.gov.sg/resources/economic-survey-of-singapore/economic-survey-of-singapore-and-feature-articles/impact-evaluation-of-workforce-singapore-s-place-and-train-career-conversion-programme/',
    note:'The paper carries a disclaimer that the views are the authors’ own and do not necessarily reflect those of the Ministry of Manpower, the Ministry of Trade and Industry, Workforce Singapore, or the Government of Singapore, so the figures are a government-published study rather than an agency position. The article appeared in the Economic Survey of Singapore; the site states it moved to meti.gov.sg on 1 October 2026.' },
  { key:'psa2026', author:'Philippine Statistics Authority', year:'2026, September 8',
    title:'Number of employed persons rose to 49.21 million as underemployment declined in July 2026 (Reference No. 2026-298)',
    url:'https://psa.gov.ph/content/number-employed-persons-rose-4921-million-underemployment-declined-july-2026' },
  { key:'ra10869', author:'Republic Act No. 10869, JobStart Philippines Act', year:'2016, June 29',
    title:'An act institutionalizing the nationwide implementation of the JobStart Philippines Program and providing funds therefor',
    url:'https://legacy.senate.gov.ph/republic_acts/ra%2010869.pdf' },
  { key:'ra11962', author:'Republic Act No. 11962, Trabaho Para sa Bayan Act', year:'2023, September 27',
    title:'An act establishing the National Employment Master Plan',
    url:'https://lawphil.net/statutes/repacts/ra2023/ra_11962_2023.html' },
  { key:'ra12063', author:'Republic Act No. 12063, Enterprise-Based Education and Training (EBET) Framework Act', year:'2024, November 7',
    title:'An act institutionalizing the enterprise-based education and training framework and appropriating funds therefor',
    url:'https://lawphil.net/statutes/repacts/ra2024/ra_12063_2024.html' },
  { key:'tesda2025', author:'Technical Education and Skills Development Authority', year:'2025, May 22',
    title:'TESDA, LinkedIn forge partnership for upskilling of Ph workforce',
    url:'https://tesda.gov.ph/Media/NewsDetail/20405' },
  { key:'wsg', author:'Workforce Singapore', year:'n.d.',
    title:'Support for Job Redesign under Productivity Solutions Grant (PSG-JR)',
    url:'https://www.wsg.gov.sg/productivity-solutions-grant-job-redesign.html' },
];

export const refMap = Object.fromEntries(REFERENCES.map(r => [r.key, r])) as Record<RefKey, Reference>;

export const shortCite = (k: RefKey) => {
  const r = refMap[k];
  const y = r.year.split(',')[0];
  if (k.startsWith('ra')) return `${r.author.split(',')[0]}, ${y}`;
  return `${r.author.replace(/,.*$/, '')}, ${y}`;
};

/**
 * Evidence cards. Each one names a single claim the site makes, the source behind
 * it, and the geographic scope that claim actually covers. These sit alongside the
 * APA reference list in section L rather than replacing it: the reference list is
 * the formal citation, these are the fast path for a reader checking a figure.
 *
 * Every field is taken from the source itself. Nothing here is paraphrased into a
 * stronger claim than the source supports.
 */
export interface Evidence {
  id: string;
  claim: string;
  finding: string;
  scope: string;
  ref: RefKey;
  /** Which section the claim appears in, so the card can sit next to it. */
  section: 'challenge' | 'ranking' | 'proposal' | 'solutions';
}

export const EVIDENCE: Evidence[] = [
  { id:'e1', section:'challenge',
    claim:'12.7 million Filipino workers are in occupations exposed to generative AI',
    finding:'More than one quarter of Philippine employment is in occupations with more than minimal exposure, the highest rate among the ASEAN countries with recent comparable data. Only 3.6 percent falls in the highest displacement risk category.',
    scope:'Philippines, national', ref:'huynh2026' },
  { id:'e2', section:'challenge',
    claim:'Exposure is concentrated by gender, age and region',
    finding:'Women face roughly double the exposure of men. Youth exposure is slightly lower overall but concentrated in occupations at greater displacement risk. Around two in five NCR jobs are exposed; Central Luzon and Calabarzon each exceed 30 percent.',
    scope:'Philippines, by region and demographic', ref:'huynh2026' },
  { id:'e3', section:'challenge',
    claim:'22.9 percent of ASEAN employment has more than minimal exposure',
    finding:'Nearly 80 million workers across ASEAN in 2025, with little widespread disruption observed so far and uneven national preparedness.',
    scope:'ASEAN, ten countries', ref:'ilo2026b' },
  { id:'e4', section:'challenge',
    claim:'49.21 million Filipinos were employed in July 2026',
    finding:'Employment rose to 49.21 million as underemployment declined. This is the base the exposure share is measured against.',
    scope:'Philippines, July 2026 labour force survey', ref:'psa2026' },
  { id:'e5', section:'challenge',
    claim:'The contact centre sector grew about 4 percent to 1.68 million workers in 2025',
    finding:'The source reports the workforce expanding 4 percent to 1.68 million in 2025, from 1.62 million a year earlier, so the sector grew despite AI adoption. Separate industry reporting describes more than two thirds of member firms running AI pilots and creating roles such as AI trainers and prompt engineers.',
    scope:'Philippines, IT-BPM sector', ref:'dagooc2026' },
  { id:'e6', section:'ranking',
    claim:'Place-and-train raised wages 2.5 percent in the placement year',
    finding:'Measured against control groups: 2.5 percent higher wages in the placement year, 5.8 to 6.5 percent over the following four years, and retention 3.9 percentage points higher. The paper states the views are the authors\u2019 own rather than official agency positions.',
    scope:'Singapore only. Not a Philippine result.', ref:'mti2025' },
  { id:'e7', section:'solutions',
    claim:'About 3 in 10 eligible Singaporeans used the one-off SkillsFuture top-up',
    finding:'Close to 800,000 people as at end-September 2025, with mid-career workers aged 40 to 60 close to half of users. The source reports take-up, not employment or wage outcomes.',
    scope:'Singapore only', ref:'moe2025' },
  { id:'e8', section:'proposal',
    claim:'Employed workers are already eligible for enterprise-based training',
    finding:'Section 6 states a trainee shall either be a new entrant to the labour force or an employed worker who opts to undergo training. Section 4(i) covers enterprise upskilling for existing employees. Approved 7 November 2024.',
    scope:'Philippines, statutory', ref:'ra12063' },
  { id:'e9', section:'proposal',
    claim:'Employers already receive a training-expense deduction',
    finding:'Section 20 gives an additional deduction from taxable income of 50 percent of actual training expenses through 31 December 2027, rising to 75 percent from 1 January 2028, capped at the lower of 5 percent of total direct labour expenses or 25 million pesos a year.',
    scope:'Philippines, statutory', ref:'ra12063' },
  { id:'e10', section:'proposal',
    claim:'740 million pesos is committed to reskilling 340,000 IT-BPM workers',
    finding:'Government-approved funding over three years in digital and AI skills, set to start in the second half of 2025. No outcome data had been published at the time of writing.',
    scope:'Philippines, IT-BPM sector', ref:'malaya2025' },
  { id:'e11', section:'proposal',
    claim:'JobStart supplies the delivery mechanics the proposal borrows',
    finding:'The Act sets ten days of life skills training, up to three months of technical training, and an internship of up to three months or 600 hours, with an employer-paid stipend of at least 75 percent of the prevailing minimum wage. Eligibility is restricted to ages 18 to 24 with under a year of work experience.',
    scope:'Philippines, statutory', ref:'ra10869' },
];

/* ---------------------------------------------------------------- identity */
export const PROJECT = {
  course: 'MO-SS033 The Contemporary World',
  assessment: 'Terminal Assessment',
  student: 'Vanessa Rose A. Salonoy',
  section: 'H1103',
  mentor: 'Ms. Bella Joy Bardolas',
  arrangement: 'Working individually',
  driver: 'Technology',
  title: 'Workplace Automation and Filipino Workers',
  /** The formal title's second half. Title and titleSub together are the research title. */
  titleSub: 'Evaluating Reskilling, Job Redesign, and Career Conversion',
  subtitle: 'Evaluating reskilling, job redesign and career conversion, and proposing a Philippine place-and-train track',
  headline: 'The future of Filipino work is changing.',
  version: 'v2.4 draft',
  draftDue: '24 October 2026',
  finalDue: '7 November 2026',
  focusIssue:
    'Workplace automation and Filipino workers: how automation is changing jobs and skill requirements, and whether workers are being supported through that change.',
  position:
    'I support the continued use of workplace automation, because the evidence so far shows it is changing Filipino jobs more than erasing them, and it can raise productivity and open up higher value work. But exposure is concentrated in IT-BPM, in roles held by women and young workers, and in NCR and nearby regions, and readiness is uneven. So automation should be paired with deliberate support for the workers whose roles are changing, designed into the transition rather than offered after people have already lost ground.',
};

/**
 * Intended audience. The Terminal Assessment Guide asks for a named audience and
 * for what they already know, what they need to understand, and what they should
 * consider afterwards. This is that statement.
 */
export const AUDIENCE = {
  who: 'Filipino workers in automation-exposed occupations, and the people who design support for them: PESO staff, employer learning and development teams, and training providers.',
  known: 'This audience already knows that automation is changing work, and most have seen the headline warnings about jobs disappearing. Workers in IT-BPM in particular have watched AI pilots arrive in their own workplaces.',
  needed: 'What is less widely understood is the difference between exposure and displacement. More than a quarter of Philippine employment sits in exposed occupations, but only 3.6 percent falls in the highest displacement risk group, and the disruption has not arrived at the scale the warnings implied. The support that exists is also narrower than it appears: training is funded, but income during a mid-career transition is not.',
  consider: 'After reading, the intended audience should be able to say which existing Philippine programme would and would not cover a worker in their situation, and why income support during retraining is the gap this proposal tries to close rather than another training scheme.',
  ref: ['huynh2026'] as RefKey[],
};

/* -------------------------------------------------------- globalization (A) */
/** How the driver reaches Filipino workers. Every sourced sentence carries its citation. */
export const GLOBALIZATION: { heading: string; sentences: Sentence[] } = {
  heading: 'Why this is a globalization issue',
  sentences: [
    { t:'Technology is the globalization driver here, and it reaches Filipino workers through the global trade in services' },
    { t:'For more than two decades the IT-BPM industry has helped position the Philippines as a global outsourcing hub, and that concentration of service-sector and outsourcing roles is what leaves the Philippine workforce particularly exposed to automation', refs:['khan2026'] },
    { t:'The competition is international as well: Philippine providers must keep pace with competitors in countries such as India, and the national upskilling budget for IT-BPM workers is described as essential to the country’s global competitiveness as AI reshapes the workforce', refs:['malaya2025','khan2026'] },
    { t:'Demand from abroad is shifting the skills employers want: global companies are seeking customer experience partners that combine human expertise with AI-enabled operations, and in an industry survey AI and automation expertise ranked as the most sought-after skills among employers', refs:['dagooc2026'] },
    { t:'For workers in these roles, AI can raise productivity, change job requirements and make some roles redundant at the same time', refs:['khan2026'] },
    { t:'Exposure is still not the same as job loss: the ILO describes it as the automation of tasks within occupations rather than full job replacement', refs:['huynh2026'] },
  ],
};

/* ---------------------------------------------------- causes of adoption (B) */
/** Why firms adopt AI, kept apart from what adoption does to workers. */
export const ADOPTION_CAUSES: { heading: string; sentences: Sentence[] } = {
  heading: 'Why firms are adopting AI',
  sentences: [
    { t:'Adoption is accelerating in the Philippines, particularly in the IT-BPM sector, although uptake remains uneven because of structural barriers', refs:['huynh2026'] },
    { t:'In the contact centre industry, an executive survey ranked AI adoption as the third-largest growth driver for 2025, behind expanding existing client accounts and winning new customers, and named talent readiness, ahead of cost, as the biggest obstacle to scaling it', refs:['dagooc2026'] },
    { t:'Industry experts also describe pressure from international clients that expect outsourcing providers to use AI to reduce costs and improve productivity', refs:['khan2026'] },
    { t:'These are reasons firms adopt the technology' },
    { t:'They are not measures of what happens to workers, and the evidence below keeps the two apart' },
  ],
};

/* ------------------------------------------------------------- the numbers */
export interface Stat { value: string; label: string; detail: string; ref: RefKey[]; accent?: 'cyan'|'amber'|'rose'; countTo?: number; suffix?: string; decimals?: number }

export const HEADLINE_STATS: Stat[] = [
  { value:'12.7M', countTo:12.7, decimals:1, suffix:'M', accent:'cyan',
    label:'Filipino workers in occupations exposed to generative AI',
    detail:'More than one quarter of employment, and the highest exposure rate among ASEAN countries with recent comparable data.', ref:['huynh2026'] },
  { value:'3.6%', countTo:3.6, decimals:1, suffix:'%', accent:'amber',
    label:'of jobs fall in the highest displacement risk category',
    detail:'Exposure means task automation inside occupations. It is not the same as a job being replaced.', ref:['huynh2026'] },
  { value:'49.21M', countTo:49.21, decimals:2, suffix:'M', accent:'cyan',
    label:'Filipinos employed as of July 2026',
    detail:'The employment base the exposure figure sits inside.', ref:['psa2026'] },
  { value:'1.68M', countTo:1.68, decimals:2, suffix:'M', accent:'cyan',
    label:'contact centre workers, after about 4 percent growth in 2025',
    detail:'The sector grew even as more than two thirds of industry member firms ran AI pilots.', ref:['dagooc2026','khan2026'] },
];

export const EXPOSURE_BY_REGION = [
  { name:'National Capital Region', value:40, note:'Around two in five jobs exposed' },
  { name:'Central Luzon (III)', value:30, note:'Exceeds 30 percent' },
  { name:'Calabarzon (IV-A)', value:30, note:'Exceeds 30 percent' },
];

export const EXPOSURE_NOTES = [
  { k:'Gender', v:'Women face double the rate of exposure of men, because they are concentrated in high-exposure occupations. Women with advanced education face particularly high disruption potential.', ref:['huynh2026'] as RefKey[] },
  { k:'Age', v:'Overall youth exposure is slightly lower than adult exposure, but young people are more likely to work in occupations at greater displacement risk, especially service and sales and clerical support.', ref:['huynh2026'] as RefKey[] },
  { k:'Region', v:'Exposure is highest in NCR, where around two in five jobs are exposed. Central Luzon and Calabarzon both exceed 30 percent.', ref:['huynh2026'] as RefKey[] },
  { k:'Region-wide', v:'Across ASEAN the ILO estimates 22.9 percent of employment in 2025, nearly 80 million workers, has more than minimal exposure, yet finds little widespread disruption so far.', ref:['ilo2026a','ilo2026b'] as RefKey[] },
];

/* -------------------------------------------------------------- the actors */
export interface Stakeholder { name:string; role:string; affected:string; interest:string; contribution:string; ref:RefKey[] }

export const STAKEHOLDERS: Stakeholder[] = [
  { name:'Filipino workers in exposed roles', role:'The people the proposal is for',
    affected:'Their tasks change first. Exposure is concentrated among women, young entry-level workers and NCR-based roles.',
    interest:'Keeping income while retraining, and whether the new role is real and lasting.',
    contribution:'Take up a conversion place and complete the training.', ref:['huynh2026'] },
  { name:'Employers and IT-BPM firms', role:'Hire first, then train',
    affected:'They carry the person while training happens. More than two thirds of industry member firms ran AI pilots.',
    interest:'Cost and productivity during the conversion period, and the risk of training someone who leaves.',
    contribution:'Offer conversion roles, deliver on-the-job training, report outcomes.', ref:['khan2026'] },
  { name:'DOLE, Bureau of Local Employment and PESOs', role:'Programme owner and local delivery',
    affected:'Would administer a new track on machinery they already run.',
    interest:'Capacity and funding. PESOs already run JobStart intake and monthly monitoring.',
    contribution:'Intake, assessment, matching, allowances, monitoring.', ref:['ra10869','dole'] },
  { name:'TESDA', role:'Training standards, accreditation and EBET registration',
    affected:'Course alignment becomes the binding constraint, and TESDA is the primary implementing agency for enterprise-based training.',
    interest:'ADB flagged that the most availed TVET courses often lead to low-productivity occupations.',
    contribution:'Accredit providers, register enterprise programmes, align courses to converted roles.', ref:['adb2021','ra12063'] },
  { name:'DICT and IBPAP', role:'Demand signal and sector steering',
    affected:'Already aligning programme strategies on the 740 million peso commitment.',
    interest:'That benefits reach workers and not only employers.',
    contribution:'Identify the growth roles worth converting into.', ref:['malaya2025','khan2026'] },
  { name:'Training providers and TVIs', role:'Deliver the technical training',
    affected:'Volume and standards both rise. Enterprises may deliver alone or with a technical-vocational institution.',
    interest:'Funding certainty and accreditation.',
    contribution:'Deliver courses mapped to actual vacancies.', ref:['ra12063','tesda2025'] },
  { name:'Local government units', role:'Host and staff the PESOs',
    affected:'PESO staffing and workload.', interest:'Local employment outcomes.',
    contribution:'Staff and resource the PESO function.', ref:['ra10869'] },
];

export const STAKEHOLDER_LIMIT =
  'No group here has endorsed this proposal. The sources show government and industry support for reskilling in general. Worker acceptance is unmeasured in everything I reviewed.';

/* ----------------------------------------------------------- the solutions */
export type Rating = 'Low'|'Low to moderate'|'Moderate'|'Moderate to high'|'High'|'High in principle'|'High as a design'|'Not shown'|'Strongest';
export interface Solution {
  id:string; rank:number; name:string; short:string; where:string;
  what:string; who:string; status:string;
  /** Who the programme is actually for. Ms. Bella asked for this by name in her
   *  Milestone 2 comments, alongside implementing organisation and location. */
  targetPopulation:string;
  detail:string[];
  criteria:{ sustainability:{r:Rating;why:string}; impact:{r:Rating;why:string}; feasibility:{r:Rating;why:string}; effectiveness:{r:Rating;why:string} };
  rankWhy:string;
  ref:RefKey[];
}

export const SOLUTIONS: Solution[] = [
  { id:'s1', rank:2, name:'Government-funded reskilling and upskilling', short:'National reskilling', where:'Philippines',
    what:'740 million pesos to train 340,000 IT-BPM workers over three years in digital and AI skills.',
    who:'National government funds it, the industry association helps steer it.',
    status:'Approved and funded, set to start in the second half of 2025. Not a programme with published results.',
    targetPopulation:'Workers already employed in IT-BPM, with the programme also open to college students close to being hired. 340,000 places over three years.',
    detail:[
      'IBPAP aligns programme strategies with TESDA and DICT.',
      'The target group includes people close to being hired as well as college students, so it covers both current and incoming workers.',
      'Training supply was expanded separately by a TESDA memorandum with LinkedIn in May 2025, opening more than 23,000 LinkedIn Learning courses to TESDA stakeholders as part of an effort aimed at BPO workers.',
      'Republic Act No. 11962 gives the legal basis, covering skilling, upskilling and reskilling with an emphasis on lifelong learning.',
    ],
    criteria:{
      sustainability:{r:'Moderate', why:'RA 11962 gives a standing legal basis, but the 740 million peso commitment is a three-year amount rather than a permanent facility.'},
      impact:{r:'Moderate', why:'Targets 340,000 IT-BPM workers while ILO exposure covers 12.7 million across all sectors. The two figures describe different populations and are not a coverage rate.'},
      feasibility:{r:'High', why:'Already funded and approved to start, with Philippine agencies and a legal mandate in place.'},
      effectiveness:{r:'Not shown', why:'No published outcome results among the sources I reviewed, because it was only set to start in the second half of 2025.'},
    },
    rankWhy:'It scores highest of the five on feasibility, on the evidence available: it is funded, approved with a start date, and backed by legislation. What it does not have yet is a published outcome result, and its target is narrow against the exposed population. I weighted effectiveness more heavily because my question is whether workers are actually supported, not whether a programme exists.',
    ref:['malaya2025','ra11962','tesda2025','huynh2026'] },

  { id:'s2', rank:4, name:'Employer-led job redesign', short:'Job redesign', where:'Singapore',
    what:'Grants for enterprises to work with pre-approved consultants on redesigning work processes, tasks and responsibilities.',
    who:'The employer decides, government subsidises the consultancy.',
    status:'The Workforce Singapore page states the grant ends on 31 December 2025. I found no successor scheme.',
    targetPopulation:'Enterprises rather than individuals. The employer applies, and the workers affected are whoever holds the redesigned roles.',
    detail:[
      'Firms can claim up to 30,000 Singapore dollars for consultancy, with a higher funding share for SMEs than for larger firms.',
      'The scheme is administered by the Singapore National Employers Federation on Workforce Singapore’s behalf.',
      'In the Philippines, industry reporting describes firms using AI to augment staff and creating roles such as AI trainers, prompt engineers and AI ethicists. That is related practice rather than a formal job-redesign programme.',
    ],
    criteria:{
      sustainability:{r:'Low', why:'The grant ends on 31 December 2025 and I found no successor.'},
      impact:{r:'High in principle', why:'It changes the job rather than only the worker, which matches the task-level nature of the exposure evidence.'},
      feasibility:{r:'Low to moderate', why:'I did not identify a comparable Philippine funding programme.'},
      effectiveness:{r:'Not shown', why:'I found no impact evaluation of the grant among my sources.'},
    },
    rankWhy:'Strong in principle, because redesigning the job rather than only the worker matches what the exposure evidence describes. Three things put it low: no impact evaluation, a stated end date with no successor, and no comparable Philippine funding vehicle. And nothing happens unless an employer chooses to act.',
    ref:['wsg','dagooc2026'] },

  { id:'s3', rank:1, name:'Place-and-train career conversion', short:'Place-and-train', where:'Singapore',
    what:'A jobseeker is hired into a new growth role by a participating company, which then provides on-the-job or industry-recognised training.',
    who:'The employer hires first, government supports the training period.',
    status:'An existing Singapore programme with a published impact evaluation.',
    targetPopulation:'Jobseekers moving into a growth role in a new sector or occupation, hired by a participating employer before they are fully trained.',
    detail:[
      'The worker is placed with a participating employer and then trained into the new role on the job, which is why it is called place-and-train rather than train-and-place.',
      'The employer carries the person while the training happens, with government support.',
      'The published evaluation compared participants against control groups.',
      'The paper carries a disclaimer that the views are the authors’ own rather than official agency positions, so the figures should be read as a government-published study rather than a formal agency position.',
    ],
    criteria:{
      sustainability:{r:'Moderate to high', why:'A standing Workforce Singapore programme rather than a time-bounded grant.'},
      impact:{r:'High', why:'It keeps workers earning while the role changes, and Philippine exposure sits in exactly the service, sales and clerical roles this is designed to move people out of.'},
      feasibility:{r:'Moderate', why:'RA 11962 and now RA 12063 give a legal basis, but I found no Philippine funding line for conversion itself.'},
      effectiveness:{r:'Strongest', why:'The only one of the five with a published control-group evaluation reporting measured wage and retention gains.'},
    },
    rankWhy:'The only one of the five with a published control-group evaluation, and the only one that keeps a worker earning while the role changes. It loses marks on feasibility because I found no Philippine funding line for conversion. The evidence is from Singapore, so it shows what the model did there and not what it would do here.',
    ref:['mti2025','huynh2026','ra11962','ra12063'] },

  { id:'s4', rank:3, name:'JobStart Philippines', short:'JobStart PH', where:'Philippines',
    what:'Life skills training, technical training and a paid internship with a partner employer, for young jobseekers.',
    who:'DOLE funds it through the Bureau of Local Employment, PESOs deliver it, employers host the internship.',
    status:'Institutionalised nationwide by Republic Act No. 10869, approved 29 June 2016. Running now.',
    targetPopulation:'Filipinos aged 18 to 24 at registration who are not employed, studying or in training, with no work experience or under one year of it.',
    detail:[
      'The Act sets the stages: ten days of life skills training, up to three months of technical training with a TESDA-accredited provider or the employer, and an internship of up to three months or 600 hours.',
      'The Act requires the employer to pay an internship stipend of at least 75 percent of the prevailing minimum wage where the establishment is located. It provides a daily training allowance without fixing the amount, which DOLE sets.',
      'DOLE publishes the current amounts: 400 pesos a day during training, and a partner employer grant covering training costs and the allowance plus 1,500 pesos per trainee per month for administrative costs.',
      'Section 5 restricts it to Filipinos aged 18 to 24 at registration who are not employed, studying or in training, with no work experience or less than one year of it. Seventeen year olds may register if they will be 18 by the technical training stage.',
    ],
    criteria:{
      sustainability:{r:'High', why:'Institutionalised nationwide by law, with a standing appropriation and PESO delivery.'},
      impact:{r:'Moderate', why:'Reaches young entry-level workers, whom the ILO identifies as being at greater displacement risk, but by its own rules it excludes anyone with a year of work experience.'},
      feasibility:{r:'High', why:'Already operating, with employer grants, allowances and monitoring already defined.'},
      effectiveness:{r:'Not shown', why:'I found no published impact evaluation. ADB’s 2020 evaluation did not rate the JobStart rollout assistance, which was still ongoing.'},
    },
    rankWhy:'Scores highest on sustainability and feasibility because it is written into law and already delivered nationwide through PESOs. The problem is reach: by eligibility it cannot serve a worker displaced from an automated role mid-career. It matters to this proposal anyway, because its delivery mechanics are the ones the Philippine adaptation borrows.',
    ref:['ra10869','dole','adb2020','huynh2026'] },

  { id:'s5', rank:5, name:'Portable individual training credit', short:'Training credit', where:'Singapore',
    what:'Training money given to the individual rather than to a programme or an employer.',
    who:'Government funds it, the worker chooses the course.',
    status:'Running. Take-up of the one-off top-up is documented in a parliamentary reply.',
    targetPopulation:'Individual Singaporeans by age rather than by occupation or sector, which is what makes the funding portable across jobs and employment status.',
    detail:[
      'Singaporeans receive an Opening Credit of 500 dollars at age 25 and a Mid-Career Credit of 4,000 dollars at age 40, neither of which expires.',
      'A separate one-off 500 dollar top-up was given in 2020 to those aged 25 and above, expiring at the end of 2025.',
      'As at end-September 2025, close to 800,000 Singaporeans, about 3 in 10 eligible people, had used the one-off top-up. Mid-career workers aged 40 to 60 made up close to half of users.',
      'Relevant to the Philippines because the funding follows the person rather than the job, which in principle reaches workers outside IT-BPM and outside formal employment.',
    ],
    criteria:{
      sustainability:{r:'High as a design', why:'Credits follow the person across jobs and employment status, and the main ones do not expire.'},
      impact:{r:'Low to moderate', why:'On the documented evidence, about 3 in 10 eligible people used the top-up. Usage is also not the same as a job or a wage gain.'},
      feasibility:{r:'Low', why:'It would need a national individual account system and a sustained funding line, neither of which I found here.'},
      effectiveness:{r:'Not shown', why:'The source reports usage, not employment or wage outcomes.'},
    },
    rankWhy:'Portability is the right instinct for a country with a large informal sector, and it is the only one of the five that reaches workers outside formal employment. But the one documented case shows limited take-up, usage is not an outcome, and standing up national individual accounts here would be the heaviest lift of the five.',
    ref:['moe2025'] },
];

export const RANKED = [...SOLUTIONS].sort((a,b)=>a.rank-b.rank);

export const CRITERIA = [
  { key:'sustainability', label:'Sustainability', blurb:'Can the result be maintained over the long term, not just for a short period?' },
  { key:'impact',         label:'Impact',         blurb:'How much does it change for how many of the people affected?' },
  { key:'feasibility',    label:'Feasibility',    blurb:'Is it realistic and possible to implement, given cost and scale?' },
  { key:'effectiveness',  label:'Effectiveness',  blurb:'Is there evidence that it actually worked for the people it was meant to help?' },
] as const;

export const CRITERIA_PROVENANCE =
  'These four were agreed by the class in the Week 8 session as the criteria for evaluating success. The session recording transcribes the third as "visibility", but the student who proposed it said feasibility and described it as covering whether a solution is realistic and possible to implement. The wording still needs confirming against the class-approved criteria sheet. No numerical scores or weights were agreed, so none are used here.';

export const RANKING_NOTE =
  'The relative order of the first three is the same as in Milestone 2. I checked it against the Terminal Assessment criteria rather than assuming it. Sustainability replacing acceptability pulled JobStart up and job redesign down, which is why the two added solutions sit where they do.';

/* ------------------------------------------------------ singapore evidence */
export const SG_OUTCOMES = [
  { name:'Wages, placement year',        value:2.5, unit:'%',  tone:'cyan' },
  { name:'Wages, next four years (low)', value:5.8, unit:'%',  tone:'cyan' },
  { name:'Wages, next four years (high)',value:6.5, unit:'%',  tone:'cyan' },
  { name:'Retention',                    value:3.9, unit:'pp', tone:'amber' },
];
/**
 * Singapore wage effect over time. Two measured states from one evaluation,
 * not a yearly series: the placement year is a single figure, and the four
 * years after it are reported as a range. Drawn as a step and a band so the
 * chart cannot imply measurements that were never taken.
 */
export const SG_WAGE_TRAJECTORY = {
  placement: { label: 'Placement year', value: 2.5 },
  after: { label: 'Next four years', low: 5.8, high: 6.5 },
  unit: '%',
  axisMax: 8,
  note: 'Two measured states, not a yearly series. The second is reported as a range, so it is drawn as a band rather than a line.',
  ref: ['mti2025'] as RefKey[],
};

/**
 * Exposure in the Philippines against the ASEAN average. The ASEAN figure is a
 * precise published percentage. The Philippine figure is reported as "more than
 * one quarter", so it is drawn at that floor and labelled as a floor.
 */
export const EXPOSURE_VS_ASEAN = [
  { name: 'Philippines', value: 25, floor: true, note: 'Reported as more than one quarter of employment, so drawn at that floor', ref: ['huynh2026'] as RefKey[] },
  { name: 'ASEAN average', value: 22.9, floor: false, note: '22.9 percent of employment in 2025, nearly 80 million workers', ref: ['ilo2026a', 'ilo2026b'] as RefKey[] },
];

/** Take-up of the one-off SkillsFuture top-up, as reported to parliament. */
export const SKILLSFUTURE_TAKEUP = {
  used: 30, label: 'About 3 in 10 eligible Singaporeans used the one-off top-up',
  detail: 'Close to 800,000 people as at end-September 2025. Mid-career workers aged 40 to 60 were close to half of them.',
  caveat: 'Usage is not an employment or wage outcome. The source reports take-up only.',
  ref: ['moe2025'] as RefKey[],
};

/** The EBET employer deduction, which steps up on a date fixed in the Act. */
export const EBET_DEDUCTION = {
  steps: [
    { period: 'To 31 Dec 2027', value: 50 },
    { period: 'From 1 Jan 2028', value: 75 },
  ],
  unit: '%',
  cap: 'Capped at the lower of 5 percent of total direct labour expenses or 25 million pesos a year.',
  note: 'An additional deduction from taxable income, equivalent to this share of actual training expenses.',
  ref: ['ra12063'] as RefKey[],
};

export const SG_CAVEAT =
  'These are Singapore results measured against control groups. They show what the model did there, not what it would do here. The Philippine version stays a proposal that would have to be measured.';

/* --------------------------------------------------------- the proposal */
export const PROPOSAL = {
  name:'A Philippine place-and-train career conversion track',
  claim:'A proposal, not an existing programme. Nothing in my sources says any agency or employer has agreed to it.',
  mechanism:[
    { n:'1', t:'Hired first',        d:'A worker is taken on by a participating employer into a new growth role before being fully trained.' },
    { n:'2', t:'Trained on the job', d:'The employer provides on-the-job or industry-recognised training for that role, registered with TESDA under the EBET framework.' },
    { n:'3', t:'Supported through it',d:'Government supports the employer while the conversion runs, so the worker’s income does not stop.' },
  ],
  gap:{
    missing:[
      'I found no Philippine funding line for career conversion itself.',
      'I found no agency that matches an automation-displaced worker to a conversion role.',
      'No existing scheme replaces income during a mid-career transition.',
    ],
    haveLegal:[
      { t:'RA 11962, Trabaho Para sa Bayan Act', d:'Establishes a National Employment Master Plan. Section 4(b) covers skilling, upskilling and reskilling with an emphasis on lifelong learning; 4(c) encourages private sector skills transfer; 6(c) requires analysis of the employment situation.', ref:['ra11962'] as RefKey[] },
      { t:'RA 12063, EBET Framework Act', d:'Institutionalises enterprise-based education and training. Section 6 makes both new labour force entrants and employed workers eligible, and Section 4(i) covers enterprise upskilling for existing employees. TESDA is the primary implementing agency.', ref:['ra12063'] as RefKey[] },
      { t:'740 million peso commitment', d:'Live funding attached to the reskilling mandate, targeting 340,000 IT-BPM workers, set to start in the second half of 2025.', ref:['malaya2025'] as RefKey[] },
    ],
    haveOps:[
      { t:'Employer incentive already legislated', d:'RA 12063 Section 20 gives an additional deduction of 50 percent of actual training expenses through 31 December 2027, rising to 75 percent from 1 January 2028, capped at the lower of 5 percent of total direct labour expenses or 25 million pesos a year.', ref:['ra12063'] as RefKey[] },
      { t:'Delivery machinery already running', d:'JobStart already does PESO intake and assessment, TESDA-accredited or employer-delivered technical training, a paid internship with a partner employer, a daily allowance set by DOLE, an employer grant, insurance and monthly monitoring.', ref:['dole','ra10869'] as RefKey[] },
      { t:'Training supply being expanded', d:'TESDA opened more than 23,000 LinkedIn Learning courses to its stakeholders as part of an effort aimed at BPO workers.', ref:['tesda2025'] as RefKey[] },
    ],
  },
  adaptation:[
    { k:'Who it is for', v:'Workers already in automation-exposed roles, rather than JobStart’s 18 to 24 year old new entrants. RA 12063 Section 6 already makes employed workers eligible for enterprise-based training, so the training side needs no new eligibility rule.', ref:['ra12063','ra10869'] as RefKey[] },
    { k:'Entry route', v:'PESO intake and assessment, as JobStart already does, with referral from employers who are automating roles.', ref:['dole'] as RefKey[] },
    { k:'Training', v:'Employer-delivered or TVI-partnered training registered with TESDA under the EBET framework.', ref:['ra12063'] as RefKey[] },
    { k:'Income during transition', v:'A training allowance and stipend on the JobStart pattern, with the amount set for this group. This is the part no existing Philippine scheme provides for mid-career workers, and it is the core of the proposal.', ref:['dole'] as RefKey[] },
    { k:'Employer incentive', v:'The RA 12063 Section 20 training-expense deduction, which already exists in law, alongside a JobStart-style grant covering part of the allowance.', ref:['ra12063','dole'] as RefKey[] },
    { k:'Funding source', v:'The existing IT-BPM reskilling commitment, at least for a first cohort in the sector where exposure is highest.', ref:['malaya2025'] as RefKey[] },
    { k:'Proposed lead agencies', v:'DOLE and PESOs to deliver, TESDA for standards and EBET registration, DICT and IBPAP for demand signals. None has been approached or has agreed to this.', ref:['ra10869','ra12063','malaya2025'] as RefKey[] },
  ],
  resources:[ 'PESO staff time for intake, matching and monthly monitoring',
              'TESDA-registered enterprise training programmes mapped to converted roles',
              'Employers willing to open conversion posts' ],
  financial:[ 'A training allowance and stipend on the JobStart pattern, set for this group',
              'The RA 12063 Section 20 deduction, which is already law rather than a new ask',
              'Drawn from the existing IT-BPM commitment, so no new appropriation is assumed' ],
  depends:[ 'Employers hiring before training is complete',
            'An income-support rule for mid-career trainees, which does not exist today',
            'Funding continuing past a three-year commitment' ],
  benefits:[ 'Workers keep earning while their role changes',
             'Employers fill growth roles from people they would otherwise let go',
             'Outcomes get measured instead of assumed, which no Philippine option does now' ],
  verified:[
    'The 740 million peso commitment and its 2025 start',
    'RA 11962, RA 10869 and RA 12063, each checked against the source text',
    'JobStart’s stages, allowances, employer grant and eligibility rules',
    'Singapore’s place-and-train design and its control-group results',
    'ILO exposure figures for the Philippines and ASEAN',
  ],
  proposed:[
    'Extending conversion to automation-affected workers',
    'Combining EBET training with JobStart placement and stipend mechanics',
    'Drawing on the IT-BPM funding for a first cohort',
    'Every SMART target on this site',
    'No agency has approved this, no budget is allocated, and no pilot results exist',
  ],
};

/**
 * Who would do what, if the track ran.
 *
 * Organised by actor, where the adaptation table in the same section is organised
 * by design element, so the two answer different questions rather than repeating
 * each other.
 *
 * The important distinction is `statutory` against `proposed`. Statutory means the
 * actor already carries that duty under a named law or a running programme.
 * Proposed means this assessment would ask them to do it, and none of them has
 * been approached or has agreed to anything.
 */
export interface ImplActor {
  id: string;
  name: string;
  short: string;
  /** Which of the three mechanism stages this actor touches. */
  stages: ('hire' | 'train' | 'support')[];
  statutory: string | null;
  proposed: string;
  ref: RefKey[];
}

export const IMPL_STAGES = [
  { key:'hire',    label:'Hired first',        note:'A worker is taken on before training is complete' },
  { key:'train',   label:'Trained on the job', note:'Training delivered inside the enterprise' },
  { key:'support', label:'Supported through',  note:'Income continues while the role changes' },
] as const;

export const IMPL_ACTORS: ImplActor[] = [
  { id:'dole', name:'DOLE and the Bureau of Local Employment', short:'DOLE and BLE',
    stages:['hire','support'],
    statutory:'Already administers JobStart nationwide under RA 10869, including the employer grant, the trainee allowance and monthly monitoring.',
    proposed:'Would own the conversion track, set the income-support rule for mid-career trainees, and consolidate outcome reporting. That income-support rule does not exist today in any form.',
    ref:['ra10869','dole'] },
  { id:'peso', name:'Public Employment Service Offices', short:'PESOs',
    stages:['hire','support'],
    statutory:'Already run JobStart intake, assessment and monthly monitoring at local level.',
    proposed:'Would assess workers referred by automating employers and match them to conversion roles. No agency currently performs this matching function for displaced workers.',
    ref:['dole','ra10869'] },
  { id:'tesda', name:'TESDA', short:'TESDA',
    stages:['train'],
    statutory:'Primary implementing agency for enterprise-based training under RA 12063, and accredits providers. Already opened more than 23,000 LinkedIn Learning courses to its stakeholders.',
    proposed:'Would register conversion training under the EBET framework and tie registration to employer-confirmed roles, which answers the ADB finding that the most availed courses often lead to low-productivity occupations.',
    ref:['ra12063','tesda2025','adb2021'] },
  { id:'employer', name:'Participating employers', short:'Employers',
    stages:['hire','train'],
    statutory:'Under RA 12063 may deliver enterprise-based training alone or with a technical-vocational institution, and may claim the Section 20 training-expense deduction.',
    proposed:'Would hire into the converted role before training completes, and report retention and wage outcomes. Hiring first is the assumption the whole model rests on, and no employer has agreed to it.',
    ref:['ra12063'] },
  { id:'tvi', name:'Training providers and TVIs', short:'Providers and TVIs',
    stages:['train'],
    statutory:'Deliver TESDA-accredited training, and may partner with enterprises under the EBET framework.',
    proposed:'Would deliver courses mapped to confirmed conversion vacancies rather than to general course demand.',
    ref:['ra12063','tesda2025'] },
  { id:'dict', name:'DICT and IBPAP', short:'DICT and IBPAP',
    stages:['hire'],
    statutory:'Already align programme strategies around the 740 million peso IT-BPM reskilling commitment targeting 340,000 workers.',
    proposed:'Would identify which growth roles are worth converting into, and could fund a first cohort from the existing commitment rather than a new appropriation.',
    ref:['malaya2025','khan2026'] },
  { id:'lgu', name:'Local government units', short:'LGUs',
    stages:['support'],
    statutory:'Host and staff the PESO function.',
    proposed:'Would carry the additional PESO workload the track creates. This is a real cost and is listed among the risks rather than assumed away.',
    ref:['ra10869'] },
  { id:'worker', name:'Workers in exposed roles', short:'Workers',
    stages:['hire','train','support'],
    statutory:null,
    proposed:'Would take up a conversion place and complete the cycle. Worker acceptance is unmeasured in every source reviewed, which is why one SMART indicator sets a baseline rather than a pass mark.',
    ref:['huynh2026'] },
];

export const IMPL_CAVEAT =
  'None of these organisations has been approached about this proposal, and none has endorsed or committed to it. The statutory column describes duties that already exist in law or in a running programme. The proposed column describes what this assessment would ask of them.';


/* ------------------------------------------------- the illustrative journey */
export const JOURNEY = [
  { step:1, stage:'Context', label:'Role starts changing', who:'Maria, contact centre agent',
    body:'Parts of her role are automated. Her job is not removed, but the tasks she was hired for are shrinking. Philippine exposure is concentrated in exactly this kind of service and sales work.', ref:['huynh2026'] as RefKey[] },
  { step:2, stage:'Skills assessment', label:'Referred, not released', who:'Employer and PESO',
    body:'Her employer refers her to the PESO rather than ending the role. The PESO assesses her against conversion roles the sector is actually hiring for.', ref:['dole'] as RefKey[] },
  { step:3, stage:'Employer participation and placement', label:'Hired into the new role first', who:'A participating employer',
    body:'She is taken on in the new role before she is fully trained. This is the step that makes it place-and-train rather than train-and-place.', ref:['mti2025'] as RefKey[] },
  { step:4, stage:'Training', label:'Trained inside the enterprise', who:'Employer with TESDA registration',
    body:'Training is delivered by the employer or with a technical-vocational institution, registered under the EBET framework, which already covers employed workers.', ref:['ra12063'] as RefKey[] },
  { step:5, stage:'Income support', label:'Income continues', who:'Government support',
    body:'A training allowance and stipend keep her earning during the conversion. This is the part that does not exist for mid-career workers today, and it is what the proposal would have to create.', ref:['dole'] as RefKey[] },
  { step:6, stage:'Follow-up', label:'Measured, not assumed', who:'PESO and DOLE',
    body:'Completion, retention at six months and wage change are recorded, so the result is evidence rather than an expectation.', ref:['ra10869'] as RefKey[] },
];
/**
 * The five stages the Assessment Guide names, mapped onto the six journey steps.
 * Steps 1 and 5 are kept because they carry meaning the five stages do not: what
 * triggers the conversion, and what keeps the worker solvent during it.
 */
export const JOURNEY_STAGES = [
  { stage:'Skills assessment', step:2 },
  { stage:'Training', step:4 },
  { stage:'Employer participation', step:3 },
  { stage:'Placement', step:3 },
  { stage:'Follow-up', step:6 },
];

export const JOURNEY_CAVEAT =
  'Maria is a hypothetical illustration, not a real person and not a documented case. Each step is grounded in a real programme feature or a real legal provision, but the journey as a whole has never been run in the Philippines.';

/* --------------------------------------------------------------- the SMART */
export interface Smart {
  id:string; name:string; definition:string; target:string; method:string;
  source:string; timeframe:string; owner:string; assumption:string;
  /** The Assessment Guide asks for objective, target group and baseline alongside
   *  the four fields already here. Where no Philippine baseline exists, the entry
   *  says so rather than carrying a number from somewhere it does not belong. */
  objective:string; targetGroup:string; baseline:string;
}
export const SMART: Smart[] = [
  { id:'m1', name:'Conversion completion',
    definition:'The share of workers entering the track who finish the full training and placement cycle.',
    target:'75 percent of a first cohort', method:'Count completions against entrants',
    source:'PESO monthly monitoring reports, which JobStart already requires',
    timeframe:'12 months from cohort start', owner:'PESO, consolidated by the Bureau of Local Employment',
    assumption:'Completion is not employment. It shows the cycle ran, not that it worked.',
    objective:'Establish whether workers who enter the track actually complete it, so that drop-out is visible early rather than at the end of a cohort.',
    targetGroup:'Workers entering a first conversion cohort, drawn from automation-exposed roles.',
    baseline:'No Philippine baseline exists. I found no published completion rate for JobStart or for the IT-BPM reskilling commitment, so the first cohort would set the baseline.' },
  { id:'m2', name:'Placement retention',
    definition:'The share still employed in the converted role six months after completion.',
    target:'70 percent at six months', method:'Employer reports, cross-checked against contribution records',
    source:'Employer returns to PESO, with SSS record matching where it can be arranged',
    timeframe:'6 and 12 months after completion', owner:'DOLE, with employer reporting',
    assumption:'Employer self-reporting can be optimistic, and record matching would need a data sharing arrangement.',
    objective:'Test whether a conversion place turns into lasting employment rather than a short placement that ends when support does.',
    targetGroup:'Workers who complete the conversion cycle and enter the converted role.',
    baseline:'No Philippine baseline exists. Singapore reported a retention effect of 3.9 percentage points against control groups, but that is a measured effect there, not a starting point here.' },
  { id:'m3', name:'Wage change',
    definition:'Wage in the converted role against wage in the prior role. Singapore measured this, so it is the fairest test of whether the model transfers.',
    target:'No real wage decrease for at least 80 percent of completers', method:'Compare payroll at entry and at 12 months',
    source:'Payroll data supplied by participating employers', timeframe:'12 months',
    owner:'Participating employers reporting to DOLE',
    assumption:'Covers only formally employed participants, and says nothing about workers who never entered.',
    objective:'Check that converting role does not cost a worker income, which is the risk that would make the track not worth entering.',
    targetGroup:'Completers who were in paid work before entering the track.',
    baseline:'Each participant\u2019s own wage at entry serves as the baseline, recorded from payroll at the point of entry. No national baseline is needed or claimed.' },
  { id:'m4', name:'Employer participation',
    definition:'The number of firms offering conversion places. The model fails if employers do not hire first.',
    target:'30 participating firms in a first cohort', method:'Count signed employer agreements',
    source:'Agreements held by the Bureau of Local Employment', timeframe:'First 12 months',
    owner:'Bureau of Local Employment',
    assumption:'Counts firms, not the quality of the roles they offer.',
    objective:'Establish whether employers will hire before training is complete, which is the single assumption the whole model rests on.',
    targetGroup:'Employers in sectors with high automation exposure, starting with IT-BPM.',
    baseline:'No Philippine baseline exists, because no comparable place-and-train scheme runs here. JobStart partner employer counts are not comparable, since those are internship hosts rather than conversion employers.' },
  { id:'m5', name:'Reach into exposed groups',
    definition:'The share of places going to the groups the ILO identifies as most exposed: women, young entry-level workers and NCR-based roles.',
    target:'Place shares at least match the exposure shares the ILO reports', method:'Compare intake records against the ILO Philippines brief',
    source:'PESO intake records and the ILO brief', timeframe:'Each cohort', owner:'PESO and DOLE',
    assumption:'The ILO figure is exposure, not displacement, so it is a reference point rather than a demand estimate.',
    objective:'Check that places reach the groups the exposure evidence identifies, rather than the easiest candidates to recruit.',
    targetGroup:'Women, young entry-level workers, and workers in NCR, Central Luzon and Calabarzon.',
    baseline:'The ILO exposure shares serve as the reference point rather than a baseline: women at roughly double men\u2019s exposure, and around two in five NCR jobs exposed. These describe exposure, not demand for places.' },
  { id:'m6', name:'Worker-reported outcome',
    definition:'Whether participants say the conversion improved their security and prospects. Worker acceptability was unmeasured in everything I reviewed.',
    target:'Establish a baseline in the first cohort rather than set a pass mark', method:'Short standardised survey',
    source:'Survey at completion and at six months', timeframe:'6 months', owner:'DOLE',
    assumption:'Self-reported. A first round sets a baseline and cannot be a pass or fail.',
    objective:'Record whether participants themselves judge the conversion to have improved their security and prospects, since no source I reviewed measures worker acceptance at all.',
    targetGroup:'Participants who complete the cycle, surveyed individually.',
    baseline:'None exists anywhere in the sources reviewed. Worker acceptability is unmeasured, which is why this indicator sets a baseline in the first cohort instead of a pass mark.' },
];
export const SMART_CAVEAT =
  'Every target here is a proposed planning target that I set. None is a measured result, and none is a baseline taken from an existing Philippine programme, because I did not find published outcome data for one.';

/* ------------------------------------- class criteria applied to the proposal */
export const PROPOSAL_CRITERIA = [
  { label:'Sustainability', verdict:'Moderate to high',
    body:'It runs on machinery that already exists in law and in practice, which is why I chose this adaptation over building something new. RA 12063 in particular gives the training side a standing legal framework with a legislated employer incentive. The weakness is that the cash would come from a three-year commitment rather than a permanent facility.' },
  { label:'Impact', verdict:'High in principle, narrow at first',
    body:'It keeps income in place during the transition, which none of the other four do. But a first cohort in IT-BPM would still reach a small fraction of the 12.7 million exposed workers.' },
  { label:'Feasibility', verdict:'Moderate, and better than I first judged',
    body:'RA 12063 removes the eligibility obstacle I previously treated as the main barrier, because employed workers are already eligible for enterprise-based training and the employer deduction is already law. What remains missing is an income-support rule for mid-career trainees and a matching function for displaced workers.' },
  { label:'Effectiveness', verdict:'Not yet shown here',
    body:'The wage and retention results are Singapore results. The Philippine version would have to earn its own numbers, which is what the SMART measures are for.' },
];

/* ------------------------------------------------------------------- risks */
export const RISKS = [
  { cat:'Participation', risk:'Employers may not hire before training is complete', why:'The whole model fails without this', mit:'Start with IT-BPM firms already running AI pilots and already funding reskilling', ref:['khan2026'] as RefKey[] },
  { cat:'Policy', risk:'No income-support rule exists for mid-career trainees', why:'RA 12063 covers training, not wages during conversion', mit:'Set the allowance by analogy to the JobStart stipend, which government already administers', ref:['ra12063','dole'] as RefKey[] },
  { cat:'Training quality', risk:'Courses may not match real vacancies', why:'ADB found the most availed TVET courses often lead to low-productivity occupations', mit:'Tie programme registration to employer-confirmed conversion roles', ref:['adb2021'] as RefKey[] },
  { cat:'Evidence transfer', risk:'Singapore results may not transfer', why:'Different labour market, different wage structure', mit:'Treat the Philippine version as a pilot to be measured, not a promise', ref:['mti2025'] as RefKey[] },
  { cat:'Funding', risk:'The commitment runs three years', why:'A conversion track needs continuity to be worth building', mit:'Report results early enough to make the case for a standing line', ref:['malaya2025'] as RefKey[] },
  { cat:'Data', risk:'Outcome data may not be obtainable', why:'Retention and wage measures depend on employer returns and record matching', mit:'Agree the data arrangement before the first cohort, not after', ref:['ra10869'] as RefKey[] },
];

/**
 * The conclusion, one entry per sentence so each sourced sentence carries its own
 * citation. Sentences without refs are the author's own conclusions from the
 * sections above and are deliberately uncited.
 */
export const CONCLUSION: Sentence[][] = [
  [
    { t:'Workplace automation is changing Filipino jobs more than it is removing them, but the change is not landing evenly', refs:['huynh2026'] },
    { t:'More than a quarter of Philippine employment sits in occupations exposed to generative AI, the highest share in ASEAN, while only 3.6 percent falls into the highest displacement risk group', refs:['huynh2026'] },
  ],
  [
    { t:'Of the five solutions I evaluated against sustainability, impact, feasibility and effectiveness, place-and-train career conversion ranks first' },
    { t:'It is the only one with a published control-group evaluation, and the only one that keeps a worker earning while the role changes', refs:['mti2025'] },
    { t:'National reskilling remains the most feasible starting point here, and JobStart already runs the delivery mechanics', refs:['dole','ra10869'] },
  ],
  [
    { t:'The Philippines now has more of the pieces than I first credited' },
    { t:'RA 12063 makes employed workers eligible for enterprise-based training and gives employers a legislated deduction for the cost', refs:['ra12063'] },
    { t:'What is still missing is income support during a mid-career transition and a matching function for displaced workers' },
    { t:'That is the gap this proposal tries to close, and the SMART measures are how it would be judged rather than assumed' },
  ],
];

/* ------------------------------------------------------ recommendations (K) */
/**
 * Drawn from sections F, H and J. Every stakeholder named is a proposed
 * implementation stakeholder only: none has been approached or has agreed.
 */
export interface Recommendation {
  action: string; who: string; benefit: string; evidence: Sentence[]; consideration: string;
}
export const RECOMMENDATIONS_INTRO =
  'These recommendations follow from the evaluation and the proposal above. The agencies and employers named are proposed implementation stakeholders: none has been approached, and none has adopted, funded or agreed to any of them.';
export const RECOMMENDATIONS: Recommendation[] = [
  { action:'Pilot a place-and-train conversion track with an initial IT-BPM cohort',
    who:'Proposed: DOLE and PESOs to deliver, with participating IT-BPM employers.',
    benefit:'Tests the top-ranked alternative where AI adoption is concentrated, with participants earning while they convert.',
    evidence:[
      { t:'In Singapore, place-and-train participants earned 2.5 percent more than control groups in the placement year and 5.8 to 6.5 percent more over the following four years, with retention 3.9 percentage points higher', refs:['mti2025'] },
      { t:'AI adoption is accelerating particularly in IT-BPM, the sector the existing upskilling commitment is aimed at', refs:['huynh2026','malaya2025'] },
    ],
    consideration:'Singapore results may not transfer to the Philippines, so the pilot should be measured rather than assumed to work.' },
  { action:'Introduce a training allowance for mid-career trainees',
    who:'Proposed: DOLE.',
    benefit:'Addresses the gap no existing scheme covers: income during a mid-career transition.',
    evidence:[
      { t:'The design could follow the JobStart pattern, in which DOLE sets a daily training allowance and, at the internship stage, participating employers pay a stipend of not less than 75 percent of the prevailing minimum wage', refs:['ra10869'] },
      { t:'Those entitlements apply only to JobStart trainees aged 18 to 24, and mid-career conversion trainees have no equivalent entitlement today' },
    ],
    consideration:'No funding line for conversion exists yet, so the allowance would need one.' },
  { action:'Use the existing EBET training-expense deduction where it applies',
    who:'Proposed: participating employers, with programmes registered with and certified by TESDA.',
    benefit:'Lowers employers’ training costs through an incentive already in law.',
    evidence:[
      { t:'An enterprise implementing a registered EBET programme can deduct an additional 50 percent of actual training expenses until 31 December 2027, rising to 75 percent from 1 January 2028, capped at the lower of 5 percent of total direct labour expenses or 25 million pesos a year', refs:['ra12063'] },
    ],
    consideration:'The deduction covers training expenses, not wages during conversion, and an enterprise registered with an investment promotion agency must choose between it and other fiscal incentives.' },
  { action:'Link registered training to employer-confirmed conversion roles',
    who:'Proposed: TESDA and training providers, with participating employers.',
    benefit:'Points training at real vacancies rather than course volume.',
    evidence:[
      { t:'ADB found that the most availed technical and vocational courses often lead to low-productivity occupations', refs:['adb2021'] },
    ],
    consideration:'Employers would need to name the roles before training begins.' },
  { action:'Agree how outcomes will be measured before the pilot begins',
    who:'Proposed: DOLE and the Bureau of Local Employment, with PESOs and participating employers reporting, as set out for each indicator in section H.',
    benefit:'Lets the six SMART indicators judge the track rather than assume it works.',
    evidence:[
      { t:'Section H sets a proposed target, data source and owner for each indicator, and section J recommends agreeing the data arrangement before the first cohort' },
    ],
    consideration:'No Philippine baseline exists for most of the indicators, so the first cohort would set it.' },
];

/* ------------------------------------------------------------- navigation */
export interface SectionDef { id:string; label:string; letter:string }
export const SECTIONS: SectionDef[] = [
  { id:'intro',        letter:'A', label:'Introduction' },
  { id:'challenge',    letter:'B', label:'The Philippine automation challenge' },
  { id:'stakeholders', letter:'C', label:'Affected workers and stakeholders' },
  { id:'solutions',    letter:'D', label:'Five solutions' },
  { id:'ranking',      letter:'E', label:'Solution ranking' },
  { id:'proposal',     letter:'F', label:'Philippine career conversion proposal' },
  { id:'journey',      letter:'G', label:'A worker journey' },
  { id:'smart',        letter:'H', label:'SMART success dashboard' },
  { id:'criteria',     letter:'I', label:'Class criteria assessment' },
  { id:'risks',        letter:'J', label:'Risks and limitations' },
  { id:'conclusion',   letter:'K', label:'Conclusion' },
  { id:'references',   letter:'L', label:'References' },
];
