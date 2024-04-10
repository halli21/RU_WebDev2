import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import router from "./routing/router";
import { themeClass } from "./themes/theme.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Box
          className={themeClass}
          style={{
            height: "100%",
          }}
        >
          <RouterProvider router={router} />
        </Box>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
