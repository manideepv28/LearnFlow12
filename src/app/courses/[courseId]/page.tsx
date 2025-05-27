"use client";

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, PlayCircle, CheckCircle, ClipboardList, User, Tag, AlertTriangle, ChevronRight, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const { currentUser, isLoading: authLoading } = useAuth();
  const { 
    getCourseById, 
    isEnrolled, 
    enrollCourse, 
    getCourseProgress, 
    getLessonStatus,
    isLoading: courseDataLoading 
  } = useCourseData();
  
  const course = useMemo(() => getCourseById(courseId), [getCourseById, courseId]);
  const enrolled = useMemo(() => isEnrolled(courseId), [isEnrolled, courseId]);
  const progress = useMemo(() => getCourseProgress(courseId), [getCourseProgress, courseId]);

  useEffect(() => {
    if (!authLoading && !currentUser && course) { // if course requires auth to view details (not implemented here)
      // Potentially redirect if not logged in and trying to access restricted content
    }
  }, [currentUser, authLoading, router, course]);

  const handleEnroll = async () => {
    if (!currentUser) {
      toast({ title: "Authentication Required", description: "Please log in to enroll.", variant: "destructive" });
      router.push(`/auth/login?redirect=/courses/${courseId}`);
      return;
    }
    const success = await enrollCourse(courseId);
    if (success) {
      toast({ title: "Successfully Enrolled!", description: `You are now enrolled in ${course.title}.` });
    } else {
      toast({ title: "Enrollment Failed", description: "Could not enroll. You might already be enrolled or an error occurred.", variant: "destructive" });
    }
  };

  if (authLoading || courseDataLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Course Not Found</AlertTitle>
        <AlertDescription>
          The course you are looking for does not exist or could not be loaded.
          <Button variant="link" asChild className="p-0 h-auto ml-2">
            <Link href="/courses">Go back to courses</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <header className="relative py-12 md:py-20 rounded-lg overflow-hidden bg-muted">
        <Image 
          src={course.imageUrl} 
          alt={course.title} 
          layout="fill" 
          objectFit="cover" 
          className="opacity-20" 
          data-ai-hint="abstract course background"
        />
        <div className="container relative z-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto md:mx-0">{course.description}</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-center md:justify-start">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              <span>Instructor: {course.instructor}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <span>Category: {course.category}</span>
            </div>
          </div>
          {!enrolled && currentUser && (
            <Button onClick={handleEnroll} size="lg" className="mt-8 shadow-lg">Enroll Now</Button>
          )}
          {!currentUser && (
             <Button onClick={() => router.push(`/auth/login?redirect=/courses/${courseId}`)} size="lg" className="mt-8 shadow-lg">Login to Enroll</Button>
          )}
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <BookOpen className="h-6 w-6 mr-3 text-primary" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.lessons.length === 0 && course.quizzes.length === 0 && (
                <p className="text-muted-foreground">Course content will be available soon.</p>
              )}
              <Accordion type="single" collapsible className="w-full">
                {course.lessons.map((lesson, index) => {
                  const lessonStatus = enrolled ? getLessonStatus(courseId, lesson.id) : 'pending';
                  const isAccessible = enrolled || index === 0; // Allow first lesson preview, or all if enrolled
                  return (
                    <AccordionItem value={`lesson-${lesson.id}`} key={lesson.id}>
                      <AccordionTrigger disabled={!isAccessible} className="hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center">
                            {isAccessible ? (
                              lessonStatus === 'completed' ? 
                              <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> : 
                              <PlayCircle className="h-5 w-5 mr-2 text-primary" />
                            ) : (
                              <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
                            )}
                            {lesson.title}
                          </span>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-3">{lesson.content || "No description available for this lesson."}</p>
                        {isAccessible ? (
                            <Button asChild variant="default" size="sm">
                                <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                                    Start Lesson <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        ): (
                            <Button size="sm" disabled>Enroll to Access</Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
                {course.quizzes.map(quiz => (
                   <AccordionItem value={`quiz-${quiz.id}`} key={quiz.id}>
                     <AccordionTrigger disabled={!enrolled} className="hover:no-underline">
                       <div className="flex items-center justify-between w-full">
                         <span className="flex items-center">
                           {enrolled ? <ClipboardList className="h-5 w-5 mr-2 text-primary" /> : <Lock className="h-5 w-5 mr-2 text-muted-foreground" />}
                           {quiz.title}
                         </span>
                         <span className="text-sm text-muted-foreground">{quiz.questions.length} Questions</span>
                       </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <p className="text-muted-foreground mb-3">Test your knowledge with this quiz.</p>
                        {enrolled ? (
                            <Button asChild variant="default" size="sm">
                                <Link href={`/courses/${courseId}/quizzes/${quiz.id}`}>
                                    Start Quiz <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        ) : (
                            <Button size="sm" disabled>Enroll to Access</Button>
                        )}
                     </AccordionContent>
                   </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          {enrolled && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Overall Completion</span>
                  <span className="font-semibold text-primary">{progress}%</span>
                </div>
                <Progress value={progress} aria-label={`${progress}% complete`} />
                 {progress === 100 && (
                    <p className="text-sm text-green-600 flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 mr-1" /> Congratulations! Course completed.
                    </p>
                )}
              </CardContent>
            </Card>
          )}
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><strong>Lessons:</strong> {course.lessons.length}</p>
                <p><strong>Quizzes:</strong> {course.quizzes.length}</p>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Category:</strong> {course.category}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}


function CourseDetailSkeleton() {
  return (
    <div className="space-y-8">
      <header className="py-12 md:py-20 rounded-lg bg-muted/50">
        <div className="container">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
          <Skeleton className="h-12 w-32 mt-8" />
        </div>
      </header>
       <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-full" /></CardContent>
          </Card>
           <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

