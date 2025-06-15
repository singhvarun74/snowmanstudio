
import FeaturedGames from '@/components/sections/home/featured-games';
import PageTitle from '@/components/ui/page-title';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40"> {/* Added padding top for sticky header */}
      <PageTitle title="Our Games" className="text-center" />
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-100ms">
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Dive into the diverse worlds crafted by Snowman Studio. Each game is a unique adventure waiting to be explored. Click on any game to learn more and find out where to play.
        </p>
      </AnimateOnScroll>
      <FeaturedGames showAllGames={true} /> {/* Pass showAllGames prop */}
      {/* Future enhancements: Filters, search, pagination */}
    </div>
  );
}
