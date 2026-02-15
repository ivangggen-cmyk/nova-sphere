import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowDownRight, ArrowUpRight, Wallet, Settings2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const methodLabels: Record<string, string> = {
  card: "Карта", sbp: "СБП", crypto: "Crypto", lolzteam: "LOLZTEAM",
};

const Payments = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requisites, setRequisites] = useState<any[]>([]);
  const [editingRequisites, setEditingRequisites] = useState(false);
  const [reqValues, setReqValues] = useState<Record<string, string>>({ card: "", sbp: "", crypto: "", lolzteam: "" });
  const [forceUpdate, setForceUpdate] = useState(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  useEffect(() => {
    setCurrentBalance(Number(profile?.balance || 0));
  }, [profile?.balance, forceUpdate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_requisites").select("*").eq("user_id", user.id),
    ]).then(([txRes, reqRes]) => {
      setTransactions(txRes.data || []);
      const reqs = reqRes.data || [];
      setRequisites(reqs);
      const vals: Record<string, string> = { card: "", sbp: "", crypto: "", lolzteam: "" };
      reqs.forEach((r: any) => { vals[r.method] = r.details; });
      setReqValues(vals);
      setLoading(false);
    });
  }, [user]);

  const handleWithdrawRequest = async () => {
    if (!user || !withdrawAmount || !withdrawMethod) {
      toast({ title: "Укажите сумму и метод вывода", variant: "destructive" }); return;
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) { toast({ title: "Некорректная сумма", variant: "destructive" }); return; }
    if (amount > currentBalance) { toast({ title: "Недостаточно средств", variant: "destructive" }); return; }

    const methodReq = requisites.find((r: any) => r.method === withdrawMethod);
    if (!methodReq || !methodReq.details) {
      toast({ title: "Сначала заполните реквизиты для этого метода", variant: "destructive" }); return;
    }

    setRequesting(true);
    try {
      const newBalance = currentBalance - amount;
      const { error: balError } = await supabase.from("profiles").update({ balance: newBalance }).eq("user_id", user.id);
      if (balError) throw balError;

      const { error } = await supabase.from("payments").insert({
        user_id: user.id, amount, type: "withdrawal" as const, status: "pending" as const,
        description: `Вывод (${methodLabels[withdrawMethod]})`,
        payment_method: withdrawMethod,
      });
      if (error) throw error;

      await supabase.from("security_logs").insert({
        user_id: user.id, event: "withdrawal_request",
        details: `Сумма: ${amount} ₽, Метод: ${methodLabels[withdrawMethod]}`,
      });

      // Force refresh profile balance in auth context
      profile.balance = newBalance;

      toast({ title: "Запрос отправлен", description: "Средства заморожены до решения администратора" });
      setWithdrawAmount(""); setWithdrawMethod("");
      const { data } = await supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setTransactions(data || []);
      // Force re-render by updating a local state trigger
      setForceUpdate(prev => prev + 1);
    } catch (e: any) {
      toast({ title: "Ошибка", description: e.message, variant: "destructive" });
    } finally { setRequesting(false); }
  };

  const validateRequisite = (method: string, value: string): string | null => {
    const v = value.trim();
    if (!v) return null;
    switch (method) {
      case "card": {
        const digits = v.replace(/[\s\-]/g, "");
        if (!/^\d{13,19}$/.test(digits)) return "Номер карты должен содержать 13–19 цифр";
        return null;
      }
      case "sbp": {
        const phone = v.replace(/[\s\-\(\)]/g, "");
        if (!/^\+?[0-9]{10,15}$/.test(phone)) return "Введите корректный номер телефона";
        return null;
      }
      case "crypto": {
        if (v.length < 20 || v.length > 128) return "Адрес кошелька должен быть от 20 до 128 символов";
        if (!/^[a-zA-Z0-9\-_:\.]+$/.test(v)) return "Адрес содержит недопустимые символы";
        return null;
      }
      case "lolzteam": {
        if (v.length < 2 || v.length > 50) return "Ник должен быть от 2 до 50 символов";
        return null;
      }
      default: return null;
    }
  };

  const [reqErrors, setReqErrors] = useState<Record<string, string | null>>({});

  const saveRequisites = async () => {
    if (!user) return;
    const errors: Record<string, string | null> = {};
    let hasError = false;
    for (const method of Object.keys(reqValues)) {
      if (reqValues[method]) {
        const err = validateRequisite(method, reqValues[method]);
        errors[method] = err;
        if (err) hasError = true;
      }
    }
    setReqErrors(errors);
    if (hasError) { toast({ title: "Проверьте правильность данных", variant: "destructive" }); return; }
    try {
      for (const method of Object.keys(reqValues)) {
        if (reqValues[method]) {
          await supabase.from("user_requisites").upsert({
            user_id: user.id, method, details: reqValues[method].trim(),
          }, { onConflict: "user_id,method" });
        }
      }
      const { data } = await supabase.from("user_requisites").select("*").eq("user_id", user.id);
      setRequisites(data || []);
      setEditingRequisites(false);
      setReqErrors({});
      toast({ title: "Реквизиты сохранены" });
    } catch (e: any) {
      toast({ title: "Ошибка", description: e.message, variant: "destructive" });
    }
  };

  const totalIn = transactions.filter(t => t.type !== "withdrawal").reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = transactions.filter(t => t.type === "withdrawal" && t.status !== "rejected").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Выплаты</h1>
        <p className="text-sm text-muted-foreground">Управление выплатами и реквизитами</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: "Общий доход", value: `${totalIn.toLocaleString("ru-RU")} ₽`, icon: CreditCard, color: "text-primary" },
          { label: "Выведено", value: `${totalOut.toLocaleString("ru-RU")} ₽`, icon: ArrowUpRight, color: "text-accent" },
          { label: "На балансе", value: `${currentBalance.toLocaleString("ru-RU")} ₽`, icon: ArrowDownRight, color: "text-success" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <div className="text-2xl font-mono font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Requisites */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2"><Wallet className="h-4 w-4" /> Мои реквизиты</h3>
          <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs" onClick={() => setEditingRequisites(!editingRequisites)}>
            <Settings2 className="h-3.5 w-3.5 mr-1" /> {editingRequisites ? "Отмена" : "Настроить"}
          </Button>
        </div>
        {editingRequisites ? (
          <div className="space-y-3">
            {Object.entries(methodLabels).map(([key, label]) => (
              <div key={key}>
                <Label className="text-xs mb-1 block text-muted-foreground">{label}</Label>
                <Input value={reqValues[key] || ""} onChange={e => { setReqValues(prev => ({ ...prev, [key]: e.target.value })); setReqErrors(prev => ({ ...prev, [key]: null })); }}
                  placeholder={key === "card" ? "0000 0000 0000 0000" : key === "sbp" ? "+7 900 000 00 00" : key === "crypto" ? "Адрес кошелька (TRC20, ERC20...)" : "Ник LOLZTEAM"}
                  className={`rounded-xl ${reqErrors[key] ? "border-destructive" : ""}`} />
                {reqErrors[key] && <p className="text-xs text-destructive mt-1">{reqErrors[key]}</p>}
              </div>
            ))}
            <Button className="gradient-primary text-primary-foreground border-0 rounded-xl" onClick={saveRequisites}>Сохранить</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {Object.entries(methodLabels).map(([key, label]) => {
              const req = requisites.find((r: any) => r.method === key);
              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground font-mono">{req?.details || "—"}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Withdraw */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h3 className="font-display font-semibold text-sm mb-3">Запросить вывод</h3>
        <div className="flex flex-wrap gap-3">
          <Input type="number" placeholder="Сумма" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="max-w-[160px] rounded-xl" />
          <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
            <SelectTrigger className="w-[160px] rounded-xl"><SelectValue placeholder="Метод" /></SelectTrigger>
            <SelectContent>
              {Object.entries(methodLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="gradient-primary text-primary-foreground border-0 rounded-xl" onClick={handleWithdrawRequest} disabled={requesting}>
            {requesting ? "Отправка..." : "Запросить"}
          </Button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-semibold text-sm mb-4">Транзакции</h3>
        {loading ? <p className="text-muted-foreground text-sm">Загрузка...</p> : transactions.length === 0 ? <p className="text-muted-foreground text-sm">Нет транзакций</p> : (
          <div className="space-y-1">
            {transactions.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type !== "withdrawal" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {tx.type !== "withdrawal" ? <ArrowDownRight className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-destructive" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{tx.description || (tx.type === "withdrawal" ? "Вывод" : tx.type === "reward" ? "Награда" : "Реф. бонус")}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString("ru-RU")}
                      {tx.payment_method && ` · ${methodLabels[tx.payment_method] || tx.payment_method}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-mono font-semibold ${tx.type !== "withdrawal" ? "text-success" : "text-destructive"}`}>
                    {tx.type !== "withdrawal" ? "+" : "-"}{Number(tx.amount).toLocaleString("ru-RU")} ₽
                  </span>
                  <Badge variant={tx.status === "completed" || tx.status === "approved" ? "default" : "outline"} className="text-[11px]">
                    {tx.status === "completed" || tx.status === "approved" ? "Завершено" : tx.status === "pending" ? "Ожидание" : "Отклонено"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Payments;
