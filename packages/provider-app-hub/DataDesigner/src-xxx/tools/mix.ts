/*
 * @Author: wph
 * @Date: 2020-08-15 16:01:41
 * @LastEditTime: 2020-08-15 16:34:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\tools\mix.ts
 */
/**
 * 生成模态框基本配置
 * @param config 传入的配置
 */
const getModalConfig = (config) => {
  return {
    visible: false,
    title: '',
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { form-新建表可控表单实例 }
     */
    onOk: (e) => {
      // form
      //   .validateFields() /** 表单校验 */
      //   .then((values) => {
      //     /**
      //      * 与后端协商,只提交页面上有的字段,没有的不传
      //      */
      //     console.log(values);
      //     /** 新建表数据提交 */
      //     Http.post('http://{ip}:{port}/paas/{lesseeCode}/{applicationCode}/data/v1/tables/', {
      //       data: values
      //     }).then(() => {
      //       /** 关闭弹窗 */
      //       setVisiable(false);
      //     });
      //   })
      //   .catch((errorInfo) => {
      //     /** 校验未通过 */
      //     console.log(errorInfo);
      //   });
      // // }
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {},
    /**
    * 这个默认属性真坑,通过input onFocus事件打开的弹窗,关不掉,就是这个属性引起的
    */
    focusTriggerAfterClose: false,
    okText: '确定',
    cancelText: '取消',
    width: 800,
    ...config,
  };
};

export { getModalConfig };
