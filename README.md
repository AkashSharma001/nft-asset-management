# NFT Asset Management System

A comprehensive full-stack NFT asset management system built with modern technologies. This system allows users to track, manage, and analyze their NFT portfolio efficiently.



https://github.com/user-attachments/assets/f031934f-f3d8-4e76-b019-9326e063e2ea



## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Fastify, tRPC
- **Database**: Supabase
- **Authentication**: Supabase Auth

## 📁 Project Structure

```
├── client/          # Next.js frontend
├── server/          # Fastify + tRPC backend
└── schema.sql       # Supabase database schema
```

## 🔧 Prerequisites

- Node.js 
- npm 
- Supabase Account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Akashsharma001/nft-asset-management.git
cd nft-asset-management
```

### 2. Install dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Setup

#### Client Setup
```bash
cd client
cp .env.example .env
```
Configure the following variables in `client/.env`:
- `NEXT_PUBLIC_API_URL`: Your Fastify server URL

#### Server Setup
```bash
cd server
cp .env.example .env
```
Configure the following variables in `server/.env`:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 4. Database Setup

1. Create a new Supabase project
2. Navigate to the SQL editor in your Supabase dashboard
3. Copy the contents of `schema.sql`
4. Execute the SQL queries to create the necessary tables

### 5. Start Development Servers

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

- Backend: [http://localhost:4000](http://localhost:4000)
- Frontend: [http://localhost:3000](http://localhost:3000)