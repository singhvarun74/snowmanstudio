
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import FeaturedGames from '@/components/sections/home/featured-games';
import HeroGamesCarousel from '@/components/sections/home/hero-games-carousel';
import PageTitle from '@/components/ui/page-title';
import { Instagram, Youtube } from 'lucide-react';

const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.625 3.008c-.897-.403-1.85-.72-2.828-.948-.075-.023-.153-.023-.225.002-.504.138-.965.345-1.383.613-.004.004-.006.006-.01.01l-.018.016c-1.302.986-2.43 2.23-3.34 3.694-1.308.204-2.636.204-3.944 0-.91-1.464-2.038-2.708-3.34-3.694l-.018-.016-.01-.01c-.418-.268-.88-.475-1.383-.613-.075-.023-.153-.023-.225.002-.978.228-1.93.545-2.828.948-.092.043-.165.11-.21.2-.048.09-.055.198-.02.292.54 1.548 1.17 3.482 1.682 5.772-.004.023-.004.047.002.068 0 .012.004.023.004.035-.15.652-.264 1.247-.332 1.78-.015.112.01.22.07.308.113.168.31.26.502.235.96-.125 1.845-.38 2.62-.73.014-.006.027-.012.04-.02-.075-.067-.14-.142-.2-.223-.35-.41-.64-.87-.85-1.38-.002-.004-.002-.006-.002-.01 0-.04.01-.07.03-.1.394-.63.93-1.21 1.57-1.72.93-.74 1.99-1.29 3.14-1.6.17-.04.34-.04.51 0 .01.002.02.004.03.006.09.02.18.04.27.06.11.03.22.05.33.08.12.03.24.06.36.09.14.04.28.07.42.11.09.03.18.05.27.08.02.004.03.01.05.01.06.02.12.03.18.05.01.002.02.004.02.006.11.03.22.06.34.09.06.01.11.03.17.04.09.02.18.04.26.06.1.03.19.05.29.07.02.004.03.01.05.01.06.02.11.03.17.05.06.01.12.03.18.04.05.01.09.02.14.03.06.02.12.03.18.04.05.01.09.02.14.03.02.003.04.006.05.008l.05.02c1.15.31 2.21.86 3.14 1.6.64.51 1.176 1.09 1.57 1.72.02.03.03.06.03.1 0 .004 0 .006-.002.01-.21.51-.5.97-.85 1.38-.06.08-.125.156-.2.223.013.008.026.014.04.02.775.35 1.66.605 2.62.73.192.024.39-.067.502-.235.06-.088.085-.196.07-.308-.067-.533-.182-1.128-.332-1.78 0-.012.004-.023.004-.035a.2.2 0 0 0 .002-.068c.512-2.29 1.142-4.224 1.682-5.772.036-.094.028-.202-.02-.292-.045-.09-.118-.157-.21-.2zm-8.43 8.566c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628zm-5.336 0c-.872 0-1.58-.726-1.58-1.628s.708-1.628 1.58-1.628c.872 0 1.58.726 1.58 1.628s-.708 1.628-1.58 1.628z"/>
  </svg>
);

export default function HomePage() {
  const whoWeAreText = `We're Snowman Studio - where horror gets a PhD in messing with your head.

Our games feature:
- Stories so twisted they make M. Night Shyamalan say "Damn, that's wild"
- Gameplay mechanics that break the 4th wall (and possibly your sanity)
- Horror that lingers like your ex's Netflix password

We're the mad scientists of Indian gaming - equal parts creative genius and sleep-deprived chaos. Our secret sauce? Taking familiar fears and flipping them into something you've never experienced before.

Warning: Side effects may include checking under your bed, distrust of snowmen, and an irrational fear of your own gaming PC.

Join the madness`;

  return (
    <>
      {/* Hero Games Carousel Section */}
      <HeroGamesCarousel />

      {/* Featured Games Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <PageTitle title="More Games" className="text-center" />
          <FeaturedGames />
        </div>
      </section>

      {/* Brief About Us Snippet */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <PageTitle title="Who We Are" className="text-primary" />
          <AnimateOnScroll>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed whitespace-pre-line">
              {whoWeAreText}
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 ease-out hover:scale-105 shadow-md">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Latest Buzz Section - Updated */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <PageTitle title="Latest Buzz" />
           <AnimateOnScroll>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay connected with us on social media for the latest updates, behind-the-scenes content, and community interactions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 hover:scale-105 transition-all duration-150 ease-out shadow-lg hover:shadow-xl">
                <Link href="https://www.instagram.com/thesnowmanstudio/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl">
                <Link href="https://www.youtube.com/@thesnowmanstudio" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe on YouTube
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl">
                <Link href="https://discord.gg/eUCKmk6GNt" target="_blank" rel="noopener noreferrer">
                  <DiscordIcon />
                  Join on Discord
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
