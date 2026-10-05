export class Gate {
  opened = true;
  protected _resolve: (() => void) | undefined;
  protected _promise = Promise.resolve();

  lock = () => {
    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
    this.opened = false;
  };
  unlock = () => {
    if (this._resolve) {
      this._resolve();
    }
    this.opened = true;
  };
  wait = async () => {
    return this._promise;
  };
}
