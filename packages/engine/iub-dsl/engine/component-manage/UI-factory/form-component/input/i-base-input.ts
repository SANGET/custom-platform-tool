import { InputProps } from "antd/lib/input";
import { OmitExtral } from "../../../../types";

interface InputPropsExtral {
  key: string;
  value: string | number;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void);
}

export type NormalInputProps = OmitExtral<InputProps, InputPropsExtral>
export { InputProps };

//
/** old */
enum EventType {
  InputChange = 'InputChange'
}
/**
 * 组件事件触发的基础标准参数
 * T: 当前触发的事件类型
 * D: 事件触发的载体的类型
 */
interface BaseEventParam<T = EventType, D = any> {
  eventType: T;
  schemasPath: string;
  payload: D
}

interface InputChangePayload {
  changeValue: string
}
type InputChangeEvent = BaseEventParam<EventType.InputChange, InputChangePayload>
