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
    desc: "Просмотрите доступные задания, отфильтруйте по категории и уровню.",
  },
  {
    icon: CheckCircle2,
    title: "Выполните и отправьте",
    desc: "Следуйте инструкции, прикрепите результат и отправьте на проверку.",
  },
  {
    icon: Wallet,
    title: "Получите оплату",
    desc: "После одобрения средства зачисляются на ваш баланс мгновенно.",
  },
];

const HowItWorks = () => (
  <section id="how" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Четыре простых шага до первого заработка</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
            )}
            <div className="relative z-10 w-16 h-16 mx-auto rounded-2xl gradient-accent flex items-center justify-center mb-4 shadow-glass">
              <step.icon className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="text-xs font-semibold text-accent mb-2">Шаг {i + 1}</div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
