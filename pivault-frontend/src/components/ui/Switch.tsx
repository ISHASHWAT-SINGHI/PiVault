import React from 'react';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className = '', checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (checked === undefined) {
        setInternalChecked(!internalChecked);
      }
      onCheckedChange?.(!isChecked);
      props.onClick?.(e);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleClick}
        ref={ref}
        className={`peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${isChecked ? 'bg-blue-600' : 'bg-slate-200'} ${className}`}
        {...props}
      >
        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${isChecked ? 'translate-x-[16px]' : 'translate-x-0'}`} />
      </button>
    );
  }
);
Switch.displayName = "Switch";
