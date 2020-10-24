import React, { ReactElement } from 'react';
import { Button, Popconfirm } from 'antd';
import { IOperationalMenuItem, IOperationalMenuItemKeys, OperationalBehavior } from '../interface';
import { OPERATIONALMENU, SPECIES } from '../constant';
import './index.less';

interface IProps {
  data: { [key: string]: string };
  onClick?: (item: IOperationalMenuItem) => void;
}
/**
 * 表格操作组件
 * @param props
 */
const Operational: React.FC<IProps> = (props: IProps): ReactElement => {
  const { onClick, data } = props;
  return (
    <div className="table-operational">
      {
        OPERATIONALMENU.map((item, index) => {
          if (item[IOperationalMenuItemKeys.behavior] === OperationalBehavior.popconfirm) {
            return 1 === 1 ? (<Popconfirm
              key={index}
              placement="topLeft"
              title={'你确定要删除这条记录吗?'}
              onConfirm={() => onClick && onClick(Object.assign(item, data))}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" >
                {item[IOperationalMenuItemKeys.title]}
              </Button>
            </Popconfirm>) : (<Button type="link" disabled>
              {item[IOperationalMenuItemKeys.title]}
            </Button>);
          }

          return (
            <Button key={index} type="link" onClick={() => onClick?.(Object.assign({}, data, item))}>
              {item[IOperationalMenuItemKeys.title]}
            </Button>);
        })
      }
    </div>
  );
};
export default React.memo(Operational);
