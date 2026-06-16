"use client";

import { Provider, useSelector } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import AuthPopup from "@/app/components/AuthPopup";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthPopup />
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}