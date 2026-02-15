import { Link } from "react-router-dom";
import AtlanticLogo from "@/components/AtlanticLogo";

const Footer = () => (
  <footer className="relative py-16 bg-foreground text-primary-foreground/60 overflow-hidden">
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 opacity-30" style={{
      background: "radial-gradient(ellipse at 20% 100%, hsl(168 60% 40% / 0.1), transparent 50%), radial-gradient(ellipse at 80% 0%, hsl(195 80% 46% / 0.05), transparent 50%)"
    }} />

    <div className="container mx-auto px-4 relative">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="mb-4">
            <AtlanticLogo size="md" dark />
          </div>
          <p className="text-sm leading-relaxed">Платформа для онлайн-заработка нового поколения. Безопасно, быстро, прозрачно.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4 text-sm tracking-wide">Платформа</h4>
          <div className="space-y-3 text-sm">
            <a href="#how" className="block hover:text-primary-foreground transition-colors duration-300">Как это работает</a>
            <a href="#benefits" className="block hover:text-primary-foreground transition-colors duration-300">Преимущества</a>
            <a href="#faq" className="block hover:text-primary-foreground transition-colors duration-300">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4 text-sm tracking-wide">Поддержка</h4>
          <div className="space-y-3 text-sm">
            <span className="block">help@atlantic.ru</span>
            <span className="block">Telegram: @atlantic_support</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-4 text-sm tracking-wide">Документы</h4>
          <div className="space-y-3 text-sm">
            <span className="block hover:text-primary-foreground cursor-pointer transition-colors duration-300">Политика конфиденциальности</span>
            <span className="block hover:text-primary-foreground cursor-pointer transition-colors duration-300">Пользовательское соглашение</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs">© 2026 Atlantic. Все права защищены.</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Все системы работают
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
