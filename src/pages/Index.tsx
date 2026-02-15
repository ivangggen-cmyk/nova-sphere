import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import Benefits from "@/components/Landing/Benefits";
import Partners from "@/components/Landing/Partners";
import FAQ from "@/components/Landing/FAQ";
import Footer from "@/components/Landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Benefits />
    <Partners />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
