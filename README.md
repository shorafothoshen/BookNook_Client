# BookNook

> **Add a book, borrow a book, return a book.**

BookNook is a small online library. Readers can browse every book on the shelf, add their own books with a cover image, borrow a book for a few days, and return it when they are done.

- **Live site:** [https://book-nook-client-nine.vercel.app](https://book-nook-client-nine.vercel.app/)
- **Server repository:** [github.com/shorafothoshen/BookNook_Server](https://github.com/shorafothoshen/BookNook_Server)

![BookNook home page](./public/project-home-page.png)

---

## Features

- **Hero slider** on the home page built with Swiper.js. It has 5 slides with autoplay and pagination, and every slide has a title, a short text and a "Browse Books" button that goes to the All Books page.
- **Secure authentication** with BetterAuth and the MongoDB adapter. Users can register with name, email, photo URL and password, log in with email and password, or continue with Google.
- **Password validation** on registration: at least one uppercase letter, one lowercase letter and 6 or more characters. An invalid password shows an error and the user is not registered.
- **Private routes.** Add Book, My Books, My Borrows and Book Details are available only after login. A visitor who is not logged in is sent to the Login page and comes back to the page they wanted after logging in. Reloading a private page keeps the user logged in.
- **JWT protected API.** The client gets a JWT from BetterAuth and sends it with every request to the Express server, so the server can verify the user.
- **Add a book** with title, author, category (Fiction, Science, History, Kids, Others), cover image uploaded to imgbb, and a short description. The name and email of the logged in user are shown as read-only fields.
- **All Books page** with a responsive grid of equal-size cards (3 per row on desktop). Each card shows the image, title, author, category and a "View Details" button.
- **Book Details page** with the image, title, author, category, description and who added the book, plus a "Borrow This Book" button that opens a confirm modal.
- **My Books page** to manage your own books. Edit opens a form with the old data already filled in, and Delete opens a custom confirm modal (not the browser confirm).
- **My Borrows page** with a table of borrowed books: image, title, borrow date, return date, a status badge (due soon or overdue) and a "Return Book" button.
- **Smart navbar.** Private links appear only for logged in users. Visitors see Login and Register buttons, and logged in users see their photo with a dropdown (name, My Profile, Logout).
- **Toast messages everywhere** with react-toastify. There is no `alert()` anywhere in the app.
- **Loading screens** with a `loading.tsx` file for each route, and a **custom 404 page** with a "Back to Home" button.
- **Page title changes on every route**, for example "BookNook | All Books".
- **Fully responsive** for mobile, tablet and desktop.

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI library | React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Authentication | BetterAuth, MongoDB adapter, JWT plugin |
| Database | MongoDB (users and sessions through BetterAuth) |
| Slider | Swiper.js |
| Notifications | react-toastify |
| Image upload | imgbb |
| Hosting | Vercel |

The REST API (books and borrows) is in the separate server repository: [BookNook_Server](https://github.com/shorafothoshen/BookNook_Server).

---

## Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Home |
| `/books` | Public | All Books |
| `/books/:id` | Private | Book Details |
| `/add-book` | Private | Add Book |
| `/my-books` | Private | My Books (edit and delete) |
| `/my-borrows` | Private | My Borrows (return) |
| `/profile` | Private | My Profile |
| `/login` | Public | Login |
| `/sign-up` | Public | Register |

---

## Getting Started

### Requirements

- Node.js 20 or newer
- A MongoDB database (MongoDB Atlas works well)
- A Google OAuth client (for Google login)
- An imgbb API key (for image upload)
- The [BookNook server](https://github.com/shorafothoshen/BookNook_Server) running

### Installation

1. Clone this repository and open the project folder.
2. Install the packages:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (see the next section).
4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` file in the project root. The file is not committed to the repository.

```env
MONGODB_CONNECTION_BASE_URL=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=a_long_random_secret_text
BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_KEY_SECRECT_KEY=your_imgbb_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

| Variable | What it is for |
|---|---|
| `MONGODB_CONNECTION_BASE_URL` | MongoDB connection string used by BetterAuth |
| `BETTER_AUTH_URL` | The URL of this client (`http://localhost:3000` locally, the live URL on Vercel) |
| `BETTER_AUTH_SECRET` | Secret used by BetterAuth to sign data (required in production) |
| `BETTER_AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `BETTER_AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_KEY_SECRECT_KEY` | imgbb API key for book image upload (the spelling `SECRECT` is intentional, keep it as it is) |
| `NEXT_PUBLIC_API_URL` | URL of the Express server, without a slash at the end |

### Google login setup

In the Google Cloud Console, add these as **Authorized redirect URIs**, otherwise Google shows a `redirect_uri_mismatch` error:

- `http://localhost:3000/api/auth/callback/google`
- `https://book-nook-client-nine.vercel.app/api/auth/callback/google`

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the app for production |
| `npm run start` | Runs the production build |
| `npm run lint` | Checks the code with ESLint |

---

## Project Structure

```text
src/
├── app/           Next.js App Router pages and loading.tsx files
├── components/    Reusable UI components
├── lib/           Auth, token and type helpers
└── styles/        Global styles
public/            Static assets (images, favicons)
next.config.ts     Next.js configuration
```

---

## Deployment

The client is deployed on **Vercel**.

1. Import the GitHub repository in Vercel.
2. Add all the environment variables from the table above in the Vercel project settings.
3. Set `BETTER_AUTH_URL` to the live URL and `NEXT_PUBLIC_API_URL` to the live URL of the server.
4. Add the live Google callback URL (see "Google login setup").
5. Deploy.

---

## Author

**Shorafot Hoshen**, [@shorafothoshen](https://github.com/shorafothoshen)