import React, { useRef } from 'react';
import _ from 'lodash';
import useReactRouter from 'use-react-router';
import { useRouterMachine } from 'use-router-machine';
import { machineConfig, machineOptions } from "../machine";

export const StateMachine = ({ children }) => {
    const { history } = useReactRouter();
    const { state: current, send, service } = useRouterMachine({
        config: machineConfig,
        options: machineOptions,
        initialContext: {},
        history,
    });

    const serviceRef = useRef(null)
    if (!serviceRef.current) {
        service.onEvent(e => {
            debugger
        })
        serviceRef.current = true;
    }

    const currentStateNodePath = _.get(current.toStrings(), `[${current.toStrings().length - 1}]`);
    const Component = _.get(current, ['meta', `${service.id}.${currentStateNodePath}`, 'Component']);

    // TODO: What about states/substates without components? Need to find the first component along the path and render that.
    if (!Component) {
        // TODO: ERROR! Every machine state must map to a Component
        return null;
    }

    const onNext = current.nextEvents.includes('NEXT') && (() => send('NEXT'))
    const onBack = current.nextEvents.includes('BACK') && (() => send('BACK'))

    // Render the component associated with the current state
    return (
        <div>
            <div>
                {currentStateNodePath}
            </div>
            <Component />
            <div>
                {onBack && <button onClick={onBack}>Back</button>}
                {onNext && <button onClick={onNext}>Next</button>}
            </div>
        </div>
    )
};