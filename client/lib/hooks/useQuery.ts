import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AxiosHeaders {
  [key: string]: string | undefined;
}

type Props<TVariables, TData> = {
  key: unknown[];
  url: string;
  enabled?: boolean;
  headers?: AxiosHeaders;
  params?: TVariables;
};

const useFormQuery = <TData = unknown, TVariables = unknown>({
  key,
  url,
  headers,
  enabled,
  params,
}: Props<TVariables, TData>) => {
  return useQuery<TData>({
    queryKey: key,
    enabled,
    queryFn: async () => {
      const res = await axios.get<TData>(
        `https://dost-server-git-development-joshuaramins-projects.vercel.app/${url}`,
        {
          headers,
          params,
        },
      );
      return res.data;
    },
  });
};

export default useFormQuery;
