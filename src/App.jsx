import React, { useEffect } from "react";
import { createBrowserHistory } from "history";
import "./App.css";
import { pages, wizardMachine } from "./wizard/machine";
import { useMachine } from "@xstate/react";

const browserHistory = createBrowserHistory();

function App() {
  const [current, send] = useMachine(wizardMachine(browserHistory), {
    devTools: true
  });

  const { Component, id } = pages[current.context.stack[current.context.index]];

  useEffect(() => {
    const unlisten = browserHistory.listen((location, action) => {
      if (action === "POP" && location.pathname.split('/')[1] === current.context.stack[current.context.index - 1]) {
        console.log('back: ', JSON.stringify({
          path: location.pathname.split('/')[1],
          stack: current.context.stack,
          index: current.context.index
        }));
        send("BACK", { historyBack: true });
      } else if (action === "POP" && location.pathname.split('/')[1] === current.context.stack[current.context.index + 1]) {
        console.log('next', JSON.stringify({
          path: location.pathname.split('/')[1],
          stack: current.context.stack,
          index: current.context.index
        }));
        send("NEXT", { page: location.pathname.split('/')[1] });
      } else {
        console.log('else', JSON.stringify({
          path: location.pathname.split('/')[1],
          stack: current.context.stack,
          index: current.context.index
        }));
      }
    });
    return () => unlisten();
  }, [current.context.index, current.context.stack, send]);

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
