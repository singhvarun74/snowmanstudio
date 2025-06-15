"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Textarea } from './textarea';

interface FloatingLabelProps {
  label: string;
  containerClassName?: string;
}

type FloatingLabelInputProps = InputHTMLAttributes<HTMLInputElement> & FloatingLabelProps;
type FloatingLabelTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FloatingLabelProps;

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, id, className, containerClassName, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn("floating-label-input-container relative mt-2", containerClassName)}>
      <Input 
        id={inputId} 
        placeholder=" " 
        {...props} 
        className={cn("peer h-12 pt-4 bg-transparent", className)} 
      />
      <label 
        htmlFor={inputId} 
        className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({ label, id, className, containerClassName, ...props }) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className={cn("floating-label-input-container relative mt-2", containerClassName)}>
      <Textarea 
        id={textareaId} 
        placeholder=" " 
        {...props} 
        className={cn("peer min-h-[120px] pt-6 bg-transparent", className)}
      />
      <label 
        htmlFor={textareaId} 
        className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-6 z-10 origin-[0] start-2.5 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};
