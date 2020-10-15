import React from 'react';
import {
  Input, Table, message, Button
} from 'antd';
import lodash from 'lodash';
import { getDictionaryList } from "../apiAgents";
import { NOTIFICATION_TYPE } from '../constants';

const { Search } = Input;

interface IModalFooter {
  onCancel: ()=>void
  onOk: ()=>void
  okText?: string
  cancelText?: string
}
export const ModalFooter: React.FC<IModalFooter> = React.memo((props: IModalFooter) => {
  const {
    onCancel, onOk, okText = "确定", cancelText = "取消"
  } = props;
  return (
    <div className="clear-both" style={{ height: '30px' }}>
      <Button
        className="float-right"
        htmlType="button"
        onClick={onCancel}
      >
        {cancelText}
      </Button>
      <Button
        className="float-right mr-2"
        onClick={onOk}
        type="primary"
      >
        {okText}
      </Button>
    </div>
  );
});
interface IProps {
  onOk: (code: string[], name: string[]) => void;
  onCancel: () => void;
  selectedRowKeys: string[]
}
interface ISelectedRow {
  code: string
  name: string
}
class ChooseDict extends React.Component<IProps> {
  state = {
    selectedRowKeys: this.props.selectedRowKeys || [],
    offset: 1,
    size: 10,
    total: 0,
    searchName: '',
    menu: []
  }

  /**
 * 用于实时的数据比对
 * @param arr
 */
  translateArrToMap = (arr: ISelectedRow[]) => {
    const obj = {};
    arr.forEach((item) => {
      const { code, name } = item;
      obj[code] = name;
    });
    return obj;
  };

  translateMapToArr = (obj, order: string[]): ISelectedRow[] => {
    return order.map((item) => {
      return { code: item, name: obj[item] };
    });
  };

  getNameById = (menu: ISelectedRow[], code: string) => {
    return menu.filter((item) => item.code === code)?.[0]?.name;
  };

  /** 进行列表数据获取 */
  getMenuList = async () => {
    const { searchName: name, offset, size } = this.state;
    /** 接口对应的offset是指记录偏移位置，不是页偏移量 */
    const res = await getDictionaryList({ name, offset: (offset - 1) * size, size });
    console.log(res.data);
    console.log(typeof (res.total - 0));
    /** 设置数据 */
    this.setState({
      menu: res?.data,
      total: res?.total - 0
    });
  }

  componentDidMount() {
    this.getMenuList();
  }

  componentDidCatch(error, errorInfo) {
    // 你也可以在异常报告设备中打印异常信息
    console.log(error, errorInfo);
  }

  handleOk = () => {
    const { onOk } = this.props;
    const { selectedRowKeys, menu } = this.state;
    if ([0, undefined, null].includes(selectedRowKeys.length)) {
      return message?.[NOTIFICATION_TYPE.WARNING]('请选择一行数据');
    }
    return onOk && onOk(
      selectedRowKeys,
      menu.filter((item) => selectedRowKeys.includes(item.code)).map((item) => item.name)
    );
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  handleChangePage = (page, pageSize) => {
    this.setState({
      offset: page,
      size: pageSize
    }, () => {
      this.getMenuList();
    });
  }

  handleRowSelect = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    });
  }

  handleRowClick = (selectedRowKeyTmpl: string) => {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.includes(selectedRowKeyTmpl)) {
      this.setState({
        selectedRowKeys: [selectedRowKeyTmpl, ...selectedRowKeys]
      });
    } else {
      this.setState({
        selectedRowKeys: lodash.without(selectedRowKeys, selectedRowKeyTmpl)
      });
    }
  }

  handleSearch = (value) => {
    this.setState({
      searchName: value
    }, () => {
      this.getMenuList();
    });
  };

  render() {
    const { menu, total, selectedRowKeys } = this.state;
    return (<>
      <Search
        placeholder="请输入字典名称"
        onSearch={this.handleSearch}
      />
      <Table
        dataSource={menu}
        columns={[
          { title: '序号', render: (text, record, index) => { return `${index + 1}`; } },
          { title: '字典名称', dataIndex: 'name' },
          { title: '字典描述', dataIndex: 'description', render: (text) => { return text || '--'; } }
        ]}
        scroll={{ y: 320 }}
        rowKey="code"
        onRow={(record) => {
          return {
            onClick: () => { this.handleRowClick(record?.code); }
          };
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          total,
          onChange: this.handleChangePage,
          onShowSizeChange: this.handleChangePage
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (this.handleRowSelect),
          type: 'radio',
        }}
      />
      <ModalFooter
        onOk={() => { this.handleOk(); }}
        onCancel={this.handleCancel}
      />
    </>);
  }
}

export default React.memo(ChooseDict);
