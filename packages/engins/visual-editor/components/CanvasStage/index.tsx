/**
 * CanvasStage
 */
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import LayoutParser from '@iub-dsl/parser/engin/layout';
import { ItemTypes } from '../ComponentPanel/types';
import { Dispatcher } from '../../core/actions';
import { VisualEditorStore } from '../../core/store';
import { increaseID, parseObjToTreeNode, wrapID } from './utils';
import DragItem from '../ComponentPanel/DragItem';

const StageRender = styled.div`
  min-height: 50vh;
  background-color: rgba(0,0,0, 0.05);
  padding: 10px;
  &.renderer {
    &.overing {
      background-color: rgba(0,0,0, 0.08);
    }
  }
`;

const ContainerWrapper = styled.div`
  padding: 20px;
  background-color: rgba(0,0,0, 0.1);
  margin: 10px;
  &:hover {
    background-color: rgba(0,0,0, 0.15);
  }
  &.overing {
    background-color: rgba(48, 95, 144, 0.5);
  }
  &.selected {
    box-shadow: 0 0 3px 5px rgba(48,95,144,0.4);
  }
`;

export interface CanvasStageProps {
  selectEntity: Dispatcher['SelectEntity']
  // layoutContent: VisualEditorStore['layoutContentState']
}

const ContainerWrapperCom = ({
  children,
  currEntity,
  onClick,
  id,
  isSelected,
  onDrop
}) => {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entity }) => {
      if (isOverCurrent) onDrop({ ...entity, parentID: id });
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const classes = classnames([
    isOverCurrent && 'overing',
    isSelected && 'selected'
  ]);

  // TODO: 修复 flex 布局的问题
  return (
    <div
      ref={drop}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, { id });
      }}
    >
      <DragItem
        entity={currEntity}
      >
        <ContainerWrapper
          className={classes}
        >
          {children}
        </ContainerWrapper>
      </DragItem>
    </div>
  );
};

// TODO: 性能优化
const containerWrapper = (
  { onDrop, onClick },
  { layoutContentCollection, selectState }
) => (container, { id, idx }) => {
  const key = wrapID(id, idx);
  const isSelected = !!selectState[id];
  return (
    <ContainerWrapperCom
      currEntity={layoutContentCollection[id]}
      onClick={onClick}
      onDrop={onDrop}
      id={id}
      isSelected={isSelected}
      key={id}
    >
      <div>id: {key}</div>
      {container}
    </ContainerWrapperCom>
  );
};

const CanvasStage = ({
  selectEntity,
  children
}: CanvasStageProps) => {
  const [layoutContentCollection, setLayoutContentCollection] = useState({});
  const [componentsCollection, setComponentsCollection] = useState({});
  const [selectState, setSelectState] = useState({});

  const addContainer = (entity) => {
    /** 防止嵌套 */
    if (entity.id === entity.parentID) return;

    /** 如果已经实例化的组件 */
    if (entity.state === 'active') {
      updateContainer(entity.id, entity);
    } else {
      /** 如果组件还没被实例化 */
      const entityRuntimeID = increaseID();
      const resEntity = Object.assign({}, entity, {
        id: entityRuntimeID,
        comID: entity.id,
        state: 'active'
      });
      const nextState = {
        ...layoutContentCollection,
        [entityRuntimeID]: resEntity
      };
      setLayoutContentCollection(nextState);
    }
  };
  const updateContainer = (id, targetEntity) => {
    const nextState = {
      ...layoutContentCollection,
    };
    nextState[id] = targetEntity;
    setLayoutContentCollection(nextState);
  };

  // TODO: delete 组件
  const delContainer = (id) => {
    const nextState = {
      ...layoutContentCollection,
    };
    delete nextState[id];
    setLayoutContentCollection(nextState);
  };

  const [{
    isOverCurrent
  }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entity }) => {
      // console.log('drop');
      // selectEntity(entity);
      if (isOverCurrent) {
        addContainer(entity);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const onDropForContainer = (entity) => {
    addContainer(entity);
  };

  const onSelectEntityForClick = (clickEvent, { id }) => {
    setSelectState({
      [id]: true
    });
  };

  const parserContext = {
    context: {},
    bindAction: (actionID) => {
      // console.log(actionID);
      return {};
    },
    bindComponent: (componentID) => {
      // console.log(componentID);
      return componentsCollection[componentID];
    },
  };
  // console.log(parseObjToTreeNode(layoutContentCollection));

  return (
    <div>
      CanvasStage
      <StageRender
        ref={drop}
        className={`canvas-stage renderer${isOverCurrent ? ' overing' : ''}`}
      >
        {
          LayoutParser({
            layoutNode: parseObjToTreeNode(layoutContentCollection),
            containerWrapper: containerWrapper({
              onDrop: onDropForContainer,
              onClick: onSelectEntityForClick,
            }, {
              layoutContentCollection,
              selectState
            })
          }, parserContext)
        }
        {children}
      </StageRender>
    </div>
  );
};

export default CanvasStage;
