import React, { FC } from 'react';
import { Button } from 'antd';
import './styles/App.less';

const App: FC = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export { App };

// import React from 'react';

// const CustomSubApp = () => {
//   return (
//     <div>
//       <h3>自定义子应用模版</h3>
//     </div>
//   );
// };

// export { CustomSubApp };
