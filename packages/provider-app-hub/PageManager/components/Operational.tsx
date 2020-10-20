import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { ITableItem, IOperationalMethods } from '../interface';
import { OPERATIONAL_MENU } from '../constant';
import './index.less';

interface IProps {
  data: ITableItem;
  methods: IOperationalMethods;
}
/**
 * 表格操作组件
 * @param props
 */
const Operational: React.FC<IProps> = (props: IProps): ReactElement => {
  const { methods, data } = props;
  return (
    <div className="table-operational">
      {
        OPERATIONAL_MENU.map((item, index) => {
          return (
            <Button
              key={index} type="link" onClick={() => {
                if (methods[item.operate] && typeof methods[item.operate] === 'function') {
                  methods[item.operate](data);
                }
              }}
            >
              {item.title}
            </Button>);
        })
      }
    </div>
  );
};
export default React.memo(Operational);
