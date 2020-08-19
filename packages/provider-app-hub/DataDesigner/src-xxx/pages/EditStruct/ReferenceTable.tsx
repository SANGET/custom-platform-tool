/*
 * @Author: your name
 * @Date: 2020-08-11 09:29:22
 * @LastEditTime: 2020-08-11 21:33:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\pages\EditStruct\ReferenceTable.js
 */
// import React from "react";

// const ReferenceTable = () => {
//   return (
//     <>引用表</>
//   );
// };
// export default ReferenceTable;

import React from 'react';
import { Input } from 'antd';
/**
* 可编辑表格
*/
import EditableTable from '@provider-app/data-designer/src/bizComps/EditableTable';

// const ReferenceTable = () => {
//   return (<EditableTable />);
// };

// export default ReferenceTable;

export default class ReferenceTable extends React.Component {
  // state = {
  //   top: 'topLeft',
  //   bottom: 'bottomRight',
  // };

  render() {
    return (
      <div>
        <EditableTable />
      </div>
    );
  }
}
// export default class ReferenceTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   componentDidMount() {}

//   render() {
//     return <Input />;
//   }

//   // render() {
//   //   return (<Button />);
//   // }
// }
