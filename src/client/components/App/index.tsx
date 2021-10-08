import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../hook/useStore';

export interface AppProps {

}

export const App: React.FC<AppProps> = observer(function App({}) {
  const store = useStore();
  return (
    <div>{store.message}</div>
  );
});
