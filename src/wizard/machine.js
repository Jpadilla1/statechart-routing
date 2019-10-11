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
        index: 0,

        // history stack
        stack: ["page1"]
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
          index: ctx => ctx.index + 1,
          stack: (ctx, e) => ctx.stack[ctx.stack.length - 1] !== e.page ? ctx.stack.concat(e.page) : ctx.stack,
        }),
        backUpdate: assign(ctx => {
          const { index } = ctx;

          return {
            index: index - 1,
          };
        }),
        historyPush: (_, e) => {
          history.push(`/${e.page}`);
        },
        historyPop: (_, { historyBack } = { historyBack: false }) => {
          if (historyBack) {
            return;
          }
          history.goBack();
        }
      }
    }
  );
