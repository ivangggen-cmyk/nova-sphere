import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const steps = [
  { id: 1, title: "Личные данные", desc: "ФИО и дата рождения", status: "done" },
  { id: 2, title: "Паспортные данные", desc: "Серия, номер, кем выдан", status: "done" },
  { id: 3, title: "Фото документа", desc: "Скан или фото паспорта", status: "pending" },
  { id: 4, title: "Селфи с документом", desc: "Фото с паспортом в руках", status: "not_started" },
];

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
  done: { label: "Подтверждено", cls: "bg-accent/10 text-accent", icon: CheckCircle2 },
  pending: { label: "На проверке", cls: "bg-amber-100 text-amber-700", icon: Clock },
  not_started: { label: "Не заполнено", cls: "bg-muted text-muted-foreground", icon: AlertCircle },
};

const Verification = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Верификация</h1>
        <p className="text-sm text-muted-foreground">Подтвердите личность для доступа к заданиям с высоким вознаграждением</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Статус верификации</h3>
            <p className="text-sm text-muted-foreground">Частично подтверждён — 2 из 4 шагов</p>
          </div>
          <Badge className="ml-auto bg-amber-100 text-amber-700 border-0">В процессе</Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="h-2 rounded-full gradient-accent" style={{ width: "50%" }} />
        </div>
      </motion.div>

      <div className="space-y-4">
        {steps.map((step, i) => {
          const st = statusMap[step.status];
          const Icon = st.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm text-primary-foreground font-bold">
                    {step.id}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>
                  <Icon className="h-3 w-3" /> {st.label}
                </span>
              </div>

              {step.status === "not_started" && (
                <div className="mt-4 border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">Загрузите файл для проверки</p>
                  <Button variant="outline" size="sm">Выбрать файл</Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Verification;
