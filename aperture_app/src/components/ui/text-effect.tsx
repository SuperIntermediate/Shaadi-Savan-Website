import React from 'react';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from 'motion/react';
import { cn } from '../../lib/utils';

export type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide';
export type PerType = 'word' | 'char' | 'line';

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.025,
  word: 0.05,
  line: 0.08,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container?: Variants; item: Variants }
> = {
  blur: {
    item: {
      hidden: { opacity: 0, filter: 'blur(8px)', y: 4 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
      exit: { opacity: 0, filter: 'blur(8px)', y: 4 },
    },
  },
  fade: {
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    item: {
      hidden: { opacity: 0, y: 14 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 14 },
    },
  },
  scale: {
    item: {
      hidden: { opacity: 0, scale: 0.92 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.92 },
    },
  },
  shake: {
    item: {
      hidden: { x: 0 },
      visible: { x: [-3, 3, -3, 3, 0] },
      exit: { x: 0 },
    },
  },
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'blur',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  if (typeof children !== 'string') {
    return null;
  }

  const baseDuration = 0.35;
  const baseStagger = defaultStaggerTimes[per] || 0.05;

  // speedReveal controls overall reveal progression (stagger between segments)
  const computedStagger = Math.max(0.01, baseStagger / speedReveal);

  // speedSegment controls animation speed of individual segments
  const computedDuration = Math.max(0.08, baseDuration / speedSegment);

  const selectedPresetVariants = preset ? presetVariants[preset] : { item: defaultItemVariants };

  const customContainerVariants = variants?.container || selectedPresetVariants.container || defaultContainerVariants;
  const customItemVariants = variants?.item || selectedPresetVariants.item || defaultItemVariants;

  const itemVariants: Variants = {
    hidden: {
      ...customItemVariants.hidden,
    },
    visible: {
      ...customItemVariants.visible,
      transition: {
        duration: computedDuration,
        ease: [0.2, 0.65, 0.3, 0.9],
        ...segmentTransition,
        ...(customItemVariants.visible as TargetAndTransition)?.transition,
      },
    },
    exit: {
      ...customItemVariants.exit,
      transition: {
        duration: computedDuration,
        ...segmentTransition,
        ...(customItemVariants.exit as TargetAndTransition)?.transition,
      },
    },
  };

  const containerVariants: Variants = {
    hidden: {
      ...customContainerVariants.hidden,
    },
    visible: {
      ...customContainerVariants.visible,
      transition: {
        staggerChildren: computedStagger,
        delayChildren: delay,
        ...containerTransition,
        ...(customContainerVariants.visible as TargetAndTransition)?.transition,
      },
    },
    exit: {
      ...customContainerVariants.exit,
      transition: {
        staggerChildren: computedStagger,
        staggerDirection: -1,
        ...(customContainerVariants.exit as TargetAndTransition)?.transition,
      },
    },
  };

  const MotionComponent = (motion as any)[as] || motion.p;

  // Split logic handling newlines and words
  const lines = children.split('\n');

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionComponent
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label={children}
          variants={containerVariants}
          className={cn('inline-block', className)}
          onAnimationStart={onAnimationStart}
          onAnimationComplete={onAnimationComplete}
          style={style}
        >
          {lines.map((line, lineIndex) => {
            if (per === 'line') {
              return (
                <motion.span
                  key={`line-${lineIndex}`}
                  aria-hidden="true"
                  className={cn('block', segmentWrapperClassName)}
                  variants={itemVariants}
                >
                  {line}
                </motion.span>
              );
            }

            const words = line.split(' ');

            return (
              <span key={`line-wrapper-${lineIndex}`} className="block">
                {words.map((word, wordIndex) => {
                  if (per === 'char') {
                    return (
                      <span
                        key={`word-${wordIndex}`}
                        className="inline-block whitespace-nowrap"
                      >
                        {word.split('').map((char, charIndex) => (
                          <motion.span
                            key={`char-${charIndex}`}
                            aria-hidden="true"
                            className={cn('inline-block', segmentWrapperClassName)}
                            variants={itemVariants}
                          >
                            {char}
                          </motion.span>
                        ))}
                        {wordIndex < words.length - 1 && (
                          <span className="inline-block">&nbsp;</span>
                        )}
                      </span>
                    );
                  }

                  // Default: per === 'word'
                  return (
                    <motion.span
                      key={`word-${wordIndex}`}
                      aria-hidden="true"
                      className={cn('inline-block', segmentWrapperClassName)}
                      variants={itemVariants}
                    >
                      {word}
                      {wordIndex < words.length - 1 && '\u00A0'}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </MotionComponent>
      )}
    </AnimatePresence>
  );
}

export default TextEffect;
