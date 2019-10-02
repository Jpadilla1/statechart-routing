import { Machine, assign } from "xstate";
import { Page1 } from "./pages/Page1";
import { Page2 } from "./pages/Page2";
import { Page3 } from "./pages/Page3";

export const pages = {
  page1: {
    id: 1,
    Component: Page1
  },
  page2: {
    id: 2,
    Component: Page2
  },
  page3: {
    id: 3,
    Component: Page3
  }
};

export const wizardMachine = history =>
  Machine(
    {
      id: "wizardMachine",
      initial: "main",
      context: {
        page: "page1",

        // history stack
        stack: []
      },
      states: {
        main: {
          on: {
            NEXT: {
              actions: ["pushUpdate", "historyPush"]
            },
            BACK: {
              actions: ["backUpdate", "historyPop"],
              cond: ctx => ctx.stack.length > 0
            }
          }
        }
      }
    },
    {
      actions: {
        pushUpdate: assign({
          page: (_, e) => e.page,
          stack: ctx => ctx.stack.concat(ctx.page)
        }),
        backUpdate: assign(ctx => {
          const { stack } = ctx;
          const newStack = stack.slice(0, stack.length - 1);
          const prev = stack[stack.length - 1];

          return {
            page: prev,
            stack: newStack
          };
        }),
        historyPush: (_, e) => {
          history.push(`/${e.page}`);
        },
        historyPop: (_, { historyBack } = { historyBack: true }) => {
          if (!historyBack) {
            return;
          }
          history.goBack();
        }
      }
    }
  );
