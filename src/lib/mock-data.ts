export type Severity = "critical" | "high" | "medium" | "low";
export type IssueStatus = "open" | "resolved";
export type TaskStatus = "todo" | "in-progress" | "completed";
export type Priority = "high" | "medium" | "low";

export type Project = {
  id: string;
  name: string;
  domain: string;
  description: string;
  health: number;
  openIssues: number;
  keywordOpportunities: number;
  contentOpportunities: number;
  linkOpportunities: number;
  lastUpdated: string;
  status: "active" | "crawling" | "needs-attention";
};

export type AuditIssue = {
  id: string;
  projectId: string;
  title: string;
  url: string;
  severity: Severity;
  affectedPages: number;
  status: IssueStatus;
  description: string;
  whyItMatters: string;
  recommendedAction: string;
  examplePages: string[];
};

export type Keyword = {
  id: string;
  projectId: string;
  keyword: string;
  url: string;
  rank: number;
  previousRank: number;
  volume: number;
  difficulty: number;
  ctr: string;
  trend: "up" | "down" | "flat";
  opportunity: Priority;
  opportunityScore: number;
  recommendedAction: string;
};

export type ContentOpportunity = {
  id: string;
  projectId: string;
  type: "create" | "refresh" | "improve";
  title: string;
  volume: number;
  difficulty: number;
  currentUrl: string | null;
  rank: number | null;
  previousRank: number | null;
  trafficTrend: string;
  opportunity: Priority;
  recommendation: string;
  completed: boolean;
};

export type LinkOpportunity = {
  id: string;
  projectId: string;
  source: string;
  target: string;
  anchor: string;
  relevance: number;
  priority: Priority;
  reason: string;
  status: "open" | "accepted" | "dismissed";
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  source: "SEO Audit" | "Keyword" | "Content Opportunity" | "Internal Links" | "Manual";
  priority: Priority;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  awaitingReview?: boolean;
  completedBy?: string | undefined;
};

export const projects: Project[] = [
  {
    id: "acme",
    name: "Acme Digital",
    domain: "acmedigital.com",
    description: "B2B digital services site, blog-led acquisition.",
    health: 78,
    openIssues: 12,
    keywordOpportunities: 24,
    contentOpportunities: 9,
    linkOpportunities: 18,
    lastUpdated: "2 hours ago",
    status: "active",
  },
  {
    id: "growthhub",
    name: "GrowthHub",
    domain: "growthhub.io",
    description: "SaaS growth platform with a large resource library.",
    health: 64,
    openIssues: 21,
    keywordOpportunities: 31,
    contentOpportunities: 14,
    linkOpportunities: 26,
    lastUpdated: "Yesterday",
    status: "needs-attention",
  },
  {
    id: "northstar",
    name: "Northstar Marketing",
    domain: "northstarmarketing.com",
    description: "Full-service marketing agency, local + national intent.",
    health: 85,
    openIssues: 6,
    keywordOpportunities: 12,
    contentOpportunities: 5,
    linkOpportunities: 9,
    lastUpdated: "4 days ago",
    status: "crawling",
  },
];

