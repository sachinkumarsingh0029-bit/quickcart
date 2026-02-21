import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import FullPageLoading from "./pages/loading/FullPageLoading";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullPageLoading />} persistor={persistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
