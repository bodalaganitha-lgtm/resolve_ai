import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import DashboardPreview from "../components/landing/DashboardPreview";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-[#07111F] text-white">
      <Navbar />

      <Hero />

      <Features />

      <HowItWorks />

      <DashboardPreview />

      <FAQ />

      <CTA />

      <Footer />
    </div>
  );
}

export default Landing;