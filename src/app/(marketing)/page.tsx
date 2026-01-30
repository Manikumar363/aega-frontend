import Hero from "@/components/home/Hero";
import WhoAreWe from "@/components/home/WhoAreWe";
import WhatWeDo from "@/components/home/WhatWeDo";
import Statistics from "@/components/home/Statistics";
import Impact from "@/components/home/Impact";
import Topics from "@/components/home/Topics";
import Reviews from "@/components/home/Reviews";
import { WhyAEGA } from "@/components/home/WhyAEGA";
import Leadership from "@/components/about/Leadership";
import Commitment from "@/components/home/Commitment";

export default function Home() {
  return (
    <main className="bg-[#03091F] min-h-screen text-white selection:bg-[#F58A07] selection:text-white">
      <Hero />
      <WhoAreWe />
      <Statistics />
      <WhyAEGA />
      <Commitment />
      {/* <WhatWeDo /> 
      <ServiceWidgets />
      
      <Reviews />
      <Topics />*/}
      <Impact />
      <Leadership />
    </main>
  );
}