import { motion } from "framer-motion";
import { UserPlus, Search, CheckCircle2, Wallet } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Регистрация",
    desc: "Создайте аккаунт за 2 минуты. Только email и базовая информация.",
  },
  {
    icon: Search,
    title: "Выберите задание",
    desc: "Просмотрите каталог заданий, фильтруйте по категориям и награде.",
  },
  {
    icon: CheckCircle2,
    title: "Выполните",
    desc: "Следуйте инструкции, прикрепите результат и отправьте на проверку.",
  },
  {
    icon: Wallet,
    title: "Получите оплату",
    desc: "После одобрения средства мгновенно зачисляются на ваш баланс.",
  },
];

const HowItWorks = () => (
  <section id="how" className="py-28 bg-background relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh opacity-40" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="inline-block text-xs font-semibold text-primary tracking-wider uppercase mb-4 px-4 py-1.5 rounded-full bg-primary/10">
          Как это работает
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 text-balance">
          Четыре шага до{" "}
          <span className="gradient-text">первого заработка</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Простой и прозрачный процесс от регистрации до получения денег
        </p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative group"
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
            )}

            <div className="relative text-center">
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground z-10">
                {i + 1}
              </div>

              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                className="w-20 h-20 mx-auto rounded-3xl bg-card border border-border flex items-center justify-center mb-5 shadow-glass group-hover:shadow-glow transition-shadow duration-500"
              >
                <step.icon className="h-9 w-9 text-primary" />
              </motion.div>

              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
