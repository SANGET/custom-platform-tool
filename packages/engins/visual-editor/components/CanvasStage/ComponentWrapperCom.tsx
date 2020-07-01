import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../ComponentPanel/DragItem';

const ComponentWrapper = styled.div`
  padding: 5px;
  background-color: rgba(0,0,0, 0.8);
  margin: 10px;
  color: #FFF;
  &:hover {
    background-color: rgba(0,0,0, 0.7);
  }
  &.selected {
    box-shadow: 0 0 1px 3px rgba(127, 113, 185, 0.5);
  }
`;

const ComponentWrapperCom = ({
  children,
  currEntity,
  componentConfig,
  onClick,
  id,
  getSelectedState,
}) => {
  const isSelected = getSelectedState(componentConfig.id);
  const classes = classnames([
    isSelected && 'selected'
  ]);

  // TODO: 修复 flex 布局的问题
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, { id: componentConfig.id, entity: componentConfig });
      }}
    >
      <DragItem
        dragItemClass={currEntity}
      >
        <ComponentWrapper
          className={classes}
        >
          <div>组件, ID: {id}</div>
          {children}
        </ComponentWrapper>
      </DragItem>
    </div>
  );
};

export default ComponentWrapperCom;
