# Supabase Setup Guide for Smart Nutricheck

## 1. Create a Supabase Account
- Go to [supabase.com](https://supabase.com)
- Sign up for free
- Create a new project

## 2. Get Your Credentials
After creating your project:
- Go to **Settings** → **General**
- Copy your **Project URL** 
- Go to **Settings** → **API**
- Copy your **anon public** key (for frontend)
- Copy your **service_role** key (for backend)

## 3. Set Up Environment Variables

### Frontend (.env)
Create a file `frontend/.env` with:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend (.env)
Create or update `backend/.env` with:
```
SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

## 4. Create Database Tables

Go to Supabase Dashboard → SQL Editor and run this SQL:

```sql
-- Create analysis_results table
CREATE TABLE public.analysis_results (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  bmi FLOAT NOT NULL,
  bmi_category TEXT NOT NULL,
  ml_result TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  final_status TEXT NOT NULL,
  image_path TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX idx_analysis_results_created_at ON public.analysis_results(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert and read their own data
CREATE POLICY "Allow insert for all" ON public.analysis_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for all" ON public.analysis_results  
  FOR SELECT USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('analysis-images', 'analysis-images', true);

-- Create policy for storage bucket
CREATE POLICY "Allow public upload" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'analysis-images');

CREATE POLICY "Allow public read" ON storage.objects 
  FOR SELECT USING (bucket_id = 'analysis-images');
```

## 5. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
pip install -r requirements.txt
```

## 6. Start the Application

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
python main.py
```

## 7. Features

### Theme Toggle
- Click the sun/moon icon (☀️/🌙) in the sidebar to toggle between light and dark themes
- Your preference is saved in localStorage

### Supabase Integration
- All analysis results are automatically saved to Supabase
- Images are stored in Supabase Storage (`analysis-images` bucket)
- You can view all analysis data in the Supabase dashboard
- The data persists even if local uploads folder is cleared

## 8. Troubleshooting

### Supabase not connecting?
- Check that your credentials are correct in `.env` files
- Ensure the `.env` files are in the correct directories
- For frontend: `frontend/.env` (NOT `frontend/.env.local`)
- For backend: `backend/.env`

### Images not uploading?
- Make sure the `analysis-images` storage bucket exists in Supabase
- Check that the storage policies are set correctly

### Connection errors?
- Restart both frontend and backend after updating `.env` files
- Clear browser cache if using stale credentials

---

**Note**: Always keep your Supabase credentials secure. Never commit `.env` files to version control.
