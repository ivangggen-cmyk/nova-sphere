import { motion } from "framer-motion";
import { CreditCard, ArrowDownRight, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { id: 1, type: "in", title: "Задание «Регистрация FinApp»", amount: "+850 ₽", date: "14 фев 2026", status: "completed" },
  { id: 2, type: "out", title: "Вывод на карту *4523", amount: "-5 000 ₽", date: "12 фев 2026", status: "completed" },
  { id: 3, type: "in", title: "Реферальный бонус", amount: "+420 ₽", date: "10 фев 2026", status: "completed" },
  { id: 4, type: "in", title: "Задание «Обзор BankX»", amount: "+1 200 ₽", date: "8 фев 2026", status: "pending" },
  { id: 5, type: "out", title: "Вывод на кошелёк", amount: "-3 000 ₽", date: "5 фев 2026", status: "completed" },
  { id: 6, type: "in", title: "Задание «Маркетинговый опрос»", amount: "+300 ₽", date: "3 фев 2026", status: "completed" },
];

const Payments = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">История выплат</h1>
      <p className="text-sm text-muted-foreground">Все транзакции вашего аккаунта</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      {[
        { label: "Общий доход", value: "48 200 ₽", icon: CreditCard },
        { label: "Выведено", value: "23 000 ₽", icon: ArrowUpRight },
        { label: "На балансе", value: "24 580 ₽", icon: ArrowDownRight },
      ].map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </motion.div>
      ))}
    </div>

    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold mb-4">Транзакции</h3>
      <div className="space-y-2">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === "in" ? "bg-accent/10" : "bg-destructive/10"}`}>
                {tx.type === "in" ? (
                  <ArrowDownRight className="h-4 w-4 text-accent" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{tx.title}</div>
                <div className="text-xs text-muted-foreground">{tx.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${tx.type === "in" ? "text-accent" : "text-destructive"}`}>
                {tx.amount}
              </span>
              <Badge variant={tx.status === "completed" ? "default" : "outline"} className="text-xs">
                {tx.status === "completed" ? "Завершено" : "В обработке"}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Payments;
