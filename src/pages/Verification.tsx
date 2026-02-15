import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const Verification = () => {
  const { profile } = useAuth();
  const isVerified = profile?.is_verified || false;

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
            <p className="text-sm text-muted-foreground">
              {isVerified ? "Ваш аккаунт верифицирован" : "Ваш аккаунт ожидает верификации администратором"}
            </p>
          </div>
          <Badge className={`ml-auto border-0 ${isVerified ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-700"}`}>
            {isVerified ? "Верифицирован" : "Не верифицирован"}
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="h-2 rounded-full gradient-accent transition-all duration-500" style={{ width: isVerified ? "100%" : "0%" }} />
        </div>
      </motion.div>

      {isVerified ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Аккаунт верифицирован</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Вам доступны все задания платформы, включая задания с высоким вознаграждением.
          </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 text-center">
          <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Ожидание верификации</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Администратор может верифицировать ваш аккаунт досрочно. Выполняйте задания и повышайте рейтинг для ускорения процесса.
          </p>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Verification;
