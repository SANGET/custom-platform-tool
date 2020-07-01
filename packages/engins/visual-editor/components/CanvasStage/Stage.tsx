/**
 * CanvasStage
 */
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';

import LayoutParser from '@iub-dsl/parser/engin/layout';
import { ItemTypes } from '../ComponentPanel/types';
import { increaseID, parseObjToTreeNode, wrapID } from './utils';
import { setNodeArrayInfo, isNodeInChild } from './utils/node-filter';
import ContainerWrapperCom from './ContainerWrapperCom';
import ComponentWrapperCom from './ComponentWrapperCom';

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

// TODO: 性能优化
const containerWrapperFac = (
  WrapperComponent,
  { onDrop, onClick }: ContainerWrapperFacActions,
  { layoutContentCollection, getSelectedState }
) => (children, { id, idx, ...other }) => {
  return (
    <WrapperComponent
      {...other}
      currEntity={layoutContentCollection[id]}
      onClick={onClick}
      onDrop={onDrop}
      getSelectedState={getSelectedState}
      id={id}
      key={id}
    >
      {children}
    </WrapperComponent>
  );
};

/**
 * 实例化 componentClass
 */
const instantiation = (componentClass, entityID) => {
  return Object.assign({}, componentClass, {
    id: entityID,

    /** 下划线前缀为内部字段 */
    _classID: componentClass.id,
    _state: 'active'
  });
};

const stateOperatorFac = (state, setState) => {
  const update = (id, targetEntity) => {
    const nextState = {
      ...state,
    };
    nextState[id] = targetEntity;
    setState(nextState);

    return nextState;
  };
  const add = (componentClass) => {
    /** 防止嵌套 */
    if (!!componentClass.id && componentClass.id === componentClass.parentID) return componentClass;

    /** 外部可以通过 entityID 设置真正的 entity 的 id */
    let { entityID } = componentClass;
    if (!entityID) {
      entityID = increaseID();
    }
    /** 如果组件还没被实例化 */
    /** 实例化 */
    const entity = instantiation(componentClass, entityID);
    const nextState = {
      ...state,
      [entityID]: entity
    };

    setState(nextState);

    return entity;
  };
  const del = (id) => {
    const nextState = {
      ...state,
    };
    delete nextState[id];
    setState(nextState);

    return nextState;
  };
  return {
    add,
    update,
    del,
  };
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
  children?: React.ReactChild
}

const CanvasStage = ({
  selectEntity,
  selectedEntities,
  children
}: CanvasStageProps) => {
  const [layoutContentCollection, setLayoutContentCollection] = useState({});
  const [componentsCollection, setComponentsCollection] = useState({});
  // const [selectState, setSelectState] = useState({});

  // console.log('componentsCollection', componentsCollection);
  // console.log('layoutContentCollection', layoutContentCollection);

  const onSelectEntityForOnce = (clickEvent, { id, entity }) => {
    selectEntity(id, entity);
  };

  const {
    add: addContainer,
    update: updateContainer,
    del: delContainer
  } = stateOperatorFac(layoutContentCollection, setLayoutContentCollection);

  const {
    add: addComponent,
    update: updateComponent,
    del: delComponent
  } = stateOperatorFac(componentsCollection, setComponentsCollection);

  const onDropFilter = (componentClass, parentID?) => {
    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }

    /** 如果已经实例化的组件 */
    const isUpdate = itemClassCopy._state === 'active';

    /** 更新布局 */
    if (isUpdate) {
      return updateContainer(itemClassCopy.id, itemClassCopy);
    }

    switch (itemClassCopy.type) {
      case 'container':
        const entityID = increaseID();
        itemClassCopy.entityID = entityID;
        const entity = addContainer(itemClassCopy);
        onSelectEntityForOnce(null, { id: entityID, entity });
        break;
      case 'component':
        const componentRefID = increaseID();
        const componentID = `comp_id_${componentRefID}`;
        const componentEntity = addComponent(componentInstantiation(itemClassCopy, componentID));
        const componentRefConfig = {
          entityID: componentRefID,
          type: "componentRef",
          componentID,
          parentID
        };
        const entityRes = addContainer(componentRefConfig);
        onSelectEntityForOnce(null, { id: componentID, entity: componentEntity });
        break;
    }
  };

  const [{
    isOverCurrent
  }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ dragItemClass }) => {
      // console.log('drop');
      if (isOverCurrent) {
        const _dragItemClass = Object.assign({}, dragItemClass);
        delete _dragItemClass.parentID;
        onDropFilter(_dragItemClass);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const parserContext = {
    context: {},
    bindAction: (actionID) => {
      // console.log(actionID);
      return {};
    },
    bindComponent: (componentID) => {
      return componentsCollection[componentID];
    },
  };
  const getSelectedState = (id) => {
    return !!selectedEntities[id];
  };
  const layoutNodeArray = parseObjToTreeNode(layoutContentCollection);

  /** 设置 node 信息 */
  setNodeArrayInfo(layoutNodeArray, layoutContentCollection);

  return (
    <div className="canvas-stage-container">
      <StageRender
        ref={drop}
        className={`canvas-stage renderer${isOverCurrent ? ' overing' : ''}`}
      >
        {
          /**
           * 通过 render prop 包装 layout 内部组件
           */
          LayoutParser({
            layoutNode: layoutNodeArray,
            componentWrapper: containerWrapperFac(
              ComponentWrapperCom,
              {
                onClick: onSelectEntityForOnce,
              },
              {
                layoutContentCollection,
                getSelectedState,
              }
            ),
            containerWrapper: containerWrapperFac(
              ContainerWrapperCom,
              {
                onDrop: onDropFilter,
                onClick: onSelectEntityForOnce,
              },
              {
                layoutContentCollection,
                getSelectedState,
              }
            )
          }, parserContext)
        }
        {children}
      </StageRender>
    </div>
  );
};

export default CanvasStage;
