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
  isMultipart?: boolean;
};

const useFormMutation = <TVariables = unknown, TData = unknown>({
  key,
  url,
  method,
  headers,
  params,
  isMultipart = false,
}: Props<TVariables, TData>): UseMutationResult<
  TData,
  AxiosError,
  TVariables
> => {
  return useMutation<TData, AxiosError, TVariables>({
    mutationKey: key,

    mutationFn: async (data: TVariables) => {
      let requestData: unknown = data;

      const requestHeaders = { ...headers };

      // Convert data to FormData when uploading files
      if (isMultipart) {
        const formData = new FormData();

        Object.entries(data as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (value === undefined || value === null) return;

            if (Array.isArray(value)) {
              value.forEach((item) => {
                if (item instanceof Blob) {
                  formData.append(key, item);
                } else if (typeof item === "object") {
                  formData.append(key, JSON.stringify(item));
                } else {
                  formData.append(key, String(item));
                }
              });
            } else if (value instanceof Blob) {
              formData.append(key, value);
            } else if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          },
        );

        requestData = formData;
      }

      const res = await axios({
        url: `https://dost-server-git-development-joshuaramins-projects.vercel.app`,
        method,
        headers: requestHeaders,
        params,
        data: requestData,
      });

      return res.data as TData;
    },

    onSuccess: (data) => {
      console.log("Mutation Success:", data);
    },

    onError: (error: AxiosError) => {
      console.error("Mutation Error:", error.response?.data ?? error.message);
    },
  });
};

export default useFormMutation;
