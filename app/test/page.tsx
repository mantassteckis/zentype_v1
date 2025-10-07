"use client"

import React, { useRef, useCallback, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Target, Zap, RotateCcw, BarChart3, Palette, Type } from "lucide-react"
import { useAuth } from "@/context/AuthProvider"
import { PreMadeTest } from "@/lib/types/database"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase/client"
import { useDebugLogger } from "@/context/DebugProvider"
import { useCorrelationId } from "@/hooks/useCorrelationId"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { ZenTypeModal } from "@/components/ui/zentype-modal"
// Removed Cloud Function imports - now using Next.js API route

export default function TestPage(): JSX.Element | null {
  // Auth and user data
  const { user, profile, isLoading } = useAuth();
  
  // User preferences with real-time sync
  const { 
    preferences, 
    currentTheme, 
    currentFont,
    dynamicTextColor, // New: Smart text color that adapts to theme and mode
    availableThemes, 
    availableFonts,
    setTheme,
    setFont
  } = useUserPreferences();
  
  // Debug logging
  const debugLogger = useDebugLogger();
  
  // Correlation ID for request tracing
  const { correlationId, getHeaders } = useCorrelationId();
  
  // Core state management
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<'config' | 'active' | 'results'>('config');
  const [selectedTime, setSelectedTime] = useState(60);
  const [textToType, setTextToType] = useState("");
  const [status, setStatus] = useState<'waiting' | 'running' | 'paused' | 'finished'>('waiting');
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Modal state for AI failures and promotions
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'promotional' | 'error'>('promotional');
  
  // Word-based typing state (NEW)
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userWordInput, setUserWordInput] = useState("");
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [wordErrors, setWordErrors] = useState<{ [wordIndex: number]: boolean }>({}); // Track which words have errors
  
  // Legacy state for compatibility (will be derived from word-based state)
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  
  // Final test results state
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const finishButtonRef = useRef<HTMLButtonElement>(null);
  const endTestRef = useRef<() => Promise<void>>();

  // Additional UI state for configuration
  const [activeTab, setActiveTab] = useState("practice");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [topic, setTopic] = useState("");
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);

  // Pre-made tests management state
  const [preMadeTests, setPreMadeTests] = useState<PreMadeTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsError, setTestsError] = useState<string | null>(null);
  
  // Pagination state for tests
  const [testsPagination, setTestsPagination] = useState<{
    nextCursor: string | null;
    hasNextPage: boolean;
    loading: boolean;
  }>({
    nextCursor: null,
    hasNextPage: false,
    loading: false
  });

  // AI-generated tests state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTest, setAiTest] = useState<any>(null); // Generated test object

  // Client-side mount state to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);
  
  // Debug: Log theme changes
  useEffect(() => {
    if (isMounted && currentTheme) {
      console.log('🎨 Theme state updated:', {
        id: currentTheme.id,
        name: currentTheme.name,
        gradient: currentTheme.gradient,
        preferenceValue: preferences.theme,
        fullGradientClass: `bg-gradient-to-br ${currentTheme.gradient}`
      });
    }
  }, [currentTheme, preferences.theme, isMounted]);

  // Helper function to calculate correct characters (for accurate WPM)
  // Compares user's typed text against original word character-by-character
  const calculateCorrectCharacters = useCallback((typedWords: string[], targetWords: string[]) => {
    let correctChars = 0;
    typedWords.forEach((typedWord, wordIndex) => {
      const targetWord = targetWords[wordIndex];
      if (targetWord) {
        const minLength = Math.min(typedWord.length, targetWord.length);
        for (let i = 0; i < minLength; i++) {
          if (typedWord[i] === targetWord[i]) {
            correctChars++;
          }
        }
      }
    });
    return correctChars;
  }, []);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add sample debug logs for testing the enhanced debugger
  useEffect(() => {
    if (debugLogger.isDebugEnabled && isMounted && process.env.NODE_ENV === 'development') {
      // Only log once when component mounts, not repeatedly
      const hasLoggedMount = sessionStorage.getItem('test-page-mount-logged');
      if (!hasLoggedMount) {
        // Use setTimeout to avoid blocking the main thread and prevent infinite loops
        setTimeout(() => {
          debugLogger.info('UI', 'Test page component mounted', { 
            timestamp: Date.now(),
            component: 'TestPage',
            route: '/test',
            userAuthenticated: !!user
          });
          sessionStorage.setItem('test-page-mount-logged', 'true');
        }, 100);
      }
    }
  }, [debugLogger, isMounted, user]);

  // Load saved preferences (only after mount)
  useEffect(() => {
    if (!isMounted) return;
    
    // Preferences are now handled by useUserPreferences hook
    // No need to manually load from localStorage
  }, [isMounted]);

  // Fetch pre-made tests from API
  useEffect(() => {
    const fetchTests = async (loadMore = false) => {
      // Only fetch for practice tests
      if (activeTab !== 'practice') {
        return;
      }

      if (loadMore) {
        setTestsPagination(prev => ({ ...prev, loading: true }));
      } else {
        setTestsLoading(true);
        setTestsError(null);
        setPreMadeTests([]);
        setTestsPagination({
          nextCursor: null,
          hasNextPage: false,
          loading: false
        });
      }
      
      try {
        // Construct query string with current filters
        const queryParams = new URLSearchParams();
        
        if (selectedDifficulty) {
          queryParams.append('difficulty', selectedDifficulty);
        }
        
        if (selectedTime) {
          queryParams.append('timeLimit', selectedTime.toString());
        }

        // Add pagination parameters
        queryParams.append('limit', '20');
        if (loadMore && testsPagination.nextCursor) {
          queryParams.append('cursor', testsPagination.nextCursor);
        }

        console.log(`🔍 Fetching tests with params: ${queryParams.toString()}`);
        
        const response = await fetch(`/api/v1/tests?${queryParams.toString()}`, {
          headers: getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        console.log(`✅ Fetched ${data.data?.length || 0} pre-made tests`);
        
        // Handle paginated response format
        const newTests = data.data || [];
        const pagination = data.pagination || { nextCursor: null, hasNextPage: false };
        
        if (loadMore) {
          setPreMadeTests(prev => [...prev, ...newTests]);
        } else {
          setPreMadeTests(newTests);
        }
        
        setTestsPagination({
          nextCursor: pagination.nextCursor,
          hasNextPage: pagination.hasNextPage,
          loading: false
        });
        
      } catch (error) {
        console.error('❌ Error fetching pre-made tests:', error);
        setTestsError(error instanceof Error ? error.message : 'Failed to load tests');
        if (!loadMore) {
          setPreMadeTests([]);
        }
        setTestsPagination(prev => ({ ...prev, loading: false }));
      } finally {
        if (!loadMore) {
          setTestsLoading(false);
        }
      }
    };

    fetchTests();
  }, [selectedDifficulty, selectedTime, activeTab]); // Now filtering by both difficulty and time

  // Load more tests function
  const loadMoreTests = () => {
    if (testsPagination.hasNextPage && !testsPagination.loading) {
      const fetchTests = async (loadMore = false) => {
        // Only fetch for practice tests
        if (activeTab !== 'practice') {
          return;
        }

        if (loadMore) {
          setTestsPagination(prev => ({ ...prev, loading: true }));
        } else {
          setTestsLoading(true);
          setTestsError(null);
          setPreMadeTests([]);
          setTestsPagination({
            nextCursor: null,
            hasNextPage: false,
            loading: false
          });
        }
        
        try {
          // Construct query string with current filters
          const queryParams = new URLSearchParams();
          
          if (selectedDifficulty) {
            queryParams.append('difficulty', selectedDifficulty);
          }
          
          if (selectedTime) {
            queryParams.append('timeLimit', selectedTime.toString());
          }

          // Add pagination parameters
          queryParams.append('limit', '20');
          if (loadMore && testsPagination.nextCursor) {
            queryParams.append('cursor', testsPagination.nextCursor);
          }

          console.log(`🔍 Fetching tests with params: ${queryParams.toString()}`);
          
          const response = await fetch(`/api/v1/tests?${queryParams.toString()}`, {
            headers: getHeaders()
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          console.log(`✅ Fetched ${data.data?.length || 0} pre-made tests`);
          
          // Handle paginated response format
          const newTests = data.data || [];
          const pagination = data.pagination || { nextCursor: null, hasNextPage: false };
          
          if (loadMore) {
            setPreMadeTests(prev => [...prev, ...newTests]);
          } else {
            setPreMadeTests(newTests);
          }
          
          setTestsPagination({
            nextCursor: pagination.nextCursor,
            hasNextPage: pagination.hasNextPage,
            loading: false
          });
          
        } catch (error) {
          console.error('❌ Error fetching pre-made tests:', error);
          setTestsError(error instanceof Error ? error.message : 'Failed to load tests');
          if (!loadMore) {
            setPreMadeTests([]);
          }
          setTestsPagination(prev => ({ ...prev, loading: false }));
        } finally {
          if (!loadMore) {
            setTestsLoading(false);
          }
        }
      };
      
      fetchTests(true);
    }
  };

  // Handle tab switching logic
  useEffect(() => {
    if (activeTab !== 'practice' && selectedTestId) {
      console.log('🔄 Switching away from practice tab - clearing selected test');
      setSelectedTestId(null);
    }
    
    // Handle AI tab switching - restore AI test content if available
    if (activeTab === 'ai') {
      if (selectedTestId) {
        console.log('🤖 Switching to AI tab - clearing practice test selection');
        setSelectedTestId(null);
      }
      
      // Restore AI test content if we have one
      if (aiTest && aiTest.text) {
        console.log('🔄 Restoring AI test content on tab switch', {
          aiTestId: aiTest.id,
          textLength: aiTest.text.length
        });
        setTextToType(aiTest.text);
        setCurrentTestId(aiTest.id);
      } else {
        // Clear content if no AI test available
        setTextToType("");
        setCurrentTestId(null);
      }
    }
  }, [activeTab, selectedTestId, aiTest]);

  // Enhanced Practice Test Selection Handler with comprehensive tracking
  const handleTestSelection = useCallback((test: PreMadeTest) => {
    // Start comprehensive flow tracking for practice test selection
    const flowId = debugLogger.startFlow('PRACTICE_TEST', 'Practice Test Selection Process', {
      component: 'TestPage',
      action: 'select_practice_test',
      testType: 'practice'
    });

    debugLogger.logUserInteraction('clicked', 'Practice Test Card', {
      testId: test.id,
      testSource: test.source,
      testDifficulty: test.difficulty,
      wordCount: test.wordCount
    });

    debugLogger.addToFlow(flowId, 'info', 'Practice test selection initiated', {
      testId: test.id,
      source: test.source,
      difficulty: test.difficulty,
      wordCount: test.wordCount,
      category: test.category,
      textLength: test.text.length
    });

    // Update selected test ID
    setSelectedTestId(test.id);
    debugLogger.addToFlow(flowId, 'debug', 'Selected test ID updated in state', {
      selectedTestId: test.id
    });
    
    // Update the text to type with selected test content - THIS IS CRITICAL
    setTextToType(test.text);
    
    // Split text into words for word-based tracking
    const wordArray = test.text.split(' ');
    setWords(wordArray);
    
    debugLogger.addToFlow(flowId, 'info', 'Test text content loaded', {
      textLength: test.text.length,
      textPreview: test.text.substring(0, 100) + "&hellip;",
      wordCount: wordArray.length
    });
    
    // Update current test ID (critical for result saving)
    setCurrentTestId(test.id);
    debugLogger.addToFlow(flowId, 'debug', 'Current test ID updated for result tracking', {
      currentTestId: test.id
    });
    
    // Clear any existing user input and reset typing state (word-based)
    setCurrentWordIndex(0);
    setUserWordInput("");
    setCompletedWords([]);
    setWordErrors({});
    
    // Legacy state reset for compatibility
    setUserInput("");
    setCurrentIndex(0);
    setErrors(0);
    setStatus('waiting');
    
    debugLogger.addToFlow(flowId, 'info', 'Typing state reset for new test', {
      userInput: '',
      currentIndex: 0,
      errors: 0,
      status: 'waiting'
    });
    
    // Reset time based on selected time (not test's recommended time for now)
    setTimeLeft(selectedTime);
    debugLogger.addToFlow(flowId, 'debug', 'Timer configured', {
      timeLimit: selectedTime,
      testRecommendedTime: test.timeLimit
    });

    // End the flow successfully
    debugLogger.endFlow(flowId, true, {
      testId: test.id,
      testSource: test.source,
      textLength: test.text.length,
      wordCount: test.wordCount,
      ready: true
    });

    console.log('✅ Practice test selection complete. Ready to start typing.');
  }, [selectedTime, debugLogger]);

  // AI Test Generation Handler
  const handleGenerateAiTest = useCallback(async () => {
    // Start comprehensive flow tracking for AI test generation
    const flowId = debugLogger.startFlow('AI_GENERATION', 'AI Test Generation Process', {
      component: 'TestPage',
      action: 'generate_ai_test',
      testType: 'ai'
    });

    debugLogger.addToFlow(flowId, 'info', 'User initiated AI test generation', {
      hasUser: !!user,
      topic: topic.trim(),
      selectedDifficulty,
      selectedTime
    }, 'app/test/page.tsx:handleGenerateAiTest');

    // Log user interaction
    debugLogger.logUserInteraction('clicked', 'AI Generate Button', {
      topic: topic.trim(),
      difficulty: selectedDifficulty,
      timeLimit: selectedTime
    });

    if (!user) {
      debugLogger.addToFlow(flowId, 'error', 'Authentication check failed - user not authenticated', { user });
      debugLogger.endFlow(flowId, false, { error: 'User not authenticated' });
      alert('Please sign in to generate AI tests');
      return;
    }

    if (!topic.trim()) {
      debugLogger.addToFlow(flowId, 'warn', 'Input validation failed - empty topic', { topic });
      debugLogger.endFlow(flowId, false, { error: 'Empty topic provided' });
      alert('Please enter a topic for the AI test');
      return;
    }

    debugLogger.addToFlow(flowId, 'info', 'Input validation passed, proceeding with generation', {
      userId: user.uid,
      topicLength: topic.trim().length,
      difficulty: selectedDifficulty,
      timeLimit: selectedTime
    });

    setIsGenerating(true);
    setAiTest(null);

    try {
      // Get user's autoSaveAiTests preference (default to false)
      const autoSaveAiTests = profile?.settings?.autoSaveAiTests || false;
      
      debugLogger.addToFlow(flowId, 'info', 'Retrieved user preferences', {
        userId: user.uid,
        autoSaveAiTests,
        hasProfile: !!profile,
        hasSettings: !!profile?.settings
      });

      // Prepare request data
      const requestData = {
        topic: topic.trim(),
        difficulty: selectedDifficulty,
        timeLimit: selectedTime,
        saveTest: autoSaveAiTests
      };

      debugLogger.addToFlow(flowId, 'info', 'Request data prepared for Cloud Function', {
        requestDataKeys: Object.keys(requestData),
        topicLength: requestData.topic.length,
        saveTest: requestData.saveTest
      });

      // Call the Cloud Function
      const generateAiTest = httpsCallable(functions, 'generateAiTest');
      
      debugLogger.addToFlow(flowId, 'info', 'Initiating Cloud Function call', {
        functionName: 'generateAiTest',
        topic: requestData.topic,
        difficulty: requestData.difficulty,
        timeLimit: requestData.timeLimit
      });

      // Log API call
      debugLogger.logApiCall('POST', 'generateAiTest', requestData);

      const callStartTime = Date.now();
      
      // Call the Cloud Function
      const result = await generateAiTest(requestData);
      const data = result.data as any;
      
      const callDuration = Date.now() - callStartTime;

      debugLogger.addToFlow(flowId, 'info', 'Cloud Function response received', {
        success: data?.success,
        textLength: data?.text?.length || 0,
        wordCount: data?.wordCount || 0,
        testId: data?.testId || 'unknown',
        callDuration,
        responseSize: JSON.stringify(data).length
      });

      // Log API response
      debugLogger.logApiCall('POST', 'generateAiTest', { 
        responseData: data, 
        duration: callDuration 
      }, data?.success !== false);
      
      debugLogger.addToFlow(flowId, 'debug', 'Processing generated text data', {
        dataType: typeof data,
        dataKeys: Object.keys(data || {}),
        hasText: !!(data?.text),
        textLength: data?.text?.length || 0,
        hasTestId: !!(data?.testId),
        hasJobId: !!(data?.jobId),
        success: data?.success
      });

      // Handle job-based response (async generation)
      if (data.jobId && data.status === 'pending') {
        debugLogger.addToFlow(flowId, 'info', 'Received job-based response, handling async generation', {
          jobId: data.jobId,
          status: data.status,
          estimatedTime: data.estimatedCompletionTime
        });

        // For now, show a message that generation is in progress
        // TODO: Implement proper job polling or Firestore listener
        debugLogger.addToFlow(flowId, 'warn', 'Job-based AI generation not fully implemented yet', {
          jobId: data.jobId,
          message: 'This feature requires job polling implementation'
        });
        
        debugLogger.endFlow(flowId, false, { 
          error: 'Job-based generation not implemented',
          jobId: data.jobId 
        });
        
        throw new Error('AI test generation is processing. This feature will be available soon.');
      }

      // Handle immediate text response (synchronous generation)
      if (!data.text) {
        debugLogger.addToFlow(flowId, 'error', 'No text content generated from Cloud Function', { 
          data,
          responseKeys: Object.keys(data || {})
        });
        debugLogger.endFlow(flowId, false, { error: 'No text content generated' });
        throw new Error('No text content generated');
      }

      // Create test object similar to PreMadeTest structure
      const generatedTest = {
        id: data.testId || `ai_${Date.now()}`,
        text: data.text,
        difficulty: selectedDifficulty,
        category: 'ai_generated',
        source: 'AI Generated',
        wordCount: data.wordCount || data.text.split(' ').length,
        timeLimit: selectedTime,
        topic: topic.trim(),
        saved: data.saved || false
      };

      debugLogger.addToFlow(flowId, 'info', 'Generated test object created successfully', {
        testId: generatedTest.id,
        textLength: generatedTest.text.length,
        wordCount: generatedTest.wordCount,
        saved: generatedTest.saved,
        category: generatedTest.category,
        textPreview: generatedTest.text.substring(0, 100) + '...'
      });

      console.log('🤖 AI-generated text preview:', data.text.substring(0, 100) + '...');
      
      setAiTest(generatedTest);
      debugLogger.addToFlow(flowId, 'info', 'AI test object set to component state', {
        stateUpdated: true
      });
      
      // Auto-select the AI test for better UX (user doesn't need to click the card)
      console.log('🤖 Auto-selecting the generated AI test');
      setTextToType(generatedTest.text);
      
      // Split text into words for word-based tracking
      const wordArray = generatedTest.text.split(' ');
      setWords(wordArray);
      
      setCurrentTestId(generatedTest.id);
      
      debugLogger.addToFlow(flowId, 'info', 'AI test auto-selected for user', {
        testId: generatedTest.id,
        textLength: generatedTest.text.length,
        autoSelected: true
      });

      // End the flow successfully
      debugLogger.endFlow(flowId, true, {
        testId: generatedTest.id,
        textLength: generatedTest.text.length,
        wordCount: generatedTest.wordCount,
        saved: generatedTest.saved,
        totalDuration: Date.now() - (flowId ? parseInt(flowId.split('_')[1]) : Date.now())
      });

    } catch (error: any) {
      debugLogger.addToFlow(flowId, 'critical', 'AI test generation failed with error', {
        errorMessage: error?.message || 'Unknown error',
        errorCode: error?.code,
        errorDetails: error?.details,
        stack: error?.stack,
        userId: user?.uid,
        topic: topic.trim(),
        difficulty: selectedDifficulty
      });

      // Log modal interaction to debug utility
      debugLogger.logUserInteraction('error', 'AI Generation Failed', {
        errorCode: error?.code,
        errorMessage: error?.message,
        willShowModal: true
      });

      // End the flow with failure
      debugLogger.endFlow(flowId, false, {
        error: error?.message || 'Unknown error',
        errorCode: error?.code,
        errorDetails: error?.details
      });

      // Check if this is an AI service unavailable error (Gemini API failure)
      if (error?.code === 'unavailable' || error?.details?.code === 'AI_SERVICE_UNAVAILABLE') {
        // Show promotional modal for AI service failures
        setModalType('promotional');
        setShowModal(true);
        
        debugLogger.logUserInteraction('modal_shown', 'AI Service Unavailable Promotional Modal', {
          trigger: 'ai_generation_failure',
          errorCode: error?.code,
          modalType: 'promotional'
        });
      } else {
        // Show error modal for other failures
        setModalType('error');
        setShowModal(true);
        
        debugLogger.logUserInteraction('modal_shown', 'AI Generation Error Modal', {
          trigger: 'ai_generation_failure',
          errorCode: error?.code,
          modalType: 'error'
        });
      }
    } finally {
      setIsGenerating(false);
      debugLogger.addToFlow(flowId, 'info', 'AI generation process cleanup completed', {
        isGenerating: false,
        finalState: 'cleanup_complete'
      });
    }
  }, [user, topic, selectedDifficulty, selectedTime, debugLogger]);

  // Enhanced AI Test Selection Handler with tracking
  const handleAiTestSelection = useCallback(() => {
    const flowId = debugLogger.startFlow('AI_GENERATION', 'AI Test Selection Process', {
      component: 'TestPage',
      action: 'select_ai_test',
      testType: 'ai'
    });

    debugLogger.logUserInteraction('clicked', 'AI Test Card', {
      hasAiTest: !!aiTest,
      testId: aiTest?.id,
      currentTab: activeTab
    });

    debugLogger.addToFlow(flowId, 'info', 'AI test selection initiated', { 
      hasAiTest: !!aiTest, 
      testId: aiTest?.id,
      currentTab: activeTab
    });

    if (!aiTest) {
      debugLogger.addToFlow(flowId, 'warn', 'No AI test available for selection');
      debugLogger.endFlow(flowId, false, { error: 'No AI test available' });
      console.warn('❌ CRITICAL: No AI test available for selection');
      return;
    }

    debugLogger.addToFlow(flowId, 'debug', 'AI test data validation', {
      aiTestId: aiTest.id,
      aiTestTopic: aiTest.topic,
      aiTextLength: aiTest.text?.length,
      aiTextPreview: `"${aiTest.text.substring(0, 50)}..."`,
      currentTextToType: `"${textToType.substring(0, 50)}..."`,
      currentTextLength: textToType.length,
      isCurrentlyDummy: textToType.includes('The quick brown fox'),
      areTextsEqual: textToType === aiTest.text
    });
    
    // Update the text to type with AI generated content
    console.log('🔄 UPDATING textToType with AI content...');
    setTextToType(aiTest.text);
    
    // Split text into words for word-based tracking
    const wordArray = aiTest.text.split(' ');
    setWords(wordArray);
    
    console.log('🆔 UPDATING currentTestId...');
    setCurrentTestId(aiTest.id);
    
    // Clear any existing user input and reset typing state (word-based)
    console.log('🔄 RESETTING typing state...');
    setCurrentWordIndex(0);
    setUserWordInput("");
    setCompletedWords([]);
    setWordErrors({});
    
    // Legacy state reset for compatibility
    setUserInput("");
    setCurrentIndex(0);
    setErrors(0);
    setStatus('waiting');
    setTimeLeft(selectedTime);
    
    console.log('✅ AI TEST SELECTION COMPLETE - State updates dispatched', {
      newTestId: aiTest.id,
      newTextLength: aiTest.text.length,
      resetComplete: true
    });
    
    // Auto-select the AI test if there's no current text (for better UX)
    if (!textToType || textToType.length === 0) {
      console.log('🤖 Auto-selecting AI test since no text is set');
      // No need for timeout since we're in the same function
      // The text will be set synchronously above
    }
    
    // Verify state update worked (React state updates are async)
    setTimeout(() => {
      console.log('🔍 VERIFICATION: Checking if textToType was actually updated:', {
        currentTextToType: `"${textToType.substring(0, 50)}..."`,
        expectedAiText: `"${aiTest.text.substring(0, 50)}..."`,
        wasUpdated: textToType === aiTest.text,
        stillDummy: textToType.includes('The quick brown fox')
      });
    }, 100);
  }, [aiTest, selectedTime, textToType, activeTab]);

  // Add a ref to track if test is already being ended
  const isEndingTestRef = useRef(false);

  // Test lifecycle functions
  const endTest = useCallback(async () => {
    // Prevent multiple calls to endTest with double protection
    if (status !== 'running') {
      console.log('🛑 endTest called but status is not running, ignoring:', status);
      return;
    }

    // Second layer of protection - check if already ending
    if (isEndingTestRef.current) {
      console.log('🛑 endTest already in progress, preventing duplicate call');
      return;
    }

    // Set flag immediately to prevent concurrent calls
    isEndingTestRef.current = true;
    console.log('🏁 endTest started - setting flags to prevent duplicates');
    
    // Immediately set status to prevent race conditions
    setStatus('finished');
    setView('results');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Calculate final results from word-based state
    const timeTaken = Math.max(1, selectedTime - timeLeft); // Ensure minimum 1 second
    const timeInMinutes = timeTaken / 60;
    
    // Join completed words to get full user input for stats and API
    // CRITICAL: Add current word if user is mid-typing when test ends
    const allTypedWords = userWordInput.length > 0 
      ? [...completedWords, userWordInput]
      : completedWords;
    const fullUserInput = allTypedWords.join(' ');
    const totalErrors = Object.keys(wordErrors).length; // Count words with errors
    
    // Calculate correct characters for accuracy
    const correctChars = calculateCorrectCharacters(completedWords, words);
    
    console.log('📊 Final stats calculation:', {
      completedWords: completedWords.length,
      currentWordInput: userWordInput,
      fullUserInput: fullUserInput,
      fullUserInputLength: fullUserInput.length,
      totalErrors: totalErrors,
      correctCharacters: correctChars,
      calculationMethod: 'Gross WPM (MonkeyType formula)'
    });
    
    // MonkeyType Formula: WPM = (all characters typed / 5) / time_in_minutes
    // This is GROSS WPM - includes all characters (correct + incorrect)
    let wpm = 0;
    if (timeInMinutes > 0 && fullUserInput.length > 0) {
      wpm = Math.round((fullUserInput.length / 5) / timeInMinutes);
    }
    
    // Accuracy = (correct characters / total characters) * 100
    let accuracy = 0;
    if (fullUserInput.length > 0) {
      accuracy = Math.round((correctChars / fullUserInput.length) * 100);
    }
    
    // Ensure values are valid numbers (not NaN or Infinity)
    wpm = isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm);
    accuracy = isNaN(accuracy) || !isFinite(accuracy) ? 0 : Math.max(0, Math.min(100, accuracy));
    
    // Save final results to state for display
    setFinalWpm(wpm);
    setFinalAccuracy(accuracy);

    // Save test result using API route if user is authenticated
    if (user) {
      // Start comprehensive flow tracking for test submission
      const flowId = debugLogger.startFlow('TEST_SUBMISSION', 'Test Result Submission Process', {
        component: 'TestPage',
        action: 'submit_test_result',
        testType: activeTab === 'ai' ? 'ai' : 'practice'
      });

      try {
        // CRITICAL FIX: Use calculated values, not legacy state
        const testResultData = {
          wpm: wpm,
          accuracy: accuracy,
          errors: Math.max(0, totalErrors), // Use calculated totalErrors
          timeTaken: Math.max(0, timeTaken),
          textLength: Math.max(0, textToType.length),
          userInput: fullUserInput || '', // Use calculated fullUserInput
          testType: activeTab === 'ai' ? 'ai-generated' : 'practice',
          difficulty: selectedDifficulty || 'Medium',
          testId: currentTestId || `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        debugLogger.addToFlow(flowId, 'info', 'Test result data prepared for submission', {
          wpm,
          accuracy,
          errors: totalErrors,
          timeTaken,
          textLength: textToType.length,
          userInputLength: fullUserInput.length,
          testType: testResultData.testType,
          difficulty: testResultData.difficulty,
          testId: testResultData.testId,
          isAiGenerated: activeTab === 'ai',
          hasAiTest: !!aiTest,
          aiTestId: aiTest?.id,
          aiTestTopic: aiTest?.topic
        });

        debugLogger.addToFlow(flowId, 'debug', 'Data validation check', {
          wpmValid: typeof wpm === 'number' && !isNaN(wpm),
          accuracyValid: typeof accuracy === 'number' && !isNaN(accuracy),
          errorsValid: typeof totalErrors === 'number' && !isNaN(totalErrors),
          timeTakenValid: typeof timeTaken === 'number' && !isNaN(timeTaken),
          textLengthValid: typeof textToType.length === 'number' && !isNaN(textToType.length),
          userInputValid: typeof fullUserInput === 'string' && fullUserInput.length > 0
        });

        // Log API call
        debugLogger.logApiCall('POST', '/api/v1/submit-test-result', testResultData);
        
        const callStartTime = Date.now();
        
        // Call the Next.js API route instead of Cloud Function
        const response = await fetch('/api/v1/submit-test-result', {
          method: 'POST',
          headers: getHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          }),
          body: JSON.stringify(testResultData)
        });
        
        const callDuration = Date.now() - callStartTime;
        
        const result = await response.json();

        debugLogger.addToFlow(flowId, 'info', 'API response received', {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          callDuration,
          responseSize: JSON.stringify(result).length
        });

        // Log API response
        debugLogger.logApiCall('POST', '/api/submit-test-result', { 
          responseData: result, 
          duration: callDuration 
        }, response.ok);
        
        if (!response.ok) {
          debugLogger.addToFlow(flowId, 'error', 'API request failed', {
            status: response.status,
            statusText: response.statusText,
            error: result.error || 'Unknown error'
          });
          debugLogger.endFlow(flowId, false, {
            error: result.error || 'Failed to save test result',
            status: response.status
          });
          throw new Error(result.error || 'Failed to save test result');
        }

        debugLogger.addToFlow(flowId, 'info', 'Test result submitted successfully', {
          resultId: result.id || 'unknown',
          saved: true,
          testType: testResultData.testType
        });

        // End the flow successfully
        debugLogger.endFlow(flowId, true, {
          resultId: result.id || 'unknown',
          wpm,
          accuracy,
          testType: testResultData.testType,
          saved: true
        });

        console.log('Test result submitted successfully:', result);
        
        // Show success feedback to user
        // TODO: Add toast notification for better UX
        
      } catch (error) {
        debugLogger.addToFlow(flowId, 'critical', 'Test submission failed with error', {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorCode: error instanceof Error ? (error as any).code : undefined,
          errorDetails: error instanceof Error ? (error as any).details : undefined
        });

        debugLogger.endFlow(flowId, false, {
          error: error instanceof Error ? error.message : 'Unknown error',
          errorCode: error instanceof Error ? (error as any).code : undefined
        });

        console.error('Error submitting test result:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', {
          code: error instanceof Error ? (error as any).code : undefined,
          message: errorMessage,
          details: error instanceof Error ? (error as any).details : undefined
        });
        
        // Show error feedback to user
        // TODO: Add error toast notification
        alert(`Failed to save test result: ${errorMessage}. Please try again.`);
      }
    } else {
      debugLogger.info('TEST_SUBMISSION', 'User not authenticated - skipping test result submission', {
        hasUser: false,
        testType: activeTab === 'ai' ? 'ai' : 'practice',
        wpm,
        accuracy
      });
      console.log('User not authenticated, not saving test result');
    }

    // Reset the ending flag at the very end
    isEndingTestRef.current = false;
    console.log('✅ endTest completed - reset ending flag');
  }, [user, selectedTime, timeLeft, userInput, textToType, errors, selectedDifficulty, currentTestId, status, completedWords, words, calculateCorrectCharacters, wordErrors, userWordInput]);

  // Update the ref whenever endTest changes
  useEffect(() => {
    endTestRef.current = endTest;
  }, [endTest]);

  // Track textToType state changes for critical debugging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 textToType STATE CHANGED:', {
        newLength: textToType.length,
        isDummyText: textToType.includes('The quick brown fox'),
        isAiText: !textToType.includes('The quick brown fox') && textToType.length > 100,
        preview: `"${textToType.substring(0, 50)}..."`,
        timestamp: new Date().toISOString()
      });
    }
  }, [textToType]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && debugLogger.isDebugEnabled && aiTest) {
      console.log('🔍 DEBUG: aiTest updated', {
        testId: aiTest.id,
        textLength: aiTest.text?.length || 0,
        topic: aiTest.topic
      });
    }
  }, [aiTest, debugLogger]);

  // Simple timer logic - starts when status is 'running', stops when not
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Call endTest via ref when timer ends - this ensures proper state without dependency issues
            if (endTestRef.current) {
              endTestRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]); // ← CRITICAL: Only depend on status, use ref for endTest

  const startTest = useCallback(() => {
    console.log('🚀 START TYPING CLICKED - Starting test with current state:', {
      textToTypePreview: `"${textToType.substring(0, 50)}..."`,
      textToTypeLength: textToType.length,
      isDummyText: textToType.includes('The quick brown fox'),
      isAiText: !textToType.includes('The quick brown fox') && textToType.length > 100,
      hasAiTest: !!aiTest,
      aiTestId: aiTest?.id,
      currentTestId: currentTestId,
      activeTab,
      timestamp: new Date().toISOString()
    });
    
    // Reset the ending flag for new test (prevent issues from previous test)
    isEndingTestRef.current = false;
    console.log('🔄 Reset ending flag for new test');
    
    // CRITICAL CHECK: If we're in AI tab but still have dummy text, something is wrong
    if (activeTab === 'ai' && textToType.includes('The quick brown fox')) {
      console.error('🚨 CRITICAL ISSUE: AI tab selected but textToType still contains dummy text!');
      console.error('🚨 AI Test State:', {
        aiTest: aiTest ? {
          id: aiTest.id,
          textLength: aiTest.text?.length,
          textPreview: aiTest.text?.substring(0, 50)
        } : 'null'
      });
    }
    
    // Reset word-based state
    setCurrentWordIndex(0);
    setUserWordInput("");
    setCompletedWords([]);
    setWordErrors({});
    
    // Reset legacy state for compatibility
    setUserInput("");
    setCurrentIndex(0);
    setErrors(0);
    setTimeLeft(selectedTime);
    setStatus('waiting');
    setView('active');
    
    // Generate a test ID for practice tests only (don't override AI test IDs)
    if (activeTab === 'practice' || !currentTestId) {
      const testId = `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentTestId(testId);
      console.log('🆔 Generated new practice test ID:', testId);
    } else {
      console.log('🆔 Keeping existing test ID (AI test):', currentTestId);
    }
    
    console.log('✅ START TEST COMPLETE - View switched to active', {
      finalTextPreview: `"${textToType.substring(0, 50)}..."`,
      finalTextLength: textToType.length,
      finalTestId: currentTestId,
      readyToType: true
    });
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [selectedTime, textToType, aiTest, activeTab, currentTestId]);

  const tryAgain = useCallback(() => {
    setView('config');
    setStatus('waiting');
  }, []);

  // Modal action handlers
  const handleUsePracticeTest = useCallback(() => {
    debugLogger.logUserInteraction('clicked', 'Use Practice Test Button', {
      source: 'modal',
      modalType,
      previousTab: activeTab
    });

    // Close modal
    setShowModal(false);

    // Switch to practice tab
    setActiveTab('practice');

    debugLogger.logUserInteraction('tab_switched', 'Practice Tab', {
      trigger: 'modal_action',
      from: activeTab,
      to: 'practice'
    });
  }, [debugLogger, modalType, activeTab]);

  const handleGetProOffer = useCallback(() => {
    debugLogger.logUserInteraction('clicked', 'Get Pro Offer Button', {
      source: 'modal',
      modalType,
      offer: '73% OFF Black Friday'
    });

    // TODO: Implement checkout flow (Stripe/Paddle integration)
    // For now, log the interaction
    console.log('🛒 Pro offer clicked - checkout flow to be implemented');
    
    // Close modal
    setShowModal(false);

    alert('Checkout system coming soon! Pro features will include unlimited AI tests, advanced statistics, and more.');
  }, [debugLogger, modalType]);

  const handleModalClose = useCallback(() => {
    debugLogger.logUserInteraction('modal_closed', 'AI Modal Closed', {
      modalType,
      method: 'user_action'
    });

    setShowModal(false);
  }, [debugLogger, modalType]);

  const handleTryAgainError = useCallback(() => {
    debugLogger.logUserInteraction('clicked', 'Try Again Button', {
      source: 'error_modal',
      previousError: 'ai_generation_failed'
    });

    // Close modal
    setShowModal(false);

    // User can try generating again with the same topic
    console.log('🔄 User will retry AI generation with same parameters');
  }, [debugLogger]);

  // Core typing engine - WORD-BASED TRACKING
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    
    const key = event.key;

    // ENTER KEY STARTS THE TIMER
    if (key === 'Enter' && status === 'waiting') {
      setStatus('running');
      return;
    }

    // Don't process other keys if not running
    if (status !== 'running') {
      return;
    }

    const currentWord = words[currentWordIndex];
    
    // Handle SPACE - commit current word and advance
    // CRITICAL: Prevent spacebar if no input (MonkeyType behavior)
    if (key === ' ') {
      // Block spacebar if user hasn't typed anything yet
      if (userWordInput.length === 0) {
        console.log('🚫 Blocked empty spacebar - user must type at least one character');
        return;
      }
      
      // User has typed something, allow word commit
      if (userWordInput.length > 0) {
        // Check if current word has errors
        const hasError = userWordInput !== currentWord;
        if (hasError) {
          setWordErrors(prev => ({ ...prev, [currentWordIndex]: true }));
        }
        
        // Add current word to completed words
        setCompletedWords(prev => [...prev, userWordInput]);
        
        // Move to next word
        setCurrentWordIndex(prev => prev + 1);
        setUserWordInput("");
        
        // Check if test is complete (no more words)
        if (currentWordIndex + 1 >= words.length) {
          endTest();
        }
      }
      return;
    }
    
    // Handle BACKSPACE
    if (key === 'Backspace') {
      if (userWordInput.length > 0) {
        // Remove last character from current word
        setUserWordInput(prev => prev.slice(0, -1));
      } else if (currentWordIndex > 0) {
        // Move back to previous word if at start of current word
        setCurrentWordIndex(prev => prev - 1);
        const previousWord = completedWords[completedWords.length - 1];
        setUserWordInput(previousWord || "");
        setCompletedWords(prev => prev.slice(0, -1));
        // Remove error flag for previous word (allow correction)
        setWordErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[currentWordIndex - 1];
          return newErrors;
        });
      }
      return;
    }

    // Handle regular character input
    if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      // Allow typing beyond word length (errors contained per word)
      setUserWordInput(prev => prev + key);
    }
  }, [status, words, currentWordIndex, userWordInput, completedWords, endTest]);

  // Pause/Resume toggle
  const togglePause = useCallback(() => {
    if (status === 'running') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('running');
    }
  }, [status]);

  // Early return for loading state to prevent hydration issues
  if (isLoading || !isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Calculate live stats from word-based state
  const currentUserInput = completedWords.join(' ') + (userWordInput ? ' ' + userWordInput : '');
  const currentErrors = Object.keys(wordErrors).length;
  
  // MonkeyType Formula: Gross WPM = (all characters typed / 5) / time_in_minutes
  // Includes ALL characters typed (correct + incorrect + spaces)
  const timePassed = (selectedTime - timeLeft) / 60; // Convert to minutes
  
  const wpm = status === 'running' && timeLeft < selectedTime && timePassed > 0
    ? Math.round((currentUserInput.length / 5) / timePassed)
    : 0;
  
  // Real-time accuracy: (correct characters / total characters typed) * 100
  const correctChars = calculateCorrectCharacters(completedWords, words);
  const totalCharsTyped = currentUserInput.length;
  
  const accuracy = totalCharsTyped > 0
    ? Math.round((correctChars / totalCharsTyped) * 100)
    : 100;

  // Render text with word-based highlighting
  const renderText = () => {
    // One-time diagnostic to track what's being rendered (prevent infinite loops)
    if (words.length > 0) {
      const textSignature = words.slice(0, 3).join(' ');
      if ((window as any).zenTypeLastRenderLog !== textSignature) {
        console.log('🎨 RENDERING TEXT - Word-based display:', {
          totalWords: words.length,
          currentWordIndex,
          completedWords: completedWords.length,
          currentWord: words[currentWordIndex] || 'N/A',
          userInput: userWordInput,
          timestamp: new Date().toISOString()
        });
        (window as any).zenTypeLastRenderLog = textSignature;
      }
    }
    
    return words.map((word, wordIndex) => {
      // Determine word state
      const isCompleted = wordIndex < currentWordIndex;
      const isCurrent = wordIndex === currentWordIndex;
      const isFuture = wordIndex > currentWordIndex;
      
      // Remove transition-all for instant updates (smooth, butter-like feel)
      // Only keep spacing classes - no visual delay on word changes
      let wordClassName = "inline-block mr-2";
      
      if (isCompleted) {
        // Completed word - ALWAYS show original text with color feedback (MonkeyType behavior)
        const hasError = wordErrors[wordIndex];
        const targetWord = word; // Original word from test
        const typedWord = completedWords[wordIndex] || ""; // What user actually typed
        
        // If no error, render entire original word as green (optimization)
        if (!hasError) {
          return (
            <span key={wordIndex} className="inline-block mr-2 text-green-500">
              {targetWord}
            </span>
          );
        }
        
        // If error exists, render ORIGINAL word character-by-character with color feedback
        // CRITICAL: Always show 'char' (original), not 'typedChar' (user's mistake)
        return (
          <span key={wordIndex} className="inline-block mr-2">
            {targetWord.split('').map((char, charIndex) => {
              const typedChar = typedWord[charIndex];
              const isCorrect = typedChar === char;
              
              return (
                <span 
                  key={charIndex} 
                  className={isCorrect ? "text-green-500" : "text-red-500 bg-red-500/10"}
                >
                  {char}
                </span>
              );
            })}
            {/* Show extra characters typed beyond word length */}
            {typedWord.length > targetWord.length && (
              <span className="text-red-500 bg-red-500/20">
                {typedWord.slice(targetWord.length)}
              </span>
            )}
          </span>
        );
      } else if (isCurrent && status === 'running') {
        // Current word being typed
        const targetWord = word;
        const typedWord = userWordInput;
        
        return (
          <span key={wordIndex} className="inline-block mr-2">
            {targetWord.split('').map((char, charIndex) => {
              const typedChar = typedWord[charIndex];
              let charClassName = "transition-colors duration-150";
              
              if (charIndex < typedWord.length) {
                // Character has been typed
                charClassName += typedChar === char ? " text-green-500" : " text-red-500 bg-red-500/10";
              } else if (charIndex === typedWord.length) {
                // Current cursor position
                charClassName += " text-foreground bg-[#00BFFF]/20 border-b-2 border-[#00BFFF]";
              } else {
                // Not yet typed
                charClassName += " text-muted-foreground";
              }
              
              return (
                <span key={charIndex} className={charClassName}>
                  {char}
                </span>
              );
            })}
            {/* Show extra characters typed beyond word length */}
            {typedWord.length > targetWord.length && (
              <span className="text-red-500 bg-red-500/20">
                {typedWord.slice(targetWord.length)}
              </span>
            )}
          </span>
        );
      } else if (isCurrent && status === 'waiting') {
        // Current word in waiting state (before test starts)
        wordClassName += " text-foreground";
        return (
          <span key={wordIndex} className={wordClassName}>
            {word}
          </span>
        );
      } else {
        // Future word
        wordClassName += " text-muted-foreground";
        return (
          <span key={wordIndex} className={wordClassName}>
            {word}
          </span>
        );
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Configuration constants
  const timeOptions = ["30", "60", "120", "300"];
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  // Configuration View
  if (view === 'config') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Configure Your Test</h1>
              <p className="text-muted-foreground">
                Customize your typing test settings for the perfect practice session
              </p>
            </div>
            <GlassCard className="space-y-8">
              <Tabs value={activeTab} onValueChange={(value: string) => {
                setActiveTab(value);
                if (value === "practice") setTopic("");
              }}>
                <TabsList className="grid w-full grid-cols-2 bg-accent">
                  <TabsTrigger
                    value="practice"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Practice Test
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    AI-Generated Test
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="practice" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground text-lg mb-3 block">
                        <Clock className="inline mr-2 h-5 w-5" />
                        Time
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeOptions.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === parseInt(time) ? "default" : "outline"}
                            onClick={() => setSelectedTime(parseInt(time))}
                            className={
                              selectedTime === parseInt(time)
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "border-border text-foreground hover:bg-accent"
                            }
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground text-lg mb-3 block">
                        <Target className="inline mr-2 h-5 w-5" />
                        Difficulty
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {difficultyOptions.map((difficulty) => (
                          <Button
                            key={difficulty}
                            variant={selectedDifficulty === difficulty ? "default" : "outline"}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={
                              selectedDifficulty === difficulty
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "border-border text-foreground hover:bg-accent"
                            }
                          >
                            {difficulty}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Test Selection Section */}
                    <div>
                      <Label className="text-foreground text-lg mb-3 block">
                        <Type className="inline mr-2 h-5 w-5" />
                        Choose Test
                      </Label>
                      
                      {testsLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-3 text-muted-foreground">Loading tests...</span>
                        </div>
                      )}
                      
                      {testsError && (
                        <div className="text-center py-8">
                          <p className="text-destructive mb-4">❌ {testsError}</p>
                          <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                            className="border-border text-foreground hover:bg-accent"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                      
                      {!testsLoading && !testsError && preMadeTests.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">No tests available for the current filters.</p>
                          <p className="text-sm text-muted-foreground">Try changing the difficulty or time settings.</p>
                        </div>
                      )}
                      
                      {!testsLoading && !testsError && preMadeTests.length > 0 && (
                        <>
                          <div className="grid gap-3 max-h-96 overflow-y-auto">
                            {preMadeTests.map((test) => (
                              <div
                                key={test.id}
                                className={`
                                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                                  ${selectedTestId === test.id
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/50 hover:bg-accent'
                                  }
                                `}
                                onClick={() => handleTestSelection(test)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">{test.source}</span>
                                    <span className={`
                                      px-2 py-1 rounded text-xs font-medium
                                      ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                      }
                                    `}>
                                      {test.difficulty}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <span>{test.wordCount} words</span>
                                    <span className="mx-2">•</span>
                                    <span>{test.timeLimit < 60 ? `${test.timeLimit}s` : `${test.timeLimit / 60}m`}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {test.text.substring(0, 120)}...
                                </p>
                                {selectedTestId === test.id && (
                                  <div className="mt-2 text-sm text-primary font-medium">
                                    ✓ Selected - Ready to start typing
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Load More Button */}
                          {testsPagination.hasNextPage && (
                            <div className="flex justify-center mt-4">
                              <Button
                                variant="outline"
                                onClick={loadMoreTests}
                                disabled={testsPagination.loading}
                                className="min-w-32"
                              >
                                {testsPagination.loading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                    Loading...
                                  </>
                                ) : (
                                  'Load More Tests'
                                )}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ai" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground text-lg mb-3 block">
                        <Clock className="inline mr-2 h-5 w-5" />
                        Time
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeOptions.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === parseInt(time) ? "default" : "outline"}
                            onClick={() => setSelectedTime(parseInt(time))}
                            className={
                              selectedTime === parseInt(time)
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "border-border text-foreground hover:bg-accent"
                            }
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground text-lg mb-3 block">
                        <Target className="inline mr-2 h-5 w-5" />
                        Difficulty
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {difficultyOptions.map((difficulty) => (
                          <Button
                            key={difficulty}
                            variant={selectedDifficulty === difficulty ? "default" : "outline"}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={
                              selectedDifficulty === difficulty
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : "border-border text-foreground hover:bg-accent"
                            }
                          >
                            {difficulty}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="topic" className="text-foreground text-lg mb-3 block">
                        <Zap className="inline mr-2 h-5 w-5" />
                        Topic
                      </Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Technology, Nature, History"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-accent border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    
                    {/* AI Generation Section */}
                    {!isGenerating && !aiTest && (
                      <div className="mt-4">
                        <Button
                          onClick={handleGenerateAiTest}
                          disabled={!topic.trim() || isGenerating}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          {isGenerating ? 'Generating...' : 'Generate Test'}
                        </Button>
                      </div>
                    )}
                    
                    {/* Loading Animation */}
                    {isGenerating && (
                      <div className="mt-4 text-center space-y-4">
                        <div className="animate-pulse">
                          <div className="flex justify-center mb-4">
                            <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-bounce"></div>
                          </div>
                          <p className="text-foreground text-lg">Your expert typing coach is generating a new test...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Generated Test Display */}
                    {console.log('🔍 AI TEST CARD RENDER CHECK:', {
                      hasAiTest: !!aiTest,
                      aiTestId: aiTest?.id,
                      isGenerating,
                      shouldShowCard: aiTest && !isGenerating,
                      topic,
                      aiTestTextLength: aiTest?.text?.length,
                      timestamp: new Date().toISOString()
                    })}
                    {aiTest && !isGenerating && (
                      <div className="mt-4">
                        {/* AI Test Card Rendering */}
                        <GlassCard 
                          className={`p-4 border-2 cursor-pointer transition-all duration-200 hover:border-primary/50`}
                          onClick={(e) => {
                            console.log('🔥 AI TEST CARD CLICKED! Event triggered:', {
                              aiTestId: aiTest?.id,
                              eventType: e.type,
                              timestamp: new Date().toISOString()
                            });
                            handleAiTestSelection();
                          }}
                          style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }} // Temporary red tint for visibility
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">AI Generated: {topic}</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedDifficulty} • ~{aiTest?.wordCount || 100} words
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {aiTest?.text?.substring(0, 100)}...
                          </p>
                        </GlassCard>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                onClick={() => {
                  console.log('🚀 START TYPING BUTTON CLICKED:', {
                    textToType: textToType || 'EMPTY',
                    textLength: textToType?.length || 0,
                    hasText: !!textToType && textToType.length > 0,
                    currentActiveTab: activeTab,
                    hasAiTest: !!aiTest,
                    aiTestId: aiTest?.id,
                    selectedTestId: selectedTestId || 'none',
                    shouldBeDisabled: (activeTab === 'practice' && !selectedTestId) || (activeTab === 'ai' && !aiTest),
                    timestamp: new Date().toISOString()
                  });
                  startTest();
                }}
                disabled={
                  (activeTab === 'practice' && !selectedTestId) || 
                  (activeTab === 'ai' && !aiTest)
                }
                className={`
                  w-full text-xl py-6
                  ${((activeTab === 'practice' && !selectedTestId) || (activeTab === 'ai' && !aiTest))
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }
                `}
              >
                {activeTab === 'practice' && !selectedTestId 
                  ? 'Select a test to begin'
                  : activeTab === 'ai' && !aiTest
                  ? 'Generate a test to begin'
                  : 'Start Typing'
                }
              </Button>
            </GlassCard>
          </div>
        </main>

        {/* ZenType Modal for AI failures and promotions */}
        <ZenTypeModal
          isOpen={showModal}
          onClose={handleModalClose}
          type={modalType}
          title={
            modalType === 'promotional'
              ? '🎉 Unlimited AI Tests with Pro'
              : '❌ AI Generation Failed'
          }
          description={
            modalType === 'promotional'
              ? 'Our AI service is experiencing high demand. Upgrade to ZenType Pro for priority access and unlimited AI-generated tests!'
              : 'Something went wrong while generating your test. Please try again or use a practice test instead.'
          }
          primaryAction={
            modalType === 'promotional'
              ? {
                  label: 'Get Pro - 73% OFF',
                  onClick: handleGetProOffer,
                  variant: 'default' as const
                }
              : {
                  label: 'Try Again',
                  onClick: handleTryAgainError,
                  variant: 'default' as const
                }
          }
          secondaryAction={{
            label: 'Use Practice Test',
            onClick: handleUsePracticeTest
          }}
        />
      </div>
    );
  }

  // Active Typing View
  if (view === 'active') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <GlassCard className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{wpm}</div>
                <div className="text-muted-foreground text-sm">WPM</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{accuracy}%</div>
                <div className="text-muted-foreground text-sm">Accuracy</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{formatTime(timeLeft)}</div>
                <div className="text-muted-foreground text-sm">Time</div>
              </GlassCard>
            </div>

            {/* Direct Theme/Font Controls for Real-Time Test Customization */}
            <div className="flex justify-end space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => {
                    console.log('🎨 Theme changed to:', value);
                    setTheme(value);
                  }}
                >
                  <SelectTrigger className="w-48 h-9 text-sm glass-card border-border bg-background/50">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border max-h-[300px]">
                    {availableThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id} className="text-sm py-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.gradient} border border-border/50 flex-shrink-0`}
                          />
                          <span className="whitespace-nowrap">{theme.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={preferences.font}
                  onValueChange={(value) => {
                    console.log('🔤 Font changed to:', value);
                    setFont(value);
                  }}
                >
                  <SelectTrigger className="w-48 h-9 text-sm glass-card border-border bg-background/50">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border max-h-[300px]">
                    {availableFonts.map((font) => (
                      <SelectItem key={font.id} value={font.id} className={`text-sm py-2 ${font.className}`}>
                        <span className="whitespace-nowrap">{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              className={`p-8 cursor-text bg-gradient-to-br ${currentTheme.gradient} rounded-lg border border-border shadow-lg transition-all duration-300`}
              onClick={() => {
                console.log('📦 Current theme applied:', {
                  id: currentTheme.id,
                  name: currentTheme.name,
                  gradient: currentTheme.gradient
                });
                inputRef.current?.focus();
              }}
            >
              <div
                className={`text-xl leading-relaxed mb-6 select-none ${currentFont.className} ${dynamicTextColor} word-wrap break-word overflow-wrap break-word`}
                style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
              >
                {renderText()}
              </div>

              <input
                ref={inputRef}
                className="absolute opacity-0 pointer-events-none"
                onKeyDown={handleKeyDown}
                autoFocus
                value=""
                onChange={() => {}}
                style={{ left: "-9999px" }}
              />

              <div className="h-1 bg-border rounded-full mb-4">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${words.length > 0 ? (currentWordIndex / words.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="text-center text-muted-foreground">
                {status === 'waiting' ? (
                  <p className="text-sm">Press <strong>ENTER</strong> to start the test, then begin typing</p>
                ) : (
                  <p className="text-sm">Click here and start typing to continue the test</p>
                )}
              </div>

              {/* Resume/Finish Test buttons positioned directly below the typing test */}
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={togglePause}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent bg-transparent"
                >
                  {status === 'running' ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  ref={finishButtonRef}
                  onClick={endTest}
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent bg-transparent"
                >
                  Finish Test
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results View
  if (view === 'results') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Test Complete!</h1>
              <p className="text-muted-foreground">Here&apos;s how you performed</p>
            </div>
            <GlassCard className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{finalWpm}</div>
                  <div className="text-foreground">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{finalAccuracy}%</div>
                  <div className="text-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{errors}</div>
                  <div className="text-foreground">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{formatTime(selectedTime - timeLeft)}</div>
                  <div className="text-foreground">Time Taken</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={tryAgain}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline" 
                  className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    );
  }

  return null;
}