'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Mail, Copy } from 'lucide-react';
import { Header } from '@/components/header';
import type { StorefrontData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function StorefrontContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<StorefrontData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = JSON.parse(atob(dataParam));
        setData(decodedData);
      } catch (e) {
        console.error('Failed to parse storefront data:', e);
        setError('Could not load storefront data. It might be corrupted.');
      }
    }
  }, [searchParams]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: `${type} has been copied.`,
    });
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-headline text-destructive">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <Skeleton className="h-[50vh] w-full rounded-xl" />
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-40 w-full" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
      </div>
    );
  }

  const { productName, marketingNarrative, enhancedImage, engagementInsights } = data;
  const storefrontUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      storefrontUrl
    )}&text=${encodeURIComponent(marketingNarrative.socialMediaContent)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      storefrontUrl
    )}`,
    email: `mailto:?subject=Check out this product: ${encodeURIComponent(
      productName
    )}&body=${encodeURIComponent(
      marketingNarrative.productDescription
    )}\n\nSee it here: ${encodeURIComponent(storefrontUrl)}`,
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12">
      <section className="relative w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={enhancedImage.enhancedPhotoDataUri}
          alt={`Enhanced image of ${productName}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-headline text-white text-center drop-shadow-lg p-4">
            {productName}
          </h1>
        </div>
      </section>

      <main className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">A Short Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed font-body">{marketingNarrative.shortStory}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{marketingNarrative.productDescription}</p>
            </CardContent>
          </Card>
        </div>

        <aside className="md:col-span-2 space-y-8">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Engagement Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-muted-foreground">Predicted Score</span>
                        <span className="text-sm font-bold text-accent">{(engagementInsights.engagementScore * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={engagementInsights.engagementScore * 100} className="h-3" />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Suggested Styles:</h4>
                    <p className="text-sm text-muted-foreground">{engagementInsights.suggestedStyles}</p>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Share on Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm italic text-muted-foreground">{marketingNarrative.socialMediaContent}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(marketingNarrative.socialMediaContent, "Social media post")}>
                  <Copy className="h-4 w-4 mr-2"/> Copy Text
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Share this Page</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon"><a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a></Button>
                <Button asChild variant="outline" size="icon"><a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /></a></Button>
                <Button asChild variant="outline" size="icon"><a href={shareLinks.email}><Mail className="h-4 w-4" /></a></Button>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(storefrontUrl, "URL")}><Copy className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

export default function StorefrontPage() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="text-center p-20">Loading Storefront...</div>}>
                <StorefrontContent />
            </Suspense>
        </>
    )
}
