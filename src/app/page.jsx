import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import TopWorkers from "@/components/home/TopWorkers";
import FeaturedTasks from "@/components/home/FeaturedTasks";
import TrustSection from "@/components/home/TrustSection";
import EarningsCalculator from "@/components/home/EarningsCalculator";
import Testimonial from "@/components/home/Testimonial";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-11/12 mx-auto bg-background">
      <Navbar />

      <main>
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <TopWorkers />
        <FeaturedTasks />
        <TrustSection />
        <EarningsCalculator />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
