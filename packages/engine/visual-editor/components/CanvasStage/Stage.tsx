/**
 * CanvasStage
 */
import React, { useState, useReducer } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import {
  LayoutRenderer, LayoutNodeInfo, parseFlatNodeToNestNode, LayoutWrapperContext
} from '@engine/layout-renderer';
import { SelectEntity } from '@engine/visual-editor/core/actions-hook';
import {
  setNodeTreeNestingInfo, ENTITY_ID,
  increaseID, wrapID
} from '@engine/visual-editor/utils';
import { layoutInfoActionReducer } from '@engine/visual-editor/core/reducers/layout-info';
import { ItemTypes } from '../ComponentPanel/types';
import ContainerWrapperCom from './ContainerWrapperCom';
import ComponentWrapperCom from './ComponentWrapperCom';
import { DragComponentClass, DropCollectType } from '../../types';
import { constructCompClass } from './utils/component-constructor';

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

interface WrapperFacOptions {
  onDrop?: (entity, containerID?) => void;
  onClick?: (event, id) => void;
  flatLayoutNodes
  getSelectedState
  getEntityProps
}

type ContainerWrapperFac = (
  wrapperComponent: React.ElementType,
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element

/**
 * wrapper 生成器
 */
const containerWrapperFac: ContainerWrapperFac = (
  WrapperComponent,
  {
    onDrop, onClick,
    flatLayoutNodes, getSelectedState, getEntityProps
  },
) => (propsForChild) => {
  const { id, children } = propsForChild;
  return (
    <WrapperComponent
      {...propsForChild}
      onClick={onClick}
      onDrop={onDrop}
      currEntity={flatLayoutNodes[id]}
      getSelectedState={getSelectedState}
      getEntityProps={getEntityProps}
      key={id}
    >
      {children}
    </WrapperComponent>
  );
};

export interface CanvasStageProps {
  selectEntity: SelectEntity
  selectedEntities
  entitiesStateStore
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  selectEntity,
  selectedEntities,
  entitiesStateStore,
}) => {
  const [
    flatLayoutNodes, layoutInfoDispatcher
  ] = useReducer(layoutInfoActionReducer, {});

  const onSelectEntityForClick = (clickEvent, { id, entity }) => {
    selectEntity(entity);
  };

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  const dropDispatcher = (componentClass, parentID?) => {
    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }
    let _entity = itemClassCopy;

    /** 如果已经实例化的组件 */
    const isUpdate = itemClassCopy._state === 'active';

    if (isUpdate) {
      /** 更新布局 */
      layoutInfoDispatcher({
        type: 'update',
        entity: itemClassCopy
      });
    } else {
      /** 实例化组件类 */
      const entity = constructCompClass(itemClassCopy);
      _entity = entity;
      layoutInfoDispatcher({
        type: 'add',
        entity
      });
    }

    /** 选中被操作的组件 */
    setTimeout(() => selectEntity(_entity));
  };

  const [{
    isOverCurrent
  }, drop] = useDrop<DragComponentClass, void, DropCollectType>({
    accept: ItemTypes.DragComponent,
    drop: ({ dragItemClass }) => {
      // console.log('drop');
      if (isOverCurrent) {
        const _dragItemClass = { ...dragItemClass };
        /** 清除 parentID */
        delete _dragItemClass.parentID;
        dropDispatcher(_dragItemClass);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  /**
   * 查看组件实例是否被选中
   * @param entityID entityID
   */
  const getSelectedState = (entityID: string) => {
    return !!selectedEntities[entityID];
  };

  const getEntityProps = (entityID: string) => {
    return entitiesStateStore[entityID];
  };

  const layoutNestingNodeTree = parseFlatNodeToNestNode<LayoutNodeInfo>(flatLayoutNodes);

  /**
   * @important 必须信息
   * 设置 node 信息
   */
  setNodeTreeNestingInfo(layoutNestingNodeTree, flatLayoutNodes);

  const wrapperContext = {
    flatLayoutNodes,
    getSelectedState,
    getEntityProps
  };

  const stageClasses = classnames([
    'canvas-stage',
    'renderer',
    isOverCurrent && 'overing'
  ]);

  console.log(layoutNestingNodeTree);

  return (
    <div
      className="canvas-stage-container"
      onClick={(e) => {
        console.log('编辑页面属性');
      }}
    >
      <StageRender
        ref={drop}
        className={stageClasses}
      >
        <LayoutRenderer
          layoutNode={layoutNestingNodeTree}
          componentRenderer={containerWrapperFac(
            ComponentWrapperCom,
            {
              ...wrapperContext,
              onClick: onSelectEntityForClick,
            },
          )}
          containerWrapper={containerWrapperFac(
            ContainerWrapperCom,
            {
              ...wrapperContext,
              onDrop: dropDispatcher,
              onClick: onSelectEntityForClick,
            },
          )}
        />
      </StageRender>
    </div>
  );
};

export default CanvasStage;