export const auditIssues: AuditIssue[] = [
  {
    id: "iss-1",
    projectId: "acme",
    title: "Missing title tags",
    url: "/services/seo",
    severity: "high",
    affectedPages: 8,
    status: "open",
    description:
      "8 pages currently have missing or incomplete title tags, including several high-intent service pages.",
    whyItMatters:
      "Title tags are the strongest on-page ranking signal and drive click-through rate from the SERP. Missing titles let Google generate its own, usually poorly aligned with search intent.",
    recommendedAction:
      "Create unique, descriptive title tags that accurately represent each page's search intent, 50-60 characters, primary keyword front-loaded.",
    examplePages: ["/services/seo", "/services/seo-audit", "/services/content", "/pricing"],
  },
  {
    id: "iss-2",
    projectId: "acme",
    title: "Missing meta description",
    url: "/about",
    severity: "medium",
    affectedPages: 5,
    status: "open",
    description: "5 pages have no meta description, so search snippets are auto-generated.",
    whyItMatters:
      "Meta descriptions influence click-through rate. Auto-generated snippets often surface boilerplate navigation text.",
    recommendedAction:
      "Write 140-155 character descriptions summarising the page value proposition with a clear call to action.",
    examplePages: ["/about", "/team", "/careers", "/contact", "/blog/analytics"],
  },
  {
    id: "iss-3",
    projectId: "acme",
    title: "Missing H1",
    url: "/blog/technical-seo",
    severity: "medium",
    affectedPages: 3,
    status: "open",
    description: "3 blog templates render the post title as a styled div rather than an H1.",
    whyItMatters:
      "A single descriptive H1 helps crawlers and assistive technology understand the primary topic of the page.",
    recommendedAction: "Update the blog template so the post title renders inside a single H1 element.",
    examplePages: ["/blog/technical-seo", "/blog/seo-guide", "/blog/content-strategy"],
  },
  {
    id: "iss-4",
    projectId: "acme",
    title: "Broken internal link",
    url: "/blog/seo-guide",
    severity: "high",
    affectedPages: 2,
    status: "open",
    description: "2 internal links point to retired URLs and return 404.",
    whyItMatters:
      "Broken links waste crawl budget, leak internal link equity and create dead ends for users mid-funnel.",
    recommendedAction: "Repoint the links to the current /services/seo-audit URL or add 301 redirects.",
    examplePages: ["/blog/seo-guide", "/blog/seo-checklist"],
  },
  {
    id: "iss-5",
    projectId: "acme",
    title: "Missing image alt text",
    url: "/blog/analytics",
    severity: "low",
    affectedPages: 14,
    status: "open",
    description: "14 content images across the blog are missing descriptive alt attributes.",
    whyItMatters: "Alt text supports accessibility and image search visibility.",
    recommendedAction: "Add concise, descriptive alt text to each content image; leave decorative images empty.",
    examplePages: ["/blog/analytics", "/blog/seo-guide", "/blog/content-strategy"],
  },
  {
    id: "iss-6",
    projectId: "acme",
    title: "Duplicate title tags",
    url: "/services",
    severity: "high",
    affectedPages: 4,
    status: "open",
    description: "4 service pages share the identical title tag 'Services | Acme Digital'.",
    whyItMatters: "Duplicate titles cause keyword cannibalisation and weaken relevance signals per page.",
    recommendedAction: "Differentiate each service page title by the specific service and qualifying modifier.",
    examplePages: ["/services", "/services/seo", "/services/ppc", "/services/content"],
  },
  {
    id: "iss-7",
    projectId: "acme",
    title: "Slow largest contentful paint",
    url: "/blog/seo-checklist",
    severity: "critical",
    affectedPages: 6,
    status: "open",
    description: "6 blog templates report an LCP above 4.0s on mobile in field data.",
    whyItMatters: "Core Web Vitals affect rankings on mobile and materially increase bounce rate.",
    recommendedAction: "Preload the hero image, serve AVIF, and defer non-critical third-party scripts.",
    examplePages: ["/blog/seo-checklist", "/blog/seo-guide", "/blog/seo-tools"],
  },
  {
    id: "iss-8",
    projectId: "acme",
    title: "Non-canonical pages indexed",
    url: "/blog/seo-guide?ref=newsletter",
    severity: "medium",
    affectedPages: 9,
    status: "open",
    description: "9 parameterised URLs are indexable and compete with their canonical version.",
    whyItMatters: "Duplicate indexable URLs split link signals across near-identical pages.",
    recommendedAction: "Add self-referencing canonicals and strip tracking parameters at the edge.",
    examplePages: ["/blog/seo-guide?ref=newsletter", "/services/seo?utm_source=li"],
  },
  {
    id: "iss-9",
    projectId: "acme",
    title: "Thin content pages",
    url: "/services/ppc",
    severity: "medium",
    affectedPages: 4,
    status: "open",
    description: "4 service pages contain fewer than 250 words of unique content.",
    whyItMatters: "Thin pages struggle to demonstrate topical depth against competing service pages.",
    recommendedAction: "Expand each page with scope, deliverables, process and FAQs based on real search queries.",
    examplePages: ["/services/ppc", "/services/cro", "/services/email", "/services/social"],
  },
  {
    id: "iss-10",
    projectId: "acme",
    title: "Orphaned pages",
    url: "/blog/seo-tools",
    severity: "low",
    affectedPages: 7,
    status: "open",
    description: "7 published pages receive no internal links from any crawlable page.",
    whyItMatters: "Orphaned pages are crawled infrequently and rarely accumulate ranking authority.",
    recommendedAction: "Add contextual internal links from relevant hub and blog pages.",
    examplePages: ["/blog/seo-tools", "/blog/serp-features"],
  },
  {
    id: "iss-11",
    projectId: "acme",
    title: "Missing structured data on articles",
    url: "/blog/content-strategy",
    severity: "low",
    affectedPages: 11,
    status: "open",
    description: "11 articles have no Article schema markup.",
    whyItMatters: "Structured data improves eligibility for rich results and entity understanding.",
    recommendedAction: "Add Article JSON-LD with headline, author, datePublished and image.",
    examplePages: ["/blog/content-strategy", "/blog/analytics"],
  },
  {
    id: "iss-12",
    projectId: "acme",
    title: "Redirect chains",
    url: "/old-blog/seo-guide",
    severity: "medium",
    affectedPages: 3,
    status: "open",
    description: "3 legacy URLs redirect through two or more hops before resolving.",
    whyItMatters: "Redirect chains slow crawling and dilute link equity.",
    recommendedAction: "Flatten each chain to a single 301 pointing at the final destination.",
    examplePages: ["/old-blog/seo-guide", "/old-services/seo"],
  },
  {
    id: "iss-13",
    projectId: "acme",
    title: "Sitemap contains 404 URLs",
    url: "/sitemap.xml",
    severity: "low",
    affectedPages: 5,
    status: "resolved",
    description: "The XML sitemap listed 5 URLs that no longer exist.",
    whyItMatters: "Invalid sitemap entries reduce trust in the sitemap as a crawl signal.",
    recommendedAction: "Regenerate the sitemap from published content only.",
    examplePages: ["/sitemap.xml"],
  },
];

