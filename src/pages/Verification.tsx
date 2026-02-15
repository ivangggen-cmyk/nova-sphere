import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const Verification = () => {
  const { profile } = useAuth();
  const isVerified = profile?.is_verified || false;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Верификация</h1>
        <p className="text-sm text-muted-foreground">Подтвердите личность для доступа к заданиям с высоким вознаграждением</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Статус верификации</h3>
            <p className="text-sm text-muted-foreground">
              {isVerified ? "Ваш аккаунт верифицирован" : "Ожидает верификации администратором"}
            </p>
          </div>
          <Badge className={`ml-auto border-0 ${isVerified ? "bg-success/10 text-success" : "bg-accent/10 text-accent"}`}>
            {isVerified ? "Верифицирован" : "Не верифицирован"}
          </Badge>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isVerified ? "100%" : "0%" }}
            transition={{ duration: 0.8 }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-8 text-center">
        {isVerified ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">Аккаунт верифицирован</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Вам доступны все задания платформы, включая задания с высоким вознаграждением.
            </p>
          </>
        ) : (
          <>
            <Clock className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">Ожидание верификации</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Администратор может верифицировать ваш аккаунт досрочно. Выполняйте задания и повышайте рейтинг.
            </p>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Verification;
