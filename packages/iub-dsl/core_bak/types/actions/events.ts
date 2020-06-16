export type UserBehavior = "onClick" | "onChange" | "onFocus" | "onBlur";

export type Lifecycles = "onMount" | "onUnmount";

type TriggerEvents = UserBehavior | Lifecycles;

export default TriggerEvents;
