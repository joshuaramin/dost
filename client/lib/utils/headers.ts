import { sessionStore } from "./sessions";

const token = sessionStore.getToken();

const headers = {
  "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
  "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
  Authorization: `Bearer ${token}`,
};

export default headers;
