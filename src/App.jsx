import React, { useEffect, useRef, useCallback } from "react";
import { createBrowserHistory } from "history";
import { useMachine } from "@xstate/react";

import "./App.css";
import { State } from "xstate";
import { pages, wizardMachine } from "./wizard/machine";

const history = createBrowserHistory();

function App() {
  const getHistoryStack = () => {
    if (history.location.state && history.location.state.state && history.location.state.state.stack) {
      return history.location.state.state.stack;
    }

    return [];
  };

  const getInitialState = () => {
    const state = sessionStorage.getItem('state-value');

    return state ? wizardMachine.resolveState(State.create(JSON.parse(state))) : null;
  };

  const initialState = getInitialState();

  const options = initialState ? { state: initialState }: {}

  console.log(options);

  const [current, send, service] = useMachine(wizardMachine, { ...options, devTools: true });
  const memStack = useRef([]);

  useEffect(() => {
    memStack.current = getHistoryStack();

    service.onTransition(state => {
      sessionStorage.setItem('state-value', JSON.stringify(state));
    });
  }, []);

  useEffect(() => {
    const unListen = history.listen((_, action) => {
      const historyStack = getHistoryStack();

      console.log("historyStack: ", historyStack);
      console.log("stack: ", memStack.current);

      if (action === "POP" && memStack.current.length > historyStack.length) {
        console.log("back: ", memStack.current);
        send("BACK");
        memStack.current = historyStack;
      } else if (action === "POP") {
        console.log("next", memStack.current);
        send("NEXT");
        memStack.current = historyStack;
      }
    });
    return () => unListen();
  }, [send, current.value]);

  const handlePush = useCallback((e) => {
    send(e);

    const historyStack = getHistoryStack();

    memStack.current = [...historyStack, current.value];

    history.push("/", {
      state: {
        stack: [...historyStack, current.value],
      }
    });
  }, [send, current]);

  const Component = pages[current.value].Component;

  return (
    <div className="App">
      <Component />

      {current.nextEvents
        .filter(e => e !== "BACK")
        .map(e => (
          <button key={e} onClick={() => handlePush(e)}>
            {e}
          </button>
        ))}
    </div>
  );
}

export default App;
