import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Сколько можно заработать?", a: "Зависит от количества и сложности выполненных заданий. Активные пользователи зарабатывают от 30 000 до 150 000 ₽ в месяц." },
  { q: "Как быстро приходят выплаты?", a: "После одобрения задания средства мгновенно зачисляются на баланс. Вывод на карту — в течение 1-3 рабочих дней." },
  { q: "Нужен ли опыт работы?", a: "Нет, у нас есть задания для любого уровня. Новичкам доступны обучающие задания с подробными инструкциями." },
  { q: "Как работает реферальная программа?", a: "Вы получаете персональную ссылку. За каждого приглашённого — процент от его заработка на 3 уровнях глубины." },
  { q: "Какие гарантии оплаты?", a: "Все заказчики вносят предоплату. Средства замораживаются на платформе и выплачиваются после проверки." },
  { q: "Есть ли ограничения по количеству заданий?", a: "Вы можете брать до 10 заданий одновременно. Лимит может быть увеличен при повышении уровня." },
];

const FAQ = () => (
  <section id="faq" className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-muted/30" />
    <div className="absolute inset-0 gradient-mesh opacity-20" />
    <div className="container mx-auto px-4 max-w-3xl relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block text-xs font-semibold text-primary tracking-wider uppercase mb-4 px-4 py-1.5 rounded-full bg-primary/10">
          FAQ
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
          Частые <span className="gradient-text">вопросы</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-2xl px-6 hover:shadow-elevated transition-shadow duration-500 data-[state=open]:shadow-elevated"
            >
              <AccordionTrigger className="text-left font-display font-medium hover:no-underline py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQ;
