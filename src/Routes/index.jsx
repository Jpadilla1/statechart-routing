import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import A from '../components/A'
import B from '../components/B'
import C from '../components/C'
import D from '../components/D'

export const Routes = () => {
    return (
        <Switch>
            <Redirect exact path={'/redirect-to-a'} to={'/a'} />
            <Redirect exact path={'/redirect-to-b'} to={'/b'} />
            <Route exact path={'/a'} render={() => {
                return (
                    <div>
                        <div>(Route)</div>
                        <div><A /></div>
                    </div>
                )
            }}/>
            <Route exact path={'/b'} render={() => {
                return (
                    <div>
                        <div>(Route)</div>
                        <div><B /></div>
                    </div>
                )
            }}/>
            <Route exact path={'/c'} render={() => {
                return (
                    <div>
                        <div>(Route)</div>
                        <div><C /></div>
                    </div>
                )
            }}/>
            <Route exact path={'/d'} render={() => {
                return (
                    <div>
                        <div>(Route)</div>
                        <div><D /></div>
                    </div>
                )
            }}/>
            <Route component={() => <div>Not Found (Route)</div>} />
        </Switch>
    );
};