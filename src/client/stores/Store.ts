import {makeAutoObservable, observable} from 'mobx';

export class Store {
  @observable public readonly message: string;

  constructor() {
    this.message = 'Hello Template React With Typescript Monorepo Project';

    makeAutoObservable(this, undefined, {autoBind: true});
  }
}

export const store = new Store();
