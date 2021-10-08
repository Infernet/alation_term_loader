import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {StoreProvider} from '../hook/useStore';
import {App} from '../components';

export type MainRouterProps = {

};

export const MainRouter: React.FC<MainRouterProps> = observer(function MainRouter() {
  return (
    <Switch>
      <StoreProvider>
        <Route path={'/'} exact>
          <App />
        </Route>
      </StoreProvider>
    </Switch>
  );
},
);
