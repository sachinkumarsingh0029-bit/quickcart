import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import { createLogger } from "redux-logger";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";

const persistConfig = {
  key: "root",
  storage: storage,
};

const loggerMiddleware = createLogger();
const syncMiddleware = createStateSyncMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware).concat(syncMiddleware),
});

const persistor = persistStore(store);

initMessageListener(store);

export { store, persistor };
