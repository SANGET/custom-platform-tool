/**
 * CanvasStage
 *
 * TODO: Fix bug，父容器拖动到子容器会出现问题
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
  // selectEntity: Dispatcher['SelectEntity']
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
    drop: ({ entityClass }) => {
      if (isOverCurrent) onDrop({ ...entityClass }, id);
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
        entityClass={currEntity}
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
const ComponentWrapperCom = ({
  children,
  currEntity,
  onClick,
  id,
  isSelected,
}) => {
  const classes = classnames([
    isSelected && 'selected'
  ]);

  // TODO: 修复 flex 布局的问题
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, { id });
      }}
    >
      <DragItem
        entityClass={currEntity}
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

interface ContainerWrapperFacActions {
  onDrop?: (entity, containerID?) => void;
  onClick?: (event, id) => void;
}

// TODO: 性能优化
const containerWrapperFac = (
  WrapperComponent,
  { onDrop, onClick }: ContainerWrapperFacActions,
  { layoutContentCollection, selectState }
) => (children, { id, idx }) => {
  const key = wrapID(id, idx);
  const isSelected = !!selectState[id];
  return (
    <WrapperComponent
      currEntity={layoutContentCollection[id]}
      onClick={onClick}
      onDrop={onDrop}
      id={id}
      isSelected={isSelected}
      key={id}
    >
      <div>id: {key}</div>
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
  };
  const add = (entityClass) => {
    /** 防止嵌套 */
    if (!!entityClass.id && entityClass.id === entityClass.parentID) return;

    /** 如果已经实例化的组件 */
    if (entityClass._state === 'active') {
      update(entityClass.id, entityClass);
    } else {
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
    }
  };
  const del = (id) => {
    const nextState = {
      ...state,
    };
    delete nextState[id];
    setState(nextState);
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
  // selectEntity,
  children
}: CanvasStageProps) => {
  const [layoutContentCollection, setLayoutContentCollection] = useState({});
  const [componentsCollection, setComponentsCollection] = useState({});
  const [selectState, setSelectState] = useState({});

  console.log('componentsCollection', componentsCollection);
  console.log('layoutContentCollection', layoutContentCollection);

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
    const entity = Object.assign({}, entityClass);
    if (parentID) {
      entity.parentID = parentID;
    }
    switch (entity.type) {
      case 'container':
        addContainer(entity);
        break;
      case 'component':
        const componentID = increaseID();
        addComponent(entityToComponentConfig(entity, componentID));
        addContainer({
          entityID: `comp_ref_${componentID}`,
          type: "componentRef",
          componentID,
          parentID
        });
        break;
    }
  };

  const [{
    isOverCurrent
  }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entityClass }) => {
      // console.log('drop');
      // selectEntity(entityClass);
      if (isOverCurrent) {
        onDropFilter(entityClass);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

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
      return componentsCollection[componentID];
    },
  };
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
            layoutNode: parseObjToTreeNode(layoutContentCollection),
            componentWrapper: containerWrapperFac(
              ComponentWrapperCom,
              {
                onClick: onSelectEntityForClick,
              },
              {
                layoutContentCollection,
                selectState,
              }
            ),
            containerWrapper: containerWrapperFac(
              ContainerWrapperCom,
              {
                onDrop: onDropFilter,
                onClick: onSelectEntityForClick,
              },
              {
                layoutContentCollection,
                selectState,
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

// const addContainer = (entity) => {
//   /** 防止嵌套 */
//   if (entity.id === entity.parentID) return;

//   /** 如果已经实例化的组件 */
//   if (entity.state === 'active') {
//     updateContainer(entity.id, entity);
//   } else {
//     /** 如果组件还没被实例化 */
//     const entityRuntimeID = increaseID();
//     const resEntity = Object.assign({}, entity, {
//       id: entityRuntimeID,
//       comID: entity.id,
//       state: 'active'
//     });
//     const nextState = {
//       ...layoutContentCollection,
//       [entityRuntimeID]: resEntity
//     };
//     setLayoutContentCollection(nextState);
//   }
// };
// const updateContainer = (id, targetEntity) => {
//   const nextState = {
//     ...layoutContentCollection,
//   };
//   nextState[id] = targetEntity;
//   setLayoutContentCollection(nextState);
// };

// // TODO: delete 组件
// const delContainer = (id) => {
//   const nextState = {
//     ...layoutContentCollection,
//   };
//   delete nextState[id];
//   setLayoutContentCollection(nextState);
// };
