import MembersHero from "@/components/members/MembersHero";
import RangeServices from "@/components/members/RangeServices";
import SystemIntegration from "@/components/members/SystemIntegration";
import Membership from "@/components/members/membership";
import Professional from "@/components/members/professional";
import PreCase from "@/components/members/PreCase";
import Testimonials from "@/components/members/testimonials";

export default function Page() {
  return (
    <>
      <MembersHero />
      <Professional />
      <RangeServices />
      <Membership />
      <SystemIntegration />
      <PreCase />
      <Testimonials />
    </>
  );
}