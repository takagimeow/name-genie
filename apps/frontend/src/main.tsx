import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const setup = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser')
    worker.start()
  }
}

setup().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})