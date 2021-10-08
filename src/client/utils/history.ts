import {createBrowserHistory, History} from 'history';

let history: History = undefined as any as History;

if (!history) {
  history = createBrowserHistory({basename: process.env.PUBLIC_URL === '.' ? undefined : process.env.PUBLIC_URL});
}

export {
  history,
};
