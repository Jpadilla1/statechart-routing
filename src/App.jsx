import React, { useRef } from "react";
import { createBrowserHistory } from "history";
import "./App.css";
import { pages, wizardMachine } from "./wizard/machine";
import { useMachine } from "@xstate/react";

const browserHistory = createBrowserHistory();

function App() {
  const [current, send] = useMachine(wizardMachine(browserHistory), {
    devTools: true
  });

  const { Component, id } = pages[current.context.page];

  const historyRef = useRef(null);

  // Create the service only once
  // See https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  if (historyRef.current === null) {
    browserHistory.listen((location, action) => {
      if (action === "POP") {
        send("BACK", { historyBack: false });
      }
    });
    historyRef.current = true;
  }

  return (
    <div className="App">
      <Component />
      {pages[`page${id + 1}`] ? (
        <button onClick={() => send("NEXT", { page: `page${id + 1}` })}>
          NEXT
        </button>
      ) : null}
      <button onClick={() => send("BACK")}>BACK</button>
    </div>
  );
}

export default App;
