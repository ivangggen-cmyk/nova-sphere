import { motion } from "framer-motion";
import { User, Mail, Lock, Bell, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">Настройки</h1>
      <p className="text-sm text-muted-foreground">Управление аккаунтом и предпочтениями</p>
    </div>

    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Профиль</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Имя</Label>
            <Input defaultValue="Алексей" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Фамилия</Label>
            <Input defaultValue="Петров" />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs mb-1.5 block">Email</Label>
            <Input defaultValue="alexey@example.com" type="email" />
          </div>
        </div>
        <Button className="mt-4 gradient-accent text-accent-foreground border-0" size="sm">Сохранить</Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> Уведомления</h3>
        <div className="space-y-4">
          {[
            { label: "Email-уведомления о новых заданиях", checked: true },
            { label: "Push-уведомления о статусе задания", checked: true },
            { label: "Еженедельный отчёт", checked: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <span className="text-sm">{n.label}</span>
              <Switch defaultChecked={n.checked} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Безопасность</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Двухфакторная аутентификация</div>
              <div className="text-xs text-muted-foreground">Дополнительная защита вашего аккаунта</div>
            </div>
            <Switch />
          </div>
          <Separator />
          <Button variant="outline" size="sm"><Lock className="mr-2 h-4 w-4" /> Сменить пароль</Button>
        </div>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default SettingsPage;
