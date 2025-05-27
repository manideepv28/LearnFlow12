"use client";

import { useEffect, useMemo } from 'react';
import { useParams, useRouter }_ from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Lock, PlaySquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const router = useRouter();

  const { currentUser, isLoading: authLoading } = useAuth();
  const { 
    getCourseById, 
    isEnrolled, 
    completeLesson, 
    getLessonStatus,
    isLoading: courseDataLoading 
  } = useCourseData();

  const course = useMemo(() => getCourseById(courseId), [getCourseById, courseId]);
  const lesson = useMemo(() => course?.lessons.find(l => l.id === lessonId), [course, lessonId]);
  const enrolled = useMemo(() => isEnrolled(courseId), [isEnrolled, courseId]);
  const lessonStatus = useMemo(() => enrolled ? getLessonStatus(courseId, lessonId) : 'pending', [enrolled, getLessonStatus, courseId, lessonId]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push(`/auth/login?redirect=/courses/${courseId}/lessons/${lessonId}`);
    } else if (!authLoading && currentUser && !enrolled && course?.lessons.findIndex(l => l.id === lessonId) !== 0) {
      // If not enrolled and not the first lesson, redirect or show error
      toast({ title: "Enrollment Required", description: "Please enroll in the course to access this lesson.", variant: "destructive" });
      router.push(`/courses/${courseId}`);
    }
  }, [currentUser, authLoading, router, enrolled, courseId, lessonId, course]);

  const lessonIndex = useMemo(() => course?.lessons.findIndex(l => l.id === lessonId) ?? -1, [course, lessonId]);
  const prevLesson = useMemo(() => lessonIndex > 0 ? course?.lessons[lessonIndex - 1] : null, [course, lessonIndex]);
  const nextLesson = useMemo(() => lessonIndex < (course?.lessons.length ?? 0) -1 ? course?.lessons[lessonIndex + 1] : null, [course, lessonIndex]);

  const handleCompleteLesson = async () => {
    if (!lesson || !enrolled) return;
    await completeLesson(courseId, lesson.id);
    toast({ title: "Lesson Completed!", description: `You've completed "${lesson.title}".` });
    if (nextLesson) {
      router.push(`/courses/${courseId}/lessons/${nextLesson.id}`);
    } else {
      router.push(`/courses/${courseId}`); // Go back to course page if it's the last lesson
    }
  };
  
  const isLoading = authLoading || courseDataLoading;

  if (isLoading) {
    return <LessonPageSkeleton />;
  }

  if (!course || !lesson) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Lesson Not Found</AlertTitle>
        <AlertDescription>
          The lesson you are looking for does not exist or could not be loaded.
          <Button variant="link" asChild className="p-0 h-auto ml-2">
            <Link href={`/courses/${courseId}`}>Go back to course</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Additional check for non-enrolled users beyond the first lesson.
  if (!enrolled && lessonIndex > 0) {
     return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <Lock className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You need to enroll in this course to view this lesson.
          <Button variant="link" asChild className="p-0 h-auto ml-2">
            <Link href={`/courses/${courseId}`}>View course details</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center">
            <PlaySquare className="h-8 w-8 mr-3 text-primary" /> {lesson.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Part of: {course.title}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <VideoPlayer videoId={lesson.videoId} title={lesson.title} />
          {lesson.content && (
            <article className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted/30">
              <p>{lesson.content}</p>
            </article>
          )}
          
          {enrolled && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="flex gap-2">
              {prevLesson && (
                <Button variant="outline" asChild>
                  <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Link>
                </Button>
              )}
              {nextLesson && (
                <Button variant="outline" asChild>
                  <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
              </div>
              {lessonStatus !== 'completed' && (
                <Button onClick={handleCompleteLesson} size="lg" className="w-full sm:w-auto">
                  <CheckCircle className="h-5 w-5 mr-2" /> Mark as Completed
                </Button>
              )}
              {lessonStatus === 'completed' && (
                 <div className="flex items-center text-green-600 font-medium p-2 rounded-md bg-green-500/10">
                    <CheckCircle className="h-5 w-5 mr-2" /> Lesson Completed
                 </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LessonPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-40" /> {/* Back button */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-1/2" /> {/* Subtitle */}
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-lg" /> {/* Video player */}
          <Skeleton className="h-20 w-full" /> {/* Content */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" /> {/* Prev button */}
              <Skeleton className="h-10 w-28" /> {/* Next button */}
            </div>
            <Skeleton className="h-12 w-48" /> {/* Complete button */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

