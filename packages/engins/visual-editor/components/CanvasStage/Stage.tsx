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
    box-shadow: 0 0 1px 3px rgba(127, 113, 185, 0.5);
  }
`;

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

export interface CanvasStageProps {
  // selectEntity: Dispatcher['SelectEntity']
  // layoutContent: VisualEditorStore['layoutContentState']
}

const layoutNodeNestingInfo = {};
const setNodeArrayInfo = (nodeArray, layoutObj) => {
  Object.keys(layoutObj).map((nodeID) => {
    const node = layoutObj[nodeID];
    const { parentID } = node;
    if (parentID) {
      if (!layoutNodeNestingInfo[parentID]) layoutNodeNestingInfo[parentID] = new Set();
      layoutNodeNestingInfo[parentID].add(node.id);
    }
  });
  // console.log(layoutNodeNestingInfo);
};
const isNodeInChild = (srcNodeID, targetNodeID) => {
  // console.log(layoutNodeNestingInfo);
  return !!layoutNodeNestingInfo[targetNodeID]
    && layoutNodeNestingInfo[targetNodeID].has(srcNodeID);
  // console.log(layoutNodeArray);
};

const ContainerWrapperCom = ({
  children,
  currEntity,
  onClick,
  id,
  getSelectedState,
  onDrop
}) => {
  const isSelected = getSelectedState(id);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    /**
     * TODO: Fix bug，父容器拖动到子容器会出现问题
     *
     * ref: https://react-dnd.github.io/react-dnd/docs/api/use-drop
     */
    drop: ({ entityClass: dropedEntityClass }) => {
      /**
       * @important 重要策略
       *
       * 1. isOverCurrent 判断是否拖动在容器内
       * 2. isNodeInChild 判断自身是否拖到子容器中，避免嵌套
       */
      if (isOverCurrent) {
        setTimeout(() => {
          const isNodeInChildRes = isNodeInChild(id, dropedEntityClass.id);
          // console.log(isNodeInChildRes);
          if (!isNodeInChildRes) {
            onDrop({ ...dropedEntityClass }, id);
          }
        });
      }
    },
    canDrop: ({ entityClass: dropedEntityClass }, monitor) => {
      /** 不允许放到自身 */
      return dropedEntityClass.id !== id;
    },
    collect: (monitor) => {
      return {
        // isOver: !!monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      };
    },
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
        onClick(e, { id, entity: currEntity });
      }}
    >
      <DragItem
        entityClass={currEntity}
      >
        <ContainerWrapper
          className={classes}
        >
          <div>容器, ID: {id}</div>
          {children}
        </ContainerWrapper>
      </DragItem>
    </div>
  );
};

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
        entityClass={currEntity}
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

const stateOperatorFac = (state, setState) => {
  const update = (id, targetEntity) => {
    const nextState = {
      ...state,
    };
    nextState[id] = targetEntity;
    setState(nextState);

    return nextState;
  };
  const add = (entityClass) => {
    /** 防止嵌套 */
    if (!!entityClass.id && entityClass.id === entityClass.parentID) return entityClass;

    /** 外部可以通过 entityID 设置真正的 entity 的 id */
    let entityRuntimeID = entityClass.entityID;
    if (!entityRuntimeID) {
      entityRuntimeID = increaseID();
    }
    /** 如果组件还没被实例化 */
    /** 实例化 */
    const entity = Object.assign({}, entityClass, {
      id: entityRuntimeID,

      /** 下划线前缀为内部字段 */
      _comID: entityClass.id,
      _state: 'active'
    });
    const nextState = {
      ...state,
      [entityRuntimeID]: entity
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

const entityToComponentConfig = (entityClass, id) => {
  return {
    ...entityClass,
    entityID: id,
    component: {
      type: entityClass.component
    }
  };
};

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

  const onDropFilter = (entityClass, parentID?) => {
    const entityClassCopy = Object.assign({}, entityClass);
    if (parentID) {
      entityClassCopy.parentID = parentID;
    }

    /** 如果已经实例化的组件 */
    const isUpdate = entityClassCopy._state === 'active';

    /** 更新布局 */
    if (isUpdate) {
      return updateContainer(entityClassCopy.id, entityClassCopy);
    }

    switch (entityClassCopy.type) {
      case 'container':
        const entityID = increaseID();
        entityClassCopy.entityID = entityID;
        const entity = addContainer(entityClassCopy);
        onSelectEntityForOnce(null, { id: entityID, entity });
        break;
      case 'component':
        const componentRefID = increaseID();
        const componentID = `comp_id_${componentRefID}`;
        const componentEntity = addComponent(entityToComponentConfig(entityClassCopy, componentID));
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
    drop: ({ entityClass }) => {
      // console.log('drop');
      if (isOverCurrent) {
        const entity = Object.assign({}, entityClass);
        delete entity.parentID;
        onDropFilter(entity);
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
  setNodeArrayInfo(layoutNodeArray, layoutContentCollection);
  // console.log(parseObjToTreeNode(layoutContentCollection));

  return (
    <div className="canvas-stage-container">
      CanvasStage
      <StageRender
        ref={drop}
        className={`canvas-stage renderer${isOverCurrent ? ' overing' : ''}`}
      >
        {
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
