import React from 'react';
import {
  Tag, Row, Col
} from 'antd';
import { IRelatedPage } from '../interface';

interface IProps {
  relatedPages: IRelatedPage[]
}
/** 关联页面组件 */
export const RelatedPageTags: React.FC<IProps> = React.memo((props: IProps) => {
  const { relatedPages } = props;
  const handleChange = () => {

  };
  return (
    <Row className="margin-blr10">
      <Col flex="66px">关联页面</Col>
      <Col flex="auto">
        <div className="link-page-tags">
          {relatedPages?.map((item) => (
            <Tag onChange = {handleChange} key={item?.id}>{item?.name}</Tag>
          ))}
        </div></Col>
    </Row>
  );
});
