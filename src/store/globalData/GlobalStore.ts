import { makeAutoObservable } from 'mobx';
import { configurePersistable, makePersistable } from 'mobx-persist-store';

configurePersistable(
  {
    storage: window.localStorage,
    expireIn: 86400000,
    removeOnExpiration: true,
    stringify: false,
    debugMode: true,
  },
  { delay: 200, fireImmediately: false }
);

class GlobalStore {
  site_title = 'Поездки';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'SampleStore',
      properties: ['site_title'],
    });
  }

  update_title(title: string) {
    this.site_title = title;
  }
}

const Store = new GlobalStore();

export default Store;
