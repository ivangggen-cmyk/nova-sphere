import { motion } from "framer-motion";

const partners = [
  "Сбербанк", "Tinkoff", "Яндекс", "VK", "Ozon", "МТС", "Wildberries", "Avito"
];

const Partners = () => (
  <section className="py-20 bg-background relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh opacity-30" />
    <div className="container mx-auto px-4 relative">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-12"
      >
        Нам доверяют ведущие компании
      </motion.p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
        {partners.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.1, y: -2 }}
            className="text-xl md:text-2xl font-display font-bold text-muted-foreground/20 hover:text-primary/40 transition-all duration-500 cursor-default select-none"
          >
            {p}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Partners;
