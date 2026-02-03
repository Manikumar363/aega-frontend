import UniversityHero from "@/components/university/universityHero";
import AgentLearning from "@/components/university/agentLearning";
import TrustCompliance from "@/components/university/TrustCompliance";
import Compliance from "@/components/university/compliance";
import Services from "@/components/university/services";
import Testimonials from "@/components/university/testimonials";


export default function university(){
    return (
        <>
        <UniversityHero />
        <Compliance />
        <Services />
        <AgentLearning />
        <TrustCompliance />
        <Testimonials />
        </>
    )
}