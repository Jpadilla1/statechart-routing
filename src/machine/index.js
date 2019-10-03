import { Machine, assign, send } from "xstate";
import A from '../components/A'
import B from '../components/B'
import C from '../components/C'

export const makeMachine = history => Machine(
  {
    id: "machine",
    initial: "AWAITING_INITIAL_STATE",
    context: {},
    states: {
      AWAITING_INITIAL_STATE: {
        on: {
          ACTIVATE_STATE: {
            actions: "activateState"
          },
          // TODO: Genreate activiation states for all possible entrypoints
          'ACTIVATE_#machine.FLOW_A.A': { target: '#machine.FLOW_A.A' },
          'ACTIVATE_#machine.FLOW_B.A': { target: '#machine.FLOW_B.A' },
        }
      },
      FLOW_A: {
        initial: 'IDLE',
        states: {
          IDLE: {},
          A: {
            meta: {
                path: '/a',
                Component: A,
            },
            on: {
              // TODO: Update URL upon activation if not 
              NEXT: "B"
            }
          },
          B: {
            meta: {
                Component: B,
            },
            on: {
              BACK: "A",
              NEXT: "C"
            }
          },
          C: {
            meta: {
                Component: C,
            },
            on: {
              BACK: "B",
              NEXT: "#machine.FLOW_B.A" // Should trigger new flow activation
            }
          }
        }
      },
      FLOW_B: {
        initial: 'IDLE',
        states: {
          IDLE: {},
          A: {
            // TODO: Update URL upon activation
            meta: {
                path: '/d',
                Component: A,
            },
            entry: ['historyPush'],
            on: {
              NEXT: "B",
            }
          },
          B: {
            meta: {
                Component: B,
            },
            on: {
              BACK: "A",
              NEXT: "C"
            }
          },
          C: {
            meta: {
                Component: C,
            },
            on: {
              BACK: "B"
            }
          }
        }
      },
    }
  },
  {
    actions: {
      activateState: send((_, event) => {
        return ({
          type: `ACTIVATE_#${event.state}`
        })
      }),
      pushUpdate: assign({
        path: (_, e) => e.path,
      }),
      historyPush: (_, e) => {
        // TODO: If current path does not match, update it.
        // TODO: Can we access the current state's meta properties within actions?
        history.push(`${e.path}`);
      },
    }
  }
);

export const resolveState = (machine, { locationPath, locationParams }) => {
  return machine.stateIds
    .map(stateId => machine.getStateNodeById(stateId))
    .filter(({ meta }) => meta && meta.path)
    .find(({ meta: { path } }) => {
      // Check path against location and params
      // /drive/expressdrive/reservation/schedule
      return path === locationPath;
    });
};
