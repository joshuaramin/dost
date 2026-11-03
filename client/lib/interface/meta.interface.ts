export interface MetaInterface {
  api_version: string;
  requested_version: string;
  deprecated: boolean;
  sunset_date: unknown | null;
  timestamp: string;
  query: object;
  path: string;
  method: "POST" | "PATCH" | "PUT" | "GET";
  statu: number;
}
