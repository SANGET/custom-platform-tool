interface IProps {
  [key: string]: string;
}
class HOSTENV {
  public env;

  constructor(props?: IProps) {
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
