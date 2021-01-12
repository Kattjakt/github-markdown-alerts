import React from "react";
import { Playground } from "./Playground";
import "./App.css";
import { ContextProvider } from "./Playground/context";

function App() {
  return (
    <ContextProvider>
      <Playground />
    </ContextProvider>
  );
}

export default App;
