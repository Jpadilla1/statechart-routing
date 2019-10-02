import { Machine, assign, send } from "xstate";
import A from '../components/A'
import B from '../components/B'
import C from '../components/C'

export const machine = Machine(
  {
    id: "machine",
    initial: "AWAITING_INITIAL_STATE",
    context: {},
    states: {
      // TODO: Allow changing flows after initialization
      AWAITING_INITIAL_STATE: {
        on: {
          ACTIVATE_STATE: {
            actions: "activateState"
          },
          // TODO: Genreate activiation states for all possible entrypoints
          'ACTIVATE_#machine.A': { target: '#machine.A' },
        }
      },
      // TODO multiple flows
      A: {
        meta: {
            path: '/a',
            Component: A,
        },
        on: {
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
          BACK: "B"
        }
      }
    }
  },
  {
    actions: {
      activateState: send((_, event) => {
        return ({
          type: `ACTIVATE_#${event.state}`
        })
      })
    }
  }
);

export const resolveState = ({ locationPath, locationParams }) => {
  return machine.stateIds
    .map(stateId => machine.getStateNodeById(stateId))
    .filter(({ meta }) => meta && meta.path)
    .find(({ meta: { path } }) => {
      // Check path against location and params
      // /drive/expressdrive/reservation/schedule
      return path === locationPath;
    });
};
