# RankPilot Navigator

Lovable Prompt — RankPilot Frontend Skeleton

RankPilot — SEO Opportunity & Prioritization Dashboard

Create a responsive frontend-only skeleton prototype for a SaaS application called RankPilot.

RankPilot is an SEO opportunity and prioritization dashboard for SEO specialists and SEO managers. Its purpose is to help users turn SEO data into prioritized, actionable tasks.

The core workflow is:

SEO Data → Issues & Opportunities → Prioritization → Recommendation → SEO Task → Completion

Important Development Rules

This is a frontend skeleton only.

Do not:

Connect a backend or database.

Implement real authentication.

Connect Google Search Console, Google Analytics, Ahrefs, Semrush, or any external API.

Add payment functionality.

Add email or notification services.

Use localStorage for permanent data.

Add passwords, API keys, secrets, or credentials.

Build real website crawling or SEO analysis.

Use realistic static mock data and temporary frontend state only.

The goal is to demonstrate the structure, design, navigation, and main user workflows.

1. Overall Design Direction

Create a modern, professional SaaS dashboard designed specifically for SEO professionals.

The interface should feel similar to a polished B2B analytics/productivity application rather than a generic admin dashboard.

Visual style

Clean and modern.

Professional.

Data-focused but not overwhelming.

Generous spacing.

Rounded cards and panels.

Clear hierarchy.

Subtle borders and shadows.

Responsive layout.

Strong visual distinction between normal, warning, high-priority, and completed states.

Use a consistent design system for:

Colors

Typography

Spacing

Buttons

Inputs

Tables

Cards

Badges

Modals

Dropdowns

Navigation

Status indicators

Suggested color system

Use a primarily dark navy/blue and white interface with blue as the primary action color.

Suggested semantic colors:

Blue = primary/action

Red = critical/high priority

Orange = warning/medium priority

Green = success/completed

Gray = neutral

Purple = opportunity/insight

Do not overuse bright colors.

2. Main Application Structure

Create the following navigation:

RankPilot

│

├── Projects

│

└── Selected Project

      ├── Dashboard

      ├── SEO Audit

      ├── Keywords

      ├── Content Opportunities

      ├── Internal Links

      ├── Tasks

      └── Settings

Also include a simple user/profile menu in the header.

All navigation routes must work.

There must be no blank pages, broken links, placeholder routes, or dead navigation items.

3. Login Screen

Create a polished frontend-only login screen.

Content

RankPilot logo/name

"SEO intelligence, prioritized."

Email input

Password input

Login button

"Use Demo Account" button

Small disclaimer that this is a frontend prototype

Interaction

The login does not need real authentication.

When the user clicks Login or Demo Account:

Validate that required fields are not empty.

Display validation messages when appropriate.

Then navigate to the Projects page.

Do not store credentials.

4. Projects Page

Create a Projects dashboard showing the websites managed by the SEO specialist.

Use realistic mock projects such as:

Acme Digital — acmedigital.com

GrowthHub — growthhub.io

Northstar Marketing — northstarmarketing.com

Each project card should display:

Project name

Domain

SEO health score

Open issues

Keyword opportunities

Content opportunities

Last updated

Status

Actions

Open Project

Create Project

Edit Project

Delete Project

Create Project

Use a modal/dialog with:

Project name

Website URL

Description

Add basic validation.

On save, add the project temporarily to frontend state.

On delete, show a confirmation dialog.

Include a useful empty state if there are no projects.

5. Project Dashboard

This is the most important page.

Create a professional SEO command center.

At the top show:

Acme Digital

acmedigital.com

SEO health score:

78 / 100

Then create summary cards:

SEO Health

78/100

Technical Issues

12 open

Keyword Opportunities

24

Content Opportunities

9

Internal Link Opportunities

18

Tasks

7 active

Priority Actions

Create a prominent section titled:

Priority Actions

Show realistic recommendations such as:

High Priority

Fix missing title tags

8 pages affected

Estimated impact: High

Button: View Issue

High Priority

Refresh declining SEO guide

Current position: #17

Previous position: #8

Estimated impact: High

Button: View Opportunity

Medium Priority

Add internal links to SEO Audit page

14 relevant source pages

Estimated impact: Medium

Button: View Recommendation

Allow the user to click these items and navigate to the relevant details.

Dashboard Charts

Include simple frontend-only visualizations:

Keyword Performance

Show a small ranking trend chart.

SEO Issues

Show a visual breakdown:

Critical

High

Medium

Low

Task Progress

Show:

To Do

In Progress

