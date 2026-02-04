import NewsHero from "@/components/news/newsHero";
import BlogsHero from "@/components/news/blogsHero";
import NewsIntro from "@/components/news/newsIntro";
import EventsHero from "@/components/news/eventsHero";

export default function Page() {
  return (
    <>
      <NewsHero />
      <BlogsHero />
      <NewsIntro/>
      <EventsHero/>
    </>
  );
}