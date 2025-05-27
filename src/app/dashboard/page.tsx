"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, LayoutDashboard, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { enrolledCourses, getCourseProgress, isLoading: courseLoading } = useCourseData();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || courseLoading) {
    return (
       <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
         <Skeleton className="h-10 w-1/4 mx-auto" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Or a message, but redirect should handle it
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
          My Dashboard
        </h1>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">You haven&apos;t enrolled in any courses yet.</p>
              <Button asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map(course => {
              const progress = getCourseProgress(course.id);
              return (
                <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                       <Link href={`/courses/${course.id}`}>{course.title}</Link>
                    </CardTitle>
                    <CardDescription>By {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Progress</span>
                        <span className="font-semibold text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} aria-label={`${progress}% complete`} />
                      {progress === 100 && (
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Course Completed!
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button asChild className="w-full">
                        <Link href={`/courses/${course.id}`}>
                            {progress === 100 ? "Review Course" : "Continue Learning"}
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/4 mb-1" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
