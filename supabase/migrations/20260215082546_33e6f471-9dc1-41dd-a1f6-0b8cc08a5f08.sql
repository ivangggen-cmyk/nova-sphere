
-- Add link_url for task execution link
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS link_url text DEFAULT '';

-- Add requirements (requirements for the task)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS requirements text[] DEFAULT '{}'::text[];

-- Add recommendations
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS recommendations text[] DEFAULT '{}'::text[];

-- Remove deadline column (no longer needed per user request)
-- We'll keep it but just not use it in the UI

-- Add level_bonus_percent to platform_settings if not exists
INSERT INTO public.platform_settings (key, value, description) 
VALUES 
  ('level_bonus_novice', '0', 'Бонус за уровень Новичок (%)'),
  ('level_bonus_advanced', '5', 'Бонус за уровень Продвинутый (%)'),
  ('level_bonus_expert', '10', 'Бонус за уровень Эксперт (%)')
ON CONFLICT (key) DO NOTHING;
