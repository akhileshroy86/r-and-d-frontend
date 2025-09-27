import { format, parseISO, isValid, addDays, subDays } from 'date-fns';

export const formatDate = (date: string | Date, formatString: string = 'yyyy-MM-dd'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : '';
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatDisplayDate = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const isDateInPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

export const addDaysToDate = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};

export const subtractDaysFromDate = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return subDays(dateObj, days);
};