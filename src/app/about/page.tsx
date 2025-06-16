
import Image from 'next/image';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import PageTitle from '@/components/ui/page-title';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageHint: string;
  instagramUrl?: string;
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Sensuki', role: 'Founder/Lead Developer', imageUrl: '/about image/sensuki.jpg', imageHint: 'portrait developer', instagramUrl: 'https://www.instagram.com/thesnowmanstudio/' },
  { id: '2', name: 'Varun', role: 'Art Director', imageUrl: '/about image/varun.jpg', imageHint: 'portrait artist', instagramUrl: 'https://www.instagram.com/thesnowmanstudio/' },
  { id: '3', name: 'Vinayak', role: 'Co-founder/3d Artst', imageUrl: '/about image/vinayak.jpg', imageHint: 'portrait developer', instagramUrl: 'https://www.instagram.com/thesnowmanstudio/' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40 relative"> {/* Added relative for GIF positioning */}
      <PageTitle title="About Snowman Studio" className="text-center text-primary" />

      <section className="mb-16 md:mb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="relative h-[350px] md:h-[500px] order-last md:order-first">
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-lg overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-in-out">
                <Image src="/about image/party.jpg" data-ai-hint="abstract colorful" alt="Team collaborating in the office" fill style={{objectFit:"cover"}} />
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-in-out border-4 border-snow-white">
                <Image src="/about image/cutie.jpg" data-ai-hint="party celebration" alt="Close-up of game development software" fill style={{objectFit:"cover"}} />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Story</h2>
            <p className="text-lg text-foreground mb-4 leading-relaxed">
              We’re a small team of students with a monstrous dream: To become India’s most unhinged game studio—crafting psychological nightmares that stick to your spine long after you’ve quit playing.
            </p>
            
            <h3 className="font-headline text-xl font-semibold mt-6 mb-2 text-primary">🔪 Our Madness We fuse:</h3>
            <ul className="list-disc list-inside space-y-1 text-lg text-foreground mb-4 leading-relaxed">
              <li>Brain-melting horror stories (think Silent Hill meets Indian folklore).</li>
              <li>Gameplay that punishes—then rewards (sweaty palms guaranteed).</li>
              <li>Experimental mechanics (ever fought a monster through a VHS tape glitch?).</li>
            </ul>

            <p className="text-lg text-foreground mb-4 leading-relaxed">
              We’re few sleep-deprived students by day, cult leaders of horror by night. (Yes, we survive on chai and pixel art.)
            </p>

            <h3 className="font-headline text-xl font-semibold mt-6 mb-2 text-primary">📜 Our Promise</h3>
            <ul className="list-disc list-inside space-y-1 text-lg text-foreground leading-relaxed">
              <li>No cheap jumpscares—only slow-burn dread.</li>
              <li>Games so immersive, you’ll check under your bed after.</li>
              <li>Democratizing horror: Sharing free assets, dev logs, and the screams we collect.</li>
            </ul>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background rounded-lg">
        <PageTitle title="Meet the Team" className="text-center" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <AnimateOnScroll
              key={member.id}
              animationClass="animate-slide-up-fade-in"
              delay={`delay-${index * 100}ms`}
              className="text-center p-4"
            >
              <div className="relative w-36 h-36 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden shadow-lg mb-4 transition-transform duration-300 ease-out hover:scale-110 border-4 border-primary">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  data-ai-hint={member.imageHint}
                  fill
                  style={{objectFit:"cover"}}
                  sizes="(max-width: 768px) 180px, 200px"
                />
              </div>
              {member.instagramUrl ? (
                <Link href={member.instagramUrl} target="_blank" rel="noopener noreferrer" passHref>
                  <h3 
                    className={cn(
                      "font-headline text-xl font-semibold text-foreground hover:text-primary hover:text-shadow-glow-primary transition-all duration-150 ease-out",
                      "cursor-pointer"
                    )}
                  >
                    {member.name}
                  </h3>
                </Link>
              ) : (
                <h3 className="font-headline text-xl font-semibold text-foreground">{member.name}</h3>
              )}
              <p className="text-primary font-medium">{member.role}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Glitchy Snowman GIF Placeholder */}
      <div className="fixed bottom-4 right-4 w-20 h-20 md:w-24 md:h-24 z-50 opacity-80 hover:opacity-100 transition-opacity">
        <Image
          src="https://placehold.co/100x100.png/0A0A0A/FF0000?text=GIF" 
          alt="Glitchy Snowman GIF" 
          data-ai-hint="snowman glitch"
          width={100} 
          height={100} 
          className="rounded-md"
        />
      </div>
    </div>
  );
}
