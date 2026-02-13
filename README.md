# 🧵 Embroidery Gallery

A beautiful web gallery for showcasing and ordering embroidery designs, with Twitch integration and stream overlay support.

## ✨ Features

- **Design Gallery** - Showcase your embroidery designs with categories and filtering
- **Order Submission** - Customers can select designs, sizes, and textile types
- **Twitch Login** - Optional OAuth authentication via Twitch
- **Redemption Codes** - Generate unique codes for giveaways (e.g., top donator prizes)
- **Stream Overlay** - Real-time notifications when orders are placed (OBS browser source)
- **Admin Panel** - Manage orders and generate redemption codes

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Supabase Account** - [Sign up free](https://supabase.com/)
3. **Twitch Developer App** (optional) - [Create here](https://dev.twitch.tv/console/apps)

### Step 1: Install Dependencies

```bash
cd Embroweb
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Once created, go to **SQL Editor** in the sidebar
3. Create a new query and paste the contents of `supabase-schema.sql`
4. Click **Run** to create all tables

### Step 3: Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   - Go to **Project Settings** > **API** in Supabase
   - Copy `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Set a secure `ADMIN_SECRET_KEY` (any random string)

### Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 🔐 Setting Up Twitch Login (Optional)

1. Go to [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
2. Click **Register Your Application**
3. Fill in:
   - **Name**: Your app name
   - **OAuth Redirect URLs**: `http://localhost:3000/api/auth/callback`
   - **Category**: Website Integration
4. After creating, click **Manage** and get your **Client ID**
5. Generate a new **Client Secret**
6. Add both to your `.env.local`

## 📺 Stream Overlay Setup (OBS)

1. Deploy your app (see Deployment section)
2. In OBS, add a new **Browser Source**
3. Set URL to: `https://yourdomain.com/overlay`
4. Set dimensions: `1920x1080` (or your stream resolution)
5. Make sure **Custom CSS** is empty for transparency

The overlay will show notifications when orders are submitted!

## 🎫 Using Redemption Codes

1. Go to `/admin` and enter your admin key
2. Click the **Redemption Codes** tab
3. Generate a new code with description and expiry
4. Share the code with your giveaway winner
5. They enter it at `/redeem` to claim their prize

## 🚀 Deployment (Vercel - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and import your repository
3. Add your environment variables in Vercel's dashboard
4. Deploy!

Don't forget to:
- Update `NEXT_PUBLIC_TWITCH_REDIRECT_URI` to your production URL
- Enable Realtime in Supabase for the stream overlay

## 📁 Project Structure

```
Embroweb/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main gallery
│   │   ├── redeem/           # Code redemption page
│   │   ├── admin/            # Admin panel
│   │   ├── overlay/          # Stream overlay
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── DesignCard.tsx
│   │   └── OrderModal.tsx
│   └── lib/
│       ├── supabase.ts       # Database client
│       └── twitch.ts         # Twitch OAuth helpers
├── supabase-schema.sql       # Database schema
└── .env.example              # Environment template
```

## 💰 Cost Breakdown

**Everything can be FREE with generous limits:**

| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth/month |
| Supabase | 500MB database, 50K monthly requests |
| Twitch API | Unlimited (within rate limits) |

## 🇨🇿 Czech Legal Notes

If you have an IČO and want to accept payments:
- For **giveaways** (no payment): No special requirements
- For **actual sales**: 
  - Consider EET (elektronická evidence tržeb) requirements
  - Use proper invoicing software
  - Consult with your accountant

This app is designed for order collection without payment processing. You can add Stripe later if needed.

## 🤝 Contributing

Feel free to customize this for your needs! The code is yours to modify.

## 📧 Support

Built with ❤️ for streamers and crafters.

---

Made with Next.js, Supabase, and Tailwind CSS
