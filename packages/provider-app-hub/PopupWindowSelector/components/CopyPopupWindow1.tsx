// import React, { useEffect } from 'react';
// import { Form, message, notification } from 'antd';
// import pinyin4js from 'pinyin4js';
// import { NameCodeItem, FromFooterBtn } from "./FormItem";
// import './index.less';
// import { copyPopupWindowService } from '../service';
// import { ICopyData } from './PopupWindowSelector';

// interface IProps {
//   onOk: () => void;
//   onCancel: () => void;

//   data: ICopyData;
// }
// const layout = {
//   labelCol: { span: 5 },
//   wrapperCol: { span: 19 },
// };
// const CopyTable: React.FC<IProps> = (props: IProps) => {
//   const { onCancel, onOk, data } = props;
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const { name, code } = data;
//     const suffixName = `_副本_${randomCode(5)}`;
//     form && form.setFieldsValue({
//       name: name + suffixName,
//       code: code + pinyin4js.convertToPinyinString(suffixName, "", pinyin4js.WITHOUT_TONE)
//     });
//   }, []);

//   const randomCode = (number: number) => {
//     const weights = parseInt(`10${Array(number).join('0')}`, 10);
//     console.dir(weights);
//     return Math.floor(Math.random() * weights);
//   };
//   const handleFinish = async (values) => {
//     const res = await copyPopupWindowService({ ...values, id: data.id });
//     if (res.code === "00000") {
//       notification.success({
//         message: "复制成功",
//         duration: 2
//       });
//       onOk && onOk();
//     } else {
//       message.error(res.msg);
//     }
//   };

//   const handleFormCancel = () => {
//     onCancel && onCancel();
//   };
//   return (
//     <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
//       <NameCodeItem form={form} />
//       <FromFooterBtn
//         okText="确定"
//         onCancel={handleFormCancel}
//       />
//     </Form>
//   );
// };

// export default React.memo(CopyTable);
