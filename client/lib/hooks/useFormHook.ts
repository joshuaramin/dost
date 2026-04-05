/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props<TSchema extends ZodType<any, any>> {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
}

export default function useFormHook<TSchema extends ZodType<any, any>>({
  schema,
  defaultValues,
}: Props<TSchema>) {
  type FormValues = z.infer<TSchema>;

  const {
    register,
    control,
    getFieldState,
    getValues,
    resetField,
    setError,
    setFocus,
    subscribe,
    trigger,
    unregister,
    handleSubmit,
    formState: { errors, isLoading },
    watch,
    setValue,
    reset,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues as FormValues,
  });

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    watch,
    setValue,
    reset,
    clearErrors,
    control,
    getFieldState,
    getValues,
    resetField,
    setError,
    setFocus,
    subscribe,
    trigger,
    unregister,
  };
}