Completed

These are mock visualizations only.

6. SEO Audit Page

Create a technical SEO audit table.

Include realistic mock issues.

Example data:

Issue	URL	Severity	Affected Pages	Status

Missing title tag	/services/seo	High	8	Open

Missing meta description	/about	Medium	5	Open

Missing H1	/blog/technical-seo	Medium	3	Open

Broken internal link	/blog/seo-guide	High	2	Open

Missing image alt text	/blog/analytics	Low	14	Open

Duplicate title tags	/services	High	4	Open

Filters

Add working temporary frontend filters:

All

Critical

High

Medium

Low

Resolved

Also add:

Search field

Status filter

Sort control

Actions

Each issue should allow:

View Details

Create Task

Mark Resolved

Use dialogs where appropriate.

7. SEO Issue Details

When an audit issue is opened, show a details panel/page containing:

Issue title

Severity

Description

Affected URL

Number of affected pages

Example affected pages

Why it matters

Recommended action

Current status

Example:

Missing Title Tags

Severity: High

8 pages currently have missing or incomplete title tags.

Recommended Action

Create unique, descriptive title tags that accurately represent each page's search intent.

Buttons:

Create Task

Mark Resolved

Back to Audit

8. Keywords Page

Create a professional keyword opportunity table.

Use realistic mock data:

Keyword	URL	Rank	Volume	Difficulty	Trend	Opportunity

SEO audit	/seo-audit	14	6,600	70	↑	High

technical SEO	/technical-seo	9	4,400	58	↑	High

SEO checklist	/seo-checklist	21	3,600	55	↓	High

SEO tools	/seo-tools	34	12,000	78	→	Medium

on page SEO	/on-page-seo	16	5,400	61	↑	High

Filters

All

High Opportunity

Medium Opportunity

Improving

Declining

Add search and sorting.

Keyword Details

When a keyword is selected, show:

Keyword

Current rank

Previous rank

Search volume

Keyword difficulty

CTR

Ranking trend

Ranking URL

Opportunity score

Recommended action

Add:

Create SEO Task

9. Content Opportunities Page

Create cards or a table for content recommendations.

Example opportunities:

Create New Content

"SEO Audit Checklist"

Search volume: 5,400

Difficulty: 55

Current URL: None

Opportunity: High

Recommendation:

Create a comprehensive SEO audit checklist targeting informational search intent.

Refresh Existing Content

"Technical SEO Guide"

Current rank: #17

Previous rank: #8

Traffic trend: Declining

Opportunity: High

Recommendation:

Refresh outdated sections, improve topical coverage, and optimize for related queries.

Improve Search Intent

"SEO Tools"

Current rank: #34

Search volume: 12,000

Opportunity: Medium

Recommendation:

Expand comparison content and improve alignment with commercial investigation intent.

Filters

All

Create

Refresh

Improve

High Priority

Medium Priority

Actions

View Details

Create Task

Mark Complete

10. Internal Links Page

Create an internal-link opportunity table.

Example:

Source Page	Target Page	Suggested Anchor	Relevance	Priority

/blog/technical-seo	/services/seo-audit	SEO audit	92%	High

/blog/seo-guide	/technical-seo	technical SEO	87%	High

/blog/content-strategy	/content-services	content strategy	81%	Medium

When an opportunity is opened, show:

Source URL

Target URL

Suggested anchor text

Relevance score

Reason for recommendation

Priority

Actions

Accept Recommendation

Create Task

Dismiss

View Details

These actions should update temporary frontend state.

11. Tasks Page

Create a centralized SEO task-management page.

Use a table or board-style layout.

Tasks should contain:

Task name

Project

Source

Priority

Assignee

Status

Due date

Example tasks:

Fix missing title tags

Source: SEO Audit

Priority: High

Status: To Do

Refresh Technical SEO Guide

Source: Content Opportunity

Priority: High

Status: In Progress

Add internal links to SEO Audit

Source: Internal Links

Priority: Medium

Status: Completed

Statuses

Use:

To Do

In Progress

Completed

Allow the user to change task status using a dropdown or buttons.

The status change should update temporary frontend state.

Create Task

Provide a modal with:

Task title

Description

Priority

Assignee

Due date

Validate required fields.

12. Settings Page

Create a simple project settings page.

Include:

Project Information

Project name

Website URL

Description

Preferences

Default priority

Dashboard view preference

Theme selector

Buttons:

Save Changes

Cancel

Changes only need to exist in temporary frontend state.

13. SEO Manager View

