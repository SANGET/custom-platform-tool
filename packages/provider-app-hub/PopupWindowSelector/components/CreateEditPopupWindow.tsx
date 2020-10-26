/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Select, InputNumber, message, notification
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, SHOW_TYPE, SPECIES, SELECT_TYPE, IPopupWindow, IModalData, IEditPopupWindowProps
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
import FormTablePopupWindow from './FormTablePopupWindow';
import FormTreePopupWindow from './FormTreePopupWindow';
import FormLeftTreeRightTable from './FormLeftTreeRightTable';

const { Option } = Select;
const { TextArea } = Input;

// interface IProps {
//   onOk: () => void;
//   onCancel: () => void;

//   upDataMenus: () => void;

//   editData:IPopupWindow
//   editModalData: IModalData

// }
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CreateEditPopupWindow: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    onCancel, onOk, updatePopupWindow, editData: {
      id, code, name, title, selectType, showType,
      tablePopupWindowDetail: { datasource, datasourceType },
      treePopupWindowDetail: { datasource, datasourceType },
      treeTablePopupWindowDetail: {
        tableDatasource, tableDatasourceType, treeDatasource, treeDatasourceType
      }
    }, editModalData: { okText }
  } = props;

  // console.log(props.editData);
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const handleFinish = async (values) => {
    console.log('handleFinish');
    // console.log('formvalue', values);
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

  const assemblyPopupParams = (values) => {
    console.log('assemblyPopupParams');
    const {
      name, title, showType, selectType, datasourceType,
      datasourceForTable, returnValueForTable, returnTextForTable, showColumnForTable, sortColumnInfoForTable,
      datasourceForTree, returnValueForTree, returnTextForTree, showColumnForTree, sortColumnInfoForTree,
      relatedSuperiorColumnForTree, showSearchForTree, superiorColumnForTree,
      tableDatasource,
      tableDatasourceType,
      tableReturnText,
      tableReturnValue,
      tableShowColumn,
      tableSortInfo,
      tableTreeRelatedColumn,
      treeDatasource,
      treeDatasourceType,
      treeRelatedSuperiorColumn,
      treeReturnText,
      treeReturnValue,
      treeShowColumn,
      treeSortInfo,
      treeSuperiorColumn

    } = values;

    const params = {
      name,
      title,
      showType,
      selectType,
      selectCount: 0,
      enable: 1,
    };

    if (showType === SHOW_TYPE.TABLE) {
      Object.assign(params, {
        tablePopupWindowDetail: {
          createdBy: 0,
          datasource: datasourceForTable,
          datasourceType: 'TABLE',
          deleteFlag: 0,
          gmtCreate: "",
          gmtModified: "",
          id: 0,
          modifiedBy: 0,
          returnText: returnTextForTable,
          returnValue: returnValueForTable,
          showColumn: showColumnForTable,
          sortColumnInfo: sortColumnInfoForTable
        }
      });
    }
    if (showType === SHOW_TYPE.TREE) {
      Object.assign(params, {
        treePopupWindowDetail: {
          createdBy: 0,
          datasource: datasourceForTree,
          datasourceType: 'TREE',
          deleteFlag: 0,
          gmtCreate: 0,
          gmtModified: 0,
          id: 0,
          modifiedBy: 0,
          relatedSuperiorColumn: relatedSuperiorColumnForTree,
          returnText: returnTextForTree,
          returnValue: returnValueForTree,
          showColumn: showColumnForTree,
          showSearch: showSearchForTree,
          sortColumnInfo: sortColumnInfoForTree,
          superiorColumn: superiorColumnForTree
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
          tableDatasource,
          tableDatasourceType: 'DB',
          tableReturnText,
          tableReturnValue,
          tableShowColumn,
          tableSortInfo,
          tableTreeRelatedColumn,
          treeDatasource,
          treeDatasourceType: 'DB',
          treeRelatedSuperiorColumn,
          treeReturnText,
          treeReturnValue,
          treeShowColumn,
          treeSortInfo,
          treeSuperiorColumn,
          version: 0
        }
      });
    }

    if (showType === SHOW_TYPE.CUSTOMIZATION) {
      Object.assign(params, {
        customPopupWindowDetail: {
          createdBy: 0,
          deleteFlag: 0,
          gmtCreate: "",
          gmtModified: "",
          id: 0,
          modifiedBy: 0,
          popupWindowId: 0

        }
      });
    }
    // console.log(params);

    return params;
  };

  const createModule = () => {
    setVisibleModal(true);
  };

  const handleMenuOk = () => {
    console.log('handleMenuOk');
    setVisibleModal(false);
    updatePopupWindow && updatePopupWindow();
  };
  const handleFormCancel = () => {
    console.log('handleFormCancel');
    onCancel && onCancel();
  };
  useEffect(() => {
    console.log('useEffect');
    form.setFieldsValue({
      name, code, title, selectType, showType
      // : getShowTypeTitleById(showType)
    });
  }, []);
  // const handleShowTypeSelectChange = (value) => {

  // };
  const getShowAreaByShowType = (showTypeTmpl) => {
    console.log('showTypeTmpl');
    if (showTypeTmpl === SHOW_TYPE.TREE) {
      return (
        <FormTreePopupWindow
          {...props}
          form={form}
        />
      );
    }
    if (showTypeTmpl === SHOW_TYPE.TABLE) {
      return (
        <FormTablePopupWindow
          {...props}
          form={form}
        />
      );
    }
    if (showTypeTmpl === SHOW_TYPE.LEFT_TREE_RIGHT_TABLE) {
      return (
        <FormLeftTreeRightTable
          {...props}
          form={form}
        />
      );
    }
  };
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
            // onChange={handleShowTypeSelectChange}
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
            placeholder="请选择类型"
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
            console.log(getFieldValue('showType'));
            return getShowAreaByShowType(getFieldValue('showType'));
          }}
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
export default React.memo(CreateEditPopupWindow);
