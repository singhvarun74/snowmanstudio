"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link'; // If news items link to individual pages
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import PageTitle from '@/components/ui/page-title';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  imageHint?: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch('/data/news.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewsItems(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch news:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
      <PageTitle title="Latest News" className="text-center" />
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col h-full overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">Error loading news: {error}</div>
      )}

      {!loading && !error && newsItems.length === 0 && (
        <p className="text-center text-lg text-muted-foreground">No news items available at the moment. Check back soon!</p>
      )}

      {!loading && !error && newsItems.length > 0 && (
         <div 
          className="gap-8"
          style={{ columnCount: 1, md: { columnCount: 2 }, lg: { columnCount: 3 } } as React.CSSProperties}
        >
           {newsItems.map((item, index) => (
            <AnimateOnScroll
              key={item.id}
              animationClass="animate-slide-up-fade-in"
              delay={`delay-${index * 100}ms`}
              className="mb-8 break-inside-avoid" // break-inside-avoid for masonry effect with CSS columns
            >
              <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video relative w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      data-ai-hint={item.imageHint || "news article"}
                      fill
                      style={{objectFit:"cover"}}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="font-headline text-xl mb-2 line-clamp-2">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{item.excerpt}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="link" className="p-0 text-primary hover:text-accent">
                    Read More <span aria-hidden="true" className="ml-1">&rarr;</span> 
                  </Button>
                </CardFooter>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}
