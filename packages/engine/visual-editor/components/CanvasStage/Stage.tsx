/**
 * CanvasStage
 */
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import LayoutRenderer from '@engine/layout-renderer';
import { ItemTypes } from '../ComponentPanel/types';
import {
  increaseID, parseFlatNodeToNestNode, wrapID, ENTITY_ID
} from './utils';
import { setNodeTreeNestingInfo } from './utils/node-filter';
import ContainerWrapperCom from './ContainerWrapperCom';
import ComponentWrapperCom from './ComponentWrapperCom';
import { EditorComponentClass, DragComponentClass, DropCollectType } from '../../types';
import { stateOperatorFac } from './stateOperatorFac';

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

interface ContainerWrapperFacActions {
  onDrop?: (entity, containerID?) => void;
  onClick?: (event, id) => void;
}

/**
 * wrapper 生成器
 *
 * TODO: 性能优化
 */
const containerWrapperFac = (
  WrapperComponent,
  { onDrop, onClick }: ContainerWrapperFacActions,
  { flatLayoutNodes, getSelectedState, getEntityProps }
) => (children, { id, idx, ...other }) => {
  return (
    <WrapperComponent
      {...other}
      currEntity={flatLayoutNodes[id]}
      onClick={onClick}
      onDrop={onDrop}
      getSelectedState={getSelectedState}
      getEntityProps={getEntityProps}
      id={id}
      key={id}
    >
      {children}
    </WrapperComponent>
  );
};

const componentInstantiation = (componentClass, id) => {
  return {
    ...componentClass,
    entityID: id,
    component: {
      type: componentClass.component
    }
  };
};

export interface CanvasStageProps {
  selectEntity
  selectedEntities
  entitiesStateStore
  children?: React.ReactChild
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  selectEntity,
  selectedEntities,
  entitiesStateStore,
  children
}) => {
  const [flatLayoutNodes, setLayoutContentCollection] = useState({});

  const onSelectEntityForOnce = (clickEvent, { id, entity }) => {
    selectEntity(id, entity);
  };

  const {
    add: addContainer,
    update: updateContainer,
    del: delContainer
  } = stateOperatorFac(flatLayoutNodes, setLayoutContentCollection);

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  const onDropFilter = (componentClass, parentID?) => {
    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }

    /** 如果已经实例化的组件 */
    const isUpdate = itemClassCopy._state === 'active';

    /** 更新布局 */
    if (isUpdate) {
      updateContainer(itemClassCopy.id, itemClassCopy);
    } else {
      const entityID = increaseID(ENTITY_ID);
      itemClassCopy.entityID = entityID;
      const entity = addContainer(itemClassCopy);
      onSelectEntityForOnce(null, { id: entityID, entity });
    }
  };

  const [{
    isOverCurrent
  }, drop] = useDrop<DragComponentClass, void, DropCollectType>({
    accept: ItemTypes.DragComponent,
    drop: ({ dragItemClass }) => {
      // console.log('drop');
      if (isOverCurrent) {
        const _dragItemClass = { ...dragItemClass };
        delete _dragItemClass.parentID;
        onDropFilter(_dragItemClass);
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

  const layoutNestingNodeTree = parseFlatNodeToNestNode(flatLayoutNodes);

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

  return (
    <div className="canvas-stage-container">
      <StageRender
        ref={drop}
        className={`canvas-stage renderer${isOverCurrent ? ' overing' : ''}`}
      >
        {
          /**
           * 通过 render prop 包装 layout 内部组件，达到动态控制内部组件实现的效果
           */
          LayoutRenderer({
            layoutNode: layoutNestingNodeTree,
            componentRenderer: containerWrapperFac(
              ComponentWrapperCom,
              {
                onClick: onSelectEntityForOnce,
              },
              wrapperContext
            ),
            containerWrapper: containerWrapperFac(
              ContainerWrapperCom,
              {
                onDrop: onDropFilter,
                onClick: onSelectEntityForOnce,
              },
              wrapperContext
            )
          })
        }
        {children}
      </StageRender>
    </div>
  );
};

export default CanvasStage;
