export type UserBehavior =
  | "onClick"
  | "onChange"
  | "onUserChange"
  | "onFocus"
  | "onBlur";

export type Lifecycles = "onMount" | "onUnmount";

export type TriggerEvents = UserBehavior | Lifecycles;

export default TriggerEvents;
