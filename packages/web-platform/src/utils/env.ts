class HOSTENV {
  public env = {}

  constructor(props?: any) {
    this.env = props;
  }

  get() {
    return this.env;
  }

  set(params) {
    this.env = params;
  }
}

export default new HOSTENV();
