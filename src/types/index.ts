
export interface User {
  id: string;
  email: string;
  name?: string;
  // password will not be stored directly in user object for security,
  // it's handled during auth and usually hashed/salted if a backend were used.
  // For localStorage, we'd store a session token or a simplified user object.
}

export interface Lesson {
  id: string;
  title: string;
  videoId: string; // YouTube video ID
  duration: string;
  content?: string; // Optional lesson text content
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface Quiz {
  id:string;
  title: string;
  lessonId?: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  imageUrl: string;
  category: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

// For user-specific data stored in localStorage
export interface UserData {
  user: User | null;
  enrolledCourses: string[]; // Array of course IDs
  courseProgress: {
    [courseId: string]: {
      completedLessons: string[]; // Array of lesson IDs
      quizScores: {
        [quizId: string]: {
          score: number;
          totalQuestions: number;
          answers: { [questionId: string]: string }; // { questionId: selectedOptionId }
        };
      };
      overallProgress?: number; // Percentage
    };
  };
}
