# 🍳 Recipe Builder - Your Fun Kitchen Companion!

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19-2D3748)](https://www.prisma.io/)

A vibrant, kid-friendly web application for discovering, building, and managing recipes with AI-powered search and shopping list generation!

## ✨ Features

### 🎯 User Features
- **Smart Recipe Search**: AI-powered recipe discovery using OpenAI, tailored to your skill level
- **Personalized Experience**: Set your skill level (Beginner, Intermediate, Advanced) and favorite dishes
- **Recipe Collection**: Save and manage your favorite recipes
- **Shopping Lists**: Automatically generate shopping lists from recipes
- **Beautiful UI**: Vibrant blue and green color scheme, kid-friendly and easy to use
- **Onboarding Flow**: Guided setup to personalize your experience from the start

### 👨‍💼 Admin Features
- **Admin Dashboard**: Monitor platform statistics and user activity
- **User Management**: View all users, their skill levels, and activity
- **Recipe Management**: View all recipes and their popularity
- **Real-time Stats**: Track total users, recipes, and shopping lists

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **OpenAI API Key** (get one at [platform.openai.com](https://platform.openai.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and add your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   OPENAI_API_KEY="your-openai-api-key-here"
   ADMIN_EMAIL="admin@recipebuilder.com"
   ADMIN_PASSWORD="admin123"
   ```

   **Important**:
   - Replace `NEXTAUTH_SECRET` with a random string (you can generate one using `openssl rand -base64 32`)
   - Add your OpenAI API key to `OPENAI_API_KEY`
   - Change the admin credentials for production use

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

   This will:
   - Create the SQLite database
   - Run migrations to create all tables
   - Seed the database with an admin user and sample recipes

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials

### Admin Account
After running the seed script, you can log in as an admin:
- **Email**: `admin@recipebuilder.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials after your first login, especially in production!

### Creating a User Account
1. Click "Get Started" or "Sign Up" on the home page
2. Fill in your details (name, email, password)
3. Complete the onboarding by selecting:
   - Your cooking skill level (Beginner, Intermediate, Advanced)
   - Your favorite dishes
4. Start exploring recipes!

## 📚 How to Use

### For Regular Users

#### 1. Search for Recipes 🔍
- Go to your Dashboard
- Use the "Search Recipes" section
- Enter a recipe name or ingredient (e.g., "pasta", "chicken")
- The AI will find recipes matching your skill level
- Click on a recipe to view full details
- Save recipes to your collection

#### 2. Manage Saved Recipes 📚
- All saved recipes appear in "My Saved Recipes"
- Click on any recipe to view ingredients and instructions
- Perfect for quick reference while cooking!

#### 3. Shopping Lists 🛒
- View and manage your shopping lists
- Create new lists for different occasions
- Check off items as you shop

### For Admin Users

#### Access the Admin Dashboard
1. Log in with admin credentials
2. Click "Admin" in the navigation bar
3. View platform statistics:
   - Total users
   - Total recipes
   - Active shopping lists
4. Monitor recent user registrations
5. Track popular recipes

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) (via Prisma)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**: [OpenAI API](https://openai.com/api/)

## 📁 Project Structure

```
recipe-builder/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── register/     # User registration
│   │   ├── onboarding/   # User onboarding
│   │   └── recipes/      # Recipe operations
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── onboarding/       # Onboarding flow
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── SearchRecipes.tsx
│   ├── SavedRecipes.tsx
│   └── ShoppingLists.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── openai.ts         # OpenAI integration
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md            # This file!
```

## 🎨 Color Scheme

The app uses a vibrant, kid-friendly color palette:
- **Primary Blue**: From `#e6f7ff` to `#002766`
- **Secondary Green**: From `#f0fdf4` to `#14532d`
- Creates a fun, inviting atmosphere perfect for families

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database with initial data

## 🗄️ Database Schema

### User
- Authentication credentials
- Role (USER or ADMIN)
- Skill level (BEGINNER, INTERMEDIATE, ADVANCED)
- Favorite dishes (JSON array)
- Relationships: saved recipes, shopping lists

### Recipe
- Title, description, category
- Ingredients and instructions (JSON arrays)
- Prep time, cook time, servings
- Difficulty level
- Source information

### Shopping List
- Name and creation date
- Items with quantities and checked status
- Linked to user and recipes

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based access control (RBAC)
- Environment variable protection
- SQL injection protection via Prisma

## 🌟 Key Highlights

- **AI-Powered**: Uses OpenAI's GPT models for intelligent recipe search
- **Skill-Based**: Recipes are filtered based on user skill level
- **User-Friendly**: Clean, intuitive interface designed for all ages
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast**: Built with Next.js for optimal performance
- **Type-Safe**: Full TypeScript coverage for reliability

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `ADMIN_EMAIL` | Default admin email | No |
| `ADMIN_PASSWORD` | Default admin password | No |

## 🚀 Deployment

### Quick Deploy to Render

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

**Quick Steps:**

1. **Switch to PostgreSQL** (required for production):
   ```bash
   bash scripts/switch-to-postgres.sh
   ```

2. **Configure Render**:
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```

3. **Set Environment Variables** in Render:
   ```
   DATABASE_URL=<from Render Postgres>
   NEXTAUTH_URL=https://your-app.onrender.com
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   OPENAI_API_KEY=<your OpenAI key>
   ADMIN_EMAIL=admin@recipebuilder.com
   ADMIN_PASSWORD=<change this>
   ```

4. **After deployment**, seed the database:
   ```bash
   npm run seed
   ```

### Recommended Platforms
- **[Render](https://render.com)** - Simple and affordable (see DEPLOYMENT.md for full guide)
- **[Vercel](https://vercel.com)** - Easiest for Next.js (requires separate database)
- **[Railway](https://railway.app)** - Great for full-stack apps

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI](https://openai.com/)
- Icons and emojis for a fun, kid-friendly experience
- Inspired by home cooks everywhere!

## 📞 Support

If you have any questions or run into issues:
1. Check this README for common setup steps
2. Review the `.env.example` file for proper configuration
3. Make sure your OpenAI API key is valid and has credits
4. Ensure all dependencies are installed with `npm install`

---

**Happy Cooking! 👨‍🍳👩‍🍳**

Made with ❤️ for families and food enthusiasts everywhere!
