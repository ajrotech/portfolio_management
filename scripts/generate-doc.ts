import {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, SectionType, TableLayoutType,
} from 'docx';
import * as fs from 'fs';

// Dawn Mist Tech palette
const P = {
  bg: '#0A1628', titleColor: '#FFFFFF', subtitleColor: '#B0C4DE',
  metaColor: '#8FAEC5', accent: '#5B8DB8', footerColor: '#6B8AA8',
  primary: '#0A1628', body: '#1A2B40', secondary: '#6878A0',
  accentHex: '#5B8DB8', surface: '#F4F8FC',
};
const c = (hex: string) => hex.replace('#', '');
const NB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// Helper functions
function h1(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.primary), font: { ascii: 'Times New Roman' } })],
  });
}

function h2(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: c(P.primary), font: { ascii: 'Times New Roman' } })],
  });
}

function h3(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: c(P.body), font: { ascii: 'Times New Roman' } })],
  });
}

function body(text: string) {
  return new Paragraph({
    spacing: { line: 312, after: 100 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: 'Calibri' } })],
  });
}

function bodyBold(label: string, text: string) {
  return new Paragraph({
    spacing: { line: 312, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 24, color: c(P.body), font: { ascii: 'Calibri' } }),
      new TextRun({ text, size: 24, color: c(P.body), font: { ascii: 'Calibri' } }),
    ],
  });
}

function code(text: string) {
  return new Paragraph({
    spacing: { line: 276, after: 60 },
    indent: { left: 480 },
    children: [new TextRun({ text, size: 20, color: '2E7D32', font: { ascii: 'Courier New' } })],
  });
}

function empty() {
  return new Paragraph({ spacing: { after: 60 }, children: [] });
}

// Simple table builder
function simpleTable(headers: string[], rows: string[][]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
      children: [new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF', font: { ascii: 'Calibri' } })],
      })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: c(P.accent) },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.accent) },
        left: { style: BorderStyle.SINGLE, size: 1, color: c(P.accent) },
        right: { style: BorderStyle.SINGLE, size: 1, color: c(P.accent) },
      },
      margins: { top: 40, bottom: 40, left: 80, right: 80 },
    })),
  });

  const dataRows = rows.map((row, i) => new TableRow({
    children: row.map(cell => new TableCell({
      shading: i % 2 === 0 ? { type: ShadingType.CLEAR, fill: c(P.surface) } : undefined,
      children: [new Paragraph({
        spacing: { before: 30, after: 30 },
        children: [new TextRun({ text: cell, size: 20, color: c(P.body), font: { ascii: 'Calibri' } })],
      })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'E0E0E0' },
      },
      margins: { top: 30, bottom: 30, left: 80, right: 80 },
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [headerRow, ...dataRows],
  });
}

// ========= COVER (R1 Pure Paragraph Left) =========
function buildCoverR1(config: { title: string; subtitle: string; englishLabel: string; metaLines: string[]; footerLeft: string; footerRight: string; palette: typeof P }) {
  const p = config.palette;
  const padL = 1200, padR = 800;
  const titlePt = 36;
  const titleSize = titlePt * 2;
  const children: any[] = [];

  children.push(new Paragraph({ spacing: { before: 4200 } }));

  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: c(p.accent), space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split('').join('  '),
        size: 18, color: c(p.accent), font: { ascii: 'Calibri' }, characterSpacing: 40 })],
    }));
  }

  children.push(new Paragraph({
    indent: { left: padL },
    spacing: { after: 300, line: Math.ceil(titlePt * 23), lineRule: 'atLeast' as any },
    children: [new TextRun({ text: config.title, size: titleSize, bold: true,
      color: c(p.titleColor), font: { ascii: 'Arial' } })],
  }));

  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: c(p.subtitleColor),
        font: { ascii: 'Arial' } })],
    }));
  }

  for (const line of config.metaLines) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: { style: BorderStyle.SINGLE, size: 8, color: c(p.accent), space: 12 } },
      children: [new TextRun({ text: line, size: 24, color: c(p.metaColor), font: { ascii: 'Arial' } })],
    }));
  }

  children.push(new Paragraph({ spacing: { before: 3000 } }));

  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: c(p.accent), space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || '', size: 16, color: c(p.footerColor), font: { ascii: 'Arial' } }),
      new TextRun({ text: '                                                          ' }),
      new TextRun({ text: config.footerRight || '', size: 16, color: c(p.footerColor), font: { ascii: 'Arial' } }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: 'exact' as any },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: c(p.bg) }, borders: noBorders,
        children,
      })],
    })],
  })];
}

