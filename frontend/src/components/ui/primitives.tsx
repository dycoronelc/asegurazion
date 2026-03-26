import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 px-4 py-2.5 text-white shadow-glow hover:bg-brand-600',
        secondary:
          'border border-brand-200 bg-white px-4 py-2.5 text-brand-700 hover:border-brand-300 hover:bg-brand-50',
        ghost: 'px-3 py-2 text-slate-600 hover:bg-slate-100',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('surface p-6', className)} {...props} />
}

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
  {
    variants: {
      tone: {
        neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
        success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        warning: 'bg-amber-50 text-amber-700 ring-amber-200',
        danger: 'bg-rose-50 text-rose-700 ring-rose-200',
        brand: 'bg-brand-50 text-brand-700 ring-brand-200',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100',
        className,
      )}
      {...props}
    />
  )
}
