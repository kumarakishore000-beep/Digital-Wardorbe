-- ==========================================
-- STYLEMATCH AI / DIGITAL WARDROBE SCHEMA
-- Compatible with Supabase PostgreSQL
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE item_category AS ENUM (
        'tops',
        'bottoms',
        'shoes',
        'accessories',
        'outerwear',
        'one_piece',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    style_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. WARDROBE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category item_category NOT NULL DEFAULT 'other',
    color_primary TEXT,
    color_secondary TEXT,
    color_accent TEXT,
    pattern TEXT,
    neckline TEXT,
    silhouette TEXT,
    image_url TEXT,
    storage_path TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    in_wishlist BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. OUTFITS TABLE
CREATE TABLE IF NOT EXISTS public.outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    compatibility_score INTEGER CHECK (compatibility_score BETWEEN 0 AND 100),
    event_setting TEXT,
    stylist_notes TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. OUTFIT ITEMS (JUNCTION TABLE)
CREATE TABLE IF NOT EXISTS public.outfit_items (
    outfit_id UUID NOT NULL REFERENCES public.outfits(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, item_id)
);

-- 7. USER REWARDS TABLE (Gamification Points & Level)
CREATE TABLE IF NOT EXISTS public.user_rewards (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    counters JSONB NOT NULL DEFAULT '{}'::jsonb,
    unlocked_badges TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. BADGES TABLE (Master Catalog)
CREATE TABLE IF NOT EXISTS public.badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement INTEGER NOT NULL CHECK (requirement > 0),
    tracking_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. USER BADGES TABLE (Junction / Unlocks)
CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, badge_id)
);

-- 10. REWARD HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.reward_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON public.wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_category ON public.wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_history_user_id ON public.reward_history(user_id);

-- ==========================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wardrobe_items_updated_at ON public.wardrobe_items;
CREATE TRIGGER update_wardrobe_items_updated_at BEFORE UPDATE ON public.wardrobe_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_outfits_updated_at ON public.outfits;
CREATE TRIGGER update_outfits_updated_at BEFORE UPDATE ON public.outfits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_rewards_updated_at ON public.user_rewards;
CREATE TRIGGER update_user_rewards_updated_at BEFORE UPDATE ON public.user_rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- AUTOMATIC USER PROVISIONING TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_rewards (user_id, points, level, counters, unlocked_badges)
    VALUES (NEW.id, 0, 1, '{}'::jsonb, '{}')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_history ENABLE ROW LEVEL SECURITY;

-- 1) PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2) WARDROBE ITEMS POLICIES
DROP POLICY IF EXISTS "Users can view their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can view their own wardrobe items" ON public.wardrobe_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can insert their own wardrobe items" ON public.wardrobe_items FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can update their own wardrobe items" ON public.wardrobe_items FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wardrobe items" ON public.wardrobe_items;
CREATE POLICY "Users can delete their own wardrobe items" ON public.wardrobe_items FOR DELETE USING (auth.uid() = user_id);

-- 3) OUTFITS POLICIES
DROP POLICY IF EXISTS "Users can view their own outfits" ON public.outfits;
CREATE POLICY "Users can view their own outfits" ON public.outfits FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own outfits" ON public.outfits;
CREATE POLICY "Users can insert their own outfits" ON public.outfits FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own outfits" ON public.outfits;
CREATE POLICY "Users can update their own outfits" ON public.outfits FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own outfits" ON public.outfits;
CREATE POLICY "Users can delete their own outfits" ON public.outfits FOR DELETE USING (auth.uid() = user_id);

-- 4) OUTFIT ITEMS POLICIES
DROP POLICY IF EXISTS "Users can view items in their outfits" ON public.outfit_items;
CREATE POLICY "Users can view items in their outfits" ON public.outfit_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert items into their outfits" ON public.outfit_items;
CREATE POLICY "Users can insert items into their outfits" ON public.outfit_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete items from their outfits" ON public.outfit_items;
CREATE POLICY "Users can delete items from their outfits" ON public.outfit_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid())
);

-- 5) USER REWARDS POLICIES
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.user_rewards;
CREATE POLICY "Users can view their own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own rewards" ON public.user_rewards;
CREATE POLICY "Users can update their own rewards" ON public.user_rewards FOR UPDATE USING (auth.uid() = user_id);

-- 6) BADGES POLICIES (Public read)
DROP POLICY IF EXISTS "Anyone can view badges" ON public.badges;
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- 7) USER BADGES POLICIES
DROP POLICY IF EXISTS "Users can view their unlocked badges" ON public.user_badges;
CREATE POLICY "Users can view their unlocked badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their unlocked badges" ON public.user_badges;
CREATE POLICY "Users can insert their unlocked badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8) REWARD HISTORY POLICIES
DROP POLICY IF EXISTS "Users can view their own reward history" ON public.reward_history;
CREATE POLICY "Users can view their own reward history" ON public.reward_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their reward history" ON public.reward_history;
CREATE POLICY "Users can insert into their reward history" ON public.reward_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- SUPABASE STORAGE BUCKETS & RLS POLICIES
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('wardrobe-images', 'wardrobe-images', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
CREATE POLICY "Users can upload their own images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
CREATE POLICY "Users can view their own images" ON storage.objects FOR SELECT USING (
    bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (
    bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ==========================================
-- SEED BADGES DATA
-- ==========================================
INSERT INTO public.badges (id, name, description, icon, requirement, tracking_key) VALUES
('first_upload', 'First Impression', 'Upload your first outfit', '📸', 1, 'upload_outfit'),
('style_explorer', 'Style Explorer', 'Analyze 5 outfits', '🔍', 5, 'complete_analysis'),
('color_theorist', 'Color Theorist', 'Use the color picker 10 times', '🎨', 10, 'use_color_picker'),
('collector_starter', 'Collector', 'Add 5 items to your collection', '👜', 5, 'add_to_collection'),
('accessory_maven', 'Accessory Maven', 'Own 10+ accessories in your collection', '💎', 10, 'add_to_collection'),
('style_pioneer', 'Style Pioneer', 'Try 3 new suggestions', '🚀', 3, 'try_suggestion'),
('trendsetter', 'Trendsetter', 'Try 10 new suggestions', '⭐', 10, 'try_suggestion'),
('wardrobe_master', 'Wardrobe Master', 'Add 25 items to your collection', '👑', 25, 'add_to_collection'),
('wishlist_dreamer', 'Wishlist Dreamer', 'Add 5 items to your wishlist', '✨', 5, 'add_to_wishlist')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    requirement = EXCLUDED.requirement,
    tracking_key = EXCLUDED.tracking_key;
