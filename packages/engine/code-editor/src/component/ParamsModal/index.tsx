import React, { ReactElement, useRef, RefObject, useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Select, InputNumber } from 'antd'
import { Store } from 'antd/lib/form/interface'
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/json-lint'
const { Option } = Select
import "./index.less"
import { IBaseOption, DATA_TYPE } from '../../config'

window['jsonlint'] = require('jsonlint-mod')

interface IProps {
  params:  string[];
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any[]) => void;
}
interface IBaseProps {
  value?: string;
  index: number;
  type: string;
  onSelectChange: (value: string, index: number) => void;
  onChange?: (value: string) => void;
}
interface IJsonEditorProps extends IBaseProps {

}
interface IAddonInputNumberProps extends IBaseProps {
  onChange?: (value: string | number | undefined) => void;
}
interface ISelectType {
  index: number;
  type: string;
  onChange: (value: string, index: number) => void;
}

type IType = "String" | "Number" | "Array" | "Object"
type IItemData = {
  key: string;
  type: IType
}

const JsonEditor = (props: IJsonEditorProps): ReactElement => {
  const { onChange, index, onSelectChange, type } = props
  const jsonRef: RefObject<HTMLTextAreaElement> = useRef(null)
  useEffect(() => {
    const editor = CodeMirror.fromTextArea(jsonRef.current!, {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/json",
      lineWrapping: true,
      smartIndent: true,
      gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter" ],
      lint: true,
      lineNumbers: true,
      foldGutter: true,
    })
    editor.on("blur", (cm, data) => {
      onChange && onChange(editor.getValue())
    })
    return () => {
      editor.toTextArea()
    }
  })
  return (
    <>
      <textarea ref={jsonRef}></textarea>
      <div className="json-editor-select">
        <SelectType
          index={index}
          type={type}
          onChange={onSelectChange}
        />
      </div>
    </>
  )
}

const SelectType = (props: ISelectType): ReactElement => {
  const { index, onChange, type } = props
  return (
    <Select
      style={{ width: 100 }}
      onChange={(value) => onChange(value, index)}
      defaultValue={type}>
      {
        DATA_TYPE.map((item: IBaseOption, index: number)=><Option key={index} value={item.key}>{item.value}</Option>)
      }
    </Select>
  )
}

const AddonInputNumber = (props: IAddonInputNumberProps): ReactElement => {
  const { onChange, index, onSelectChange, type } = props
  return (
    <div className="addon-input-number">
      <InputNumber
        onChange={onChange}
      />
      <SelectType
        type={type} onChange={onSelectChange} index={index}
      />
    </div>
  )
}
/**
 * 运行参数配置弹框
 * @param props: IProps
 */
const ParamsModal = (props: IProps): ReactElement => {
  const { visible, params, onCancel, onFinish } = props
  const [ fromData, setFromData ] = useState<IItemData[]>([])
  const [form] = Form.useForm()
  useEffect(()=>{
    setFromData(paramsTransformFromData())
  }, [visible])

  function paramsTransformFromData(): IItemData[] {
    const data: IItemData[] = []
    params.forEach(item => {
      data.push({ key: item, type: "String"})
    })
    return data
  }
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20, offset: 1 },
  }
  const tailLayout = {
    wrapperCol: { offset: 20, span: 4 },
  }
  const handleRunParamsCancel = () => {
    onCancel && onCancel()
  }
  const handleRunParamsFinish = (values: Store) => {
    const formatParams: any[] = []
    let isError: boolean = false
    Object.values(values).forEach((item, index) => {
      const { type } = fromData[index]
      if(type  === "Number" || type === "String") {
        formatParams.push(item)
      } else {
        try {
          const json = (new Function("return "+ item))()
          formatParams.push(json)
          if(Object.prototype.toString.call(json) !== `[object ${type}]`) {
            isError = true
            setFromError(index, "参数格式不正确")
          }
        } catch (error) {
          isError = true
          setFromError(index, "参数格式不正确")
        }
      }
    })
    if(isError) return
    onFinish && onFinish(formatParams)
  }
  const setFromError = (name: string | number, message: string) => {
    form.setFields([{
        name: name,
        errors: [message],
      }
    ])
  }
  const handleTypeChange = (value: string, index: number) => {
    const preFromData = JSON.parse(JSON.stringify(fromData))
    preFromData[index].type = value
    form.resetFields([index])
    setFromData(preFromData)
  }

  const renderComponent = (type: string, index: number): ReactElement => {
    if(type === "String") {
      return <Input addonAfter={<SelectType type={type} onChange={handleTypeChange} index={index}/>}/>
    } else if (type === "Number") {
      return <AddonInputNumber index={index} type={type} onSelectChange={handleTypeChange} />
    } else {
      return <JsonEditor index={index} type={type} onSelectChange={handleTypeChange}/>
    }
  }

  return (
    <Modal
        title="运行参数配置"
        visible={visible}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        className="params-modal"
        onCancel={handleRunParamsCancel}
     >
      <Form
        {...layout}
        form={form}
        name="basic"
        labelAlign="left"
        onFinish={handleRunParamsFinish}
      >
        {
          fromData.map((item, index)=>
            <Form.Item
              key={index}
              label={`参数${item.key}:`}
              name={index}
              rules={[
                { required: true, message: `请输入参数${item.key}的值` },
              ]}
            >
              {renderComponent(item.type, index)}
            </Form.Item>)
        }

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ParamsModal)
