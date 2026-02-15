
-- User payment requisites
CREATE TABLE public.user_requisites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('card', 'sbp', 'crypto', 'lolzteam')),
  details TEXT NOT NULL DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, method)
);

ALTER TABLE public.user_requisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requisites" ON public.user_requisites
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own requisites" ON public.user_requisites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requisites" ON public.user_requisites
  FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete own requisites" ON public.user_requisites
  FOR DELETE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Add payment_method column to payments for tracking which requisite was used
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
