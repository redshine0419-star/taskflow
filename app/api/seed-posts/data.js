import { getBlogImage } from '../../../lib/blog-images.js'

export const SEED_POSTS = [

  // ── EN 1 ──────────────────────────────────────────────────────────────────
  {
    slug: 'asana-alternative-free-google-workspace',
    title: 'Best Free Asana Alternatives for Google Workspace Teams',
    date: '2026-04-01',
    category: 'alternatives',
    lang: 'en',
    usedKeyword: 'asana alternative free google workspace',
    desc: 'Need a free Asana alternative that works with Google Workspace? Compare the top options for teams already using Google Drive and Gmail.',
    content: `<h2>Why Teams Look for a Free Asana Alternative</h2>
<p>Asana's free plan covers the basics — tasks, lists, and a board view — but it draws a hard line at 15 members and hides key features like timeline view, custom fields, and reporting behind a $10.99/user/month paywall. For teams embedded in Google Workspace who need more without paying per seat, several strong alternatives exist.</p>
<h2>What to Look for When Switching</h2>
<p>Before picking a replacement, identify which Asana features your team actually uses daily. Most teams rely on three things: a task inbox, a shared board, and deadline tracking. Only a minority regularly use portfolios or workload views.</p>
<ul>
  <li><strong>Google Workspace integration</strong> — can it attach Drive files, sync with Google Calendar, or trigger from Gmail?</li>
  <li><strong>Free tier seat limit</strong> — some tools cap users at 5, which breaks teams of 10</li>
  <li><strong>Guest access</strong> — can external stakeholders view or comment without a paid seat?</li>
  <li><strong>Export and migration</strong> — can you pull your Asana tasks into the new tool without manual re-entry?</li>
</ul>
<h2>Top Free Asana Alternatives</h2>
<h3>1. Trello</h3>
<p>Trello is the most accessible kanban tool available. The free plan supports unlimited cards, unlimited members, and up to 10 boards per workspace. Its Power-Up ecosystem connects to Google Drive, Google Calendar, and Gmail. The main limitation is one Power-Up per board on the free plan, which forces a choice between integrations.</p>
<p><strong>Best for:</strong> Small teams that work primarily in kanban and need a visual board without setup overhead.</p>
<h3>2. ClickUp</h3>
<p>ClickUp's free plan is unusually generous — unlimited tasks, unlimited members, 100MB storage, and multiple view types including list, board, calendar, and Gantt. It integrates directly with Google Drive and can import tasks from Google Sheets. The trade-off is a steep learning curve; new users often spend significant time configuring spaces before doing productive work.</p>
<p><strong>Best for:</strong> Teams willing to invest setup time in exchange for an all-in-one tool that rarely requires an upgrade.</p>
<h3>3. Notion</h3>
<p>Notion blurs the line between docs and task management. The free plan supports unlimited pages and blocks. Teams use database views — board, table, calendar — to replicate Asana-style project tracking. The Google Drive integration embeds files inline. The downside: Notion lacks native task assignment notifications.</p>
<p><strong>Best for:</strong> Teams that already write everything in docs and want tasks to live in the same place.</p>
<h3>4. Linear</h3>
<p>Linear is built for software teams. It offers sprints, issue tracking, cycle analytics, and GitHub/GitLab integration out of the box. The free plan covers up to 250 issues. It doesn't integrate with Google Workspace as deeply as other tools, but its speed and UX are consistently praised by engineering teams.</p>
<p><strong>Best for:</strong> Product and engineering teams running sprints who find Asana too generic.</p>
<h3>5. Basecamp Personal</h3>
<p>Basecamp's personal plan is free for up to 3 projects and 20 users. It bundles message boards, to-do lists, file storage, and group chat in a single interface. Teams that fit its model find it reduces tool sprawl significantly.</p>
<p><strong>Best for:</strong> Small teams that want everything in one place and are tired of stitching tools together.</p>
<h3>6. TaskGrid</h3>
<p>TaskGrid stores project data directly in Google Sheets and adds a visual kanban board on top. Because the data lives in Drive, there's nothing new to learn for teams already using Google Workspace.</p>
<p><strong>Best for:</strong> Google Workspace teams that want kanban without migrating data out of the Google ecosystem.</p>
<h2>Migration Tips</h2>
<p>Asana allows CSV export of tasks including assignees, due dates, and custom fields. Most alternatives accept CSV import. Before switching, export a test project, import it into your chosen tool, and verify that assignee names and dates map correctly. Run both tools in parallel for one sprint before fully committing.</p>
<h2>Verdict</h2>
<p>For most Google Workspace teams, <strong>ClickUp</strong> offers the highest feature-to-cost ratio on a free plan. If simplicity matters more than features, <strong>Trello</strong> is the fastest to adopt. If your team lives in docs, <strong>Notion</strong> is the natural choice. Pick based on where your team spends most of its time, not on feature lists.</p>`,
  },

  // ── EN 2 ──────────────────────────────────────────────────────────────────
  {
    slug: 'notion-alternative-free-teams',
    title: 'Top Free Notion Alternatives for Teams in 2026',
    date: '2026-04-02',
    category: 'alternatives',
    lang: 'en',
    usedKeyword: 'notion alternative free for teams',
    desc: 'Notion free plan limits guest access and version history. These free Notion alternatives give teams full documentation and project management without the friction.',
    content: `<h2>What the Notion Free Plan Actually Limits</h2>
<p>Notion's free plan is genuinely usable for a single person or very small team. You get unlimited pages and blocks, basic database views, and the core editing experience. But three limitations push teams toward alternatives:</p>
<ul>
  <li><strong>Guest limit</strong>: Only 10 guests on the free plan. External collaborators beyond that require a paid seat.</li>
  <li><strong>Version history</strong>: Limited to 7 days on free. For teams tracking changes over weeks or months, this is a real gap.</li>
  <li><strong>Notion AI</strong>: The AI writing and summarization features require a paid add-on.</li>
</ul>
<h2>Free Notion Alternatives Compared</h2>
<h3>1. Coda</h3>
<p>Coda is the most direct Notion competitor. Documents contain "tables" that function like databases, and you can build interactive buttons, automations, and views inside a doc. The free plan supports unlimited docs but limits automations and rows per table. Guest sharing is more permissive than Notion's free tier.</p>
<p><strong>Best for:</strong> Teams that build tools inside documents — approval workflows, tracking dashboards, or internal apps.</p>
<h3>2. Slab</h3>
<p>Slab focuses purely on knowledge management rather than task tracking. It's cleaner than Notion for writing and searching company documentation. The free plan supports up to 10 users with full search and basic integrations. It doesn't try to be a project manager, which is either a relief or a dealbreaker depending on your needs.</p>
<p><strong>Best for:</strong> Teams that primarily need a shared knowledge base and use a separate tool for task management.</p>
<h3>3. Nuclino</h3>
<p>Nuclino offers a graph-based knowledge base with a fast, distraction-free editor. The free plan supports up to 50 items and 2GB storage. Its real strength is the visual graph view that shows how documents connect, making it useful for teams building interconnected documentation.</p>
<p><strong>Best for:</strong> Research teams or those who think in connected notes rather than hierarchical folders.</p>
<h3>4. AppFlowy (Open Source)</h3>
<p>AppFlowy is open-source and can be self-hosted, meaning zero cost at any scale if you manage your own server. It mirrors Notion's interface closely — block-based editor, database views, board and calendar layouts. Self-hosting requires technical setup but removes all seat and storage limits.</p>
<p><strong>Best for:</strong> Technical teams or companies with data residency requirements that need a Notion-like tool under their own control.</p>
<h3>5. Confluence Free</h3>
<p>Atlassian offers Confluence free for up to 10 users with unlimited pages and spaces. It's the standard for engineering and product teams using Jira, as the two integrate seamlessly. For established tech teams it's a natural fit.</p>
<p><strong>Best for:</strong> Teams already using Jira who want documentation to live next to their issue tracker.</p>
<h3>6. Outline (Open Source)</h3>
<p>Outline is an open-source team wiki with a clean Markdown-based editor. The self-hosted version is free. It supports real-time collaboration, nested documents, and integrates with Slack for search.</p>
<p><strong>Best for:</strong> Developer-led teams comfortable with self-hosting who want a fast, no-nonsense documentation tool.</p>
<h2>Choosing the Right Fit</h2>
<p>The right Notion alternative depends on what you actually used Notion for:</p>
<ul>
  <li>If you used Notion primarily as a <strong>task manager</strong>, try ClickUp or Asana free instead</li>
  <li>If you used it as a <strong>knowledge base</strong>, Slab or Confluence free fit better</li>
  <li>If you used it as an <strong>internal tool builder</strong>, Coda is the closest match</li>
  <li>If cost is the absolute constraint and you have technical resources, <strong>AppFlowy or Outline self-hosted</strong> eliminate the cost entirely</li>
</ul>
<h2>Migration Checklist</h2>
<p>Notion exports pages as Markdown or HTML. Most alternatives import Markdown reasonably well. Large databases with complex relations may require manual restructuring. Run the export, review the output, and test import on 10-20 pages before committing the full team.</p>`,
  },

  // ── EN 3 ──────────────────────────────────────────────────────────────────
  {
    slug: 'google-sheets-kanban-board',
    title: 'How to Build a Kanban Board in Google Sheets (Step-by-Step)',
    date: '2026-04-10',
    category: 'google-workspace',
    lang: 'en',
    usedKeyword: 'google sheets kanban board',
    desc: 'Build a functional kanban board in Google Sheets using conditional formatting, data validation, and filter views. Step-by-step guide with automation tips.',
    content: `<h2>Why Build a Kanban Board in Google Sheets?</h2>
<p>Purpose-built kanban tools like Trello or Linear are faster to set up, but Google Sheets offers something they don't: your data stays inside Google Drive, where your team already works. There's no new tool to learn, no separate login, and the board is a spreadsheet — meaning you can slice, filter, and analyze your tasks with formulas that kanban apps can't match.</p>
<p>The trade-off is that Sheets requires manual setup and doesn't give you drag-and-drop card movement.</p>
<h2>Basic Structure: Columns as Status Lanes</h2>
<p>The simplest kanban board in Sheets uses one row per task and a status column that acts as your swim lanes. Here's the recommended column structure:</p>
<ul>
  <li><strong>A: Task</strong> — short description of the work item</li>
  <li><strong>B: Status</strong> — dropdown: To Do / In Progress / Review / Done</li>
  <li><strong>C: Assignee</strong> — team member name or email</li>
  <li><strong>D: Due Date</strong> — date format for sorting</li>
  <li><strong>E: Priority</strong> — High / Medium / Low</li>
  <li><strong>F: Notes</strong> — free text for context</li>
</ul>
<h2>Step 1: Add Data Validation for Status</h2>
<p>Select the entire Status column (B2:B500), then go to <strong>Data → Data validation</strong>. Choose "List of items" and enter: <code>To Do, In Progress, Review, Done</code>. This turns the column into a dropdown and prevents typos that break filtering.</p>
<h2>Step 2: Apply Conditional Formatting for Visual Clarity</h2>
<p>Select the full data range (A2:F500) and go to <strong>Format → Conditional formatting</strong>:</p>
<ol>
  <li>Custom formula: <code>=$B2="In Progress"</code> → light blue background</li>
  <li>Custom formula: <code>=$B2="Review"</code> → light yellow background</li>
  <li>Custom formula: <code>=$B2="Done"</code> → light green background, strikethrough text</li>
  <li>Custom formula: <code>=AND($D2&lt;TODAY(),$B2&lt;&gt;"Done")</code> → red background (overdue tasks)</li>
</ol>
<h2>Step 3: Create Filter Views per Status Lane</h2>
<p>Go to <strong>Data → Filter views → Create new filter view</strong>. Name it "In Progress" and set a filter on column B to show only "In Progress" rows. Repeat for each status. Team members can switch between views without affecting what others see.</p>
<h2>Step 4: Add a Summary Dashboard</h2>
<p>On a second sheet tab, use COUNTIF formulas to display task counts per status:</p>
<pre><code>=COUNTIF(Tasks!B:B,"In Progress")</code></pre>
<p>Add a bar chart based on these counts for a quick visual summary of project health.</p>
<h2>Step 5: Automate with Apps Script (Optional)</h2>
<p>For teams that want email notifications when tasks change status, Google Apps Script can watch for edits. Go to <strong>Extensions → Apps Script</strong> and add an <code>onEdit</code> trigger that sends a Gmail notification when column B changes to "Review".</p>
<h2>Limitations of the Sheets Approach</h2>
<p>A Sheets kanban works well up to about 50-100 active tasks with a team of 5-8. Beyond that, you'll encounter:</p>
<ul>
  <li>No drag-and-drop card movement — status changes require editing a cell</li>
  <li>No per-card comments or attachments natively</li>
  <li>Simultaneous editing can cause conflicts</li>
  <li>No mobile-friendly board view</li>
</ul>
<h2>When to Use a Dedicated Tool Instead</h2>
<p>If your team needs real drag-and-drop, card-level discussions, or file attachments on tasks, move to a purpose-built tool. For teams already deep in Google Workspace, <a href="https://www.taskgrid.my">TaskGrid</a> builds a visual kanban board directly on top of a Google Sheet, giving you drag-and-drop without moving your data out of Drive.</p>`,
  },

  // ── EN 4 ──────────────────────────────────────────────────────────────────
  {
    slug: 'free-ai-project-management-2026',
    title: 'Free AI Project Management Tools in 2026: An Honest Comparison',
    date: '2026-04-18',
    category: 'ai-tools',
    lang: 'en',
    usedKeyword: 'free AI project management tool 2026',
    desc: 'Which free AI project management tools actually deliver in 2026? Comparing ClickUp AI, Notion AI, Asana Intelligence, Linear, and Taskade on their free tiers.',
    content: `<h2>What AI Actually Does in Project Management Tools</h2>
<p>The phrase "AI-powered" is attached to almost every project management tool in 2026. Most of these claims fall into a narrow set of real capabilities:</p>
<ul>
  <li><strong>Task generation</strong>: parsing a document or prompt and creating a task list</li>
  <li><strong>Status summarization</strong>: generating a plain-language progress report from task data</li>
  <li><strong>Smart scheduling</strong>: suggesting due dates based on team workload</li>
  <li><strong>Risk detection</strong>: flagging tasks likely to be delayed based on historical patterns</li>
  <li><strong>Writing assistance</strong>: drafting task descriptions, meeting notes, or project briefs</li>
</ul>
<p>The question isn't whether a tool has AI — it's which of these features are available on the free tier and how much they actually reduce manual work.</p>
<h2>Free AI Tools Compared</h2>
<h3>1. Taskade — Free AI Available</h3>
<p>Taskade includes AI in its free plan, which makes it the most notable free AI PM tool in 2026. Free users can generate task lists from prompts, summarize projects, and use AI chat within tasks. The free tier limits AI usage to a fixed number of requests per month, but it's enough to evaluate the feature genuinely.</p>
<p><strong>Free AI verdict: Available with monthly limits. Best option for testing AI PM features at no cost.</strong></p>
<h3>2. ClickUp AI — Paid Add-On</h3>
<p>ClickUp added AI to its platform as a paid add-on ($5/user/month), which means it's not available on the free plan. However, ClickUp's free tier is still extremely capable without AI: unlimited tasks, multiple views, and automations.</p>
<p><strong>Free AI verdict: Not available. Strong tool otherwise.</strong></p>
<h3>3. Notion AI — Paid Add-On</h3>
<p>Notion AI is available as a paid add-on ($8/user/month) on top of any Notion plan, including free. This means free Notion users can try AI features but must pay to continue. Notion AI is strongest for writing tasks — summarizing meeting notes, drafting project briefs, and cleaning up messy documentation.</p>
<p><strong>Free AI verdict: Trial only. Best AI writing assistant in the category.</strong></p>
<h3>4. Asana Intelligence — Advanced Plan Only</h3>
<p>Asana's AI features (project status summaries, smart goals, smart editor) are gated behind the Advanced and Enterprise plans. The free plan has no AI capabilities.</p>
<p><strong>Free AI verdict: Not available on free plan.</strong></p>
<h3>5. Linear — Basic AI Included Free</h3>
<p>Linear doesn't market itself as an AI tool, but it includes AI-assisted issue writing (auto-expanding brief descriptions into full issue details) and smart search. These features are available to all users including the free tier.</p>
<p><strong>Free AI verdict: Basic AI features available free. Best for engineering teams.</strong></p>
<h2>Practical AI Workflows Without a Paid Tool</h2>
<p>Teams can get most of the value of "AI project management" by combining free tools:</p>
<ol>
  <li>Use <strong>Claude.ai or ChatGPT free</strong> to generate task breakdowns from a project brief</li>
  <li>Paste the output into Trello, Notion, or any kanban tool manually</li>
  <li>Use Otter.ai (free tier) to transcribe meetings and extract action items</li>
</ol>
<p>This approach requires more manual steps but achieves similar results without any paid AI subscription.</p>
<h2>The Honest Assessment</h2>
<p>In 2026, <strong>Taskade</strong> is the only mainstream PM tool offering genuine AI features on a free plan. Most competitors treat AI as a premium upsell. For teams willing to pay a modest amount, Notion AI's writing assistance offers the best quality for general-purpose project work.</p>`,
  },

  // ── EN 5 ──────────────────────────────────────────────────────────────────
  {
    slug: 'small-team-project-management-free',
    title: 'Best Free Project Management Tools for Small Teams in 2026',
    date: '2026-04-24',
    category: 'productivity',
    lang: 'en',
    usedKeyword: 'small team project management free',
    desc: 'The best free project management tools for teams of 2 to 15 people in 2026. Compared by ease of setup, free tier limits, and collaboration features.',
    content: `<h2>What Small Teams Actually Need</h2>
<p>Small teams — typically 2 to 15 people — have fundamentally different needs from enterprise project management. They don't need resource allocation matrices or portfolio dashboards. They need:</p>
<ul>
  <li>A shared view of who is doing what</li>
  <li>Clear deadlines and ownership</li>
  <li>A way to track what's done vs. in progress</li>
  <li>Something everyone will actually use without training</li>
</ul>
<p>Most free PM tools are built with these needs in mind, then progressively locked behind paywalls as complexity grows. The key is finding one where the free tier genuinely covers a team of your size without artificial limits that kick in too early.</p>
<h2>Free Tools That Work Well for Small Teams</h2>
<h3>Trello — Best for Simplicity</h3>
<p>Trello's free plan supports unlimited cards, unlimited members, and up to 10 boards per workspace. For a team of 5-15 running a handful of projects simultaneously, this is enough. The kanban interface requires no training, and new team members can start contributing in minutes.</p>
<p>The limitation: one Power-Up per board. If you need a calendar view AND a Google Drive integration on the same board, you'll have to choose. Workaround: use Butler (Trello's built-in automation) to fill gaps Power-Ups would otherwise cover.</p>
<p><strong>Free tier ceiling:</strong> 10 boards. Works well until a team runs 10+ simultaneous projects.</p>
<h3>Asana — Best for Task-Heavy Teams</h3>
<p>Asana's free plan supports up to 15 members, unlimited tasks, list and board views, and basic reporting. It's more structured than Trello — tasks have subtasks, dependencies can be set, and there's a clear "My Tasks" inbox for each team member.</p>
<p>The free plan doesn't include timeline view or custom fields, which limits its use for complex project planning. For straightforward task tracking, it's hard to beat at zero cost.</p>
<p><strong>Free tier ceiling:</strong> 15 members. Upgrade pressure hits when you need timeline or reporting.</p>
<h3>ClickUp — Best Feature Density</h3>
<p>ClickUp's free tier is the most feature-rich in the category: unlimited tasks, unlimited members, 100MB storage, multiple view types (list, board, calendar, Gantt, mind map), and basic automations.</p>
<p>The cost is complexity. ClickUp has a steeper learning curve than Trello or Asana. Small teams with a designated setup person who can configure ClickUp once tend to love it; teams expecting everyone to self-onboard often abandon it.</p>
<p><strong>Free tier ceiling:</strong> 100MB storage is tight if you attach files. Otherwise, very high ceiling.</p>
<h3>Notion — Best for Doc-Heavy Teams</h3>
<p>If your team writes a lot — specs, meeting notes, proposals — and wants tasks to live next to documentation, Notion is the right fit. The free plan supports unlimited pages and basic database views.</p>
<p>Notion requires more setup than the others. Someone needs to design the database structure before the team can use it effectively. But teams that invest the setup time often find it replaces three or four other tools.</p>
<p><strong>Free tier ceiling:</strong> Guest limit (10 guests) is the most common frustration for teams with external stakeholders.</p>
<h3>Linear — Best for Product/Engineering Teams</h3>
<p>Linear is purpose-built for software development. Sprints, issue statuses, cycle analytics, and GitHub/GitLab integration are all first-class features. The free plan covers up to 250 issues and includes most core features.</p>
<p>It's not the right fit for non-technical teams. A marketing or design team will find it over-indexed on developer concepts.</p>
<p><strong>Free tier ceiling:</strong> 250 issues. Hits limits on large backlogs.</p>
<h2>Decision Guide by Team Type</h2>
<ul>
  <li><strong>Marketing or operations team</strong>: Start with Trello. Migrate to Asana when you hit 10 boards.</li>
  <li><strong>Product + engineering team</strong>: Linear is the default. ClickUp if you need non-engineers included.</li>
  <li><strong>Consulting or agency</strong>: Notion for docs + Trello or Asana for tasks.</li>
  <li><strong>Google Workspace team</strong>: TaskGrid (kanban on Google Sheets) or ClickUp with Google Drive integration.</li>
</ul>
<h2>What to Avoid</h2>
<p>Avoid tools that require a credit card to start a "free" plan. Avoid tools that cap your free plan at 5 members if your team is 6 or more. And avoid adopting a tool because it has the most features: the best PM tool for a small team is the one everyone actually opens every day.</p>`,
  },

  // ── KO 1 ──────────────────────────────────────────────────────────────────
  {
    slug: '아사나-무료-대안',
    title: '아사나(Asana) 무료 대안 툴 비교 2026',
    date: '2026-04-29',
    category: '툴비교',
    lang: 'ko',
    usedKeyword: '아사나 무료 대안',
    desc: 'Asana 유료 전환이 고민이라면? 2026년 무료로 사용할 수 있는 아사나 대안 툴 6가지를 기능, 팀 규모, 사용 목적별로 비교합니다.',
    content: `<h2>아사나(Asana) 무료 플랜의 한계</h2>
<p>Asana는 팀 프로젝트 관리 툴 중 가장 잘 알려진 서비스 중 하나입니다. 무료 플랜으로도 기본적인 태스크 관리, 리스트 뷰, 보드 뷰를 사용할 수 있지만, 팀이 성장하거나 기능을 더 활용하려 하면 곧 한계를 마주치게 됩니다.</p>
<ul>
  <li><strong>팀원 15명 제한</strong>: 무료 플랜은 최대 15명까지만 사용 가능합니다.</li>
  <li><strong>타임라인 뷰 없음</strong>: 간트차트 형태의 타임라인은 유료 플랜 전용입니다.</li>
  <li><strong>커스텀 필드 없음</strong>: 태스크에 맞춤 항목을 추가하려면 유료 플랜이 필요합니다.</li>
  <li><strong>보고서 기능 제한</strong>: 프로젝트 진행 현황을 자동으로 집계하는 대시보드는 유료 기능입니다.</li>
</ul>
<p>월 $10.99/인의 비용은 소규모 팀에게 부담스럽습니다. 아래에서 Asana를 대체할 수 있는 무료 툴 6가지를 비교합니다.</p>
<h2>아사나 무료 대안 6가지 비교</h2>
<h3>1. Trello</h3>
<p>Trello는 칸반 보드 방식의 툴 중 가장 진입장벽이 낮습니다. 무료 플랜에서 무제한 카드, 무제한 팀원, 워크스페이스당 10개 보드를 지원합니다. 구글 드라이브, 구글 캘린더와 연동되는 Power-Up이 있어 Google Workspace와 함께 사용하기 좋습니다.</p>
<p><strong>제한사항</strong>: 무료 플랜에서 보드당 Power-Up 1개 제한이 있습니다.</p>
<p><strong>추천 팀</strong>: 칸반 방식으로 업무를 관리하는 소규모 팀</p>
<h3>2. ClickUp</h3>
<p>ClickUp의 무료 플랜은 업계에서 가장 넉넉한 수준입니다. 무제한 태스크, 무제한 팀원, 100MB 저장공간, 리스트·보드·캘린더·간트 등 다양한 뷰를 무료로 제공합니다.</p>
<p><strong>제한사항</strong>: 초기 설정이 복잡하고 학습 곡선이 높습니다.</p>
<p><strong>추천 팀</strong>: 기능이 많은 툴을 원하는 팀, 여러 툴을 하나로 통합하고 싶은 팀</p>
<h3>3. Notion</h3>
<p>Notion은 문서와 태스크 관리를 하나의 공간에서 처리할 수 있는 툴입니다. 무료 플랜에서 무제한 페이지와 데이터베이스 뷰(보드, 테이블, 캘린더)를 지원합니다.</p>
<p><strong>제한사항</strong>: 게스트 10명 제한, 버전 히스토리 7일 제한</p>
<p><strong>추천 팀</strong>: 문서 작성이 많은 팀, 기획·마케팅 직군</p>
<h3>4. Linear</h3>
<p>Linear는 소프트웨어 개발팀을 위한 이슈 트래커입니다. 스프린트, 사이클 분석, GitHub·GitLab 연동이 기본 제공됩니다. 무료 플랜에서 이슈 250개까지 사용할 수 있습니다.</p>
<p><strong>제한사항</strong>: 비개발팀에는 어색한 UI, 이슈 250개 제한</p>
<p><strong>추천 팀</strong>: 스프린트로 업무를 운영하는 제품·개발팀</p>
<h3>5. Basecamp Personal</h3>
<p>Basecamp는 메시지 보드, 할 일 목록, 파일 공유, 그룹 채팅을 한 곳에 모은 툴입니다. Personal 플랜은 프로젝트 3개, 팀원 20명까지 무료입니다.</p>
<p><strong>제한사항</strong>: 프로젝트 3개 제한, 커스터마이징 제한</p>
<p><strong>추천 팀</strong>: 하나의 툴로 모든 것을 해결하고 싶은 팀</p>
<h3>6. TaskGrid</h3>
<p>TaskGrid는 구글 시트를 데이터베이스로 사용하고 그 위에 칸반 보드를 제공하는 툴입니다. 구글 워크스페이스를 이미 사용하는 팀이라면 별도 데이터 마이그레이션 없이 바로 시작할 수 있습니다.</p>
<p><strong>추천 팀</strong>: 구글 워크스페이스 기반으로 일하는 팀</p>
<h2>어떤 툴을 선택해야 할까?</h2>
<ul>
  <li>빠르게 시작하고 싶다면 → <strong>Trello</strong></li>
  <li>Asana와 가장 유사한 기능을 원한다면 → <strong>ClickUp</strong></li>
  <li>문서와 태스크를 함께 관리하고 싶다면 → <strong>Notion</strong></li>
  <li>개발팀이라면 → <strong>Linear</strong></li>
  <li>구글 워크스페이스 팀이라면 → <strong>TaskGrid</strong></li>
</ul>
<h2>전환 시 체크리스트</h2>
<p>Asana에서 다른 툴로 전환할 때는 반드시 CSV 내보내기로 기존 태스크를 백업하세요. 대부분의 대안 툴이 CSV 가져오기를 지원합니다. 한 프로젝트를 새 툴에서 1~2주 병행 운영해보고 팀 전체가 전환하는 순서를 권장합니다.</p>`,
  },

  // ── KO 2 ──────────────────────────────────────────────────────────────────
  {
    slug: '노션-대신-무료-협업툴',
    title: '노션 대신 쓸 수 있는 무료 협업툴 추천 2026',
    date: '2026-04-30',
    category: '툴비교',
    lang: 'ko',
    usedKeyword: '노션 대신 무료 협업툴',
    desc: '노션 무료 플랜의 게스트 제한, 버전 히스토리 제한이 불편하다면? 노션 대신 사용할 수 있는 무료 협업툴 6가지를 비교합니다.',
    content: `<h2>노션(Notion) 무료 플랜, 실제로 어떤 제한이 있나</h2>
<p>노션은 문서와 데이터베이스를 하나의 공간에서 관리할 수 있는 독특한 포지션으로 많은 팀에서 사용되고 있습니다. 무료 플랜으로도 상당히 많은 기능을 사용할 수 있지만, 팀 협업 도구로 쓰다 보면 다음 한계를 마주치게 됩니다.</p>
<ul>
  <li><strong>게스트 10명 제한</strong>: 외부 협력사, 프리랜서, 고객을 초대할 때 금방 한도에 도달합니다.</li>
  <li><strong>버전 히스토리 7일</strong>: 일주일 이상 된 수정 이력은 무료 플랜에서 확인할 수 없습니다.</li>
  <li><strong>Notion AI 별도 유료</strong>: AI 글쓰기와 요약 기능은 별도 추가 결제가 필요합니다.</li>
  <li><strong>고급 권한 관리 없음</strong>: 페이지별 세밀한 접근 권한 설정은 유료 플랜에서만 가능합니다.</li>
</ul>
<h2>노션 대신 쓸 수 있는 무료 협업툴 6가지</h2>
<h3>1. Coda</h3>
<p>Coda는 노션과 가장 유사한 포지션의 툴입니다. 문서 안에 테이블, 버튼, 자동화를 넣어 인터랙티브한 워크스페이스를 만들 수 있습니다. 무료 플랜에서 문서 수 무제한, 기본 자동화를 지원합니다. 게스트 공유가 노션보다 유연합니다.</p>
<p><strong>추천 팀</strong>: 승인 워크플로우, 트래킹 대시보드, 내부 앱을 문서 안에 만들고 싶은 팀</p>
<h3>2. Slab</h3>
<p>Slab은 지식 관리(Knowledge Base)에 특화된 툴입니다. 노션보다 글쓰기와 검색에 집중되어 있어 사내 문서, 온보딩 자료, 가이드라인 관리에 적합합니다. 무료 플랜은 팀원 10명까지 지원하며, Slack 연동으로 문서를 검색할 수 있습니다.</p>
<p><strong>추천 팀</strong>: 체계적인 사내 문서가 필요한 팀</p>
<h3>3. Nuclino</h3>
<p>Nuclino는 빠른 에디터와 그래프 뷰가 특징인 팀 위키 툴입니다. 무료 플랜에서 아이템 50개와 2GB 저장공간을 지원합니다. 문서 간 연결 관계를 시각적으로 보여주는 그래프 뷰는 복잡한 문서 구조를 파악하는 데 유용합니다.</p>
<p><strong>추천 팀</strong>: 연구팀, 문서 간 연결 관계를 중시하는 팀</p>
<h3>4. AppFlowy (오픈소스)</h3>
<p>AppFlowy는 노션과 인터페이스가 가장 유사한 오픈소스 툴입니다. 자체 서버에 설치하면 팀원 수와 저장공간 제한 없이 무료로 사용할 수 있습니다. 데이터 보안이 중요한 조직에서 특히 유용합니다.</p>
<p><strong>추천 팀</strong>: 서버를 직접 운영할 수 있는 기술팀, 데이터 보안이 중요한 조직</p>
<h3>5. Confluence 무료</h3>
<p>Atlassian Confluence는 팀원 10명까지 무료로 사용할 수 있습니다. 페이지와 스페이스 수에 제한이 없으며, Jira와 연동하면 이슈와 문서를 연결하여 관리할 수 있습니다.</p>
<p><strong>추천 팀</strong>: Jira를 사용하는 개발팀</p>
<h3>6. Outline (오픈소스)</h3>
<p>Outline은 마크다운 기반의 팀 위키 오픈소스 툴입니다. 셀프호스팅 시 무료이며, 실시간 공동 편집, 중첩 문서, Slack 검색 연동을 지원합니다.</p>
<p><strong>추천 팀</strong>: 셀프호스팅이 가능한 개발팀</p>
<h2>상황별 선택 가이드</h2>
<ul>
  <li>주로 <strong>태스크 관리</strong>로 사용했다면 → ClickUp 또는 Asana 무료 플랜</li>
  <li>주로 <strong>사내 문서·지식 베이스</strong>로 사용했다면 → Slab 또는 Confluence 무료</li>
  <li>문서 안에 <strong>인터랙티브 기능</strong>이 필요하다면 → Coda</li>
  <li><strong>비용을 완전히 없애고 싶고 기술 역량</strong>이 있다면 → AppFlowy 또는 Outline 셀프호스팅</li>
</ul>
<h2>전환 전 확인할 것들</h2>
<p>노션은 페이지를 Markdown 또는 HTML로 내보낼 수 있습니다. 대부분의 대안 툴이 Markdown 가져오기를 지원하지만, 복잡한 데이터베이스나 관계형 필드는 수동으로 재구성이 필요할 수 있습니다. 전체 마이그레이션 전에 핵심 문서 10-20개를 먼저 테스트해보는 것을 권장합니다.</p>`,
  },

  // ── KO 3 ──────────────────────────────────────────────────────────────────
  {
    slug: '구글-스프레드시트-칸반보드',
    title: '구글 스프레드시트로 칸반보드 만들기: 단계별 가이드',
    date: '2026-05-08',
    category: '구글활용',
    lang: 'ko',
    usedKeyword: '구글 스프레드시트 칸반보드 만들기',
    desc: '구글 스프레드시트를 칸반보드로 만드는 방법을 단계별로 설명합니다. 조건부 서식, 데이터 유효성 검사, 필터 뷰를 활용한 실용 가이드.',
    content: `<h2>구글 시트로 칸반보드를 만드는 이유</h2>
<p>Trello나 Asana 같은 전문 칸반 툴이 더 빠르게 시작할 수 있지만, 구글 스프레드시트만의 장점이 있습니다. 데이터가 구글 드라이브에 남아 있어 팀이 이미 익숙한 환경에서 작업할 수 있고, 수식으로 현황을 집계하거나 피벗 테이블로 분석하는 것이 전문 툴보다 훨씬 자유롭습니다.</p>
<p>단점도 명확합니다. 드래그앤드롭으로 카드를 이동할 수 없고, 카드별 댓글이나 첨부파일 기능이 없습니다.</p>
<h2>기본 구조 설정하기</h2>
<p>가장 기본적인 구글 시트 칸반보드는 태스크당 한 행을 사용하고, 상태(Status) 열이 칸반의 수영 레인 역할을 합니다. 아래 컬럼 구성을 권장합니다.</p>
<ul>
  <li><strong>A열: 태스크명</strong> — 업무 항목 요약</li>
  <li><strong>B열: 상태</strong> — 드롭다운: 할 일 / 진행 중 / 검토 중 / 완료</li>
  <li><strong>C열: 담당자</strong> — 이름 또는 이메일</li>
  <li><strong>D열: 마감일</strong> — 날짜 형식 (정렬 가능)</li>
  <li><strong>E열: 우선순위</strong> — 높음 / 보통 / 낮음</li>
  <li><strong>F열: 메모</strong> — 추가 맥락 자유 기입</li>
</ul>
<h2>1단계: 상태 열에 데이터 유효성 검사 추가</h2>
<p>B2:B500 범위를 선택하고 <strong>데이터 → 데이터 유효성 검사</strong>로 이동합니다. "항목 목록"을 선택하고 <code>할 일, 진행 중, 검토 중, 완료</code>를 입력합니다. 이렇게 하면 상태 열이 드롭다운으로 변환되어 오탈자로 인한 필터 오류를 방지할 수 있습니다.</p>
<h2>2단계: 조건부 서식으로 색상 구분</h2>
<p>전체 데이터 범위(A2:F500)를 선택하고 <strong>서식 → 조건부 서식</strong>으로 이동합니다.</p>
<ol>
  <li>맞춤 수식: <code>=$B2="진행 중"</code> → 배경색 연파랑</li>
  <li>맞춤 수식: <code>=$B2="검토 중"</code> → 배경색 연노랑</li>
  <li>맞춤 수식: <code>=$B2="완료"</code> → 배경색 연초록, 텍스트 취소선</li>
  <li>맞춤 수식: <code>=AND($D2&lt;TODAY(),$B2&lt;&gt;"완료")</code> → 배경색 연빨강 (기한 초과)</li>
</ol>
<h2>3단계: 상태별 필터 뷰 만들기</h2>
<p><strong>데이터 → 필터 보기 → 새 필터 보기 만들기</strong>로 이동합니다. 이름을 "진행 중"으로 설정하고 B열에 "진행 중"만 표시하는 필터를 추가합니다. 팀원들이 각자 다른 뷰로 전환해도 다른 사람의 화면에 영향을 주지 않습니다.</p>
<h2>4단계: 현황 요약 대시보드 추가</h2>
<p>두 번째 시트 탭을 추가하고 상태별 태스크 수를 COUNTIF로 집계합니다.</p>
<pre><code>=COUNTIF(태스크!B:B,"진행 중")</code></pre>
<p>이 값들을 기반으로 막대 차트를 추가하면 프로젝트 현황을 한눈에 확인할 수 있는 대시보드가 됩니다.</p>
<h2>5단계: Apps Script로 알림 자동화 (선택)</h2>
<p>담당자에게 상태 변경 시 이메일 알림을 보내고 싶다면 <strong>확장 프로그램 → Apps Script</strong>에서 onEdit 트리거를 활용합니다. B열이 "검토 중"으로 변경될 때 해당 행의 담당자에게 Gmail 알림을 발송하는 스크립트를 작성할 수 있습니다.</p>
<h2>구글 시트 칸반보드의 한계</h2>
<p>이 방식은 활성 태스크 50~100개, 팀원 5~8명 규모까지 잘 동작합니다. 그 이상이 되면 다음 문제가 발생합니다.</p>
<ul>
  <li>카드 이동이 셀 수정으로만 가능 (드래그앤드롭 없음)</li>
  <li>카드별 댓글 스레드 없음</li>
  <li>동시 편집 시 충돌 가능성</li>
  <li>모바일에서 보드 형태로 보기 어려움</li>
</ul>
<p>드래그앤드롭과 카드별 소통이 필요해졌다면 전문 칸반 툴로 이전할 시점입니다. 구글 워크스페이스를 계속 활용하고 싶다면 <a href="https://www.taskgrid.my">TaskGrid</a>가 구글 시트 위에 시각적 칸반 보드를 제공하는 선택지입니다.</p>`,
  },

  // ── KO 4 ──────────────────────────────────────────────────────────────────
  {
    slug: 'ai-프로젝트-관리-툴-무료',
    title: 'AI 기능이 있는 무료 프로젝트 관리 툴 비교 2026',
    date: '2026-05-18',
    category: 'AI활용',
    lang: 'ko',
    usedKeyword: 'AI 프로젝트 관리 툴 무료',
    desc: 'AI 기능이 포함된 무료 프로젝트 관리 툴 2026년 비교. 태스크 자동 생성부터 보고서 자동화까지, 무료로 실제 사용 가능한 AI 기능을 정리합니다.',
    content: `<h2>프로젝트 관리 툴에서 AI가 실제로 하는 일</h2>
<p>2026년에는 거의 모든 프로젝트 관리 툴이 "AI 탑재"를 내세우고 있습니다. 하지만 실제로 제공되는 AI 기능은 대부분 아래 몇 가지 범주에 속합니다.</p>
<ul>
  <li><strong>태스크 자동 생성</strong>: 문서나 프롬프트를 입력하면 태스크 목록을 자동으로 만들어 줍니다.</li>
  <li><strong>현황 요약</strong>: 현재 진행 중인 프로젝트 상태를 자연어로 요약합니다.</li>
  <li><strong>스마트 스케줄링</strong>: 팀원 업무량을 분석해 적절한 마감일을 제안합니다.</li>
  <li><strong>리스크 감지</strong>: 지연될 가능성이 높은 태스크를 예측해 알려줍니다.</li>
  <li><strong>글쓰기 보조</strong>: 태스크 설명, 회의록, 프로젝트 브리핑 초안을 작성합니다.</li>
</ul>
<p>중요한 것은 "AI가 있느냐"가 아니라 "무료 플랜에서 어떤 AI 기능을 쓸 수 있느냐"입니다.</p>
<h2>무료 AI 프로젝트 관리 툴 비교</h2>
<h3>1. Taskade — 무료 AI 기능 제공</h3>
<p>Taskade는 2026년 기준으로 무료 플랜에서 AI 기능을 제공하는 가장 대표적인 툴입니다. 프롬프트를 입력해 태스크 목록을 자동 생성하거나, 프로젝트 현황을 AI로 요약하고, 태스크 내에서 AI 채팅을 사용할 수 있습니다. 무료 플랜에서는 월별 AI 요청 횟수 제한이 있지만, 기능을 실제로 경험해보기에는 충분합니다.</p>
<p><strong>무료 AI 판정: ✅ 가능 (월별 한도 있음)</strong></p>
<h3>2. ClickUp AI — 유료 애드온</h3>
<p>ClickUp은 AI 기능을 월 $5/인의 별도 애드온으로 제공합니다. 무료 플랜에서는 AI를 사용할 수 없습니다. 다만 ClickUp 자체의 무료 플랜은 매우 강력하며, AI 없이도 대부분의 팀에서 충분히 활용할 수 있습니다.</p>
<p><strong>무료 AI 판정: ❌ 불가</strong></p>
<h3>3. Notion AI — 별도 유료</h3>
<p>Notion AI는 무료 플랜 포함 모든 플랜에 $8/인/월의 추가 결제가 필요합니다. 제한적인 무료 체험 후 유료로 전환해야 합니다. Notion AI의 강점은 문서 글쓰기 보조로, 회의록 요약이나 프로젝트 브리핑 초안 작성에 특히 유용합니다.</p>
<p><strong>무료 AI 판정: ❌ 체험 후 유료 전환</strong></p>
<h3>4. Asana Intelligence — 고급 플랜 전용</h3>
<p>Asana의 AI 기능은 Advanced 이상 플랜에서만 사용 가능합니다. 무료 플랜에서는 AI 기능이 전혀 없습니다.</p>
<p><strong>무료 AI 판정: ❌ 불가</strong></p>
<h3>5. Linear — 기본 AI 기능 무료 포함</h3>
<p>Linear는 AI 툴로 마케팅하지 않지만, AI 보조 이슈 작성(짧은 설명을 상세한 이슈로 확장) 기능이 무료 플랜에 포함되어 있습니다. 소프트웨어 개발팀에게는 실용적인 기능입니다.</p>
<p><strong>무료 AI 판정: ✅ 기본 기능 포함</strong></p>
<h2>무료 AI 툴 없이 AI 워크플로우 만드는 법</h2>
<p>유료 AI 구독 없이도 AI를 프로젝트 관리에 활용할 수 있습니다.</p>
<ol>
  <li><strong>Claude.ai 또는 ChatGPT 무료 버전</strong>으로 프로젝트 브리핑 문서에서 태스크 분해하기</li>
  <li>생성된 태스크 목록을 Trello, Notion, ClickUp에 수동으로 붙여넣기</li>
  <li><strong>Otter.ai 무료 플랜</strong>으로 회의를 녹음·요약하고 액션아이템 추출하기</li>
  <li>추출된 액션아이템을 팀 보드에 복사해 담당자 지정</li>
</ol>
<h2>결론</h2>
<p>2026년 현재, 진정한 의미의 무료 AI 프로젝트 관리 기능을 제공하는 툴은 <strong>Taskade</strong>가 유일한 주류 선택지입니다. AI 글쓰기 보조에 조금 투자할 의사가 있다면 <strong>Notion AI</strong>가 문서 중심 팀에 가장 높은 품질을 제공합니다. 개발팀이라면 <strong>Linear</strong>의 무료 AI 이슈 작성 기능이 실용적입니다.</p>`,
  },

  // ── KO 5 ──────────────────────────────────────────────────────────────────
  {
    slug: '스타트업-무료-협업툴',
    title: '스타트업을 위한 무료 협업툴 추천 조합 2026',
    date: '2026-05-22',
    category: '협업팁',
    lang: 'ko',
    usedKeyword: '스타트업 무료 협업툴 추천',
    desc: '예산이 부족한 스타트업을 위한 무료 협업툴 추천. 커뮤니케이션, 문서, 프로젝트 관리, 화상회의를 커버하는 2026년 최적 툴 조합을 소개합니다.',
    content: `<h2>스타트업의 협업툴 선택 기준</h2>
<p>초기 스타트업이 협업툴을 선택할 때 가장 중요한 기준은 세 가지입니다. 첫째 비용(무료 또는 저비용), 둘째 팀원 학습 곡선(빠르게 적응 가능한가), 셋째 확장성(팀이 성장해도 계속 쓸 수 있는가)입니다.</p>
<p>초기에 너무 복잡한 툴을 도입하면 오히려 생산성이 떨어집니다. 반대로 너무 단순한 툴은 팀이 성장할 때 다시 교체해야 하는 번거로움이 생깁니다.</p>
<h2>업무 영역별 무료 툴 추천</h2>
<h3>커뮤니케이션: Slack 또는 Discord</h3>
<p><strong>Slack 무료 플랜</strong>은 90일치 메시지 히스토리, 10개 앱 연동, 1:1 화상통화를 지원합니다. 대부분의 SaaS 툴이 Slack 연동을 지원하기 때문에 생태계 통합에 유리합니다.</p>
<p><strong>Discord</strong>는 무료로 무제한 메시지 히스토리, 음성 채널, 화면 공유를 지원합니다. 초기 스타트업에서 비용을 절감하면서 Slack과 유사한 채널 기반 커뮤니케이션을 원한다면 Discord가 현실적인 대안입니다.</p>
<p><strong>선택 기준</strong>: 외부 파트너·투자자와 소통이 잦다면 Slack, 내부 팀 중심이라면 Discord</p>
<h3>문서 & 지식 관리: Notion 또는 Slab</h3>
<p><strong>Notion 무료 플랜</strong>은 팀 문서, 회의록, 온보딩 자료, 제품 로드맵을 한 공간에서 관리할 수 있게 합니다. 데이터베이스 기능으로 태스크 관리도 어느 정도 겸할 수 있어 초기에는 툴 수를 줄이기 좋습니다.</p>
<p><strong>Slab</strong>은 검색과 구조화에 더 특화되어 있어, 팀이 자주 참조하는 문서 관리에 더 적합합니다.</p>
<h3>프로젝트 & 태스크 관리: Trello 또는 Linear</h3>
<p><strong>Trello 무료 플랜</strong>은 무제한 카드·팀원, 10개 보드를 지원합니다. 칸반 방식의 업무 관리에 최적화되어 있으며, 비개발 직군도 빠르게 적응할 수 있습니다.</p>
<p><strong>Linear 무료 플랜</strong>은 250개 이슈까지 지원하며 스프린트, GitHub 연동, 사이클 분석을 제공합니다. 제품·개발 팀이 메인이라면 Linear가 더 맞는 선택입니다.</p>
<p><strong>두 팀이 공존한다면</strong>: 개발팀은 Linear, 비개발팀은 Trello로 분리해서 사용하는 구성도 실용적입니다.</p>
<h3>화상회의: Google Meet</h3>
<p>Google Meet는 구글 계정만 있으면 최대 100명, 60분 화상회의를 무료로 사용할 수 있습니다. 구글 캘린더와 자동 연동되어 회의 초대·관리가 간편합니다.</p>
<h3>파일 저장 & 공유: Google Drive</h3>
<p>구글 계정당 15GB 무료 저장공간을 제공합니다. 구글 Docs·Sheets·Slides를 통해 팀원과 실시간 공동 편집이 가능합니다. 스타트업 초기에는 이것으로 충분합니다.</p>
<h2>팀 규모별 추천 조합</h2>
<h3>창업 초기 (1-3인)</h3>
<ul>
  <li>커뮤니케이션: 카카오톡 또는 Slack 무료</li>
  <li>문서: Notion 무료</li>
  <li>태스크: Trello 또는 Notion DB</li>
  <li>파일: 구글 드라이브</li>
</ul>
<h3>초기 성장기 (4-10인)</h3>
<ul>
  <li>커뮤니케이션: Slack 무료 (또는 Discord)</li>
  <li>문서: Notion 무료 또는 Slab</li>
  <li>태스크: Trello (비개발) + Linear (개발)</li>
  <li>화상회의: Google Meet</li>
  <li>파일: 구글 드라이브</li>
</ul>
<h3>시드 투자 이후 (10-30인)</h3>
<p>팀이 이 규모에 도달하면 무료 플랜의 한계가 보이기 시작합니다. Slack 유료 전환(메시지 히스토리 무제한), Notion Plus 전환(게스트 확대, 버전 히스토리), 또는 프로젝트 관리 툴 유료 전환을 검토할 시점입니다.</p>
<h2>피해야 할 실수</h2>
<ul>
  <li><strong>툴 과잉</strong>: 5개 이상의 협업툴을 동시에 운영하면 어느 툴에서 무엇을 찾아야 하는지 혼란이 생깁니다. 초기에는 3-4개로 제한하세요.</li>
  <li><strong>팀원 의견 없이 도입</strong>: 아무리 좋은 툴도 팀원이 쓰지 않으면 무용지물입니다. 2-3가지 후보를 팀과 함께 1주일씩 써보고 결정하는 과정을 거치세요.</li>
  <li><strong>기능 많은 툴 = 좋은 툴 착각</strong>: 가장 좋은 협업툴은 팀이 매일 자연스럽게 열게 되는 툴입니다.</li>
</ul>`,
  },

]

export function getPostWithImage(post) {
  return { ...post, imageUrl: getBlogImage(post.category) }
}
