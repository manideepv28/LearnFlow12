"use client";

import type { UserData } from '@/types';

const USER_DATA_KEY = 'learnFlowUserData';

const initialUserData: UserData = {
  user: null,
  enrolledCourses: [],
  courseProgress: {},
};

export const getUserData = (): UserData => {
  if (typeof window === 'undefined') {
    return initialUserData;
  }
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : initialUserData;
  } catch (error) {
    console.error('Error getting user data from localStorage:', error);
    return initialUserData;
  }
};

export const setUserData = (data: UserData): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting user data to localStorage:', error);
  }
};

export const clearUserData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(USER_DATA_KEY);
};
