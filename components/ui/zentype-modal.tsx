'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export interface ZenTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'promotional' | 'error';
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Reusable ZenType Modal Component
 * 
 * Features:
 * - Blurred backdrop overlay
 * - Responsive design
 * - Theme-aware (dark/light mode)
 * - Navigation stays visible
 * - Polymorphic colors matching ZenType brand
 * 
 * Usage:
 * - Promotional offers
 * - Error messages
 * - Important notifications
 */
export function ZenTypeModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  primaryAction,
  secondaryAction,
}: ZenTypeModalProps) {
  const router = useRouter();

  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const Icon = type === 'promotional' ? Sparkles : AlertCircle;
  const iconColor = type === 'promotional' 
    ? 'text-blue-500 dark:text-blue-400' 
    : 'text-destructive';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Blurred Backdrop - doesn't cover navigation */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg",
          "bg-background/95 dark:bg-card/95",
          "backdrop-blur-xl",
          "border border-border/50",
          "rounded-2xl shadow-2xl",
          "p-6 md:p-8",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          // Polymorphic gradient border effect
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          "before:bg-gradient-to-br before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20",
          "before:-z-10 before:blur-sm",
          type === 'promotional' && "before:opacity-100",
          type === 'error' && "before:from-destructive/20 before:via-destructive/10 before:to-destructive/20"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4",
            "p-2 rounded-lg",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent/50 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            "p-3 rounded-full",
            type === 'promotional' && "bg-blue-500/10 dark:bg-blue-500/20",
            type === 'error' && "bg-destructive/10 dark:bg-destructive/20"
          )}>
            <Icon className={cn("size-8", iconColor)} />
          </div>
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground"
        >
          {title}
        </h2>

        {/* Description */}
        <p className="text-center text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || 'default'}
              className="flex-1 h-11 text-base font-semibold"
            >
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="flex-1 h-11 text-base"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>

        {/* Footer hint for promotional */}
        {type === 'promotional' && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            Limited time offer • Secure checkout • Cancel anytime
          </p>
        )}
      </div>
    </div>
  );
}
