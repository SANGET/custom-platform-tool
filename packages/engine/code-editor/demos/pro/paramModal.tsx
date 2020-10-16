import React, { ReactElement, useEffect, useState } from 'react';
import {
  Button, Modal, Input, Select, InputNumber, Alert
} from 'antd';
import CodeEditor from '@engine/code-editor';
import "./style.less";
import { Editor } from 'codemirror';
import { DATA_TYPE } from './config';
import { IBaseOption, IParams } from './interface';

const { Option } = Select;
window.jsonlint = require('jsonlint-mod');

interface IProps {
  params: IParams,
  visible: boolean;
  onCancel?: () => void;
  onFinish?: (values: IParams) => void;
}
interface IBaseProps {
  value?: string | number | undefined;
  type: string;
  onSelectChange: (value: string) => void;
  onChange?: (value: string) => void;
}
type IJsonEditorProps = IBaseProps
interface IAddonInputNumberProps extends IBaseProps {
  onChange?: (value: string | number | undefined) => void;
}
interface ISelectType {
  type: string;
  onChange: (value: string) => void;
}

const JsonEditor = (props: IJsonEditorProps): ReactElement => {
  const {
    onSelectChange, type, value, onChange
  } = props;
  const handleCodeEditorChange = (instance: Editor, changeObj: object) => {
    onChange && onChange(instance.getValue());
  };
  return (
    <>
      <CodeEditor
        value = {value as string}
        mode="application/json"
        gutters = {["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]}
        theme="base16-light"
        renderToolBar={() => <></>}
        onChange={handleCodeEditorChange}
        cusResourceList={
          {
            mode: "application/json",
            // @ts-ignore
            dependentLint: () => import('codemirror/addon/lint/json-lint.js')
          }
        }

      />
      <div className="json-editor-select">
        <SelectType
          type={type}
          onChange={onSelectChange}
        />
      </div>
    </>
  );
};

const SelectType = (props: ISelectType): ReactElement => {
  const { onChange, type } = props;
  return (
    <Select
      style={{ width: 100 }}
      onChange={(value) => onChange && onChange(value)}
      defaultValue={type}
    >
      {
        DATA_TYPE.map((item: IBaseOption, index: number) => <Option key={index} value={item.key}>{item.value}</Option>)
      }
    </Select>
  );
};

const AddonInputNumber = (props: IAddonInputNumberProps): ReactElement => {
  const {
    onChange, onSelectChange, type, value
  } = props;
  return (
    <div className="addon-input-number">
      <InputNumber
        defaultValue={value as number}
        onChange={onChange}
      />
      <SelectType
        type={type} onChange={onSelectChange}
      />
    </div>
  );
};
/**
 * 运行参数配置弹框
 * @param props: IProps
 */
const ParamsModal = (props: IProps): ReactElement => {
  const {
    visible, params, onCancel, onFinish
  } = props;
  const [attributes, setAttributes] = useState<IParams>(params);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setAttributes(params);
  }, [visible]);
  const handleParamsCancel = () => {
    onCancel && onCancel();
  };
  const handleFinish = () => {
    const { type, value } = attributes;
    if (!value && value !== 0) {
      setError("值不能为空");
      return;
    }
    if (type === "Array" || type === "Object") {
      try {
        const json = JSON.parse(value as string);
        if (Object.prototype.toString.call(json) !== `[object ${type}]`) {
          setError("数据格式不对");
          return;
        }
      } catch (error) {
        setError("数据格式不对");
        return;
      }
    }
    onFinish && onFinish(attributes);
  };
  const handleTypeChange = (value: string) => {
    setError("");
    setAttributes(Object.assign({}, attributes, { type: value, value: "" }));
  };
  const handleValueChange = (value: any) => {
    setAttributes(Object.assign(attributes, { value }));
  };
  const RenderComponent = ({ type, value }: IParams): ReactElement => {
    if (type === "String") {
      return <Input
        defaultValue={value as string}
        addonAfter={<SelectType type={type} onChange={handleTypeChange}/>}
        onChange={(e) => handleValueChange(e.target.value)}
      />;
    } if (type === "Number") {
      return <AddonInputNumber value = {value as number} type={type} onSelectChange={handleTypeChange} onChange={handleValueChange}/>;
    }
    return <JsonEditor value = {value as string} type={type!} onSelectChange={handleTypeChange} onChange={handleValueChange}/>;
  };

  return (
    <Modal
      title="运行参数配置"
      visible={visible}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      className="params-modal"
      onCancel={handleParamsCancel}
    >
      <RenderComponent {...attributes} />
      {error && <Alert
        message={error}
        type="error"
        showIcon
      />}
      <div className="btn">
        <Button type="primary" onClick={handleFinish}>
          确定
        </Button>
      </div>
    </Modal>
  );
};

export default React.memo(ParamsModal);
