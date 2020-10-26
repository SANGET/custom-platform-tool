import React, { useState, useReducer, useEffect } from 'react';
import {
  Form, Input, Table
} from 'antd';
import { ModalFooter } from '@provider-app/table-editor/components/ChooseDict';
import { SketchPicker } from 'react-color';
import { FormInstance } from 'antd/lib/form';
import CreateModal from './CreateModal';
import { DEF_VALUE, DICTIONARY_CHILD_KEY, DICTIONARY_KEY } from '../constants';

const getColumns = ({
  handleAdd, handleClickColor, list, handleDelete
}) => {
  return [
    {
      title: '编码',
      key: DICTIONARY_CHILD_KEY.CODE,
      width: 242,
      ellipsis: { showTitle: true },
      dataIndex: DICTIONARY_CHILD_KEY.CODE,
      render: (text, record) => {
        return record.editable ? (
          <Form.Item
            name={DICTIONARY_CHILD_KEY.CODE}
            rules={[
              { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '32位字符内的中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
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
      key: DICTIONARY_CHILD_KEY.NAME,
      width: '242px',
      dataIndex: DICTIONARY_CHILD_KEY.NAME,
      ellipsis: { showTitle: true },
      render: (text, record) => {
        return record.editable ? (
          <Form.Item
            name="name"
            rules={[
              { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '32位字符内的中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' },
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
              console.log(record[DICTIONARY_CHILD_KEY.ID]);
              handleClickColor({
                color: text || DEF_VALUE.RENDERFONTCOLOR,
                type: DICTIONARY_CHILD_KEY.RENDERFONTCOLOR,
                id: record[DICTIONARY_CHILD_KEY.ID]
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
              handleClickColor({
                color: text || DEF_VALUE.RENDERBGCOLOR,
                type: DICTIONARY_CHILD_KEY.RENDERBGCOLOR,
                id: record[DICTIONARY_CHILD_KEY.ID]
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
              handleAdd(index);
            }}
          >新增</span>
          {list.length > 1
            ? <span
              className="link-btn ml-1"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
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

class CreateDictionary extends React.Component {
  state = {
    editingKey: '',
    list: [],
    map: {},
    modalVisibleColorPicker: false,
    colorPicker: {
      color: DEF_VALUE.RENDERBGCOLOR,
      successCallback: () => {}
    },
    keyOfColorPicker: ''
  }

  dictForm = React.createRef<FormInstance>();

  childForm = React.createRef<FormInstance>();

  getMap = (list) => {
    const map = {};
    list.forEach((item) => {
      map[item[DICTIONARY_CHILD_KEY.ID]] = item;
    });
    return map;
  }

  componentDidMount() {
    const {
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
      list, editingKey
    } = this.props.config;
    this.dictForm.current?.setFieldsValue({
      [DICTIONARY_KEY.NAME]: name,
      [DICTIONARY_KEY.DESC]: desc,
    });
    this.setState({
      list, map: this.getMap(list), editingKey: editingKey || ''
    }, () => {
      if (editingKey) {
        const record = list[this.getIndexByEditingKey()];
        this.childForm.current?.setFieldsValue({
          [DICTIONARY_CHILD_KEY.NAME]: record[DICTIONARY_CHILD_KEY.NAME],
          [DICTIONARY_CHILD_KEY.CODE]: record[DICTIONARY_CHILD_KEY.CODE],
          [DICTIONARY_CHILD_KEY.RENDERBGCOLOR]: record[DICTIONARY_CHILD_KEY.RENDERBGCOLOR],
          [DICTIONARY_CHILD_KEY.RENDERFONTCOLOR]: record[DICTIONARY_CHILD_KEY.RENDERFONTCOLOR]
        });
      }
    });
  }

  getColorPickerConfig = ({ id, color, type }) => {
    return {
      color,
      successCallback: ({ hex }) => {
        this.setState({
          modalVisibleColorPicker: false,
          list: this.updateRecordByKey(id, { [type]: hex })
        });
      }
    };
  }

  getIndexByEditingKey = ():number => {
    const { editingKey } = this.state;
    return this.getIndexByKey(editingKey);
  };

  getIndexByKey = (key) => {
    const { list } = this.state;
    let index = -1;
    Array.isArray(list) && list.some((item, i) => {
      if (item[DICTIONARY_CHILD_KEY.ID] === key) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  }

  updateRecordByEditingKey = (updateRecord) => {
    const { editingKey } = this.state;
    return this.updateRecordByKey(editingKey, updateRecord);
  }

  updateRecordByKey = (id, updateRecord) => {
    const record = this.state.map[id];
    for (const key in updateRecord) {
      record[key] = updateRecord[key];
    }
    return this.state.list.slice();
  }

  createItem = () => {
    const id = `${new Date().valueOf()}`;
    const record = {
      [DICTIONARY_CHILD_KEY.ID]: id,
      [DICTIONARY_CHILD_KEY.EDITABLE]: true,
      [DICTIONARY_CHILD_KEY.RENDERBGCOLOR]: '#fff',
      [DICTIONARY_CHILD_KEY.RENDERFONTCOLOR]: '#000'
    };
    return record;
  }

  handleAdd = (index) => {
    this.handleClick().then((canIAdd) => {
      if (!canIAdd) return;
      this.childForm.current?.resetFields();
      const record = this.createItem();
      const { map, list } = this.state;
      list.splice(index + 1, 0, record);
      map[record[DICTIONARY_CHILD_KEY.ID]] = record;
      this.setState({
        list: list.slice(),
        map,
        editingKey: record.id
      });
    });
  }

  handleClick = () => {
    return new Promise((resolve, reject) => {
      const { editingKey } = this.state;
      if (editingKey === '') {
        resolve(true);
        return;
      }
      try {
        this.childForm.current?.validateFields().then(() => {
          const record = this.childForm.current?.getFieldsValue([DICTIONARY_CHILD_KEY.NAME, DICTIONARY_CHILD_KEY.CODE]);
          this.childForm.current?.resetFields();
          this.setState({
            editingKey: '',
            list: this.updateRecordByEditingKey({ ...record, [DICTIONARY_CHILD_KEY.EDITABLE]: false })
          }, () => {
            resolve(true);
          });
        });
      } catch (e) {
        resolve(false);
      }
    });
  };

  handleDoubleClick = (record) => {
    const { editingKey } = this.state;
    const { [DICTIONARY_CHILD_KEY.ID]: id } = record;
    if (id === editingKey) return;
    this.handleClick().then((canIEdit) => {
      if (!canIEdit) return;
      this.setState({
        editingKey: id,
        list: this.updateRecordByKey(id, { [DICTIONARY_CHILD_KEY.EDITABLE]: true })
      });
      const { [DICTIONARY_CHILD_KEY.NAME]: name, [DICTIONARY_CHILD_KEY.CODE]: code } = record;
      this.childForm.current?.setFieldsValue({ [DICTIONARY_CHILD_KEY.NAME]: name, [DICTIONARY_CHILD_KEY.CODE]: code });
    });
  }

  handleOk = async () => {
    const { onOk } = this.props;
    try {
      await this.dictForm.current?.validateFields();
      const data = this.dictForm.current?.getFieldsValue([DICTIONARY_KEY.NAME, DICTIONARY_KEY.DESC]);
      const canISave = await this.handleClick();
      if (!canISave) return;
      const { list } = this.state;
      onOk && onOk({ ...data, list });
    } catch (e) {
      console.log(e);
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  handleClickColor = ({ color, type, id }) => {
    const colorPicker = this.getColorPickerConfig({ id, color, type });
    this.setState({
      colorPicker,
      modalVisibleColorPicker: true
    });
  }

  handleDelete = (id) => {
    const { editingKey, list } = this.state;
    const index = this.getIndexByKey(id);
    list.splice(index, 1);
    this.setState({
      list: list.slice(),
      editingKey: editingKey === id ? '' : editingKey
    });
  }

  render() {
    const { nameVisible, descVisible } = this.props.config;
    const {
      list, modalVisibleColorPicker, colorPicker
    } = this.state;
    const {
      handleClickColor, handleAdd, handleDoubleClick, handleClick: onClick, handleDelete, handleOk, handleCancel
    } = this;
    const columns = getColumns({
      handleDelete,
      handleClickColor,
      list,
      handleAdd
    });
    return (
      <div
        className="create-dictionary"
      >
        <Form ref={this.dictForm} layout = "inline">
          { nameVisible ? (
            <Form.Item
              className="w-2/4"
              style={{ margin: 0 }}
              label="字典名称"
              name={DICTIONARY_KEY.NAME}
              rules={[
                { required: true, message: '字典名称必填' },
                { pattern: /^[\u4e00-\u9fa5a-zA-Z()][\u4e00-\u9fa5_a-zA-Z0-9()]{0,31}$/, message: '限制32位字符，输入字段包括中文、英文大小写、数字、下划线、英文小括号(_)，不能以数字或下划线_开头' }
              ]}
            >
              <Input />
            </Form.Item>
          ) : null}
          { descVisible ? (
            <Form.Item
              style={{ margin: 0, paddingLeft: '5px' }}
              className="w-2/4"
              label="字典描述"
              name={DICTIONARY_KEY.DESC}
            >
              <Input />
            </Form.Item>
          ) : null }
        </Form>
        <Form ref={this.childForm} className="create-dict-child-list">
          <Table
            columns={columns}
            dataSource = {list}
            rowKey={'id'}
            pagination={false}
            onRow={(record, index) => {
              return {
                onDoubleClick: () => { handleDoubleClick(record); },
                onClick
              };
            }}
          />
        </Form>
        <CreateModal
          width = '266px'
          modalVisible={modalVisibleColorPicker}
          title="更改颜色"
          onCancel={() => this.setState({ modalVisibleColorPicker: false })}
        >
          <SketchPicker
            className="color-picker"
            modalVisible={modalVisibleColorPicker}
            color={colorPicker.color} onChangeComplete ={({ hex }) => {
              typeof colorPicker.successCallback === 'function' && colorPicker.successCallback({ hex });
            }}
          />
        </CreateModal>
        <ModalFooter
          onOk={handleOk}
          onCancel={handleCancel}
        />
      </div>
    );
  }
}

export default React.memo(CreateDictionary);
