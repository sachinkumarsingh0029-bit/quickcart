import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import FullPageLoading from "./pages/loading/FullPageLoading";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import routes from "./Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullPageLoading />} persistor={persistor}>
        <RouterProvider router={routes} />
      </PersistGate>
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
