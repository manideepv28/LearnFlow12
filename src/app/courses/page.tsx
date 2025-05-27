"use client";

import { CourseCard } from '@/components/courses/CourseCard';
import { useCourseData } from '@/hooks/useCourseData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
  const { courses, isLoading } = useCourseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(courses.map(course => course.category));
    return ['all', ...Array.from(cats)];
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory !== 'all') {
      filtered = filtered.filter(course => course.category === filterCategory);
    }

    switch (sortOption) {
      case 'title-asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      case 'instructor-asc':
        return filtered.sort((a, b) => a.instructor.localeCompare(b.instructor));
      // Add more sorting options if needed
      default:
        return filtered;
    }
  }, [courses, searchTerm, sortOption, filterCategory]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 w-full md:w-1/2" />
          <Skeleton className="h-10 w-full md:w-1/4" />
          <Skeleton className="h-10 w-full md:w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Explore Our Courses</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find the perfect course to enhance your skills and knowledge.</p>
      </section>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border rounded-lg shadow-sm">
        <Input
          type="search"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="instructor-asc">Instructor (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow-sm">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
}

