import { motion } from "framer-motion";

const partners = [
  "Сбербанк", "Tinkoff", "Яндекс", "VK", "Ozon", "МТС"
];

const Partners = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mb-10"
      >
        Нам доверяют ведущие компании
      </motion.p>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {partners.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-xl md:text-2xl font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-default"
          >
            {p}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Partners;
