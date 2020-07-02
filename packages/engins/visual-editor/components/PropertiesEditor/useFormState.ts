import { useState } from "react";
import { EditorEntityProperties } from "../../types";

export type UpdateFormValueCallback = (formID: any, value: any, propType: any) => void

/**
 * 存储属性编辑器产出的表单数据
 */
const useFormState = (defaultFormState = {}): [
  EditorEntityProperties, UpdateFormValueCallback
] => {
  const [formState, setFormState] = useState<EditorEntityProperties>(defaultFormState);

  const updateFormValues = (formID, value, propType) => {
    setFormState({
      ...formState,
      [formID]: {
        propType,
        value
      }
    });
  };

  return [
    formState, updateFormValues
  ];
};

export default useFormState;
