import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, } from 'antd';

/** 网络请求工具 */
import { Msg } from '@infra/utils/http';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
import { renderOperCol, getColConfig } from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';
import { formatGMT } from '@provider-app/data-designer/src/tools/format';
import DictForm from '@provider-app/data-designer/src/pages/DictManage/DictForm';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  GetDictList, AddDict, UpdateDict, GetDictDeatil, DelTable, GetSubDictDetail, deleSubDict, AddUpdateSubDict
} from '../../api';

const DictManage = ({ isModal = false }) => {
  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  /**
  * 字典新增弹窗显隐,表单标题控制
  */
  const [modalConfig, setModalConfig] = useState({
    visible: false, title: '', isSub: false, isAddEditRow: false
  });

  const [tableLoading, setTableLoading] = useState({ tip: "", spinning: false });
  const [tableData, setTableData] = useState([]);
  const [subTableData, setSubTableData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
  const columns = [
    // renderIndexCol(pager),
    {
      title: '序号',
      dataIndex: 'rowIndex',
      width: 80,
      key: 'rowIndex',
      render: (text, record, index) => {
        // console.log({ text, record, index });
        /** 与后端协商,行号由前端计算 */
        const { page, pageSize } = pager;
        return <span>{pageSize / 10 - 1 + index + 1}</span>;
      },
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 140,
      key: 'name'
    },
    {
      title: '字典描述',
      dataIndex: 'description',
      width: '30%',
      key: 'description',
      render: (text, record, index) => {
        return text || "--";
      }
    },
  ];
  /**
  * 删除字典
  */
  const DelDict = (id) => {
    DelTable(id).then((res) => {
      getList();

      Msg.success('操作成功');
      // console.log(res);
    });
  };
  /** 操作按钮 */
  const operButs = [
    {
      text: '编辑',
      onClick: (row) => {
        debugger;
        /**
        * 获取详情
        */
        getDetail({
          id: row.id,
          cb: (row) => {
            debugger;
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
        if (row.items[0]) {
          DelTable(row.id)
            .then((res) => {
              if (res.code === '00000') {
                getList();
                Msg.success(res.msg);
              } else {
                Msg.error(res.msg);
              }
            });
        } else {
        //  console.log('err',row.items[0])
          Msg.error("该子字典底下存在子字典不允许删除");
        }

        // getDetail({
        //   id:row.id,
        //   cb:(row)=>{
        //   console.log('删除这条数据是否是有子项',row,row.items,row.items[0])
        //   if(!row.items[0].id){
        //     DelDict(row.id);
        //    }else {
        //     Msg.error("该子字典底下存在子字典不允许删除")
        //    }
        // }})
        //  console.log(row,row.items,row.items.id,subTableData);
      }
    },

  ];

  const getDictCols = () => {
    if (isModal) {
      return columns.concat(renderOperCol(operButs));
    }
    return columns.concat([{
      title: '最后修改人',
      dataIndex: 'modifiedBy',
      width: 140,
      key: 'modifiedBy'
    },
    {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      width: 160,
      key: 'gmtModified',
    }
    ],
    renderOperCol(operButs));
  };
  const cols = getDictCols().map((item) => getColConfig(item));

  const [dictId, setDictId] = useState('');
  const [dictPid, setDictPid] = useState('');

  const moveToUp = (a:any, row) => {
    if (a.indexOf(row) === -1) {
      for (let k = 0; k < a.length; k++) {
        if (a[k].hasChild) {
          moveToUp(a[k].items, row);
        } else {
          continue;
        }
      }
    } else {
      const index = a.indexOf(row);
      if (index !== 0) {
        a.splice(index, 1);
        a.splice(index - 1, 0, row);
        setSubTableData([...subTableData]);
      }
    }
  };
  const moveToDown = (a:any, row) => {
    if (a.indexOf(row) === -1) {
      for (let k = 0; k < a.length; k++) {
        if (a[k].hasChild) {
          moveToUp(a[k].items, row);
        } else {
          continue;
        }
      }
    } else {
      const index = a.indexOf(row);
      if (index !== subTableData.length - 1) {
        subTableData.splice(index, 1);
        subTableData.splice(index + 1, 0, row);
        setSubTableData([...subTableData]);
      }
    }
  };
  /** 操作按钮-打开弹窗 */
  const subOperButs = [
    {
      text: <ArrowUpOutlined/>,
      onClick: (row) => {
        moveToUp(subTableData, row);

        // subTableData
        // if(row.level === 1){
        //   const index = subTableData.indexOf(row)
        //   if(index!== 0){
        //     subTableData.splice(index,1)
        //     subTableData.splice(index-1,0,row)
        //     setSubTableData([...subTableData])
        //   }
        // }
        // ----------2
        //  console.log(row)
        //  if(subTableData.indexOf(row)===-1){
        //    for(let i=0;i<subTableData.length;i++){
        //      if(subTableData[i].hasChild){

        //       if(subTableData[i].items.indexOf(row)===-1){
        //         for(let k=0;k<subTableData[i].items.length;k++){
        //           if(subTableData[i].items[k].hasChild){

        //           }else{
        //             continue
        //           }
        //         }
        //       }else{
        //         let index = subTableData[i].items.indexOf(row)
        //         if(index!== 0){
        //           subTableData[i].items.splice(index,1)
        //           subTableData[i].items.splice(index-1,0,row)
        //           setSubTableData([...subTableData])
        //         }
        //       }

        //      }else{
        //        continue
        //      }

        //    }
        //  }else{
        //   const index = subTableData.indexOf(row)
        //   if(index!== 0){
        //     subTableData.splice(index,1)
        //     subTableData.splice(index-1,0,row)
        //     setSubTableData([...subTableData])
        //   }
        //  }
        // console.log('row---000001aaa',dictId,row,subTableData,subTableData.indexOf(row));
      }
    },
    {
      text: <ArrowDownOutlined/>,
      onClick: (row) => {
        // subTableData
        // if(row.level === 1){
        //   const index = subTableData.indexOf(row)
        //   if(index!== subTableData.length-1){
        //     subTableData.splice(index,1)
        //     subTableData.splice(index+1,0,row)
        //     setSubTableData([...subTableData])
        //   }
        // }
        // console.log('row---000002bbb',row,subTableData);
        moveToDown(subTableData, row);
      }
    },
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
            // console.log(res);
            setModalConfig({
              title: '配置子项', visible: true, isSub: true, isAddEditRow: res && res.length === 0
            });
            form.setFieldsValue({ items: res });
          }
        });
      },
      key: 'gmtModified'
    },
    {
      text: '删除子项',
      title: '你确定删除子项?',
      onClick: (row) => {
        // console.log(row,'subrow-----')
        // if(row.items&&!row.items.id){
        //   delSubDetail({
        //     dictionaryId: dictId,
        //     /** pid就是本行id */
        //     pid: row.id,
        //     // cb: () => {

        //     //   getDetail({
        //     //     id: dictId,
        //     //     cb: (data) => {
        //     //       setSubTableData(data.items);
        //     //     }
        //     //   });
        //     //   Msg.success('操作成功');
        //     // }
        //   })

        // }else{
        //       Msg.error("该子字典底下存在子字典不允许删除")
        // }
        // console.log(dictId,row.id)

        //  console.log('row',row)
        if (!row.hasChild) {
          Msg.error("该项没有子项");
        } else {
          deleSubDict({ dictionaryId: dictId, pid: row.id })
            .then((res) => {
              if (res.code === '00000') {
                getDetail({
                  id: dictId,
                  cb: (data) => {
                    setSubTableData([...data.items]);
                    // console.log('data---1111',data)
                  }
                });
                Msg.success(res.msg);
              } else {
                Msg.error(res.msg);
              }
            });
        }

        // console.log('subTableData-------1',subTableData);

        // console.log(row);
        // DelDict(row.id);
      }
    },
  ];
  /**
  * 子字典项
  *
  * TODO: 洪耿程：查看合并结果
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
      render: (text, record, index) => {
      //  console.log(text,record,index)
        return (
          <span
            style={{
              color: `${record.renderFontColor}`, backgroundColor: `${record.renderBgColor}`, display: 'block', width: '100%', height: '100%'
            }}
          >
            {text}
          </span>
        );
      }
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
    // const reqMethod = {
    //   add: 'post',
    //   update: 'put'
    // }[type];
    if (type === 'add') {
      // 新增字典  AddDict(data)
      AddDict(data)
        .then((res) => {
          if (res.code === "00000") {
            Msg.success(res.msg);
            getList();
            cb && cb();
          } else {
            Msg.error(res.msg);
          }

        // console.log(res);
        });
    } else {
      // 修改字典  UpdateDict(data)
      UpdateDict(data)
        .then((res) => {
          if (res.code === "00000") {
            getDetail({
              id: dictId,
              cb: (data) => {
                data && setSubTableData([...data.items]);
              // console.log('data---1111',data)
              }
            });
            Msg.success(res.msg);
            cb && cb();
          } else {
            Msg.error(res.msg);
          }
        });
    }
  };

  /**
  * 查询字典列表
  */
  const getList = (args = {}) => {
    const params = Object.assign({}, {
      name: '', description: "", offset: 0, size: 10,
    }, args);
    setTableLoading({ tip: "正在加载数据...", spinning: true });

    GetDictList(params).then((res) => {
      // console.log(res.data.result);
      const data = res.result.data.map((row) => ({
        ...row,
        gmtModified: formatGMT(row.gmtModified)

      }));
      setTotal(res.result.total);
      setTableData(data);
      // console.log('查询的结果',data)
    }).finally(() => {
      setTableLoading({ tip: "", spinning: false });
    });
  };

  /**
  * 查询字典详情
  */
  const getDetail = ({ id, cb }) => {
    // return await Http.get(`/data/v1/dictionary/${id}`);
    setTableLoading({ tip: "正在加载数据...", spinning: true });
    debugger;
    GetDictDeatil(id).then((res) => {
      cb && cb(res.result);
    }).finally(() => {
      setTableLoading({ tip: "", spinning: false });
    });
  };

  /**
  * 新增/修改子字典接口
  */
  const configSubDict = ({ data, cb, querySub }) => {
    AddUpdateSubDict(data).then((res) => {
      // console.log(res);
      if (res.code === "00000") {
        cb && cb(res.result);
        getSubDictDetail(querySub);
        Msg.success(res.msg);
      } else {
        Msg.error(res.msg);
      }
    });
  };

  function addItems(a, res) {
    for (let i = 0; i < a.length; i++) {
      if (a[i].level <= 5) {
        if (a[i].hasChild) {
          if (a[i].items && a[i].items[0]) {
            addItems(a[i].items, res);
          } else {
            a[i].items = res.result;
          }
        }
      } else {
        break;
      }
    }
  }

  /**
  * 查询子字典项
  */
  const getSubDictDetail = ({ dictionaryId, pid, cb }) => {
    // const { dictionaryId = dictId, pid = dictPid, cb } = args;
    // console.log('subTableData--查看',subTableData)

    GetSubDictDetail({ dictionaryId, pid }).then((res) => {
      // console.log(res.result,'子字典在这里',subTableData,tableData);
      //  for(let i=0;i<subTableData.length;i++){
      //   if(subTableData[i].hasChild){
      //     if(subTableData[i].items[0]){
      //       for(let k=0;k<subTableData[i].items.length;k++){
      //         if(subTableData[i].items[k].hasChild){
      //           if(subTableData[i].items[k].items[0]){

      //           }else{
      //             subTableData[i].items[k].items = res.result
      //           }

      //         }
      //       }
      //     }else{
      //        subTableData[i].items = res.result
      //     }
      //   }
      // }
      addItems(subTableData, res);
      setSubTableData([...subTableData]);
      cb && cb(res.result);
    });
  };
  /**
  *
  * 删除子字典项
  */
  const delSubDetail = (params) => {
    // const { dictionaryId, pid, cb } = params;
    // console.log(dictionaryId,pid,cb,'dictionaryId,pid,cb')
    const { dictionaryId, pid, } = params;
    // console.log(dictionaryId,pid,'dictionaryId,pid,cb')
    /**
    * 是删除子字典下面的子项,不是删除子字典自身
    */
    /**
    * dictionaryId-字典项id  pid--本级id
    * "level"=5时 第5级隐藏配置子项,删除子项按钮
    */

    deleSubDict({ dictionaryId, pid });
    // deleSubDict({ dictionaryId, pid }).then((res) => {
    //   cb && cb(res);
    // });
  };
  // console.log(res);
  // const queryList = async (args = {}) => {
  //   /**
  //    * 与产品约定,左侧树查询不考虑右侧列表查询条件,右侧列表查询要带上左侧查询条件,点击了搜索按钮之后才查询
  //    */
  //   const params = Object.assign({}, {
  //     /**  String 否 数据表名称 */
  //     name: '',
  //     // 字典描述
  //     description: '',
  //     /**  int 是 分页查询起始位置,从0开始 */
  //     offset: 0,
  //     /**  int 是 每页查询记录数 */
  //     size: 10
  //   }, args);
  //   /** 请求表结构列表数据 */
  //   // const tableRes = await Http.get('http://localhost:60001/mock/structList.json', { params });
  //   // const tableRes = await Http.get('/data/v1/tables/list', { params });  // -----

  //   const tableRes = await GetDictList(params);
  //   // console.log({ tableRes });

  //   /** 表格数据格式转换-注意setStructTableData之后不能立刻获取最新值 */
  //   const tableData = tableRes.result.data.map((col) => {
  //     /** 根据T点的key查找节点完整信息 */
  //     /** 返回节点的名称 */
  //     // col.moduleId = treeQuery(treeData, col.moduleId).title;
  //     // console.log(col.moduleId);
  //     /** 将表类型代码转换为文字 */
  //     // const showText = TableTypeEnum.find((item) => item.value === col.type);
  //     // col.type = showText ? showText.text : '';
  //     /** gmt时间格式转yyyy-MM-dd hh:mm:ss */
  //     col.gmtCreate = formatGMT(col.gmtCreate);
  //     col.gmtModified = formatGMT(col.gmtModified);
  //     /** antd table每行记录必需有key字段 */
  //     col.key = col.id;
  //     return col;
  //   });
  //   // console.log({ structTableData });
  //   // setTableData(structTableData);
  //   setStructTableData(tableData);
  // };
  useEffect(() => {
    getList();
  }, []);
  // const data = [
  //   {
  //     key: '1',

  //     name: 'John Brown sr.',

  //     description: 'New York No. 1 Lake Park',
  //   },
  //   {
  //     key: '2',

  //     name: 'Joe Black',

  //     description: 'Sidney No. 1 Lake Park',
  //   },
  // ];
  // -----接口

  const [form] = Form.useForm();

  const addMenu = {
    text: '新建',
    onClick: () => {
      setModalConfig({
        title: '新增字典', visible: true, isSub: false, isAddEditRow: true
      });
      form.setFieldsValue({});
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
    width: "600px",
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { fieldForm-新建表可控表单实例 }
     */
    // TODO: 洪耿程 检查是否已修复问题
    onOk: (e) => {
      form.validateFields().then((values) => {
      //  console.log(values);

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
          // console.log(errorInfo);
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
          placeholder: '请输入字典描述',
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
                  // TODO: 洪耿程，确认功能
                  getList({ description, name, offset: 0 });
                  // queryList({ description, name, offset: 0 });
                });
            }
          },
          {
            type: '',
            text: '清空',
            onClick: () => {
              searchForm.resetFields();
              getList();
            }
          }
        ]
      }
    }

  };

  return (
    <div className="data-designer">
      <BasicForm {...searchProps} />
      <TableHeadMenu {...tableHeadMenus} />
      <Table
        loading={tableLoading}
        bordered
        columns={cols}
        indentSize={10}
        dataSource={tableData}
        rowKey={(record:any) => record.id}
        pagination={{
          total,
          showTotal: ((total) => {
            return `共 ${total} 条`;
          }),
          onChange: (page, pageSize) => {
            //   console.log(page,pageSize)
            getList({ offset: (page - 1) * pageSize, size: pageSize });
            setPager({ page, pageSize: 10 });
          }
          // TODO: 洪耿程，确认功能
          // onChange: (page, pageSize: any) => {
          //   setPager({ page, pageSize });
          //   queryList({ offset: page, size: pageSize });
          // }
        }}
        expandable={{
          /** 点击行不展开 */
          // expandRowByClick: false,
          /** 展开行的键值集合 */
          expandedRowKeys,
          /** 额外的展开行 */
          expandedRowRender: (record) => {
            //   if(subTableData){
            //  console.log('subTableData-----子集的数据',subTableData,record)
            // for(let i=0;i<subTableData.length;i++){
            //     if(subTableData[i].hasChild){
            //  subTableData[i]['items'] = []
            // setSubTableData([...subTableData])
            // }
            //   else{
            //       continue
            //     }
            //   }
            // }
            return (
              <Table
                bordered
                columns={subCols}
                dataSource={subTableData}
                // columns={Acolumns}
                // dataSource={Adata}
                /** 指定树形结构的列名 */

                rowKey={(row:any) => row.id}
                pagination={false}
                expandable={{
                  onExpand: (expanded, record:any) => {
                    let index;
                    // if (record.level === 1) {
                    index = subTableData.findIndex((item:any) => item.id === record.id);
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
                        // console.log('data----0000001',data)
                        if (data) {
                          for (let i = 0; i < data.length; i++) {
                            if (data[i].level <= 5) {
                              if (data[i].hasChild) {
                                data[i].items = [];
                              }
                            }
                          }
                        }

                        if (subTableData[index] && Array.isArray(data) && data.length > 0) {
                          // console.log('subTableData001',subTableData[index],'index',index,'data',data)
                          subTableData[index].items = data;
                          setSubTableData([...subTableData]);
                        }

                        // console.log(subTableData,'subTableData-------子字典下的子字典')
                        // deepLevelItem=
                        /** 不要原封不动使用useState导出的值 */
                        // console.log(subTableData,'subTableData001')

                        // console.log(JSON.stringify(subTableData, null, 4));
                        // console.log(subTableData,'subTableData002')
                      }
                    });
                  }
                }}
                onRow={(record) => {
                  return {
                    //   // console.log(record);
                    //   debugger;
                    //   let index;
                    //   // if (record.level === 1) {
                    //   index = subTableData.findIndex((item:any) => item.id === record.id);
                    //   // } else {
                    //   //   index = deepLevelItem.findIndex((item) => item.id === record.id);
                    //   // }

                    //   getSubDictDetail({
                    //     dictionaryId: dictId,
                    //     pid: record.id,
                    //     cb: (data) => {
                    //       /**
                    //        * 设置展开的行
                    //        */
                    //      // console.log('data----0000001',data)
                    //       if(data){
                    //         for(let i =0;i<data.length;i++){
                    //           if(data[i].level<=5){
                    //             if(data[i].hasChild){
                    //               data[i].items = []
                    //             }
                    //           }
                    //         }
                    //       }

                    //       if(subTableData[index] && Array.isArray(data) && data.length > 0){
                    //        // console.log('subTableData001',subTableData[index],'index',index,'data',data)
                    //         subTableData[index].items = data;
                    //         setSubTableData([...subTableData]);
                    //       }

                    //      // console.log(subTableData,'subTableData-------子字典下的子字典')
                    //       // deepLevelItem=
                    //       /** 不要原封不动使用useState导出的值 */
                    //      // console.log(subTableData,'subTableData001')

                    //       // console.log(JSON.stringify(subTableData, null, 4));
                    //      // console.log(subTableData,'subTableData002')
                    //     }
                    //   });
                    // }, // 点击行
                    // onDoubleClick: (event) => {},
                    onContextMenu: (event) => {},
                    // onMouseEnter: (event) => {}, // 鼠标移入行
                    onMouseLeave: (event) => {},
                  };
                }}
                childrenColumnName='items'
              />
            );
          },
          /** 点击展开图标时展开 */
          onExpand: (expanded, record:any) => {
            // console.log(record);
            // console.log('expanded',expanded)
            setDictId(record.id);
            getDetail({
              id: record.id,
              cb: (data) => {
                /**
                 * 设置展开的行
                 */
                //  console.log(data,'展开的行------')
                for (let i = 0; i < data.items.length; i++) {
                  if (data.items[i].level <= 5) {
                    if (data.items[i].hasChild) {
                      data.items[i].items = [];
                    }
                  }
                }
                if (!expanded) {
                  setExpandedRowKeys([]);
                } else {
                  setExpandedRowKeys([record.id]);
                }
                data.items && setSubTableData(data.items);
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

    </div>
  );
};

// const DictManageContainer = Connector(DictManage);
export default DictManage;
