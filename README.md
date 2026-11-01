# 📚 NovelNest
### A World Between Pages ✨

<p align="center">
  <b>Discover Books. Share Stories. Explore Knowledge.</b>
  <br />
  Your personal digital library for discovering, collecting, and borrowing books.
</p>

<p align="center">
  <a href="https://github.com/nayanhalder730/novelnest-client">
    <img src="https://img.shields.io/badge/Frontend-GitHub-181717?style=for-the-badge&logo=github" alt="Frontend Repository" />
  </a>
  <a href="https://github.com/nayanhalder730/novelnest-server">
    <img src="https://img.shields.io/badge/Backend-GitHub-181717?style=for-the-badge&logo=github" alt="Backend Repository" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Blue-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 🌐 Live Preview

<p align="center">
  <a href="https://your-live-website-url.vercel.app">
    <img src="https://img.shields.io/badge/🚀_VISIT_LIVE_WEBSITE-087F75?style=for-the-badge" alt="Live Website" />
  </a>
</p>

**Live Website:** [NovelNest](https://your-live-website-url.vercel.app)

**Frontend Repository:** [novelnest-client](https://github.com/nayanhalder730/novelnest-client)

**Backend Repository:** [novelnest-server](https://github.com/nayanhalder730/novelnest-server)

---

## 📖 About NovelNest

**NovelNest** is a modern online library platform designed to make book discovery and borrowing easier.

It provides a convenient space where readers can explore different books, contribute their own collections, borrow books for a specific period, and manage their borrowed books.

Whether you love fiction, science, history, or discovering something new, NovelNest brings your reading experience into one place.

> A world between pages, where every book tells a story.

---

## ✨ Key Features

### 📚 Book Discovery
- Explore a collection of books from different categories.
- Browse books with a clean and responsive card layout.
- View detailed information about individual books.
- Discover the latest additions through the New Arrivals section.

### 🔐 Authentication
- User registration with name, email, and password.
- Secure login using Better Auth.
- Google social authentication.
- Session-based user authentication.
- Protected routes for authenticated users.

### ➕ Book Management
- Add new books to the library.
- Upload book cover images.
- Select book categories.
- Set the total number of available copies.
- Edit previously added books.
- Delete books from your personal collection.

### 🔄 Borrow Management
- Borrow books from the library.
- Track borrowed books.
- View borrowing and return dates.
- Return borrowed books.
- Manage book availability through copy tracking.

### 🎨 User Experience
- Modern and responsive user interface.
- Dark and light theme support.
- Interactive home page slider.
- Loading states for asynchronous operations.
- Toast notifications for success and error messages.
- Reusable and organized components.
- Responsive design for mobile, tablet, and desktop.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Description |
|---|---|
| Next.js | React framework with App Router |
| React | Component-based UI |
| TypeScript | Type-safe development |
| Tailwind CSS | Modern styling |
| shadcn/ui | Reusable UI components |
| Lucide React | Icon library |
| Swiper.js | Interactive slider |

### Authentication

| Technology | Description |
|---|---|
| Better Auth | Authentication solution |
| MongoDB Adapter | Authentication database integration |
| Google OAuth | Social authentication |

### Backend

| Technology | Description |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend REST API |
| MongoDB | NoSQL database |

### Development & Deployment

- Git & GitHub
- Vercel
- Render
- npm

---

## 🗂️ Project Structure

```text
novelnest-client/
│
├── public/
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   │
│   │   ├── add-book/
│   │   │   └── page.tsx
│   │   │
│   │   ├── all-books/
│   │   │   ├── [slug]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/
│   │   │
│   │   ├── my-borrows/
│   │   │   └── page.tsx
│   │   │
│   │   ├── my-collection/
│   │   ├── profile/
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── components/
│       │
│       ├── books/
│       │   ├── BorrowButton.tsx
│       │   │
│       │   └── homePage/
│       │       ├── allBooks.tsx
│       │       ├── BookAction.tsx
│       │       ├── BookCard.tsx
│       │       ├── HeroBanner.tsx
│       │       └── MyBorrowCard.tsx
│       │
│       └── shared/
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run NovelNest on your local machine.

### Prerequisites

Make sure you have installed:

- Node.js 20 or later
- npm
- MongoDB database
- Google OAuth credentials (for Google authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/nayanhalder730/novelnest-client.git
```

### 2. Navigate to the Project

```bash
cd novelnest-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
# Backend API
NEXT_PUBLIC_SERVER_SITE_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Important:** Use the exact environment variable names configured in your application. Never share your secret keys or upload `.env.local` to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

http://localhost:3000

---

## ⚙️ Backend Setup

NovelNest uses a separate Express.js backend with MongoDB.

### Clone the Backend Repository

```bash
git clone https://github.com/nayanhalder730/novelnest-server.git
```

### Navigate to the Backend Directory

```bash
cd novelnest-server
```

### Install Dependencies

```bash
npm install
```

### Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=novelnest
CLIENT_SITE_URL=http://localhost:3000
```

Add any other variables required by your server configuration.

### Start the Backend

```bash
npm run dev
```

The backend will run at:

http://localhost:8000

---

## 🔌 API Overview

The backend provides REST API endpoints for book and borrowing management.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:id` | Retrieve a single book |
| POST | `/books` | Add a new book |
| PATCH | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Retrieve borrowed books |
| DELETE | `/borrows/:id` | Return a borrowed book |

---

## 🔑 Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/all-books` | Public | Browse all books |
| `/all-books/:slug` | Private | Book details |
| `/all-books/:slug/edit` | Private | Edit book |
| `/sign-in` | Public | User login |
| `/sign-up` | Public | User registration |
| `/add-book` | Private | Add a new book |
| `/my-collection` | Private | Manage added books |
| `/my-borrows` | Private | Manage borrowed books |
| `/profile` | Private | User profile |

---

## 🎯 Core Project Goals

NovelNest is designed to:

- Make online book discovery convenient.
- Provide a simple book-sharing platform.
- Simplify borrowing and returning books.
- Help users manage their personal book collections.
- Demonstrate practical full-stack web development.
- Provide a smooth and accessible user experience.

---

## 🔮 Future Improvements

Potential improvements for future versions:

- ⭐ Book rating and review system.
- ❤️ Favorite books and personalized reading lists.
- 🔍 Advanced search and sorting.
- 📊 Personal reading statistics.
- 🤖 Smart book recommendations.
- 📚 Reading history and activity tracking.

---

## 👨‍💻 About the Developer

<p align="center">
  <b>Nayan Halder</b>
  <br />
  MERN Stack Developer
  <br />
  Aspiring Full-Stack Developer
  <br />
  📍 Dhaka, Bangladesh
</p>

<p align="center">
  <a href="https://github.com/nayanhalder730">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/nayan-halder-dev">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://www.facebook.com/nayan81xd">
    <img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" />
  </a>
</p>

---

## ⭐ Show Your Support

If you find NovelNest interesting, consider giving this repository a ⭐ on GitHub.

Your feedback and suggestions are always welcome!

<p align="center">
  <b>Made with ❤️ by Nayan Halder</b>
  <br />
  <i>A World Between Pages.</i>
</p>