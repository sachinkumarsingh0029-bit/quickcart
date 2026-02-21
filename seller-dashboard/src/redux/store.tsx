import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import rootReducer from "./rootReducer";
import { createLogger } from "redux-logger";

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const loggerMiddleware = createLogger();

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

const persistor = persistStore(store);

export { store, persistor };