export const keywords: Keyword[] = [
  {
    id: "kw-1",
    projectId: "acme",
    keyword: "SEO audit",
    url: "/seo-audit",
    rank: 14,
    previousRank: 19,
    volume: 6600,
    difficulty: 70,
    ctr: "2.1%",
    trend: "up",
    opportunity: "high",
    opportunityScore: 88,
    recommendedAction:
      "Strengthen the /seo-audit page with a downloadable checklist, add FAQ schema and build 3 internal links from technical blog posts.",
  },
  {
    id: "kw-2",
    projectId: "acme",
    keyword: "technical SEO",
    url: "/technical-seo",
    rank: 9,
    previousRank: 12,
    volume: 4400,
    difficulty: 58,
    ctr: "4.6%",
    trend: "up",
    opportunity: "high",
    opportunityScore: 84,
    recommendedAction:
      "Page 1 position 9 is one improvement away from the top 5. Expand crawl budget and log-file sections, refresh examples.",
  },
  {
    id: "kw-3",
    projectId: "acme",
    keyword: "SEO checklist",
    url: "/seo-checklist",
    rank: 21,
    previousRank: 15,
    volume: 3600,
    difficulty: 55,
    ctr: "0.7%",
    trend: "down",
    opportunity: "high",
    opportunityScore: 79,
    recommendedAction:
      "Declining six positions in 60 days. Refresh the checklist, fix the LCP regression on the blog template and re-promote internally.",
  },
  {
    id: "kw-4",
    projectId: "acme",
    keyword: "SEO tools",
    url: "/seo-tools",
    rank: 34,
    previousRank: 34,
    volume: 12000,
    difficulty: 78,
    ctr: "0.2%",
    trend: "flat",
    opportunity: "medium",
    opportunityScore: 61,
    recommendedAction:
      "Intent is commercial investigation. Rebuild as a comparison page with pricing tables and use-case filtering.",
  },
  {
    id: "kw-5",
    projectId: "acme",
    keyword: "on page SEO",
    url: "/on-page-seo",
    rank: 16,
    previousRank: 22,
    volume: 5400,
    difficulty: 61,
    ctr: "1.8%",
    trend: "up",
    opportunity: "high",
    opportunityScore: 81,
    recommendedAction:
      "Add a worked example walkthrough and target the 'on page SEO checklist' modifier in an H2 section.",
  },
  {
    id: "kw-6",
    projectId: "acme",
    keyword: "seo reporting template",
    url: "/blog/seo-reporting",
    rank: 27,
    previousRank: 31,
    volume: 1900,
    difficulty: 42,
    ctr: "0.4%",
    trend: "up",
    opportunity: "medium",
    opportunityScore: 58,
    recommendedAction: "Add a genuinely downloadable template asset; current page describes one but does not offer it.",
  },
  {
    id: "kw-7",
    projectId: "acme",
    keyword: "core web vitals",
    url: "/blog/core-web-vitals",
    rank: 44,
    previousRank: 38,
    volume: 8100,
    difficulty: 74,
    ctr: "0.1%",
    trend: "down",
    opportunity: "medium",
    opportunityScore: 52,
    recommendedAction: "Content predates INP replacing FID. Rewrite around current metrics and thresholds.",
  },
  {
    id: "kw-8",
    projectId: "acme",
    keyword: "internal linking strategy",
    url: "/blog/internal-linking",
    rank: 11,
    previousRank: 13,
    volume: 2400,
    difficulty: 49,
    ctr: "3.2%",
    trend: "up",
    opportunity: "high",
    opportunityScore: 76,
    recommendedAction: "Close to top 10. Add a decision framework section and link from the technical SEO hub.",
  },
];

