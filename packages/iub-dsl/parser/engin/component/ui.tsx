import React, { Fragment } from "react";
import BTable from "@infra/ui/table/ant-table";

/**
 * @description 直接对接UI隔离层, 提供统一标准
 */

const InputCompParser: React.FC<any> = ({
  label, events: { onChange, onClick }, sourcePath, ...args
}): React.ReactElement => {
  return (<Fragment>
    {label} :
    <input
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof onChange === 'function') {
          const inputChangeCtx = {
            eventType: 'inputChange',
            value: e.target.value,
            key: 'dId1' // 的柯理化
          };
          onChange(inputChangeCtx);
        }
      }}
      onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (typeof onClick === 'function') {
          const inputClickCtx = {
            eventType: 'inputClick',
            event: e,
            key: 'dId6' // 的柯理化
          };
          onClick(inputClickCtx);
        }
      }}
      {...args}
    />
  </Fragment>);
};

const ButtonCompParser: React.FC<any> = ({
  id,
  text, type, events: { onClick }, ...args
}) => {
  return (<button
    onClick={() => {
      if (typeof onClick === 'function') {
        if (id === 'addBtn') {
          const btnClickCtx = {
            eventType: 'addBtn',
            value: {},
          };
          onClick(btnClickCtx);
        }
      }
    }}
  >{text}</button>);
};

/**
 * 1. 外部输入的dataSource, 应该是已经根据UI标准转换好的, 「此处不应该使用sdId之类的」
 * 2. 所以要增强get, 获取时候按照一定的格式进行转换 「一定格式的描述就是tag那部分」
 */
const SelectorCompParser: React.FC<any> = ({
  label, type, dataSource, sourcePath, showValue, selValue, value, events: { onChange }
}) => {
  return (<Fragment>
    {label} :
    <select
      placeholder='请选择'
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        if (typeof onChange === 'function') {
          const inputChangeCtx = {
            eventType: 'inputChange',
            value: e.target.value,
            key: 'dId2' // 的柯理化
          };
          onChange(inputChangeCtx);
        }
      }}
    >
      {dataSource.map((_) => <option key={_[selValue]} value={_[selValue]}>{_[showValue]}</option>)}
    </select>
  </Fragment>);
};

/**
 * defalutVal应该要分开的
 *
 * 二围表数据描述
 * tag、alias
 * 页面传递, 元数据,数据结构
 * 结构通信
 *
 * 1. 普通输入框 : 单字段, showval、value, usevalue
 * 2. 下拉框: 列表+selval
 * 3. 表格: 标准基础的mapObj, 列数据源, array + list
 *
 * 获取根据元数据映射,设置值
 * struct --> mapto
 *  metadate、 compUseKey、 tagKey
 *
 * 方案1:
 *  增强get
 * 方案2:
 */

const columnsInfo = [
  {
    title: '主键',
    key: 'sdId1',
    dataIndex: 'sdId1',
  },
  {
    title: '位置名称',
    key: 'sdId2',
    dataIndex: 'sdId2',
  },
  {
    title: '位置类型',
    key: 'sdId3',
    dataIndex: 'sdId3',
  },
  {
    title: '上级位置',
    key: 'sdId4',
    dataIndex: 'sdId4',
  },
];

const TableCompParser: React.FC<any> = ({
  id,
  style, dataSource, sourcePath, events: { onClick }
}) => {
  return (<div
    style={style}
    key={'tabledd'}
  >
    <BTable
      key={'tablereff'} dataSource={dataSource}
      columnsInfo={columnsInfo}
      onRow={(record) => {
        return {
          onClick: () => {
            if (typeof onClick === 'function') {
              const tableColClickCtx = {
                eventType: 'tableColClick',
                value: {
                  foucsData: record,
                  sourcePath: sourcePath.dataSource,
                  compId: id
                },
                key: 'runTimeFocus' // 的柯理化
              };
              onClick(tableColClickCtx);
            }
          },
        };
      }}

    />
  </div>);
};

const DefaultComp = (props) => <div>组件获取异常</div>;

const GetUIParser = (compType: string) => {
  switch (compType) {
    case "Input":
      return InputCompParser;
    case "Button":
      return ButtonCompParser;
    case "Selector":
      return SelectorCompParser;
    case "Table":
      return TableCompParser;
    default:
      return DefaultComp;
  }
};

export default GetUIParser;
