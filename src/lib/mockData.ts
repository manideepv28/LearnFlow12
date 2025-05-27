import type { Course } from '@/types';

export const mockCourses: Course[] = [
  {
    id: 'nextjs-fundamentals',
    title: 'Next.js Fundamentals',
    description: 'Learn the basics of Next.js, including routing, server components, and data fetching.',
    instructor: 'Jane Doe',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Web Development',
    lessons: [
      { id: 'l1', title: 'Introduction to Next.js', videoId: 'fmADCfisSMg', duration: '10:32', content: 'An overview of Next.js and its core features.' },
      { id: 'l2', title: 'Routing and Layouts', videoId: 'HP0D439h3MQ', duration: '15:45', content: 'Understanding the App Router and creating layouts.' },
      { id: 'l3', title: 'Server Components', videoId: 'N7k4Q1yI3yI', duration: '12:10', content: 'Exploring the power of Server Components.' },
    ],
    quizzes: [
      {
        id: 'q1',
        title: 'Next.js Basics Quiz',
        lessonId: 'l1',
        questions: [
          { id: 'qq1', questionText: 'What is Next.js?', options: [{id:'a', text:'A React framework'}, {id:'b', text:'A Node.js library'}, {id:'c', text:'A CSS preprocessor'}], correctOptionId: 'a' },
          { id: 'qq2', questionText: 'Which router is default in newer Next.js versions?', options: [{id:'a', text:'Pages Router'}, {id:'b', text:'App Router'}, {id:'c', text:'File Router'}], correctOptionId: 'b' },
        ],
      },
    ],
  },
  {
    id: 'react-deep-dive',
    title: 'React Deep Dive',
    description: 'Explore advanced React concepts like hooks, context API, and performance optimization.',
    instructor: 'John Smith',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Web Development',
    lessons: [
      { id: 'l4', title: 'Advanced Hooks', videoId: 'oRjK7og2MOc', duration: '18:20', content: 'Deep dive into useState, useEffect, and custom hooks.' },
      { id: 'l5', title: 'Context API', videoId: '5Xy-t1k4Hw0', duration: '14:05', content: 'Managing global state with Context API.' },
      { id: 'l6', title: 'Performance Optimization', videoId: '4K0DRxS2n9Q', duration: '20:00', content: 'Techniques for optimizing React applications.' },
    ],
    quizzes: [
      {
        id: 'q2',
        title: 'React Hooks Quiz',
        lessonId: 'l4',
        questions: [
          { id: 'qq3', questionText: 'Which hook is used for side effects?', options: [{id:'a', text:'useState'}, {id:'b', text:'useEffect'}, {id:'c', text:'useContext'}], correctOptionId: 'b' },
          { id: 'qq4', questionText: 'Can custom hooks use other hooks?', options: [{id:'a', text:'Yes'}, {id:'b', text:'No'}], correctOptionId: 'a' },
        ],
      },
    ],
  },
  {
    id: 'typescript-for-beginners',
    title: 'TypeScript for Beginners',
    description: 'A comprehensive introduction to TypeScript for JavaScript developers.',
    instructor: 'Alice Brown',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Programming Languages',
    lessons: [
      { id: 'l7', title: 'Introduction to TypeScript', videoId: 'd56mG7DezGs', duration: '12:50', content: 'What is TypeScript and why use it?' },
      { id: 'l8', title: 'Basic Types', videoId: 'ADi_nfiI3yI', duration: '16:30', content: 'Understanding number, string, boolean, arrays, etc.' },
      { id: 'l9', title: 'Interfaces and Classes', videoId: 'ETxj22oVPAA', duration: '19:15', content: 'Defining shapes and creating classes.' },
    ],
    quizzes: [
       {
        id: 'q3',
        title: 'TypeScript Basics Quiz',
        lessonId: 'l8',
        questions: [
          { id: 'qq5', questionText: 'What command compiles a .ts file?', options: [{id:'a', text:'tsc'}, {id:'b', text:'node'}, {id:'c', text:'npm run compile'}], correctOptionId: 'a' },
          { id: 'qq6', questionText: 'Is TypeScript statically typed?', options: [{id:'a', text:'Yes'}, {id:'b', text:'No'}], correctOptionId: 'a' },
        ],
      },
    ],
  },
];
