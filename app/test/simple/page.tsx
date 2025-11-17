'use client';

/**
 * Simple Mode - Quick Test Generation
 * /test/simple
 * 
 * Allows users to paste their own text and generate a typing test
 * without configuring difficulty or time parameters.
 * 
 * Features:
 * - Large textarea for text input
 * - Real-time character/word counter
 * - Validation: 50-5000 characters
 * - Counts against daily AI test limit
 * - No AI processing (faster, no cost)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { ArrowLeft, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/client';

export default function SimpleModeTestPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  
  // Character and word counts
  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Validation
  const isValid = charCount >= 50 && charCount <= 5000;
  const canGenerate = isValid && !isGenerating && !authLoading;
  
  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) {
        setLoadingSubscription(false);
        return;
      }
      
      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/v1/user/subscription', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data);
          console.log('[Simple Mode] Subscription status loaded', data);
        } else {
          console.error('[Simple Mode] Failed to fetch subscription status');
        }
      } catch (error) {
        console.error('[Simple Mode] Error fetching subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };
    
    if (!authLoading) {
      fetchSubscriptionStatus();
    }
  }, [user, authLoading]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call Cloud Function to generate simple test using Firebase SDK
      const generateSimpleTest = httpsCallable(functions, 'generateSimpleTest');
      const result = await generateSimpleTest({ text: text.trim() });
      
      const data = result.data as { testId: string; wordCount: number; message: string };
      
      console.log('[Simple Mode] Test generated successfully', {
        testId: data.testId,
        wordCount: data.wordCount
      });
      
      // Redirect to test page with the generated test
      router.push(`/test?mode=ai&testId=${data.testId}`);
      
    } catch (error: any) {
      console.error('[Simple Mode] Generation error:', error);
      
      // Check for subscription limit error (resource-exhausted)
      if (error.code === 'functions/resource-exhausted') {
        setError('Daily AI test limit reached. Upgrade to Premium for unlimited tests.');
        console.warn('[Simple Mode] Subscription limit reached');
      } else if (error.code === 'functions/unauthenticated') {
        setError('Please log in to generate tests.');
        router.push('/login');
      } else {
        setError(error.message || 'Failed to generate test. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Show loading state while auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/test')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Test Page
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Simple Mode</h1>
          </div>
          <p className="text-muted-foreground">
            Paste your own text and generate a typing test instantly. No configuration needed.
          </p>
        </div>
        
        {/* Subscription Status Banner */}
        {!loadingSubscription && subscriptionStatus && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                {subscriptionStatus.tier === 'premium' ? (
                  <p className="text-sm">
                    ✨ <span className="font-semibold">Premium:</span> Unlimited AI tests
                  </p>
                ) : (
                  <p className="text-sm">
                    📊 <span className="font-semibold">{subscriptionStatus.aiTestsRemaining} of {subscriptionStatus.dailyLimit}</span> AI tests remaining today
                  </p>
                )}
              </div>
              {subscriptionStatus.tier === 'free' && subscriptionStatus.aiTestsRemaining === 0 && (
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Textarea */}
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium mb-2">
              Paste Your Text
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here... (50-5000 characters)"
              className="w-full h-64 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isGenerating}
            />
            
            {/* Character/Word Counter */}
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center gap-4">
                <span className={charCount < 50 || charCount > 5000 ? 'text-destructive' : 'text-muted-foreground'}>
                  {charCount} / 5000 characters
                </span>
                <span className="text-muted-foreground">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
              </div>
              
              {/* Validation Messages */}
              {charCount > 0 && (
                <div>
                  {charCount < 50 && (
                    <span className="text-destructive text-xs">
                      Need {50 - charCount} more characters
                    </span>
                  )}
                  {charCount > 5000 && (
                    <span className="text-destructive text-xs">
                      {charCount - 5000} characters over limit
                    </span>
                  )}
                  {isValid && (
                    <span className="text-green-600 text-xs">
                      ✓ Ready to generate
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">{error}</p>
                {error.includes('limit reached') && (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="text-sm font-semibold text-primary hover:underline mt-1"
                  >
                    View Premium Plans
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Test...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Test
              </>
            )}
          </button>
          
          {/* Info Box */}
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <h3 className="font-semibold text-sm mb-2">How Simple Mode Works:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Paste any text between 50-5000 characters</li>
              <li>• No AI processing (faster generation, no cost)</li>
              <li>• Text is cleaned and formatted automatically</li>
              <li>• Counts against your daily AI test limit</li>
              <li>• Perfect for practicing with specific content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