// ========= BUILD DOCUMENT =========
const coverConfig = {
  title: 'Portfolio Management System',
  subtitle: 'Technical Manual & API Documentation',
  englishLabel: 'FULL STACK DEVELOPMENT INTERNSHIP  |  WEEK 03',
  metaLines: [
    'Built with Next.js 16, TypeScript, Prisma ORM, shadcn/ui',
    'Multi-Tenant Architecture with RESTful API Engineering',
    'Dynamic Routing, Reusable Components, Drag-to-Reorder',
  ]
};

const coverChildren = buildCoverR1({
  ...coverConfig,
  footerLeft: 'Portfolio Management System',
  footerRight: 'Version 1.0  |  July 2026',
  palette: P,
});

// Body content
const bodyContent: any[] = [
  // ---- Section 1: System Architecture ----
  h1('1. System Architecture'),
  h2('1.1 Overview'),
  body('The Portfolio Management System is a full-stack web application built on the Next.js 16 App Router with server-side API routes and a React-based client layer. It follows a multi-tenant architecture where each registered user receives a unique, publicly accessible portfolio page identified by their username. The system cleanly separates concerns between data persistence, API logic, and presentation, enabling independent scaling and testing of each tier. The entire application is type-safe using TypeScript throughout both frontend and backend code, with Prisma providing end-to-end type safety between the database schema and application code.'),
  body('The architecture is designed around three core principles: modular reusability of UI components, a clean RESTful API layer that enforces ownership-based access control, and a single-page client-side routing system that switches between the Creator Dashboard and Public Profile views without full page reloads. This design ensures a responsive, app-like user experience while maintaining clear data flow boundaries between the frontend state management (Zustand) and the backend data persistence layer (Prisma + SQLite).'),

  h2('1.2 Technology Stack'),
  simpleTable(
    ['Layer', 'Technology', 'Purpose'],
    [
      ['Framework', 'Next.js 16 (App Router)', 'Full-stack React framework with server-side API routes'],
      ['Language', 'TypeScript 5', 'End-to-end type safety across client and server'],
      ['Database', 'SQLite via Prisma ORM', 'Lightweight, file-based relational database'],
      ['Styling', 'Tailwind CSS 4 + shadcn/ui', 'Utility-first CSS with accessible component library'],
      ['State Management', 'Zustand', 'Lightweight client-side state for navigation and auth'],
      ['Drag & Drop', '@dnd-kit/core + sortable', 'Accessible drag-to-reorder for project management'],
      ['Icons', 'Lucide React', 'Consistent, tree-shakeable icon set'],
      ['Animations', 'Framer Motion', 'Smooth page transitions and micro-interactions'],
      ['Password Hashing', 'Node.js crypto (SHA-256)', 'Demo-grade password hashing with salt'],
    ]
  ),
  empty(),

  h2('1.3 Data Architecture'),
  body('The data model follows a multi-tenant structure with three primary entities: User, Profile, and Project. Each User has exactly one Profile (one-to-one relationship), and each Profile can have multiple Projects (one-to-many relationship). This design ensures that all portfolio data is cleanly scoped to individual users, enabling efficient queries and ownership-based access control throughout the API layer. JSON serialization is used for array-type fields (skills, techTags, mediaUrls) to maintain compatibility with SQLite\'s scalar type constraints while still supporting flexible, variable-length collections.'),

  h3('1.3.1 Entity Relationship Diagram'),
  simpleTable(
    ['Model', 'Key Fields', 'Relationship'],
    [
      ['User', 'id, email, username, password, name', '1:1 with Profile'],
      ['Profile', 'id, userId, bio, avatarUrl, title, location, skills', 'Belongs to User, 1:N with Project'],
      ['Project', 'id, profileId, title, description, techTags, order', 'Belongs to Profile'],
    ]
  ),
  empty(),

  h3('1.3.2 Schema Design Decisions'),
  body('The schema separates authentication concerns (User model) from portfolio presentation concerns (Profile and Project models). This separation allows the Profile to be updated independently without affecting authentication, and Projects to be queried and reordered without loading user credentials. The Profile acts as an intermediary between User and Project, providing a natural scoping boundary: when a user is deleted, all associated profiles and projects are cascade-deleted, maintaining referential integrity without orphaned records.'),
  body('Array fields such as skills, techTags, and mediaUrls are stored as JSON strings rather than in separate junction tables. This pragmatic decision simplifies queries and reduces join complexity for a system where these arrays are always read and written as complete units. The trade-off is acceptable because individual tag queries are not required; tags are always displayed as part of the parent entity. The order field on the Project model supports drag-to-reorder functionality by storing an integer position value that can be updated in bulk via a transactional API endpoint.'),

  h2('1.4 Component Architecture'),
  body('The frontend is organized into reusable, composable components that serve distinct roles within the application. The component hierarchy follows a clear separation between layout shells, data-displaying components, and interactive form components. Each component is designed for reuse across both the Creator Dashboard and the Public Profile views, with behavior differences controlled via props rather than code duplication.'),
  simpleTable(
    ['Component', 'File', 'Purpose', 'Reusable'],
    [
      ['ProjectCard', 'components/portfolio/ProjectCard.tsx', 'Displays project info with tech tags, links, and actions', 'Yes'],
      ['SkillTag / SkillTagList', 'components/portfolio/SkillTag.tsx', 'Renders skill badges with optional truncation', 'Yes'],
      ['ProfileHeader', 'components/portfolio/ProfileHeader.tsx', 'Avatar, name, title, bio, social links, skills', 'Yes'],
      ['LandingView', 'components/portfolio/LandingView.tsx', 'Public-facing landing page with search and CTA', 'No'],
      ['CreatorDashboard', 'components/portfolio/DashboardViews.tsx', 'Authenticated dashboard with tabs and CRUD', 'No'],
      ['PublicProfileView', 'components/portfolio/PublicProfileView.tsx', 'Public portfolio reader with featured/regular split', 'No'],
      ['LoginForm / RegisterForm', 'components/portfolio/AuthForms.tsx', 'Authentication forms with validation', 'No'],
      ['ProjectForm', 'components/portfolio/DashboardViews.tsx', 'Add/Edit project with all fields', 'No'],
      ['SortableProjectItem', 'components/portfolio/DashboardViews.tsx', 'Draggable wrapper for ProjectCard in dashboard', 'No'],
    ]
  ),
  empty(),

  // ---- Section 2: API Documentation ----
  h1('2. RESTful API Specification'),
  h2('2.1 Authentication'),
  body('Authentication is handled via header-based user identification. After login, the client stores the user ID in Zustand state and includes it in the x-user-id header on all authenticated API requests. This is a simplified authentication mechanism suitable for the educational context of this project. In a production environment, this would be replaced with JWT tokens, HTTP-only session cookies, or a full NextAuth.js integration with configurable providers.'),
  body('All API endpoints that modify data (PUT, POST, DELETE) require the x-user-id header. If this header is missing or invalid, the endpoint returns a 401 Unauthorized response. Ownership verification is performed by looking up the user\'s profile and confirming that the requested resource belongs to that profile, preventing cross-tenant data access.'),

  h3('2.1.1 POST /api/auth/register'),
  bodyBold('Description: ', 'Creates a new user account and automatically initializes an empty Profile.'),
  simpleTable(
    ['Field', 'Type', 'Required', 'Validation'],
    [
      ['email', 'string', 'Yes', 'Valid email format, unique'],
      ['username', 'string', 'Yes', '3-30 chars, alphanumeric + underscore, unique'],
      ['name', 'string', 'No', 'Display name for the profile'],
      ['password', 'string', 'Yes', 'Minimum 6 characters'],
    ]
  ),
  empty(),
  bodyBold('Success (201): ', '{ "message": "Account created successfully", "user": { "id", "email", "username", "name" } }'),
  bodyBold('Error (409): ', '{ "error": "Username is already taken" } or { "error": "Email is already registered" }'),

  h3('2.1.2 POST /api/auth/login'),
  bodyBold('Description: ', 'Authenticates a user by email and password, returning the user object without the password hash.'),
  simpleTable(
    ['Field', 'Type', 'Required'],
    [
      ['email', 'string', 'Yes'],
      ['password', 'string', 'Yes'],
    ]
  ),
  empty(),
  bodyBold('Success (200): ', '{ "user": { "id", "email", "username", "name" } }'),
  bodyBold('Error (401): ', '{ "error": "Invalid email or password" }'),

  h2('2.2 Portfolio Endpoints'),

  h3('2.2.1 GET /api/portfolio/:username'),
  bodyBold('Description: ', 'Fetches the complete public-facing portfolio data for a given username. This is the primary endpoint used by the Public Profile View. It returns the user\'s profile information and all projects ordered by their position. The email field is intentionally excluded from the response for privacy.'),
  bodyBold('Auth: ', 'None required (public endpoint).'),
  bodyBold('URL Parameter: ', 'username - The unique handle of the portfolio owner.'),
  bodyBold('Success (200): ', 'Returns a user object with nested profile (including parsed skills array) and projects array (including parsed techTags and mediaUrls arrays), all sorted by project order ascending.'),
  bodyBold('Error (404): ', '{ "error": "Portfolio not found" } - Returned when no user exists with the given username.'),

  h3('2.2.2 PUT /api/portfolio/profile'),
  bodyBold('Description: ', 'Updates the authenticated user\'s profile information. If no profile exists yet, one is automatically created (upsert behavior). The skills field accepts either a JSON array or a comma-separated string, providing flexibility in how clients submit data.'),
  bodyBold('Auth: ', 'Required (x-user-id header).'),
  simpleTable(
    ['Field', 'Type', 'Description'],
    [
      ['bio', 'string', 'Profile biography / about text'],
      ['avatarUrl', 'string', 'URL to profile picture'],
      ['title', 'string', 'Job title or role'],
      ['location', 'string', 'Geographic location'],
      ['website', 'string', 'Personal website URL'],
      ['github', 'string', 'GitHub profile URL'],
      ['linkedin', 'string', 'LinkedIn profile URL'],
      ['twitter', 'string', 'Twitter/X profile URL'],
      ['skills', 'string | string[]', 'Skills as comma-separated string or JSON array'],
    ]
  ),
  empty(),
  bodyBold('Success (200): ', 'Returns the updated profile object with skills parsed as an array.'),

  h3('2.2.3 POST /api/portfolio/projects'),
  bodyBold('Description: ', 'Creates a new project item and appends it to the authenticated user\'s portfolio. The project is automatically assigned the next available order position. If the user does not have a profile yet, one is created automatically. The techTags and mediaUrls fields accept comma-separated strings which are stored as JSON arrays in the database.'),
  bodyBold('Auth: ', 'Required (x-user-id header).'),
  simpleTable(
    ['Field', 'Type', 'Required', 'Description'],
    [
      ['title', 'string', 'Yes', 'Project title'],
      ['description', 'string', 'No', 'Project description'],
      ['link', 'string', 'No', 'Live demo URL'],
      ['repoUrl', 'string', 'No', 'Source code repository URL'],
      ['techTags', 'string', 'No', 'Comma-separated technology tags'],
      ['mediaUrls', 'string', 'No', 'Comma-separated media/screenshot URLs'],
      ['featured', 'boolean', 'No', 'Whether to mark as a featured project (default: false)'],
    ]
  ),
  empty(),
  bodyBold('Success (201): ', 'Returns the created project with parsed techTags and mediaUrls arrays.'),

  h3('2.2.4 PUT /api/portfolio/projects/:id'),
  bodyBold('Description: ', 'Updates an existing project. Only the owner of the project (verified through the profile relationship) can update it. All fields are optional; only provided fields will be updated (partial update behavior).'),
  bodyBold('Auth: ', 'Required (x-user-id header). Ownership verified.'),
  bodyBold('Success (200): ', 'Returns the updated project.'),
  bodyBold('Error (404): ', 'Project not found or does not belong to the authenticated user.'),

  h3('2.2.5 DELETE /api/portfolio/projects/:id'),
  bodyBold('Description: ', 'Permanently deletes a project. Ownership is verified before deletion to prevent cross-tenant data manipulation. After deletion, the remaining projects retain their existing order values; a separate reorder call can be made if sequential ordering is desired.'),
  bodyBold('Auth: ', 'Required (x-user-id header). Ownership verified.'),
  bodyBold('Success (200): ', '{ "message": "Project deleted" }'),

  h3('2.2.6 PUT /api/portfolio/projects/reorder'),
  bodyBold('Description: ', 'Reorders projects by updating the order field on multiple projects in a single database transaction. The client sends an array of objects, each containing a project ID and its new order position. The transaction ensures atomicity: either all projects are reordered successfully, or none are changed, preventing inconsistent ordering states.'),
  bodyBold('Auth: ', 'Required (x-user-id header).'),
  bodyBold('Request Body: ', '{ "projectIds": [{ "id": "...", "order": 0 }, { "id": "...", "order": 1 }, ...] }'),
  bodyBold('Success (200): ', '{ "message": "Projects reordered successfully" }'),

  // ---- Section 3: Views and Navigation ----
  h1('3. User Interface Architecture'),
  h2('3.1 Client-Side Routing'),
  body('The application uses a single-page architecture with client-side view switching managed by Zustand state. The main page.tsx acts as a router that renders different view components based on the current viewMode state value. This approach was chosen because the deployment environment only exposes a single route (/), making traditional Next.js file-based routing impractical. The Zustand store tracks the current view mode (landing, login, register, dashboard, public-profile) along with authentication state and portfolio data, providing a centralized, predictable state container.'),
  simpleTable(
    ['View Mode', 'Component', 'Auth Required', 'Description'],
    [
      ['landing', 'LandingView', 'No', 'Public landing page with search and feature cards'],
      ['login', 'LoginForm', 'No', 'Email/password authentication form'],
      ['register', 'RegisterForm', 'No', 'Account creation form with validation'],
      ['dashboard', 'CreatorDashboard', 'Yes', 'Authenticated dashboard with projects and profile tabs'],
      ['public-profile', 'PublicProfileView', 'No', 'Read-only portfolio display for any username'],
    ]
  ),
  empty(),

  h2('3.2 Creator Dashboard'),
  body('The Creator Dashboard is the primary management interface for authenticated users. It features a tabbed layout with two main sections: Projects and Profile Settings. The Projects tab provides a full CRUD interface with drag-to-reorder capability powered by @dnd-kit. Each project can be added, edited, or deleted through inline forms that appear within the project list context. The Profile Settings tab offers a comprehensive form for editing all profile fields including bio, avatar URL, social links, and skills.'),
  body('The drag-to-reorder implementation uses @dnd-kit\'s SortableContext with vertical list sorting strategy. When a user drags a project to a new position, the onDragEnd handler computes the new order using arrayMove, updates the local state optimistically for immediate visual feedback, and then sends a bulk reorder request to the API. If the API call fails, the local state is reverted to the previous order, providing a robust optimistic update pattern with automatic rollback on failure.'),

  h2('3.3 Public Profile View'),
  body('The Public Profile View is a lightweight, read-only page that displays a user\'s portfolio in an optimized, shareable format. It fetches data from the GET /api/portfolio/:username endpoint and renders the profile header, featured projects, and regular projects in a responsive grid layout. The view includes a loading skeleton state for perceived performance and clear error handling for non-existent portfolios. If the viewer is the portfolio owner (determined by comparing the authenticated user\'s username with the profile\'s username), an "Edit Dashboard" button is shown for quick access back to the management interface.'),
  body('The responsive design uses Tailwind CSS breakpoints to adapt from a single-column layout on mobile devices to a two-column grid on medium and larger screens. Featured projects are displayed in a separate section at the top with a distinct visual treatment (ring highlight and star badge), while regular projects appear below in the same grid format. This separation helps visitors quickly identify the portfolio owner\'s most significant work.'),

  // ---- Section 4: Setup Guide ----
  h1('4. Local Development Setup'),
  h2('4.1 Prerequisites'),
  body('Before setting up the project locally, ensure you have the following tools installed on your development machine. The project is designed to run with minimal dependencies and can be set up in under five minutes.'),
  simpleTable(
    ['Tool', 'Minimum Version', 'Installation'],
    [
      ['Node.js', 'v18.x or later', 'https://nodejs.org'],
      ['Bun', 'v1.0 or later', 'curl -fsSL https://bun.sh/install | bash'],
      ['Git', 'v2.x', 'https://git-scm.com'],
    ]
  ),
  empty(),

  h2('4.2 Installation Steps'),
  bodyBold('Step 1: ', 'Clone the repository and navigate into the project directory.'),
  code('git clone <repository-url> && cd portfolio-management-system'),
  empty(),
  bodyBold('Step 2: ', 'Install all dependencies using the Bun package manager.'),
  code('bun install'),
  empty(),
  bodyBold('Step 3: ', 'Set up the database by pushing the Prisma schema to SQLite.'),
  code('bun run db:push'),
  empty(),
  bodyBold('Step 4: ', '(Optional) Seed the database with sample demo data.'),
  code('bun run scripts/seed.ts'),
  empty(),
  bodyBold('Step 5: ', 'Start the development server.'),
  code('bun run dev'),
  empty(),
  body('The application will be available at http://localhost:3000. The development server supports hot module replacement (HMR), so any changes to source files will be reflected immediately in the browser without a manual refresh.'),

  h2('4.3 Environment Configuration'),
  body('The project uses a single environment variable for database configuration, which is pre-configured in the .env file. No additional environment setup is required for local development. The DATABASE_URL points to a local SQLite file stored in the db/ directory relative to the project root.'),
  code('DATABASE_URL="file:./db/custom.db"'),
  empty(),

  h2('4.4 Demo Accounts'),
  body('If you ran the seed script, two demo accounts are available for testing. These accounts come pre-populated with realistic profile data and multiple projects with tech tags, descriptions, and links.'),
  simpleTable(
    ['Username', 'Email', 'Password', 'Projects'],
    [
      ['johndoe', 'john@example.com', 'password123', '5 projects (2 featured)'],
      ['janedev', 'jane@example.com', 'password123', '2 projects (1 featured)'],
    ]
  ),
  empty(),

  // ---- Section 5: Design Patterns ----
  h1('5. Design Patterns and Conventions'),
  h2('5.1 Component Reusability'),
  body('The ProjectCard component demonstrates the reusability pattern used throughout the application. It accepts a Project data object and optional callback props (onEdit, onDelete) along with a showActions boolean flag. In the Public Profile View, it is rendered without actions for a clean, read-only display. In the Creator Dashboard, the same component is wrapped in a SortableProjectItem that adds drag handles and enables the edit/delete actions. This prop-driven behavior variation eliminates code duplication while maintaining a consistent visual appearance across views.'),
  body('The SkillTag and SkillTagList components follow a similar pattern. SkillTag renders a single technology badge with configurable variant styling, while SkillTagList maps over an array of skill strings and optionally truncates the display with a "+N more" count. These components are used in both the ProfileHeader (public view) and the profile edit form (dashboard), maintaining visual consistency across the entire application.'),

  h2('5.2 API Design Patterns'),
  body('The API layer follows RESTful conventions with resource-oriented URLs and standard HTTP methods. Each endpoint handles a single responsibility: authentication (auth/*), public data retrieval (portfolio/:username), and authenticated resource management (portfolio/profile, portfolio/projects). The ownership verification pattern is consistent across all authenticated endpoints: extract x-user-id header, look up the user\'s profile, verify that the target resource belongs to that profile, then proceed with the operation or return a 404 response. This pattern prevents unauthorized cross-tenant access without requiring complex role-based authorization.'),
  body('The reorder endpoint demonstrates the bulk transaction pattern. Instead of making individual PUT requests for each position change (which would be slow and prone to partial failure), the client sends a single request with all project positions. The server wraps all updates in a Prisma $transaction, ensuring atomicity. This pattern is essential for drag-to-reorder functionality where multiple items change position simultaneously.'),

  h2('5.3 State Management'),
  body('Zustand was chosen for client state management due to its minimal boilerplate and excellent TypeScript integration. The store maintains five categories of state: navigation (viewMode, publicUsername), authentication (user), portfolio display data (portfolioData), dashboard data (projects), and UI state (isLoading). Actions are defined directly in the store definition, providing a single source of truth for all state mutations. The store is accessed via the useStore hook, which uses Zustand\'s built-in subscription mechanism to re-render only the components that depend on changed state slices.'),
];

// Build document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: 'Calibri' }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
    },
    heading1: {
      run: { font: { ascii: 'Times New Roman' }, size: 32, bold: true, color: c(P.primary) },
    },
    heading2: {
      run: { font: { ascii: 'Times New Roman' }, size: 28, bold: true, color: c(P.primary) },
    },
    heading3: {
      run: { font: { ascii: 'Times New Roman' }, size: 26, bold: true, color: c(P.body) },
    },
  },
  sections: [
    // Cover section
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: coverChildren,
    },
    // Body section
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary), font: { ascii: 'Calibri' } })],
          })],
        }),
      },
      children: bodyContent,
    },
  ],
});

// Generate file
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('/home/z/my-project/download/Portfolio_Management_System_Documentation.docx', buffer);
  console.log('Documentation generated successfully!');
});
