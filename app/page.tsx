import { CTASection } from "@/components/home/CTASection";
import { FeaturesSection } from "@/components/home/FeatureSection";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

export default function page() {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </>
  );
}
