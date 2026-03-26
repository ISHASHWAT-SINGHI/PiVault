import React from 'react';

export const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number }>(
  ({ className = '', value = 0, ...props }, ref) => (
    <div ref={ref} className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`} {...props}>
      <div 
        className="h-full w-full flex-1 bg-slate-900 transition-all duration-300" 
        style={{ transform: `translateX(-${100 - Math.min(Math.max(value, 0), 100)}%)` }} 
      />
    </div>
  )
);
Progress.displayName = "Progress";
