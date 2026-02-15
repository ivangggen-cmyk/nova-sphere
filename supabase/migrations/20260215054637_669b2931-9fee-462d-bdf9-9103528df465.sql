
-- Drop all restrictive policies and recreate as permissive

-- BANNERS
DROP POLICY IF EXISTS "Anyone can view banners" ON public.banners;
DROP POLICY IF EXISTS "Admin can manage banners" ON public.banners;
DROP POLICY IF EXISTS "Admin can update banners" ON public.banners;
DROP POLICY IF EXISTS "Admin can delete banners" ON public.banners;

CREATE POLICY "Anyone can view banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin can manage banners" ON public.banners FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update banners" ON public.banners FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete banners" ON public.banners FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- NEWS
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
DROP POLICY IF EXISTS "Admin can manage news" ON public.news;
DROP POLICY IF EXISTS "Admin can update news" ON public.news;
DROP POLICY IF EXISTS "Admin can delete news" ON public.news;

CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT USING ((is_published = true) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage news" ON public.news FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update news" ON public.news FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete news" ON public.news FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- PAYMENTS
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can update payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can delete payments" ON public.payments;

CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage payments" ON public.payments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (auth.uid() = user_id));
CREATE POLICY "Admin can update payments" ON public.payments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete payments" ON public.payments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- PLATFORM_SETTINGS
DROP POLICY IF EXISTS "Admin can view settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admin can insert settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admin can update settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admin can delete settings" ON public.platform_settings;

CREATE POLICY "Admin can view settings" ON public.platform_settings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can insert settings" ON public.platform_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update settings" ON public.platform_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete settings" ON public.platform_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can insert profiles" ON public.profiles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete profiles" ON public.profiles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- REFERRALS
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admin can delete referrals" ON public.referrals;
DROP POLICY IF EXISTS "Authenticated can create referrals" ON public.referrals;

CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING ((auth.uid() = referrer_id) OR (auth.uid() = referred_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete referrals" ON public.referrals FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- REPORTS
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can submit reports" ON public.reports;
DROP POLICY IF EXISTS "Admin can update reports" ON public.reports;
DROP POLICY IF EXISTS "Admin can delete reports" ON public.reports;

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update reports" ON public.reports FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR ((auth.uid() = user_id) AND (status = 'pending'::report_status)));
CREATE POLICY "Admin can delete reports" ON public.reports FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- SECURITY_LOGS
DROP POLICY IF EXISTS "Admin can view logs" ON public.security_logs;
DROP POLICY IF EXISTS "Authenticated can insert logs" ON public.security_logs;

CREATE POLICY "Admin can view logs" ON public.security_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can insert logs" ON public.security_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- TASK_CATEGORIES
DROP POLICY IF EXISTS "Anyone can view categories" ON public.task_categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.task_categories;
DROP POLICY IF EXISTS "Admin can update categories" ON public.task_categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON public.task_categories;

CREATE POLICY "Anyone can view categories" ON public.task_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.task_categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update categories" ON public.task_categories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete categories" ON public.task_categories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- TASKS
DROP POLICY IF EXISTS "Authenticated can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admin can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admin can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admin can delete tasks" ON public.tasks;

CREATE POLICY "Authenticated can view tasks" ON public.tasks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage tasks" ON public.tasks FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update tasks" ON public.tasks FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete tasks" ON public.tasks FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES
DROP POLICY IF EXISTS "Users can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can delete roles" ON public.user_roles;

CREATE POLICY "Users can view roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- USER_TASKS
DROP POLICY IF EXISTS "Users can view own user_tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can take tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can update own user_tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can delete own user_tasks" ON public.user_tasks;

CREATE POLICY "Users can view own user_tasks" ON public.user_tasks FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can take tasks" ON public.user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_tasks" ON public.user_tasks FOR UPDATE USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can delete own user_tasks" ON public.user_tasks FOR DELETE USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

-- Seed platform_settings if empty
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('commission_percent', '10', 'Комиссия платформы (%)'),
  ('min_withdrawal', '500', 'Минимальная сумма вывода (₽)'),
  ('max_withdrawal', '50000', 'Максимальная сумма вывода (₽)'),
  ('referral_level_1_percent', '10', 'Бонус реферала 1-го уровня (%)'),
  ('referral_level_2_percent', '5', 'Бонус реферала 2-го уровня (%)'),
  ('referral_level_3_percent', '2', 'Бонус реферала 3-го уровня (%)'),
  ('two_factor_required', 'false', 'Обязательная двухфакторная аутентификация'),
  ('antifraud_enabled', 'true', 'Антифрод система'),
  ('ip_logging', 'true', 'Логирование IP-адресов'),
  ('max_tasks_per_user', '10', 'Макс. заданий на пользователя'),
  ('auto_approve_reports', 'false', 'Автоматическое одобрение отчётов'),
  ('maintenance_mode', 'false', 'Режим обслуживания')
ON CONFLICT (key) DO NOTHING;
