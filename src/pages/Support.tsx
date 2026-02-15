import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Send, Mail, Phone, FileText, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const quickFaqs = [
  { q: "Как вывести деньги?", a: "Перейдите в раздел «История выплат» и нажмите «Вывести». Средства поступят на карту в течение 1-3 рабочих дней." },
  { q: "Почему задание отклонено?", a: "Проверьте комментарий модератора в уведомлениях. Часто причина — несоответствие критериям проверки." },
  { q: "Как повысить уровень?", a: "Выполняйте задания без отклонений. Каждые 10 успешных заданий повышают ваш уровень доступа." },
  { q: "Как работает реферальная программа?", a: "Вы получаете 10% от заработка рефералов 1-го уровня, 5% — 2-го, 2% — 3-го уровня." },
];

const Support = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    toast({ title: "Обращение отправлено!", description: "Мы ответим в течение 24 часов." });
    setSubject("");
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Поддержка</h1>
        <p className="text-sm text-muted-foreground">Мы поможем решить любой вопрос</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Частые вопросы</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {quickFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4 border-border">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-3">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-3">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Написать в поддержку</h3>
            <div className="space-y-4">
              <Input placeholder="Тема обращения" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea placeholder="Опишите вашу проблему или вопрос..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="resize-none" />
              <Button className="gradient-accent text-accent-foreground border-0" onClick={handleSubmit} disabled={!subject.trim() || !message.trim()}>
                <Send className="mr-2 h-4 w-4" /> Отправить
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Contact info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Контакты</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "support@atlantic.ru" },
                { icon: Phone, label: "Телефон", value: "+7 (800) 555-35-35" },
                { icon: MessageCircle, label: "Telegram", value: "@atlantic_support" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <c.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="text-sm font-medium">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Время ответа</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Чат: до 15 минут</div>
              <div>Email: до 24 часов</div>
              <div>Телефон: Пн-Пт 9:00-18:00</div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
