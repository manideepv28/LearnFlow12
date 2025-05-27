"use client";

import type { ReactNode} from 'react';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Course, UserData, Lesson, QuizQuestion } from '@/types';
import { mockCourses } from '@/lib/mockData';
import { getUserData, setUserData as saveUserData } from '@/lib/localStorageUtils';
import { useAuth } from '@/hooks/useAuth';

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  getCourseById: (id: string) => Course | undefined;
  enrollCourse: (courseId: string) => Promise<boolean>;
  isEnrolled: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => number; // 0-100
  getLessonStatus: (courseId: string, lessonId: string) => 'completed' | 'pending';
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  submitQuiz: (courseId: string, quizId: string, answers: { [questionId: string]: string }) => Promise<{ score: number, totalQuestions: number }>;
  getQuizResult: (courseId: string, quizId: string) => { score: number, totalQuestions: number, answers: { [questionId: string]: string }} | undefined;
  isLoading: boolean;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [allCourses, setAllCourses] = useState<Course[]>(mockCourses);
  const [userCourseData, setUserCourseData] = useState<UserData['courseProgress']>({});
  const [userEnrolledIds, setUserEnrolledIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (currentUser) {
      const data = getUserData();
      setUserCourseData(data.courseProgress || {});
      setUserEnrolledIds(data.enrolledCourses || []);
    } else {
      // Clear data if no user
      setUserCourseData({});
      setUserEnrolledIds([]);
    }
    setIsLoading(false);
  }, [currentUser]);

  const getCourseById = useCallback((id: string) => {
    return allCourses.find(course => course.id === id);
  }, [allCourses]);

  const enrolledCourses = React.useMemo(() => {
    return allCourses.filter(course => userEnrolledIds.includes(course.id));
  }, [allCourses, userEnrolledIds]);

  const isEnrolled = useCallback((courseId: string) => {
    return userEnrolledIds.includes(courseId);
  }, [userEnrolledIds]);

  const persistUserData = useCallback(() => {
    if (!currentUser) return;
    const currentGlobalData = getUserData();
    saveUserData({
      ...currentGlobalData,
      user: currentUser, // ensure user is also up-to-date
      enrolledCourses: userEnrolledIds,
      courseProgress: userCourseData,
    });
  }, [currentUser, userEnrolledIds, userCourseData]);


  const enrollCourse = useCallback(async (courseId: string): Promise<boolean> => {
    if (!currentUser || userEnrolledIds.includes(courseId)) return false;
    setUserEnrolledIds(prev => [...prev, courseId]);
    // Initialize progress for the new course
    setUserCourseData(prev => ({
      ...prev,
      [courseId]: { completedLessons: [], quizScores: {}, overallProgress: 0 },
    }));
    // Persist immediately after state update
    // Need to use a callback with persistUserData or pass the new state directly
    // For simplicity, let's rely on a useEffect to persist, or call it directly after state updates.
    // This direct call might use stale data if not careful.
    // A robust way is to update localStorage within the setState callbacks or useEffect.
    return true;
  }, [currentUser, userEnrolledIds]);

  // Effect to persist data whenever relevant state changes
  useEffect(() => {
    if(currentUser && !isLoading) { // Persist only if user is logged in and not initial loading
      persistUserData();
    }
  }, [userEnrolledIds, userCourseData, persistUserData, currentUser, isLoading]);


  const calculateOverallProgress = useCallback((courseId: string, currentProgress: UserData['courseProgress'][string]): number => {
    const course = getCourseById(courseId);
    if (!course) return 0;

    const totalLessons = course.lessons.length;
    const completedLessonsCount = currentProgress.completedLessons.length;
    
    let totalQuizWeight = 0;
    let achievedQuizWeight = 0;

    course.quizzes.forEach(quiz => {
      const quizResult = currentProgress.quizScores[quiz.id];
      if (quizResult) {
        totalQuizWeight += quiz.questions.length; // Assuming each question has equal weight
        achievedQuizWeight += quizResult.score;
      } else {
        totalQuizWeight += quiz.questions.length; // Still counts towards total if not attempted
      }
    });
    
    const lessonProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 50 : 0; // Lessons 50% weight
    const quizProgress = totalQuizWeight > 0 ? (achievedQuizWeight / totalQuizWeight) * 50 : 0; // Quizzes 50% weight
    
    return Math.round(lessonProgress + quizProgress);
  }, [getCourseById]);

  const getCourseProgress = useCallback((courseId: string): number => {
    const progress = userCourseData[courseId];
    return progress?.overallProgress ?? 0;
  }, [userCourseData]);


  const getLessonStatus = useCallback((courseId: string, lessonId: string): 'completed' | 'pending' => {
    return userCourseData[courseId]?.completedLessons.includes(lessonId) ? 'completed' : 'pending';
  }, [userCourseData]);

  const completeLesson = useCallback(async (courseId: string, lessonId: string): Promise<void> => {
    if (!currentUser || !userCourseData[courseId] || userCourseData[courseId].completedLessons.includes(lessonId)) return;

    setUserCourseData(prev => {
      const updatedCourseProgress = {
        ...prev[courseId],
        completedLessons: [...prev[courseId].completedLessons, lessonId],
      };
      const overallProgress = calculateOverallProgress(courseId, updatedCourseProgress);
      return {
        ...prev,
        [courseId]: { ...updatedCourseProgress, overallProgress },
      };
    });
  }, [currentUser, userCourseData, calculateOverallProgress]);

  const submitQuiz = useCallback(async (courseId: string, quizId: string, answers: { [questionId: string]: string }): Promise<{ score: number, totalQuestions: number }> => {
    if (!currentUser) throw new Error("User not authenticated");
    const course = getCourseById(courseId);
    const quiz = course?.quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error("Quiz not found");

    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) {
        score++;
      }
    });
    
    const result = { score, totalQuestions: quiz.questions.length, answers };

    setUserCourseData(prev => {
      const updatedCourseProgress = {
        ...prev[courseId],
        quizScores: {
          ...prev[courseId]?.quizScores,
          [quizId]: result,
        },
      };
      const overallProgress = calculateOverallProgress(courseId, updatedCourseProgress);
      return {
        ...prev,
        [courseId]: { ...updatedCourseProgress, overallProgress },
      };
    });
    return { score, totalQuestions: quiz.questions.length };
  }, [currentUser, getCourseById, calculateOverallProgress]);

  const getQuizResult = useCallback((courseId: string, quizId: string) => {
    return userCourseData[courseId]?.quizScores[quizId];
  }, [userCourseData]);


  return (
    <CourseContext.Provider value={{ 
        courses: allCourses, 
        enrolledCourses, 
        getCourseById, 
        enrollCourse,
        isEnrolled,
        getCourseProgress,
        getLessonStatus,
        completeLesson,
        submitQuiz,
        getQuizResult,
        isLoading
    }}>
      {children}
    </CourseContext.Provider>
  );
};
