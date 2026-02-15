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
  { q: "Как работает реферальная программа?", a: "Вы получаете персональную ссылку. За каждого приглашённого — % от его заработка на нескольких уровнях глубины." },
  { q: "Какие гарантии оплаты?", a: "Все заказчики вносят предоплату. Средства замораживаются на платформе и выплачиваются после проверки." },
];

const FAQ = () => (
  <section id="faq" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Частые вопросы</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-xl px-6 border-0">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
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
