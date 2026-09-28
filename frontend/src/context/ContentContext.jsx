import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext(null);

const DEFAULT_IDEA = 'Create a LinkedIn post about our new AI agent that automates software testing.';
const DEFAULT_GOAL = 'Engagement & Technical Discussion';
const DEFAULT_AUDIENCE = 'Software Engineers, QA Leads, Tech Founders';

const STORAGE_KEYS = {
  IDEA: 'socialmind_idea',
  GOAL: 'socialmind_goal',
  AUDIENCE: 'socialmind_audience',
  RESULT: 'socialmind_result',
};

export function ContentProvider({ children }) {
  // Initialize from localStorage so tab navigation or page refresh does not lose state
  const [idea, setIdeaState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IDEA);
      return saved !== null ? saved : DEFAULT_IDEA;
    } catch {
      return DEFAULT_IDEA;
    }
  });

  const [goal, setGoalState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOAL);
      return saved !== null ? saved : DEFAULT_GOAL;
    } catch {
      return DEFAULT_GOAL;
    }
  });

  const [audience, setAudienceState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIENCE);
      return saved !== null ? saved : DEFAULT_AUDIENCE;
    } catch {
      return DEFAULT_AUDIENCE;
    }
  });

  const [result, setResultState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESULT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persistent setters
  const setIdea = (val) => {
    setIdeaState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.IDEA, val);
    } catch (e) {
      console.warn('Failed to save idea to localStorage', e);
    }
  };

  const setGoal = (val) => {
    setGoalState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.GOAL, val);
    } catch (e) {
      console.warn('Failed to save goal to localStorage', e);
    }
  };

  const setAudience = (val) => {
    setAudienceState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIENCE, val);
    } catch (e) {
      console.warn('Failed to save audience to localStorage', e);
    }
  };

  const setResult = (val) => {
    setResultState(val);
    try {
      if (val) {
        localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(val));
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESULT);
      }
    } catch (e) {
      console.warn('Failed to save result to localStorage', e);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  const resetAll = () => {
    setIdea(DEFAULT_IDEA);
    setGoal(DEFAULT_GOAL);
    setAudience(DEFAULT_AUDIENCE);
    clearResult();
  };

  return (
    <ContentContext.Provider
      value={{
        idea,
        setIdea,
        goal,
        setGoal,
        audience,
        setAudience,
        result,
        setResult,
        clearResult,
        resetAll,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}
