
-- Fix overly permissive policies: require authentication for inserts
DROP POLICY "Anyone can create notifications" ON public.notifications;
CREATE POLICY "Authenticated can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY "System can create referrals" ON public.referrals;
CREATE POLICY "Authenticated can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY "Anyone can insert logs" ON public.security_logs;
CREATE POLICY "Authenticated can insert logs" ON public.security_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Also fix the duplicate/conflicting policy on platform_settings
DROP POLICY "Admin can manage settings" ON public.platform_settings;
CREATE POLICY "Admin can insert settings" ON public.platform_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update settings" ON public.platform_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete settings" ON public.platform_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
