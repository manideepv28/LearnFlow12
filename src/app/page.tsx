import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookMarked, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <section className="pt-16 pb-8 md:pt-24 md:pb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Welcome to LearnFlow
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Unlock your potential with our diverse range of online courses. Learn at your own pace, anytime, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/courses">
              Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/auth/signup">
              Get Started
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl grid md:grid-cols-3 gap-8">
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-6 w-6 text-accent" />
              Expert-Led Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access high-quality content curated by industry professionals and experienced instructors.
            </p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M12 12h-1"/><path d="M12 8h-1"/><path d="M12 16h-1"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
              Flexible Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Learn on your schedule with 24/7 access to video lessons and materials on any device.
            </p>
          </CardContent>
        </Card>
        <Card className="text-left shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-accent" />
              Track Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay motivated by tracking your course completion and quiz scores on your personal dashboard.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="w-full py-12">
          <Card className="overflow-hidden shadow-xl md:grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 text-left">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of learners and take the next step in your personal or professional development journey.
              </p>
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/courses">
                  View All Courses
                </Link>
              </Button>
            </div>
            <div className="h-64 md:h-full relative">
                 <Image
                    src="https://placehold.co/800x600.png"
                    alt="Learning illustration"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="education learning"
                  />
            </div>
          </Card>
      </section>
    </div>
  );
}
