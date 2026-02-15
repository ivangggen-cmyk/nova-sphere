import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Users, Globe, Lock, Smartphone, Clock, Award } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Моментальные выплаты", desc: "Получайте средства на карту или кошелёк сразу после одобрения задания. Без ожидания." },
  { icon: Shield, title: "Надёжные партнёры", desc: "Все заказчики проходят верификацию. Оплата гарантирована платформой." },
  { icon: BarChart3, title: "Прозрачная статистика", desc: "Детальная аналитика доходов, эффективности и рейтинга в реальном времени." },
  { icon: Users, title: "Реферальная программа", desc: "3 уровня глубины — приглашайте друзей и получайте пассивный доход." },
  { icon: Globe, title: "Работа отовсюду", desc: "Полностью удалённый формат. Всё, что нужно — доступ в интернет." },
  { icon: Lock, title: "Безопасность", desc: "Двухфакторная аутентификация, шифрование и антифрод-система." },
  { icon: Smartphone, title: "Мобильная версия", desc: "Удобный интерфейс адаптирован под все устройства и экраны." },
  { icon: Clock, title: "Гибкий график", desc: "Работайте когда удобно — без расписания, нормативов и дедлайнов." },
  { icon: Award, title: "Система достижений", desc: "24 достижения с наградами. Растите в уровнях и зарабатывайте больше." },
];

const Benefits = () => (
  <section id="benefits" className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-muted/30" />
    <div className="absolute inset-0 gradient-mesh opacity-20" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="inline-block text-xs font-semibold text-primary tracking-wider uppercase mb-4 px-4 py-1.5 rounded-full bg-primary/10">
          Преимущества
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 text-balance">
          Всё для <span className="gradient-text">комфортного заработка</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Платформа, которой доверяют тысячи исполнителей по всей стране
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-elevated transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
