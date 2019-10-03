import { Machine, assign, send } from "xstate";
import A from '../components/A'
import B from '../components/B'
import C from '../components/C'

export const machineConfig = {
  initial: "AWAITING_INITIAL_STATE",
  context: {},
  on: {
    // 'route-changed': {
    //   cond: (context, event) => event.dueToStateTransition === true,
    //   actions: (context, event) => {
    //     debugger
    //   }
    // }
  },
  states: {
    AWAITING_INITIAL_STATE: {
      meta: {
        path: '/idle',
      },
    },
    FLOW_A: {
      initial: 'IDLE',
      meta: {
        path: '/A',
      },
      states: {
        IDLE: {
          meta: {
            path: '/A/idle',
          },
        },
        A: {
          meta: {
              path: '/A/a',
              Component: A,
          },
          on: {
            NEXT: "B"
          }
        },
        B: {
          meta: {
              path: '/A/b',
              Component: B,
          },
          on: {
            BACK: "A",
            NEXT: "C"
          }
        },
        C: {
          meta: {
              path: '/A/c',
              Component: C,
          },
          on: {
            BACK: "B",
            NEXT: "#(machine).FLOW_B.A" // Should trigger new flow activation
          }
        }
      }
    },
    FLOW_B: {
      initial: 'IDLE',
      meta: {
        path: '/B',
      },
      states: {
        IDLE: {
          meta: {
            path: '/B/idle',
          },
        },
        A: {
          // TODO: Update URL upon activation
          meta: {
              path: '/B/a',
              Component: A,
          },
          on: {
            NEXT: "B",
          }
        },
        B: {
          meta: {
              path: '/B/b',
              Component: B,
          },
          on: {
            BACK: "A",
            NEXT: "C"
          }
        },
        C: {
          meta: {
              path: '/B/c',
              Component: C,
          },
          on: {
            BACK: "B"
          }
        }
      }
    },
  }
}

export const machineOptions = {
  actions: {}
}

export const machine = Machine(machineConfig, machineOptions);