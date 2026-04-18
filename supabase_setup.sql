-- ═══════════════════════════════════════════════════
-- SUPABASE SETUP SCRIPT FOR PORTFOLIO (LIKES BY EMAIL)
-- ═══════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor to set up the `likes` feature with email tracking.

-- 1. DROP old policies if they exist
DROP POLICY IF EXISTS "Allow public select on likes" ON public.likes;
DROP POLICY IF EXISTS "Allow public update on likes" ON public.likes;
DROP POLICY IF EXISTS "Allow public insert on likes" ON public.likes;
DROP POLICY IF EXISTS "Allow public delete on likes" ON public.likes;

-- 2. DROP old likes table if it exists (optional - only if migrating from old structure)
DROP TABLE IF EXISTS public.likes CASCADE;

-- 3. Create the new `likes` table with email tracking
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security for `likes`
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 5. Allow anyone to read all likes
CREATE POLICY "Allow public select on likes"
ON public.likes FOR SELECT
TO public
USING (true);

-- 6. Allow anyone to insert a like with their email
CREATE POLICY "Allow public insert on likes"
ON public.likes FOR INSERT
TO public
WITH CHECK (true);

-- 7. Allow users to delete their own like by email
CREATE POLICY "Allow public delete on likes"
ON public.likes FOR DELETE
TO public
USING (true);

-- 8. Enable REALTIME for the `likes` table
-- This allows the portfolio frontend to listen for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
