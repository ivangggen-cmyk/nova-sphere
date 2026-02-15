import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Users, Globe, Lock } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Моментальные выплаты", desc: "Получайте средства на карту или кошелёк сразу после одобрения задания." },
  { icon: Shield, title: "Надёжные партнёры", desc: "Все заказчики проходят верификацию. Оплата гарантирована." },
  { icon: BarChart3, title: "Прозрачная статистика", desc: "Детальная аналитика доходов, эффективности и рейтинга в реальном времени." },
  { icon: Users, title: "Реферальная программа", desc: "Приглашайте друзей и получайте % от их заработка на нескольких уровнях." },
  { icon: Globe, title: "Работа отовсюду", desc: "Полностью удалённый формат. Работайте из любой точки мира." },
  { icon: Lock, title: "Безопасность", desc: "Двухфакторная аутентификация, шифрование данных и антифрод-система." },
];

const Benefits = () => (
  <section id="benefits" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Платформа, которой доверяют тысячи исполнителей</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover-lift"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <b.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