export const contentOpportunities: ContentOpportunity[] = [
  {
    id: "co-1",
    projectId: "acme",
    type: "create",
    title: "SEO Audit Checklist",
    volume: 5400,
    difficulty: 55,
    currentUrl: null,
    rank: null,
    previousRank: null,
    trafficTrend: "No coverage",
    opportunity: "high",
    recommendation:
      "Create a comprehensive SEO audit checklist targeting informational search intent, structured by technical, on-page and off-page sections.",
    completed: false,
  },
  {
    id: "co-2",
    projectId: "acme",
    type: "refresh",
    title: "Technical SEO Guide",
    volume: 4400,
    difficulty: 58,
    currentUrl: "/blog/technical-seo",
    rank: 17,
    previousRank: 8,
    trafficTrend: "Declining",
    opportunity: "high",
    recommendation:
      "Refresh outdated sections, improve topical coverage, and optimize for related queries such as crawl budget and log file analysis.",
    completed: false,
  },
  {
    id: "co-3",
    projectId: "acme",
    type: "improve",
    title: "SEO Tools",
    volume: 12000,
    difficulty: 78,
    currentUrl: "/seo-tools",
    rank: 34,
    previousRank: 34,
    trafficTrend: "Flat",
    opportunity: "medium",
    recommendation:
      "Expand comparison content and improve alignment with commercial investigation intent, including pricing and feature tables.",
    completed: false,
  },
  {
    id: "co-4",
    projectId: "acme",
    type: "create",
    title: "Core Web Vitals for Marketers",
    volume: 8100,
    difficulty: 74,
    currentUrl: null,
    rank: null,
    previousRank: null,
    trafficTrend: "No coverage",
    opportunity: "medium",
    recommendation:
      "Create a non-technical explainer covering INP, LCP and CLS with business impact framing and prioritisation guidance.",
    completed: false,
  },
  {
    id: "co-5",
    projectId: "acme",
    type: "refresh",
    title: "SEO Checklist",
    volume: 3600,
    difficulty: 55,
    currentUrl: "/seo-checklist",
    rank: 21,
    previousRank: 15,
    trafficTrend: "Declining",
    opportunity: "high",
    recommendation:
      "Update the checklist for 2026 ranking factors, add a printable version and fix the page speed regression.",
    completed: false,
  },
  {
    id: "co-6",
    projectId: "acme",
    type: "improve",
    title: "SEO Services",
    volume: 2900,
    difficulty: 66,
    currentUrl: "/services/seo",
    rank: 12,
    previousRank: 14,
    trafficTrend: "Improving",
    opportunity: "medium",
    recommendation:
      "Add proof elements: case study results, process timeline and pricing bands to match commercial intent.",
    completed: false,
  },
  {
    id: "co-7",
    projectId: "acme",
    type: "create",
    title: "Internal Linking Playbook",
    volume: 2400,
    difficulty: 49,
    currentUrl: null,
    rank: null,
    previousRank: null,
    trafficTrend: "No coverage",
    opportunity: "high",
    recommendation:
      "Create a playbook covering hub-and-spoke structures, anchor text patterns and measurement of internal link impact.",
    completed: false,
  },
  {
    id: "co-8",
    projectId: "acme",
    type: "refresh",
    title: "SEO Reporting Template",
    volume: 1900,
    difficulty: 42,
    currentUrl: "/blog/seo-reporting",
    rank: 27,
    previousRank: 31,
    trafficTrend: "Improving",
    opportunity: "medium",
    recommendation: "Attach a real downloadable template and add a section on reporting to non-SEO stakeholders.",
    completed: false,
  },
  {
    id: "co-9",
    projectId: "acme",
    type: "improve",
    title: "On Page SEO",
    volume: 5400,
    difficulty: 61,
    currentUrl: "/on-page-seo",
    rank: 16,
    previousRank: 22,
    trafficTrend: "Improving",
    opportunity: "high",
    recommendation: "Add annotated before/after examples and an embedded checklist to increase dwell time.",
    completed: false,
  },
];

