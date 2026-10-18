import Hero from "@/components/hero/Hero";
import FlavorsSection from "@/components/sections/FlavorsSection";
import StorySection from "@/components/sections/StorySection";
import CTASection from "@/components/sections/CTASection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-black">
      <Hero />
      <FlavorsSection />
      <StorySection />
      <CTASection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
