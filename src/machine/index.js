import { Machine, assign, send } from "xstate";
import { getNodes } from 'xstate/lib/graph'
import A from '../components/A'
import B from '../components/B'
import C from '../components/C'

const ACTIVATE_TRANSITION_PREFIX = "ACTIVATE_"

const machineConfig = {
  id: "machine",
  initial: "AWAITING_INITIAL_STATE",
  context: {},
  states: {
    AWAITING_INITIAL_STATE: {
      on: {
        ACTIVATE_STATE: {
          actions: "activateState"
        },
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
            NEXT: "B",
          }
        },
        B: {
          initial: 'B1',
          meta: {
              Component: B,
          },
          states: {
            B1: {
              on: {
                BACK: "#machine.FLOW_A.A",
                NEXT: "B2"
              }
            },
            B2: {
              on: {
                BACK: "B1",
                NEXT: "#machine.FLOW_A.C"
              }
            }
          }
        },
        C: {
          meta: {
              Component: C,
          },
          on: {
            BACK: "B",
            NEXT: "#machine.FLOW_B.A"
          }
        }
      }
    },
    FLOW_B: {
      initial: 'IDLE',
      states: {
        IDLE: {},
        A: {
          meta: {
              path: '/d',
              Component: A,
          },
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
}

const withActivateStateTransitions = (config) => {
  const nodes = getNodes(Machine(config))
  
  const newConfig = { ...config }
  for (const node of nodes) {
    if (node.meta && node.meta.path) {
      newConfig.states.AWAITING_INITIAL_STATE.on[`${ACTIVATE_TRANSITION_PREFIX}${node.id}`] = `#${node.id}`
    }
  }

  return newConfig
}

const machineOptions = {
  actions: {
    activateState: send((_, event) => {
      return ({
        type: `${ACTIVATE_TRANSITION_PREFIX}${event.stateNodeId}`
      })
    }),
  }
}

let machine
export const getMachine = () => {
  if (!machine) {
    machine = Machine(withActivateStateTransitions(machineConfig), machineOptions)
  }

  return machine;
};

export const resolveState = (machine, { locationPath, locationParams }) => {
  return machine.stateIds
    .map(stateId => machine.getStateNodeById(stateId))
    .filter(({ meta }) => meta && meta.path)
    .find(({ meta: { path } }) => {
      // TODO: Check path against params (e.g. dynamic segments; '/a/:id/b')
      return path === locationPath;
    });
};