Include a basic manager dashboard accessible through the user/profile menu or demo role selection.

It should show:

Total projects

Open SEO issues

Active tasks

Completed tasks

Projects requiring attention

Team task progress

Include a simple approval section:

Tasks Awaiting Review

Example:

Refresh Technical SEO Guide

Completed by Sarah

Project: Acme Digital

Buttons:

Approve

Request Changes

These are temporary frontend interactions only.

14. Reusable Components

Create reusable components rather than duplicating UI.

Include components such as:

Sidebar

Header

ProjectCard

StatCard

SEOHealthCard

PriorityBadge

StatusBadge

DataTable

FilterBar

SearchInput

Modal/Dialog

ConfirmationDialog

EmptyState

ErrorState

LoadingState

RecommendationCard

TaskCard

ChartCard

FormField

Dropdown

Toast/notification

Use consistent components throughout the application.

15. Required UI States

Do not build only the successful/default state.

Include useful temporary states for:

Empty State

Example:

No SEO opportunities found.

Opportunities will appear here when project data is available.

Button:

Create Project

Loading State

Use skeleton loaders for dashboard cards and tables where appropriate.

Validation State

Examples:

Project name is required.

Website URL is required.

Invalid website URL.

Task title is required.

Display errors next to the relevant form fields.

Error State

Create a generic error component:

Something went wrong while loading this data.

Button:

Try Again

The retry can simply reset the temporary UI state.

Confirmation State

For destructive actions such as deleting a project:

Delete Acme Digital?

This action cannot be undone.

Buttons:

Cancel

Delete Project

Success State

After actions such as:

Project created

Task created

Task completed

Recommendation accepted

Issue resolved

Show a temporary success toast/message.

16. Responsive Design

The application must work across:

Desktop

Use:

Persistent sidebar

Multi-column dashboard

Full data tables

Charts/cards

Tablet

Collapsible sidebar

Responsive cards

Horizontally scrollable tables where necessary

Mobile

Collapsible/mobile navigation

Single-column cards

Stacked dashboard sections

Mobile-friendly forms

Tables converted into cards or horizontally scrollable containers

Buttons large enough for touch interaction

Do not allow important content to overflow off-screen.

17. Mock Data

Use realistic SEO data throughout the application.

Do not use generic placeholder text such as:

Lorem ipsum

Test 123

Item 1

Example data

Use realistic domains, URLs, SEO issues, keywords, rankings, search volumes, priorities, and task names.

All mock data should be internally consistent.

For example, if the dashboard says there are 12 open technical issues, the audit page should contain corresponding mock issues.

If a recommendation becomes a task, the task should use the same recommendation information.

18. Main User Workflows to Demonstrate

The prototype must support these temporary frontend workflows:

Workflow 1 — Audit → Task

Projects

→ Select Project

→ Dashboard

→ SEO Audit

→ Open High-Priority Issue

→ View Details

→ Create Task

→ Tasks

→ See task as "To Do"

Workflow 2 — Keyword → Opportunity → Task

Projects

→ Select Project

→ Keywords

→ Filter High Opportunity

→ Open Keyword

→ Review Recommendation

→ Create Task

→ Tasks

Workflow 3 — Internal Link → Task → Complete

Dashboard

→ Internal Links

→ Open Recommendation

→ Accept Recommendation

→ Create Task

→ Change status to In Progress

→ Change status to Completed

Make sure these workflows actually work using temporary React/frontend state.

19. Important Prototype Principle

The central experience should be:

"Tell me what SEO work I should do next."

Do not make the dashboard simply a collection of charts.

The most prominent section should be Priority Actions.

The user should be able to go from:

Problem → Explanation → Recommendation → Task

with minimal clicks.

20. Final Quality Requirements

Before considering the prototype complete, verify:

Every navigation item works.

Every route has meaningful content.

There are no blank screens.

There are no broken buttons for core workflows.

Forms have validation.

Delete actions have confirmation.

Success/error states exist.

Filters work with mock data.

Task status changes work.

Recommendation-to-task workflow works.

Layout works on desktop, tablet, and mobile.

Components are reusable.

Typography and spacing are consistent.

Mock data is realistic and internally consistent.

No backend is connected.

No database is connected.

No external APIs are connected.

No real authentication is implemented.

No credentials or API keys are included.

No permanent data storage such as localStorage is used.

Build the application as a polished frontend skeleton, not as a production SEO platform. Prioritize the core RankPilot workflow and a professional SEO-focused user experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/96fcf5a5-0df6-4dc3-bc5e-5c8560972e3f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
