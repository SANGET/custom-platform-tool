import { UpdateState } from "@iub-dsl/definition/actions/sys-actions/state-action";

export const updateStateAction = (conf: UpdateState) => {
  console.log(conf);

  if (conf.changeTarget) {

  }
  return () => {
    console.log(097);
  };
};
