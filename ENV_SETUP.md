# Backend Environment Setup

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://vuduybachvp:TJ4obGsJleYENZzV@livechat.jcxnz9h.mongodb.net
MONGODB_DB_NAME=stockpilot

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dycxmy3tq
CLOUDINARY_API_KEY=728763913524778
CLOUDINARY_API_SECRET=S6hvz7VYYQ81LFkctZacoWXer7E
CLOUDINARY_FOLDER=stockpilot_products

# AI/Genkit
GEMINI_API_KEY=AIzaSyASss4IJVvRgFwl1JpwhUiGQPIkOqKYjD0

# CORS
FRONTEND_URL=http://localhost:3000
https://product-mng-fe.vercel.app/
```

## Chạy Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Tạo file .env với nội dung trên

3. Start development server:
```bash
npm run dev
```

Backend sẽ chạy trên http://localhost:5000 