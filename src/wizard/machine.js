import { Machine } from "xstate";
import { Page1 } from "./pages/Page1";
import { Page2 } from "./pages/Page2";
import { Page3 } from "./pages/Page3";

export const pages = {
  step1: {
    id: 1,
    Component: Page1
  },
  step2: {
    id: 2,
    Component: Page2
  },
  step3: {
    id: 3,
    Component: Page3
  }
};

export const wizardMachine = Machine({
  id: "wizardMachine",
  initial: "step1",
  states: {
    step1: {
      on: {
        NEXT: "step2"
      }
    },
    step2: {
      on: {
        BACK: "step1",
        NEXT: "step3"
      }
    },
    step3: {
      on: {
        BACK: "step2"
      }
    }
  }
});
