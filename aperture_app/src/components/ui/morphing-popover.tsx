'use client';

import React, {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  Transition,
  HTMLMotionProps,
} from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MorphingPopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  close: () => void;
}

const MorphingPopoverContext = createContext<MorphingPopoverContextType | null>(null);

export function useMorphingPopover(): MorphingPopoverContextType {
  const context = useContext(MorphingPopoverContext);
  if (!context) {
    throw new Error(
      'useMorphingPopover must be used within a MorphingPopover component'
    );
  }
  return context;
}

export interface MorphingPopoverProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  transition?: Transition;
  className?: string;
}

export function MorphingPopover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  transition = {
    type: 'spring',
    bounce: 0.05,
    duration: 0.35,
  },
  className,
}: MorphingPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const uniqueId = useId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const setIsOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Handle click outside & Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (contentRef.current && !contentRef.current.contains(target)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <MorphingPopoverContext.Provider
      value={{
        isOpen,
        setIsOpen,
        uniqueId,
        triggerRef,
        contentRef,
        close,
      }}
    >
      <MotionConfig transition={transition}>
        <div className={cn('relative', className)}>{children}</div>
      </MotionConfig>
    </MorphingPopoverContext.Provider>
  );
}

export interface MorphingPopoverTriggerProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  asChild?: boolean;
}

export function MorphingPopoverTrigger({
  children,
  className,
  asChild = false,
  ...props
}: MorphingPopoverTriggerProps) {
  const { isOpen, setIsOpen, uniqueId, triggerRef } = useMorphingPopover();

  if (isOpen) {
    return null;
  }

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`popover-${uniqueId}`}
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      onClick={() => setIsOpen(true)}
      style={{ borderRadius: 9999 }}
      className={cn(
        'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A875]',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export interface MorphingPopoverContentProps
  extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export function MorphingPopoverContent({
  children,
  className,
  ...props
}: MorphingPopoverContentProps) {
  const { isOpen, uniqueId, contentRef } = useMorphingPopover();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          layoutId={`popover-${uniqueId}`}
          role="dialog"
          aria-modal="true"
          style={{ borderRadius: 16 }}
          className={cn(
            'relative overflow-hidden z-30 focus:outline-none',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface MorphingPopoverCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

export function MorphingPopoverClose({
  className,
  children,
  ...props
}: MorphingPopoverCloseProps) {
  const { close } = useMorphingPopover();

  return (
    <button
      type="button"
      aria-label="Close inquiry popover"
      onClick={close}
      className={cn(
        'p-1.5 rounded-full text-[#B9AD9A] hover:text-[#F3EBDD] hover:bg-[#30251F]/70 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A875] cursor-pointer',
        className
      )}
      {...props}
    >
      {children || <X className="w-4 h-4" />}
    </button>
  );
}

export interface MorphingPopoverTitleProps
  extends HTMLMotionProps<'h3'> {
  children: ReactNode;
  className?: string;
}

export function MorphingPopoverTitle({
  children,
  className,
  ...props
}: MorphingPopoverTitleProps) {
  const { uniqueId } = useMorphingPopover();

  return (
    <motion.h3
      layoutId={`popover-label-${uniqueId}`}
      className={cn(
        'font-serif-editorial text-[24px] sm:text-[26px] font-medium text-[#F3EBDD]',
        className
      )}
      {...props}
    >
      {children}
    </motion.h3>
  );
}

export interface MorphingPopoverDescriptionProps
  extends HTMLMotionProps<'p'> {
  children: ReactNode;
  className?: string;
}

export function MorphingPopoverDescription({
  children,
  className,
  ...props
}: MorphingPopoverDescriptionProps) {
  return (
    <motion.p
      className={cn('text-[14.5px] leading-relaxed text-[#B9AD9A]', className)}
      {...props}
    >
      {children}
    </motion.p>
  );
}
