
-- Add image_url to tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- Create storage bucket for task images
INSERT INTO storage.buckets (id, name, public) VALUES ('task-images', 'task-images', true) ON CONFLICT DO NOTHING;

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false) ON CONFLICT DO NOTHING;

-- Storage policies for task-images (public read, admin write)
CREATE POLICY "Anyone can view task images" ON storage.objects FOR SELECT USING (bucket_id = 'task-images');
CREATE POLICY "Admin can upload task images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'task-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update task images" ON storage.objects FOR UPDATE USING (bucket_id = 'task-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete task images" ON storage.objects FOR DELETE USING (bucket_id = 'task-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for verification-docs (user upload own, admin view all)
CREATE POLICY "Users can upload own verification docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own verification docs" ON storage.objects FOR SELECT USING (bucket_id = 'verification-docs' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Admin can delete verification docs" ON storage.objects FOR DELETE USING (bucket_id = 'verification-docs' AND public.has_role(auth.uid(), 'admin'));

-- Verification requests table
CREATE TABLE public.verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  full_name text NOT NULL DEFAULT '',
  document_type text NOT NULL DEFAULT 'passport',
  document_url text DEFAULT '',
  selfie_url text DEFAULT '',
  admin_notes text DEFAULT '',
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification requests" ON public.verification_requests FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own verification requests" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update verification requests" ON public.verification_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete verification requests" ON public.verification_requests FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  position text NOT NULL DEFAULT '',
  access_tabs text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view team" ON public.team_members FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage team" ON public.team_members FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update team" ON public.team_members FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete team" ON public.team_members FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