export const linkOpportunities: LinkOpportunity[] = [
  {
    id: "ln-1",
    projectId: "acme",
    source: "/blog/technical-seo",
    target: "/services/seo-audit",
    anchor: "SEO audit",
    relevance: 92,
    priority: "high",
    reason:
      "The source page discusses audit methodology in three sections but never links to the commercial audit page. 14 relevant source pages share this pattern.",
    status: "open",
  },
  {
    id: "ln-2",
    projectId: "acme",
    source: "/blog/seo-guide",
    target: "/technical-seo",
    anchor: "technical SEO",
    relevance: 87,
    priority: "high",
    reason: "High-traffic guide with strong topical overlap; target page is one position from the top 5.",
    status: "open",
  },
  {
    id: "ln-3",
    projectId: "acme",
    source: "/blog/content-strategy",
    target: "/content-services",
    anchor: "content strategy",
    relevance: 81,
    priority: "medium",
    reason: "Commercial page receives no links from the content cluster despite matching intent.",
    status: "open",
  },
  {
    id: "ln-4",
    projectId: "acme",
    source: "/blog/seo-checklist",
    target: "/seo-audit",
    anchor: "run an SEO audit",
    relevance: 78,
    priority: "medium",
    reason: "Checklist readers are mid-funnel and the audit page is the natural next step.",
    status: "open",
  },
  {
    id: "ln-5",
    projectId: "acme",
    source: "/blog/analytics",
    target: "/blog/seo-reporting",
    anchor: "SEO reporting template",
    relevance: 74,
    priority: "low",
    reason: "Reduces orphaning of the reporting article and strengthens the measurement cluster.",
    status: "open",
  },
  {
    id: "ln-6",
    projectId: "acme",
    source: "/blog/internal-linking",
    target: "/services/seo",
    anchor: "SEO services",
    relevance: 71,
    priority: "low",
    reason: "Adds a commercial exit from an informational page with growing traffic.",
    status: "open",
  },
];

