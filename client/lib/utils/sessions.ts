// lib/utils/session.ts
import store from "store2";

const KEY = "data_sessions";

export type SessionData = {
  token: string;
  data: {
    user_id: string;
    email: string;
    Profile: {
      first_name: string;
      last_name: string;
    };
    Role: {
      name: string;
    };
    Organization: {
      name: string;
    };
  };
};

export const sessionStore = {
  get(): SessionData | null {
    return store.get(KEY) || null;
  },

  set(session: SessionData) {
    store.set(KEY, session);
  },

  clear() {
    store.remove(KEY);
  },

  getToken(): string | null {
    return store.get(KEY)?.token || null;
  },
};
