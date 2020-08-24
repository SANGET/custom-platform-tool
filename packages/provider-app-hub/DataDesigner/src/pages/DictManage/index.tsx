import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, } from 'antd';

/** 网络请求工具 */
import Http, { Msg } from '@infra/utils/http';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
import { renderOperCol, getColConfig } from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import { Connector } from '@provider-app/data-designer/src/connector';

import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';
import { formatGMT } from '@provider-app/data-designer/src/tools/format';
import DictForm from '@provider-app/data-designer/src/pages/DictManage/DictForm';

const DictManage = ({ isModal = false }) => {
  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  /**
  * 字典新增弹窗显隐,表单标题控制
  */
  const [modalConfig, setModalConfig] = useState({
    visible: false, title: '', isSub: false, isAddEditRow: false
  });
  /**
  * 删除字典
  */
  const DelDict = (id) => {
    Http.delete(`/smart_building/data/v1/tables/${id}`).then((res) => {
      Msg.success('操作成功');
      // console.log(res);
      getList();
    });
  };
  /** 操作按钮 */
  const operButs = [
    {
      text: '编辑',
      onClick: (row) => {
        /**
        * 获取详情
        */
        getDetail({
          id: row.id,
          cb: (row) => {
            // console.log(row);
            setModalConfig({
              title: '编辑字典', visible: true, isSub: false, isAddEditRow: false
            });
            form.setFieldsValue(row);
          }
        });
      }
    },
    {
      text: '删除',
      title: '你确定删除这条字典?',
      onClick: (row) => {
        // console.log(row);
        DelDict(row.id);
      }
    },
  ];

  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const columns = [
    // renderIndexCol(pager),
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '字典描述',
      dataIndex: 'description',
      width: '30%',
    },
  ];
  const getDictCols = () => {
    if (isModal) {
      return columns.concat(renderOperCol(operButs));
    }
    return columns.concat([{
      title: '最后修改人',
      dataIndex: 'modifiedUserName',
      width: 140,
    },
    {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      width: 160,
    }], renderOperCol(operButs));
  };
  const cols = getDictCols().map((item) => getColConfig(item));

  const [dictId, setDictId] = useState('');
  const [dictPid, setDictPid] = useState('');

  /** 操作按钮-打开弹窗 */
  const subOperButs = [
    {
      text: '配置子项',
      onClick: (row) => {
        /**
        * 设置pid,设置之后不能立刻取到值
        */
        setDictPid(row.id);
        getSubDictDetail({
          dictionaryId: dictId,
          pid: row.id,
          cb: (res) => {
            console.log(res);
            setModalConfig({
              title: '配置子项', visible: true, isSub: true, isAddEditRow: res && res.length === 0
            });
            form.setFieldsValue({ items: res });
          }
        });
      }
    },
    {
      text: '删除子项',
      title: '你确定删除子项?',
      onClick: (row) => {
        delSubDetail({
          dictionaryId: dictId,
          /** pid就是本行id */
          pid: row.id,
          cb: () => {
            Msg.success('操作成功');
            getDetail({
              id: dictId,
              cb: (data) => {
                setSubTableData(data.items);
              }
            });
          }
        });

        // console.log(row);
        // DelDict(row.id);
      }
    },
  ];
  /**
  * 子字典项
  */
  const subColumns = [
    // renderIndexCol(pager),
    {
      title: '编码',
      dataIndex: 'code',
      width: 140,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 140,
    },
    renderOperCol(subOperButs),

  ];
  const subCols = subColumns.map((item) => getColConfig(item));

  /**
  * 提交数据
  * type-
  */
  const submitData = ({ type, data, cb }) => {
    const reqMethod = {
      add: 'post',
      update: 'put'
    }[type];

    Http[reqMethod]('/smart_building/data/v1/dictionary/', data).then((res) => {
      Msg.success('操作成功');
      getList();
      cb && cb();
      // console.log(res);
    });
  };

  /**
  * 查询字典列表
  */
  const getList = (args = {}) => {
    const params = Object.assign({}, {
      name: '', description: "", offset: 0, size: 10,
    }, args);
    setTableLoading(true);
    Http.get('/smart_building/data/v1/dictionary/list', { params }).then((res) => {
      // console.log(res.data.result);
      const data = res.data.result.data.map((row) => ({
        ...row,
        gmtModified: formatGMT(row.gmtModified)

      }));
      setTableData(data);
    }).finally(() => {
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  /**
  * 查询字典详情
  */
  const getDetail = ({ id, cb }) => {
    // return await Http.get(`/smart_building/data/v1/dictionary/${id}`);
    setTableLoading(true);
    Http.get(`/smart_building/data/v1/dictionary/${id}`, {}).then((res) => {
      cb && cb(res.data.result);
    }).finally(() => {
      setTableLoading(false);
    });
  };

  /**
  * 新增/修改子字典接口
  */
  const configSubDict = ({ data, cb, querySub }) => {
    Http.put("/smart_building/data/v1/dictionary_value/", data).then((res) => {
      // console.log(res);
      cb && cb(res.data.result);
      getSubDictDetail(querySub);
      Msg.success('操作成功');
    });
  };
  /**
  * 查询字典项项
  */
  const getSubDictDetail = ({ dictionaryId, pid, cb }) => {
    // const { dictionaryId = dictId, pid = dictPid, cb } = args;

    Http.get(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`).then((res) => {
      // console.log(res);
      cb && cb(res.data.result);
    });
  };
  /**
  *
  * 删除子字典项
  */
  const delSubDetail = (params) => {
    const { dictionaryId, pid, cb } = params;
    /**
    * 是删除子字典下面的子项,不是删除子字典自身
    */
    /**
    * dictionaryId-字典项id  pid--本级id
    * "level"=5时 第5级隐藏配置子项,删除子项按钮
    */
    Http.delete(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`).then((res) => {
      cb && cb(res);
      // console.log(res);
    });
  };

  const [form] = Form.useForm();

  const addMenu = {
    text: '新建',
    onClick: () => {
      setModalConfig({
        title: '新增字典', visible: true, isSub: false, isAddEditRow: true
      });
    }
  };
  /**
  * 表格头部按钮菜单属性配置
  */
  const tableHeadMenus = {
    title: '字典列表',
    style: { marginTop: "20px" },
    menus: isModal ? [addMenu] : [
      addMenu,
      { text: '导入', onClick: () => {} },
      { text: '导出', onClick: () => {} },
    ]
  };

  /**
  * 清除表单校验错误提示,关闭弹窗
  */
  const handleModalClose = () => {
    form.resetFields();
    setModalConfig({
      visible: false, title: '', isSub: false, isAddEditRow: false
    });
  };
  /**
  * 字典表单弹窗配置
  */
  const modalProps = getModalConfig({
    visible: modalConfig.visible,
    title: modalConfig.title,
    isSub: modalConfig.isSub,
    isAddEditRow: modalConfig.isAddEditRow,
    width: "1000px",
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { fieldForm-新建表可控表单实例 }
     */
    onOk: (e) => {
      form.validateFields().then((values) => {
        console.log(values);

        if (modalConfig.title === '配置子项') {
          configSubDict({
            data: {
              dictionaryId: dictId,
              pid: dictPid,
              items: values.items
            },
            cb: () => {
              handleModalClose();
            },
            querySub: {
              dictionaryId: dictId,
              pid: dictPid,
            }
          });
        } else {
          submitData({
            type: modalConfig.title === '新增字典' ? 'add' : 'update',
            data: values,
            cb: () => {
              handleModalClose();
            }
          });
        }
      })
        .catch((errorInfo) => {
        /** 校验未通过 */
          console.log(errorInfo);
        });
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      handleModalClose();
    },
  });

  /**
  * 搜索表单实例
  */
  const [searchForm] = Form.useForm();
  /** 搜索条件-表名称 */
  const searchProps = {
    colSpan: isModal ? 9 : 6,
    form: searchForm,
    className: 'search-form',

    items: {
      name: {
        itemAttr: {
          label: "字典名称",
        },
        compAttr: {
          type: 'Input',
          placeholder: "请输入字典名称",
        }
      },
      description: {
        /** 表单项属性 */
        itemAttr: {
          label: "字典描述",
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入表名称',
        }
      },
      btns: {
        itemAttr: {},
        compAttr: [
          {
            type: 'primary',
            text: '搜索',
            onClick: () => {
              searchForm
                .validateFields() /** 表单校验 */
                .then((values) => {
                  const { description, name } = values;
                  /**
                     * 列表查询,页码从0开始
                     */
                  getList({ description, name, offset: 0 });
                });
            }
          },
          {
            type: '',
            text: '清空',
            onClick: () => {
              searchForm.resetFields();
            }
          }
        ]
      }
    }

  };

  const [subTableData, setSubTableData] = useState([]);

  const deepLevelItem = [];

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  return (<div className="data-designer">
    <BasicForm {...searchProps} />
    <TableHeadMenu {...tableHeadMenus} />
    <Table
      loading={tableLoading}
      bordered
      columns={cols}
      indentSize={10}
      dataSource={tableData}
      rowKey={(record) => record.id}
      pagination={{
        showTotal: ((total) => {
          return `共 ${total} 条`;
        }),
        onChange: (page, pageSize) => {
          getList({ offset: page - 1, size: pageSize });
          setPager({ page, pageSize });
        }
      }}
      expandable={{
        /** 点击行不展开 */
        expandRowByClick: false,
        /** 展开行的键值集合 */
        expandedRowKeys,
        /** 额外的展开行 */
        expandedRowRender: (record) => {
          return (
            <Table
              bordered
              columns={subCols}
              dataSource={subTableData}
              // columns={Acolumns}
              // dataSource={Adata}
              /** 指定树形结构的列名 */
              childrenColumnName={['items']}
              rowKey={(row) => row.id}
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    // console.log(record);
                    let index;
                    // if (record.level === 1) {
                    index = subTableData.findIndex((item) => item.id === record.id);
                    // } else {
                    //   index = deepLevelItem.findIndex((item) => item.id === record.id);
                    // }

                    getSubDictDetail({
                      dictionaryId: dictId,
                      pid: record.id,
                      cb: (data) => {
                        /**
                         * 设置展开的行
                         */
                        subTableData[index].items = data;
                        // deepLevelItem=
                        /** 不要原封不动使用useState导出的值 */
                        setSubTableData([...subTableData]);
                        // console.log(JSON.stringify(subTableData, null, 4));
                      }
                    });
                  }, // 点击行
                  onDoubleClick: (event) => {},
                  onContextMenu: (event) => {},
                  onMouseEnter: (event) => {}, // 鼠标移入行
                  onMouseLeave: (event) => {},
                };
              }}
            />
          );
        },
        /** 点击展开图标时展开 */
        onExpand: (expanded, record) => {
          // console.log(record);
          setDictId(record.id);
          getDetail({
            id: record.id,
            cb: (data) => {
              /**
               * 设置展开的行
               */
              setExpandedRowKeys([record.id]);
              setSubTableData(data.items);
            }
          });
        },
        /**
        * 允许展开
        */
        rowExpandable: (record) => true,
      }}
    />
    <Modal {...modalProps} key={new Date().getTime()} >
      <DictForm form={form} isSub={modalProps.isSub} isAddEditRow={modalProps.isAddEditRow} />
    </Modal>

  </div>);
};

// const DictManageContainer = Connector(DictManage);
export default DictManage;
