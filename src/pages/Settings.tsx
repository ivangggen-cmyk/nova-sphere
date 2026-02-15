import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (profile) { setFullName(profile.full_name || ""); setPhone(profile.phone || ""); } }, [profile]);

  const handleSave = async () => {
    if (!user) return; setSaving(true);
    try { await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id); toast({ title: "Сохранено" }); }
    catch (e: any) { toast({ title: "Ошибка", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    const email = user?.email; if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else toast({ title: "Письмо отправлено" });
  };

  return (
    <DashboardLayout>
      <div className="mb-6"><h1 className="text-2xl font-display font-bold mb-1">Настройки</h1><p className="text-sm text-muted-foreground">Управление аккаунтом</p></div>
      <div className="max-w-2xl space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Профиль</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label className="text-xs mb-1.5 block text-muted-foreground">Имя</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs mb-1.5 block text-muted-foreground">Email</Label><Input value={profile?.email || ""} disabled className="rounded-xl" /></div>
            <div><Label className="text-xs mb-1.5 block text-muted-foreground">Телефон</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7..." className="rounded-xl" /></div>
          </div>
          <Button className="mt-4 gradient-primary text-primary-foreground border-0 rounded-xl" size="sm" onClick={handleSave} disabled={saving}>{saving ? "..." : "Сохранить"}</Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Безопасность</h3>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={handleChangePassword}><Lock className="mr-2 h-4 w-4" /> Сменить пароль</Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-sm mb-3">Реферальный код</h3>
          <div className="flex items-center gap-3">
            <Input value={profile?.referral_code || ""} readOnly className="max-w-xs rounded-xl font-mono" />
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { navigator.clipboard.writeText(profile?.referral_code || ""); toast({ title: "Скопировано!" }); }}>Копировать</Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};
export default SettingsPage;
