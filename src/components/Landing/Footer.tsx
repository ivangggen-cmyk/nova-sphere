import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-12 bg-foreground text-primary-foreground/60">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="text-xl font-bold text-primary-foreground mb-3">
            <span className="gradient-text">Atlantic</span>
          </div>
          <p className="text-sm">Платформа для онлайн-заработка нового поколения</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 text-sm">Платформа</h4>
          <div className="space-y-2 text-sm">
            <a href="#how" className="block hover:text-primary-foreground transition-colors">Как это работает</a>
            <a href="#benefits" className="block hover:text-primary-foreground transition-colors">Преимущества</a>
            <a href="#faq" className="block hover:text-primary-foreground transition-colors">FAQ</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 text-sm">Поддержка</h4>
          <div className="space-y-2 text-sm">
            <span className="block">help@atlantic.ru</span>
            <span className="block">Telegram: @atlantic</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-3 text-sm">Документы</h4>
          <div className="space-y-2 text-sm">
            <span className="block">Политика конфиденциальности</span>
            <span className="block">Пользовательское соглашение</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs">
        © 2026 Atlantic. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
