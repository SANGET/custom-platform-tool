import React, { useState, useReducer, useEffect } from 'react';
import {
  Form, Input, Table
} from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { SketchPicker } from 'react-color';
import CreateModal from './CreateModal';

const getColumns = ({
  saveRow, setChildren, setEditingKey, children, editingKey, setColorPicker, form
}) => {
  return [{
    title: '编码',
    key: 'code',
    width: 242,
    ellipsis: { showTitle: true },
    dataIndex: 'code',
    render: (text, record) => {
      return record.editable ? (
        <Form.Item
          name="code"
          rules={[
            { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '限制32位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
            { required: true, message: '编码必填' },
          ]}
        >
          <Input onClick={(e) => e.stopPropagation()} />
        </Form.Item>
      ) : (
        text
      );
    }
  }, {
    title: '名称',
    key: 'name',
    width: '242px',
    dataIndex: 'name',
    ellipsis: { showTitle: true },
    render: (text, record) => {
      return record.editable ? (
        <Form.Item
          name="name"
          rules={[
            { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '限制32位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
            { required: true, message: '名称必填' },
          ]}
        >
          <Input onClick={(e) => e.stopPropagation()} />
        </Form.Item>
      )
        : text;
    }
  }, {
    title: '字体颜色',
    key: 'renderFontColor',
    dataIndex: 'renderFontColor',
    width: 88,
    render: (text, record, index) => {
      return (
        <div
          className="color-render"
          style={{ backgroundColor: text }}
          onClick={(e) => {
            e.stopPropagation();
            setColorPicker({
              modalVisible: true,
              value: text || '#fff',
              pickAft: ({ hex }) => {
                setColorPicker({
                  modalVisible: false
                });
                setChildren({
                  type: 'update',
                  name: {
                    [index]: { ...record, renderFontColor: hex }
                  }
                });
              }
            });
          }}
        ></div>
      );
    }
  }, {
    title: '背景颜色',
    key: 'renderBgColor',
    width: 88,
    dataIndex: 'renderBgColor',
    render: (text, record, index) => {
      return (
        <div
          className="color-render"
          style={{ backgroundColor: text }}
          onClick={(e) => {
            e.stopPropagation();
            setColorPicker({
              modalVisible: true,
              value: text || '#fff',
              pickAft: ({ hex }) => {
                setColorPicker({
                  modalVisible: false
                });
                setChildren({
                  type: 'update',
                  name: {
                    [index]: { ...record, renderBgColor: hex }
                  }
                });
              }
            });
          }}
        ></div>
      );
    }
  }, {
    title: '操作',
    key: 'action',
    width: '92px',
    render: (text, record, index) => (
      <>
        <span
          className="link-btn"
          onClick={(e) => {
            e.stopPropagation();
            saveRow().then((canIAdd) => {
              if (!canIAdd) return;
              const id = `${new Date().valueOf()}`;
              form.resetFields();
              setChildren({
                type: 'add',
                name: {
                  [index + 1]: {
                    id, editable: true, renderBgColor: '#fff', renderFontColor: '#000'
                  }
                }
              });
              setEditingKey(id);
            });
          }}
        >新增</span>
        {children.length > 1
          ? <span
            className="link-btn ml-1"
            onClick={(e) => {
              editingKey === record.id && setEditingKey('');
              setChildren({
                type: 'delete',
                name: index
              });
              e.stopPropagation();
            }}
          >删除</span> : null}
      </>
    )
  }];
};
interface IOperateParam {
  dictName?:string
  dictDescription?:string
  editingKeyFirst?: string
  childList: {
    name: string
    code: string
    renderBgColor: string
    renderFontColor: string
    editable?: boolean
  }[]
}
interface IProps {
  onOk: (data:IOperateParam) => void;
  onCancel: () => void;
  config: {
    showDictionaryConfig,
    operateParam: IOperateParam
  }
}
const CreateDictionary: React.FC<IProps> = (props: IProps) => {
  const {
    onOk, onCancel, config: {
      showDictionaryConfig, operateParam: {
        dictName, dictDescription, childList, editingKeyFirst
      }
    }
  } = props;
  const [colorPicker, setColorPicker] = useState({
    modalVisible: false,
    value: '#000',
    pickAft: (param) => {}
  });
  const [children, setChildren] = useReducer((state, action) => {
    let newState;
    switch (action.type) {
      case 'add':
        newState = [];
        for (const index in action.name) {
          newState = state.slice(0, index).concat(action.name[index], state.slice(index)); break;
        }
        return newState;
      case 'delete':
        newState = state.slice();
        newState.splice(action.name, 1);
        return newState;
      case 'update':
        newState = state.slice();
        for (const index in action.name) {
          newState[index] = action.name[index];
        }
        return newState;
    }
    return state;
  }, childList);
  const [editingKey, setEditingKey] = useState(editingKeyFirst || '');
  const [dictForm] = Form.useForm();
  const [childForm] = Form.useForm();
  const getIndexByEditingKey = ():number => {
    let index = -1;
    Array.isArray(children) && children.some((item, i) => {
      if (item.id === editingKey) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  };
  const saveRow = async () => {
    if (editingKey === '') return children;
    const index = getIndexByEditingKey();
    try {
      await childForm.validateFields();
      const record = childForm.getFieldsValue(['name', 'code']);
      setChildren({
        type: 'update',
        name: {
          [index]: {
            ...children[index], ...record, editable: false
          }
        }
      });
      children[index] = { ...children[index], ...record, editable: false };
      setEditingKey('');
      return children;
    } catch (e) {
      return false;
    }
  };
  const handleOk = async () => {
    try {
      await dictForm.validateFields();
      const data = dictForm.getFieldsValue(['dictName', 'dictDescription']);
      saveRow().then((canISave) => {
        if (!canISave) return;
        onOk && onOk({ ...data, children: canISave });
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const columns = getColumns({
    saveRow, setChildren, setEditingKey, children, editingKey, setColorPicker, form: childForm
  });
  useEffect(() => {
    dictForm.setFieldsValue({ dictName, dictDescription });
    if (editingKey) {
      const index = getIndexByEditingKey();
      const record = children[index];
      childForm.setFieldsValue({
        name: record.name,
        code: record.code,
        renderBgColor: record.renderBgColor,
        renderFontColor: record.renderFontColor
      });
    }
  }, []);

  return (
    <div
      className="create-dictionary"
    >
      {showDictionaryConfig ? <Form form={dictForm} layout = "inline">
        <Form.Item
          className="w-2/4"
          style={{ margin: 0 }}
          label="字典名称"
          name="dictName"
          rules={[
            { required: true, message: '字典名称必填' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '限制32位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{ margin: 0, paddingLeft: '5px' }}
          className="w-2/4"
          label="字典描述"
          name="dictDescription"
        >
          <Input />
        </Form.Item>
      </Form> : null}
      <Form form={childForm} className="create-dict-child-list">
        <Table
          columns={columns}
          dataSource = {children}
          rowKey={'id'}
          pagination={false}
          onRow={(record, index) => {
            return {
              onDoubleClick: (event) => {
                if (record.id === editingKey) return;
                saveRow().then((canIEdit) => {
                  if (!canIEdit) return;
                  setEditingKey(record.id);
                  setChildren({
                    type: 'update',
                    name: {
                      [index]: { ...record, editable: true }
                    }
                  });
                  const { name, code } = record;
                  childForm.setFieldsValue({ name, code });
                });
              },
              onClick: (event) => { saveRow(); }
            };
          }}
        />
      </Form>
      <CreateModal
        width = '266px'
        modalVisible={colorPicker.modalVisible}
        title="更改颜色"
        onCancel={() => setColorPicker({ modalVisible: false, value: '#000', pickAft: (param) => {} })}
      >
        <SketchPicker
          className="color-picker"
          modalVisible={colorPicker.modalVisible}
          color={colorPicker.value} onChangeComplete ={({ hex }) => {
            typeof colorPicker.pickAft === 'function' && colorPicker.pickAft({ hex });
          }}
        />
      </CreateModal>
      <ModalFooter
        onOk={() => { handleOk(); }}
        onCancel={() => { handleCancel(); }}
      />
    </div>
  );
};

export default React.memo(CreateDictionary);
