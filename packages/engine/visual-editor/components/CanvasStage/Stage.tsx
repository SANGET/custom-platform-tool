/**
 * CanvasStage
 */
import React, { useState, useReducer } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import {
  LayoutRenderer, LayoutNodeInfo, parseFlatNodeToNestNode
} from '@engine/layout-renderer';
import { SelectEntity, SelectEntityState } from '@engine/visual-editor/core/actions-hook';
import {
  setNodeTreeNestingInfo, ENTITY_ID,
  increaseID, wrapID
} from '@engine/visual-editor/utils';
import { layoutInfoActionReducer } from '@engine/visual-editor/core/reducers/layout-info';
import { ItemTypes } from '@engine/visual-editor/spec/types';
import ContainerWrapperCom from '@engine/visual-editor/spec/template/ContainerWrapperCom';
import ComponentWrapperCom from '@engine/visual-editor/spec/template/ComponentWrapperCom';
import { DragComponentClass, DropCollectType, EntitiesStateStore } from '@engine/visual-editor/types';
import { containerWrapperFac, FacToComponentProps } from '@engine/visual-editor/spec/wrapper-fac';

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

/**
 * 中央舞台组件的 props
 */
export interface CanvasStageProps {
  /** 组件包装器，提供标准接口，详情查看 @engine/visual-editor/spec/template/ComponentWrapperCom  */
  ComponentWrapper?: React.ElementType<FacToComponentProps>
  /** 容器组件包装器，提供标准接口，详情查看 @engine/visual-editor/spec/template/ContainerWrapperCom  */
  ContainerWrapper?: React.ElementType<FacToComponentProps>
  /** 选中组件实例的方法 */
  selectEntity: SelectEntity
  /** 选中的组件实例 */
  selectedEntities: SelectEntityState['selectedList']
  /** 组件实例的状态集合 */
  entitiesStateStore: EntitiesStateStore
}

/**
 * 中央舞台组件
 */
const CanvasStage: React.FC<CanvasStageProps> = ({
  selectEntity,
  selectedEntities,
  entitiesStateStore,
  ComponentWrapper = ComponentWrapperCom,
  ContainerWrapper = ContainerWrapperCom,
}) => {
  const [
    flatLayoutNodes, layoutInfoDispatcher
  ] = useReducer(layoutInfoActionReducer, {});

  const onSelectEntityForClick = (clickEvent, entity) => {
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

  /**
   * 布局包装渲染器的上下文
   */
  const wrapperContext = {
    flatLayoutNodes,
    getSelectedState,
    getEntityProps,
    onDrop: dropDispatcher,
    onClick: onSelectEntityForClick,
  };

  const stageClasses = classnames([
    'canvas-stage',
    'renderer',
    isOverCurrent && 'overing'
  ]);

  // console.log(layoutNestingNodeTree);

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
            ComponentWrapper,
            wrapperContext,
          )}
          containerWrapper={containerWrapperFac(
            ContainerWrapper,
            wrapperContext,
          )}
        />
      </StageRender>
    </div>
  );
};

export default CanvasStage;
