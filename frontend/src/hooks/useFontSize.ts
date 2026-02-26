import { useState, useCallback } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

const FONT_SIZE_KEY = 'mediclear_font_size';

function getStoredFontSize(): FontSize {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    if (stored === 'small' || stored === 'medium' || stored === 'large') {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'medium';
}

export const fontSizeClasses: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

export const fontSizeHeadingClasses: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>(getStoredFontSize);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    try {
      localStorage.setItem(FONT_SIZE_KEY, size);
    } catch {
      // ignore
    }
  }, []);

  return { fontSize, setFontSize };
}
