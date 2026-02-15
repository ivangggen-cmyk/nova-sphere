
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Enum for task status
CREATE TYPE public.task_status AS ENUM ('active', 'paused', 'completed');

-- Enum for user_task status
CREATE TYPE public.user_task_status AS ENUM ('assigned', 'in_progress', 'submitted', 'approved', 'rejected');

-- Enum for report format
CREATE TYPE public.report_format AS ENUM ('photo', 'text', 'audio');

-- Enum for report status
CREATE TYPE public.report_status AS ENUM ('pending', 'approved', 'rejected');

-- Enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Enum for payment type
CREATE TYPE public.payment_type AS ENUM ('reward', 'withdrawal', 'referral_bonus');

-- Enum for notification type
CREATE TYPE public.notification_type AS ENUM ('success', 'info', 'warning', 'bonus', 'system');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(12,2) NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Новичок',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Task categories
CREATE TABLE public.task_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.task_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  reward NUMERIC(10,2) NOT NULL DEFAULT 0,
  deadline TIMESTAMPTZ,
  difficulty TEXT NOT NULL DEFAULT 'Легко',
  total_spots INTEGER NOT NULL DEFAULT 50,
  taken_spots INTEGER NOT NULL DEFAULT 0,
  status task_status NOT NULL DEFAULT 'active',
  steps TEXT[] DEFAULT '{}',
  criteria TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User tasks (assigned tasks)
CREATE TABLE public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  status user_task_status NOT NULL DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, task_id)
);

-- Reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_task_id UUID NOT NULL REFERENCES public.user_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  format report_format NOT NULL DEFAULT 'text',
  content TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT DEFAULT '',
  reviewed_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  description TEXT DEFAULT '',
  transaction_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  bonus_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Platform settings (key-value store for admin config)
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security logs
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  ip_address TEXT DEFAULT '',
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Banners for content management
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News/announcements
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
BEGIN
  ref_code := 'ATL' || substr(md5(random()::text), 1, 8);
  
  INSERT INTO public.profiles (user_id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    ref_code
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ======= RLS POLICIES =======

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User roles
CREATE POLICY "Users can view roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Task categories (public read)
CREATE POLICY "Anyone can view categories" ON public.task_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.task_categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update categories" ON public.task_categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete categories" ON public.task_categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Tasks (public read for authenticated)
CREATE POLICY "Authenticated can view tasks" ON public.tasks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage tasks" ON public.tasks FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update tasks" ON public.tasks FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete tasks" ON public.tasks FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User tasks
CREATE POLICY "Users can view own user_tasks" ON public.user_tasks FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can take tasks" ON public.user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_tasks" ON public.user_tasks FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own user_tasks" ON public.user_tasks FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Reports
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update reports" ON public.reports FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR (auth.uid() = user_id AND status = 'pending'));
CREATE POLICY "Admin can delete reports" ON public.reports FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage payments" ON public.payments FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
CREATE POLICY "Admin can update payments" ON public.payments FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete payments" ON public.payments FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can delete referrals" ON public.referrals FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Platform settings (admin only)
CREATE POLICY "Admin can view settings" ON public.platform_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage settings" ON public.platform_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Security logs (admin only)
CREATE POLICY "Admin can view logs" ON public.security_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert logs" ON public.security_logs FOR INSERT WITH CHECK (true);

-- Banners (public read, admin write)
CREATE POLICY "Anyone can view banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin can manage banners" ON public.banners FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update banners" ON public.banners FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete banners" ON public.banners FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- News (public read, admin write)
CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can manage news" ON public.news FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update news" ON public.news FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete news" ON public.news FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Insert default task categories
INSERT INTO public.task_categories (name, description, icon) VALUES
  ('Банковские услуги', 'Открытие счетов, карт, ИП', 'Building2'),
  ('Подбор персонала', 'Поиск курьеров, водителей, сотрудников', 'Users'),
  ('Страхование', 'Оформление полисов и страховок', 'Shield'),
  ('Туризм', 'Бронирование туров и путешествий', 'Plane'),
  ('Займы', 'Оформление микрозаймов и кредитов', 'Banknote');

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('referral_level_1_percent', '10', 'Процент реферального бонуса 1-го уровня'),
  ('referral_level_2_percent', '5', 'Процент реферального бонуса 2-го уровня'),
  ('referral_level_3_percent', '2', 'Процент реферального бонуса 3-го уровня'),
  ('platform_commission', '5', 'Комиссия платформы в процентах'),
  ('min_withdrawal', '500', 'Минимальная сумма вывода'),
  ('max_withdrawal', '100000', 'Максимальная сумма вывода'),
  ('two_factor_required', 'true', 'Обязательная двухфакторная аутентификация'),
  ('antifraud_enabled', 'true', 'Антифрод-система'),
  ('ip_logging', 'true', 'Логирование IP-адресов'),
  ('email_notifications', 'true', 'Email-уведомления'),
  ('push_notifications', 'true', 'Push-уведомления'),
  ('telegram_bot', 'false', 'Telegram-бот');
