import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface AxiosHeaders {
  [key: string]: string | undefined;
}

type Props<TVariables, TData> = {
  key: unknown[];
  url: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: AxiosHeaders;
  params?: Record<string, string | number | undefined>;
};
const useFormMutation = <TVariables = unknown, TData = unknown>({
  key,
  url,
  method,
  headers,
  params,
  isMultipart = false, // new option
}: Props<TVariables, TData> & { isMultipart?: boolean }): UseMutationResult<
  TData,
  AxiosError,
  TVariables
> => {
  return useMutation<TData, AxiosError, TVariables>({
    mutationKey: key,
    mutationFn: async (data: TVariables) => {
      let requestData: unknown = data;

      const requestHeaders = { ...headers };

      // If files are included, convert to FormData
      if (isMultipart) {
        const formData = new FormData();
        Object.entries(data as Record<string, string>).forEach(
          ([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => formData.append(key, v));
            } else {
              formData.append(key, value);
            }
          },
        );
        requestData = formData;
        requestHeaders["Content-Type"] = "multipart/form-data";
      }

      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`,
        method,
        headers: requestHeaders,
        params,
        data: requestData,
      });

      return res.data as TData;
    },
    onSuccess: (data) => {
      console.log("Mutation Success", data);
    },
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        console.log("Mutation Error:", error.response.data);
      } else {
        console.log("Mutation Error:", error.message);
      }
    },
  });
};

export default useFormMutation;
