<div align="center">

# 🎙️ StudioSpace

### Discover Studios. Book Sessions. Create Something Amazing.

A studio discovery and booking web application built with Next.js, TypeScript, and Tailwind CSS.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [Getting Started](#-getting-started) · [Routes](#-application-routes) · [Checklist](#-testing-checklist)

</div>

---

## 📖 About StudioSpace

**StudioSpace** helps users explore studio spaces and manage their studio-related activities through a modern web interface.

The project includes authentication pages, studio browsing and detail pages, studio creation and editing forms, booking management, user listings, shared navigation/footer components, and theme-provider setup.

> **Note:** This README is based on the project structure shown in the provided screenshots. Backend services, database technology, deployment URLs, and exact environment-variable names were not visible, so they are not assumed here.

## ✨ Features

<details open>
<summary><strong>🏠 Home page</strong></summary>

- Home page entry point.
- Hero slider component.
- Featured studios section.
- Studio categories section.
- Home page composition through reusable components.

</details>

<details>
<summary><strong>🔐 Authentication</strong></summary>

- Login page.
- Registration page.
- Better Auth integration files.
- API route handler for authentication.
- Separate client-side and server-side authentication utilities.
- Token helper utilities.

</details>

<details>
<summary><strong>🏢 Studio management</strong></summary>

- Browse studio details using a dynamic studio ID route.
- Add a studio through a dedicated form page.
- Edit an existing studio through a dynamic edit route.
- View your own studio listings.
- Reusable studio details and update form components.

</details>

<details>
<summary><strong>📅 Booking management</strong></summary>

- My Bookings page.
- Dedicated page for managing the user's bookings.
- UI can be extended to support booking status, cancellation, and booking history according to the implemented API.

</details>

<details>
<summary><strong>🎨 UI and theming</strong></summary>

- Shared Navbar and Footer.
- Theme provider component.
- Global CSS configuration.
- Reusable UI components.
- Custom not-found page.
- Responsive layouts and light/dark theme styling where implemented.

</details>

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Component-based user interface |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| Better Auth | Authentication integration, based on project files |
| Lucide React | Icons, where used |
| Framer Motion | Animations, where used |
| shadcn/ui | Reusable UI components, where used |

**Important:** The screenshots confirm the Next.js `src/app` structure and authentication-related files. Verify `package.json` to confirm the exact installed versions and any additional libraries before publishing.

## 🗂️ Project Structure

The following tree is transcribed from the provided screenshots. The `...` entries indicate files or folders not shown in the screenshots.

```text
project-root/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── add-studio/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts
│   │   ├── my-bookings/
│   │   │   └── page.tsx
│   │   ├── my-listings/
│   │   │   └── page.tsx
│   │   ├── studios/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── extra-home.tsx
│   │   │   ├── featured-studios.tsx
│   │   │   ├── hero-slider.tsx
│   │   │   └── studio-categories.tsx
│   │   ├── providers/
│   │   │   └── theme-provider.tsx
│   │   ├── shared/
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── StudioDetails.tsx
│   │   │   └── UpdateStudioForm.tsx
│   │   └── ui/
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── auth-client.ts
│   │   ├── auth.ts
│   │   ├── getTokenFromClient.ts
│   │   ├── getTokenFromServer.ts
│   │   └── utils.ts
│   │
│   └── proxy.ts
│
├── .env
├── package.json
└── README.md
```

## 🧭 Application Routes

These routes are based on the visible App Router folders. Dynamic routes use an ID parameter.

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/login` | Login page, inside the `(auth)` route group |
| `/register` | Registration page, inside the `(auth)` route group |
| `/add-studio` | Add a new studio |
| `/my-bookings` | View and manage bookings |
| `/my-listings` | Manage your studio listings |
| `/studios/[id]` | View studio details |
| `/studios/edit/[id]` | Edit a studio |
| `/api/auth/[...all]` | Authentication API route handler |

> In Next.js, route groups such as `(auth)` organize routes but do not become part of the URL. Confirm that any protected route behavior matches the implementation in `proxy.ts` and your authentication setup.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js version supported by your Next.js project.
- npm, pnpm, or yarn.
- Any external services required by your authentication or API configuration.

### 2. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 3. Install dependencies

```bash
npm install
```

Use the package manager that matches your lockfile if the project uses pnpm or yarn.

### 4. Set environment variables

Create a local `.env` file if required by the application. Check `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/getTokenFromServer.ts`, and your API configuration for the **actual required variable names**.

Example template only:

```env
# Add the exact variables required by your project.
# Do not copy placeholder values into production.
```

**Security reminder:** Never publish real secrets, API keys, database credentials, or authentication secrets. Make sure local `.env` files are excluded from Git.

### 5. Run the development server

Check the `scripts` section in `package.json`. For a typical Next.js application, the command is:

```bash
npm run dev
```

Open the local URL printed in the terminal, commonly `http://localhost:3000`.

### 6. Create a production build

```bash
npm run build
npm run start
```

Run these commands only if the corresponding scripts exist in your `package.json`.

## 🧩 Important Source Files

<details>
<summary><strong>Authentication files</strong></summary>

- `src/app/(auth)/login/page.tsx` — login page.
- `src/app/(auth)/register/page.tsx` — registration page.
- `src/app/api/auth/[...all]/route.ts` — authentication API route.
- `src/lib/auth.ts` — server-side authentication setup.
- `src/lib/auth-client.ts` — client-side authentication setup.
- `src/lib/getTokenFromClient.ts` — client token helper.
- `src/lib/getTokenFromServer.ts` — server token helper.
- `src/proxy.ts` — proxy-related application logic; inspect the implementation to document its exact purpose.

</details>

<details>
<summary><strong>Shared components</strong></summary>

- `src/components/shared/Navbar.tsx` — shared navigation.
- `src/components/shared/Footer.tsx` — shared footer.
- `src/components/shared/StudioDetails.tsx` — studio details UI.
- `src/components/shared/UpdateStudioForm.tsx` — studio update form.
- `src/components/providers/theme-provider.tsx` — theme provider.

</details>

<details>
<summary><strong>Home components</strong></summary>

- `src/components/home/extra-home.tsx`
- `src/components/home/featured-studios.tsx`
- `src/components/home/hero-slider.tsx`
- `src/components/home/studio-categories.tsx`

These components help organize the home page into smaller, reusable pieces.

</details>

## 🧪 Testing Checklist

Mark each item after testing it in your local or deployed application.

- [ ] Home page loads correctly.
- [ ] Hero slider behaves correctly.
- [ ] Featured studios and studio categories render correctly.
- [ ] Login flow works.
- [ ] Registration flow works.
- [ ] Authentication session persists as intended.
- [ ] Studio details page works for a valid ID.
- [ ] Add studio form validates and submits correctly.
- [ ] My listings displays the current user's listings.
- [ ] Edit studio form loads and saves the selected studio.
- [ ] My bookings displays the current user's bookings.
- [ ] Protected actions reject unauthorized requests.
- [ ] Light and dark themes work on all relevant pages.
- [ ] Navbar and footer links work.
- [ ] Unknown URLs show the custom 404 page.
- [ ] `npm run build` completes successfully.

## 🛣️ Roadmap

- [ ] Complete end-to-end testing for studio management.
- [ ] Verify booking creation, status changes, and cancellation flows.
- [ ] Document real API endpoints and request/response formats.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Add screenshots or a short demo GIF.
- [ ] Add the live deployment and repository links.

## 🔗 Project Links

- **Live Demo:** Add your deployment URL.
- **GitHub Repository:** Add your repository URL.
- **Issues / Feedback:** [Report a Bug or Suggest a Feature](https://github.com/Naimur131251/https://github.com/Naimur131251/StudioSpace-Client/issues)

## 👤 About the Author

<div align="center">

### **Md Naimur Rahman**

*Frontend Developer | Building modern web experiences*

<p>
  <a href="https://github.com/Naimur131251">
    <img src="https://img.shields.io/badge/GitHub-Naimur131251-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
  <a href="https://naimur-portfolio-1234.netlify.app/">
    <img src="https://img.shields.io/badge/Portfolio-Visit%20Website-6366F1?style=for-the-badge&logo=netlify&logoColor=white" alt="Portfolio Website" />
  </a>
</p>

**Passionate about creating responsive, interactive, and user-friendly web applications.**

</div>

---

<p align="center">
  ⭐ If you like StudioSpace, consider giving the repository a star!
</p>


---

<div align="center">

**StudioSpace — Discover. Book. Create.** 🎙️

</div>
