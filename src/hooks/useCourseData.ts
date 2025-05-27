"use client";

import { useContext } from 'react';
import { CourseContext } from '@/contexts/CourseContext';

export const useCourseData = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseData must be used within a CourseProvider');
  }
  return context;
};
