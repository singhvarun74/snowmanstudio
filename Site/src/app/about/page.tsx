import Image from 'next/image';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import PageTitle from '@/components/ui/page-title';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageHint: string;
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Snow', role: 'Lead Developer', imageUrl: 'https://placehold.co/200x200.png', imageHint: 'portrait developer' },
  { id: '2', name: 'Jamie Frost', role: 'Art Director', imageUrl: 'https://placehold.co/200x200.png', imageHint: 'portrait artist' },
  { id: '3', name: 'Casey Blizzard', role: 'Game Designer', imageUrl: 'https://placehold.co/200x200.png', imageHint: 'portrait designer' },
  { id: '4', name: 'Morgan Hail', role: 'Community Manager', imageUrl: 'https://placehold.co/200x200.png', imageHint: 'portrait manager' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
      <PageTitle title="About Snowman Studio" className="text-center text-primary" />

      <section className="mb-16 md:mb-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="relative h-[350px] md:h-[500px] order-last md:order-first">
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-lg overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-in-out">
                <Image src="https://placehold.co/450x350.png" data-ai-hint="team working office" alt="Team collaborating in the office" fill style={{objectFit:"cover"}} />
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-lg overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 ease-in-out border-4 border-snow-white">
                <Image src="https://placehold.co/350x300.png" data-ai-hint="game development screen" alt="Close-up of game development software" fill style={{objectFit:"cover"}} />
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Story</h2>
            <p className="text-lg text-foreground mb-4 leading-relaxed">
              Founded on the principle of "Passion Meets Play," Snowman Studio is an independent game development studio dedicated to crafting immersive and innovative gaming experiences. We believe that games are a powerful medium for storytelling, creativity, and connection.
            </p>
            <p className="text-lg text-foreground mb-4 leading-relaxed">
              Our team is a diverse collective of talented developers, artists, designers, and writers who share a common goal: to push the boundaries of interactive entertainment and create worlds that players will love to explore.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              From thrilling adventures to thought-provoking narratives, we strive to deliver high-quality games that resonate with players long after they've put down the controller.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background rounded-lg">
        <PageTitle title="Meet the Team" className="text-center" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
                />
              </div>
              <h3 className="font-headline text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
}
