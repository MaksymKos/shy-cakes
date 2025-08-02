# Shy Cakes

A modern portfolio website built with Next.js for showcasing cake designs and bakery portfolio.

## 🚀 Features

-   Portfolio management with image uploads
-   Responsive design with Tailwind CSS
-   Cloud-based image storage with Cloudinary
-   Admin panel for content management
-   MongoDB database integration
-   NextAuth.js authentication

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd shy-cakes
npm install
```

### 2. Environment Variables

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Cloudinary Setup

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard and copy the credentials:
    - Cloud Name
    - API Key
    - API Secret
3. Add these to your `.env.local` file

### 4. MongoDB Setup

1. Create a MongoDB database (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free)
2. Get your connection string and add it to `MONGODB_URI` in `.env.local`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   │   ├── upload/     # Image upload endpoint
│   │   └── portfolio/  # Portfolio CRUD operations
│   └── ...
├── components/         # Reusable components
├── lib/               # Utility functions
│   └── cloudinary.ts  # Cloudinary integration
└── ...
```

## 🔧 Key Technologies

-   **Next.js 15** - React framework
-   **TypeScript** - Type safety
-   **Tailwind CSS** - Styling
-   **MongoDB** - Database
-   **Cloudinary** - Image storage and optimization
-   **NextAuth.js** - Authentication

## 🚨 Troubleshooting

### Upload Errors (EROFS: read-only file system)

This error occurs when deployed to serverless platforms. The solution implemented uses Cloudinary for image storage instead of local file system.

Make sure you have:

1. Cloudinary credentials in your environment variables
2. The `cloudinary` package installed
3. Proper error handling in the upload API route

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

### Other Platforms

Make sure to set all environment variables in your deployment platform's configuration.

## 📝 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and Cloudinary
