"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";

export const StateProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);