export const tasks: Task[] = [
  {
    id: "tk-1",
    projectId: "acme",
    title: "Fix missing title tags",
    description: "Write unique title tags for the 8 affected pages, starting with /services/seo.",
    source: "SEO Audit",
    priority: "high",
    assignee: "Sarah Klein",
    status: "todo",
    dueDate: "2026-08-24",
  },
  {
    id: "tk-2",
    projectId: "acme",
    title: "Refresh Technical SEO Guide",
    description: "Rank dropped from #8 to #17. Refresh sections and expand topical coverage.",
    source: "Content Opportunity",
    priority: "high",
    assignee: "Sarah Klein",
    status: "in-progress",
    dueDate: "2026-08-27",
  },
  {
    id: "tk-3",
    projectId: "acme",
    title: "Add internal links to SEO Audit page",
    description: "Place contextual links from 14 relevant source pages using the anchor 'SEO audit'.",
    source: "Internal Links",
    priority: "medium",
    assignee: "Marco Reyes",
    status: "completed",
    dueDate: "2026-08-14",
    awaitingReview: true,
    completedBy: "Marco Reyes",
  },
  {
    id: "tk-4",
    projectId: "acme",
    title: "Resolve duplicate title tags on service pages",
    description: "Differentiate the 4 service page titles by service and modifier.",
    source: "SEO Audit",
    priority: "high",
    assignee: "Priya Nair",
    status: "todo",
    dueDate: "2026-08-25",
  },
  {
    id: "tk-5",
    projectId: "acme",
    title: "Improve LCP on blog template",
    description: "Preload hero image, serve AVIF and defer third-party scripts.",
    source: "SEO Audit",
    priority: "high",
    assignee: "Marco Reyes",
    status: "in-progress",
    dueDate: "2026-08-21",
  },
  {
    id: "tk-6",
    projectId: "acme",
    title: "Build SEO Audit Checklist page",
    description: "New informational page targeting 'SEO audit checklist', 5,400 monthly searches.",
    source: "Content Opportunity",
    priority: "medium",
    assignee: "Sarah Klein",
    status: "todo",
    dueDate: "2026-09-02",
  },
  {
    id: "tk-7",
    projectId: "acme",
    title: "Optimise /on-page-seo for top 10",
    description: "Currently #16 with 5,400 volume and an improving trend.",
    source: "Keyword",
    priority: "medium",
    assignee: "Priya Nair",
    status: "in-progress",
    dueDate: "2026-08-29",
  },
  {
    id: "tk-8",
    projectId: "growthhub",
    title: "Fix broken canonical tags on resource hub",
    description: "Canonicals point to the staging domain on 9 resource pages.",
    source: "SEO Audit",
    priority: "high",
    assignee: "Marco Reyes",
    status: "todo",
    dueDate: "2026-08-22",
  },
  {
    id: "tk-9",
    projectId: "northstar",
    title: "Add location schema to service area pages",
    description: "12 local landing pages lack LocalBusiness markup.",
    source: "SEO Audit",
    priority: "low",
    assignee: "Priya Nair",
    status: "completed",
    dueDate: "2026-08-10",
    completedBy: "Priya Nair",
  },
];

export const rankTrend = [
  { month: "Mar", position: 26 },
  { month: "Apr", position: 24 },
  { month: "May", position: 21 },
  { month: "Jun", position: 19 },
  { month: "Jul", position: 17 },
  { month: "Aug", position: 14 },
];

export const assignees = ["Sarah Klein", "Marco Reyes", "Priya Nair", "Unassigned"];