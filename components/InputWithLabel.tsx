import React, { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// Define the props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
  label?: string;
  helperText?: string;
  hasError?: boolean;
  textarea?: boolean;
}

// Forward ref for both input and textarea
export const InputWithLabel = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    { helperText, label, hasError, textarea = false, inputClassName, ...props },
    ref
  ) => {
    const commonClasses = cn(
      "w-full border p-2 rounded-md",
      hasError ? "border-red-600" : "border-gray-300",
      inputClassName
    );

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={props.id} className="mb-2.5 inline-block font-medium">
            {label}
          </Label>
        )}

        {textarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={commonClasses}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input ref={ref as React.Ref<HTMLInputElement>} {...props} />
        )}

        {helperText && (
          <p
            className={cn(
              "mt-2 text-xs",
              hasError ? "text-red-600" : "text-gray-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";
