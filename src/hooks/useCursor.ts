import { useState, useEffect } from 'react';
import { CursorType } from '../types';

interface CursorState {
  type: CursorType;
  text: string;
}

type CursorListener = (state: CursorState) => void;

let globalState: CursorState = {
  type: 'default',
  text: '',
};

const listeners = new Set<CursorListener>();

export const setCursor = (type: CursorType, text: string = '') => {
  globalState = { type, text };
  listeners.forEach((listener) => listener(globalState));
};

export const resetCursor = () => {
  globalState = { type: 'default', text: '' };
  listeners.forEach((listener) => listener(globalState));
};

export function useCursor() {
  const [cursor, setCursorState] = useState<CursorState>(globalState);

  useEffect(() => {
    const handleChange = (state: CursorState) => {
      setCursorState(state);
    };

    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return {
    cursorType: cursor.type,
    cursorText: cursor.text,
    setCursor,
    resetCursor,
  };
}
