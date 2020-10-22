/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, SHOW_TYPE, SPECIES, SELECT_TYPE, IPopupWindow, IModalData
} from '../constant';

import {
  IPopupShowType, IPopupSelectType
} from '../interface';
import {
  NameCodeItem, ModuleTreeItem, PrimaryTreeItem, FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { createPopupWindowService, editPopupWindowService } from '../service';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;

  editData:IPopupWindow
  editModalData: IModalData

}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CreatePopupWindow: React.FC<IProps> = (props: IProps) => {
  const {
    onCancel, onOk, upDataMenus, editData: {
      id, code, name, selectType, showType
    }, editModalData: { okText }
  } = props;

  console.log(props.editData);
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const handleFinish = async (values) => {
    if (!id) {
    // const params = assemblyParams(values);
      const params = assemblyPopupParams(values);
      const res = await createPopupWindowService(params);
      if (res.code === "00000") {
        notification.success({
          message: "新增成功",
          duration: 2
        });
        onOk && onOk();
      } else {
        message.error(res.msg);
      }
    } else {
      // const params = assemblyParams(values);
      const params = assemblyPopupParams(values);
      const res = await editPopupWindowService(params, id);
      if (res.code === "00000") {
        notification.success({
          message: "编辑成功",
          duration: 2
        });
        onOk && onOk();
      } else {
        message.error(res.msg);
      }
    }
  };
  /**
   * 创建表接口参数拼装
   * @param values
   */
  const assemblyParams = (values) => {
    const {
      name, code, type, moduleId, description, mainTableCode, maxLevel
    } = values;
    const params = {
      name,
      code,
      type,
      moduleId,
      description,
      species: SPECIES.BIS,
    };
    if (type === SHOW_TYPE.TABLE) {
      Object.assign(params, { auxTable: { mainTableCode } });
    }
    if (type === SHOW_TYPE.TREE) {
      Object.assign(params, { treeTable: { maxLevel } });
    }
    return params;
  };

  const assemblyPopupParams = (values) => {
    const {
      name, showType, selectType, datasource, datasourceType, returnValue, returnText
    } = values;

    const params = {
      name,
      showType,
      selectType,
      selectCount: 0,
      enable: 1,
    };

    if (showType === SHOW_TYPE.TABLE) {
      Object.assign(params, {
        tablePopupWindowDetail: {
          createdBy: 0,
          datasource,
          datasourceType: 'TABLE',
          deleteFlag: 0,
          gmtCreate: "",
          gmtModified: "",
          id: 0,
          modifiedBy: 0,
          returnText: 0,
          returnValue: 0,
          showColumn: "",
          sortColumnInfo: ""
        }
      });
    }
    if (showType === SHOW_TYPE.TREE) {
      Object.assign(params, {
        treePopupWindowDetail: {
          createdBy: 0,
          datasource,
          datasourceType: 'TREE',
          deleteFlag: 0,
          gmtCreate: 0,
          gmtModified: 0,
          id: 0,
          modifiedBy: 0,
          relatedSuperiorColumn: 0,
          returnText: 0,
          returnValue: 0,
          showColumn: 0,
          showSearch: 0,
          sortColumnInfo: 0,
          superiorColumn: 0
        }
      });
    }

    if (showType === SHOW_TYPE.LEFT_TREE_RIGHT_TABLE) {
      Object.assign(params, {
        treeTablePopupWindowDetail: {
          createdBy: 0,
          deleteFlag: 0,
          gmtCreate: 0,
          gmtModified: 0,
          id: 0,
          modifiedBy: 0,
          popupWindowId: 0,
          showSearch: 0,
          tableDatasource: 0,
          tableDatasourceType: 0,
          tableReturnText: 0,
          tableReturnValue: 0,
          tableShowColumn: 0,
          tableSortInfo: 0,
          tableTreeRelatedColumn: 0,
          treeDatasource: 0,
          treeDatasourceType: 0,
          treeRelatedSuperiorColumn: 0,
          treeReturnText: 0,
          treeReturnValue: 0,
          treeShowColumn: 0,
          treeSortInfo: 0,
          treeSuperiorColumn: 0,
          version: 0
        }
      });
    }
    console.log(params);

    return params;
  };

  const createModule = () => {
    setVisibleModal(true);
  };

  const handleMenuOk = () => {
    setVisibleModal(false);
    upDataMenus && upDataMenus();
  };
  const handleFormCancel = () => {
    onCancel && onCancel();
  };
  useEffect(() => {
    form.setFieldsValue({
      name, code, selectType, showType
      // : getShowTypeTitleById(showType)
    });
    console.log(showType);
  }, []);
  const handleShowTypeSelectChange = (value) => {

  };
  console.log(form.getFieldValue('showType'));
  return (
    <>
      <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
        <NameCodeItem form={form} />
        <Form.Item
          name="showType"
          label="显示类型"
          rules={[{
            required: true,
            message: "请选择显示类型"
          }]}
        >
          <Select
            placeholder="请选择显示类型"
            onChange={handleShowTypeSelectChange}
            options = {SHOW_TYPE_OPTIONS}
          >
            {/* {
              SHOW_TYPE_OPTIONS.map((item, index) => <Option
                key={item.id} value={item.title}
              >{item.title}</Option>)
            } */}
          </Select>
        </Form.Item>
        <Form.Item
          name="selectType"
          label="选择类型"
          rules={[{
            required: true,
            message: "请选择选择类型"
          }]}
        >
          <Select
            placeholder="请选择选择类型"
            value={selectType}
          >
            {
              SELECT_TYPE_OPTIONS.map((item, index) => <Option
                key={item.id} value={item.id}
              >{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.showType !== currentValues.showType}
        >
          {({ getFieldValue }) => {
            return getFieldValue('showType') === SHOW_TYPE.TREE
              ? (
                <Form.Item
                  name="maxLevel"
                  label="最大层级数1"
                  rules={[{
                    required: true,
                    message: "请填写最大层级数1"
                  }]}
                  initialValue={15}
                >
                  <InputNumber placeholder="须为正整数,最大层级不超过15级" min={2} max={15} />
                </Form.Item>
              ) : getFieldValue('showType') === SHOW_TYPE.TABLE ? (
                <PrimaryTreeItem />
              ) : null;
          }}
        </Form.Item>
        <PopupWindowTable
          editData = {props.editData}
          form={form}
          label="数据源"
          name = 'datasource'
          code='datasource'
          text = 'datasource'
        />
        <PopupWindowField
          {...props}
          label = "返回值"
          code='returnValue'
          form={form}
          name="returnValue"
          text = 'returnValue'

        />
        <PopupWindowField
          {...props}
          label = "返回文本"
          code='returnText'
          form={form}
          name="returnText"
          text = 'returnText'
        />
        <ModuleTreeItem />
        <Button
          type="link"
          className="create-link"
          onClick={createModule}
        >新建模块</Button>
        <Form.Item name="description" label="备注" >
          <TextArea rows={4} maxLength={100} />
        </Form.Item>
        <FromFooterBtn
          onCancel={handleFormCancel}
          okText={okText}
        />
      </Form>
      <CreateModal
        title={okText}
        modalVisible={visibleModal}
        onCancel={() => setVisibleModal(false)}
      >
        <CreateMenu
          onCancel={() => setVisibleModal(false)}
          onOk={handleMenuOk}
        />
      </CreateModal>
    </>
  );
};
export default React.memo(CreatePopupWindow);
