import { makeAutoObservable } from 'mobx';

class GlobalStore {
  site_title = 'Поездки';
  material_adjust_is_sum = true;

  constructor() {
    makeAutoObservable(this);
  }

  update_title(title: string) {
    this.site_title = title;
  }

  update_adjus_sum_state(isSum: boolean) {
    this.material_adjust_is_sum = isSum;
  }
}

const Store = new GlobalStore();

export default Store;
