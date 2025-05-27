"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { toast } from '@/hooks/use-toast';
import { BookOpen, User, Tag, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { currentUser } = useAuth();
  const { enrollCourse, isEnrolled, isLoading: courseLoading } = useCourseData();
  const enrolled = isEnrolled(course.id);

  const handleEnroll = async () => {
    if (!currentUser) {
      toast({ title: "Authentication Required", description: "Please log in to enroll in courses.", variant: "destructive" });
      return;
    }
    const success = await enrollCourse(course.id);
    if (success) {
      toast({ title: "Successfully Enrolled!", description: `You are now enrolled in ${course.title}.` });
    } else {
      toast({ title: "Enrollment Failed", description: "Could not enroll in the course. You might already be enrolled or an error occurred.", variant: "destructive" });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative w-full h-48">
        <Image
          src={course.imageUrl}
          alt={course.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint="online course"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl hover:text-primary transition-colors">
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
        </CardTitle>
        <CardDescription className="flex items-center text-sm pt-1">
          <User className="h-4 w-4 mr-1.5 text-muted-foreground" /> By {course.instructor}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <Tag className="h-3.5 w-3.5 mr-1.5" /> {course.category}
        </div>
      </CardContent>
      <CardFooter>
        {enrolled ? (
          <Button asChild className="w-full" variant="outline">
            <Link href={`/courses/${course.id}`}>
              View Course <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button onClick={handleEnroll} disabled={courseLoading || !currentUser} className="w-full">
            {currentUser ? (courseLoading ? "Processing..." : "Enroll Now") : "Login to Enroll"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
