# PasteDump

A simple and fast pastebin application built with modern web technologies. Create and share text snippets, code, and logs with ease, featuring syntax highlighting, custom expiration times, and a clean, modern interface.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Database Migrations:** [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## Local Development Setup

To run this project on your local machine, follow these steps.

### 1. Clone the Repository

```bash
git clone https://github.com/tegaidogun/pastedump.git
cd pastedump
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

This project requires a Supabase project for its database.

1.  Go to [supabase.com](https://supabase.com/) and create a new project.
2.  Keep the project dashboard open.

### 4. Configure Environment Variables

You need to create a `.env.local` file in the root of the project to store your Supabase credentials.

1.  Create the file: `touch .env.local`
2.  Go to your Supabase project's **Settings > API**.
3.  Add the following variables to your `.env.local` file, getting the values from the API settings page:

    ```bash
    # .env.local

    # Application keys
    NEXT_PUBLIC_SUPABASE_URL="...L"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="Y..."
    SUPABASE_SERVICE_ROLE_KEY="..."

    # Honestly you could just paste all the variables given to you by default, it should be fine
    ```

4.  Next, go to your Supabase project's **Settings > Database**.
5.  Under **Connection string**, find the URI that starts with `postgres://`. Make sure to copy the one for **Transaction (session) mode**, not the connection pooler.
6.  Add this to your `.env.local` file as `DATABASE_URL`:

    ```bash
    # .env.local
    
    # ... (add to the other keys)
    
    # Database migration key (use the DIRECT connection string)
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[...].supabase.co:5432/postgres"
    ```

### 5. Run Database Migrations

With your environment variables set, run the following command to automatically create the necessary `pastes` table and functions in your Supabase database.

```bash
npm run migrate:dev up
```

You only need to do this once for initial setup.

### 6. Run the Development Server

You're all set! Start the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Testing

The project is configured to run tests using Jest. For a clean testing environment, it's recommended to use a second, separate Supabase project.

1.  Create a second Supabase project for testing.
2.  Create a `.env.test` file in the root of the project.
3.  Fill `.env.test` with the credentials from your **test** project, following the same format as in step 4 above.
4.  Run the tests:

    ```bash
    npm test
    ```

This command will first automatically migrate your test database to the correct schema and then run the test suite. 

## License

This project is licensed under the MIT License.