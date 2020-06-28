/**
 * CanvasStage
 */
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import LayoutParser from '@iub-dsl/parser/engin/layout';
import { ItemTypes } from '../ComponentPanel/types';
import { Dispatcher } from '../../core/actions';
import { VisualEditorStore } from '../../core/store';
import { increaseID, parseObjToTreeNode, wrapID } from './utils';

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
  background-color: rgba(0,0,0, 0.1);
  padding: 20px;
  &.overing {
    background-color: rgba(0,0,0, 0.15);
  }
`;

export interface CanvasStageProps {
  selectEntity: Dispatcher['SelectEntity']
  // layoutContent: VisualEditorStore['layoutContentState']
}

const ContainerWrapperCom = ({
  children,
  parentID,
  onDrop
}) => {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entity }) => {
      onDrop({ ...entity, parentID });
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  return (
    <ContainerWrapper
      ref={drop}
      className={`${isOverCurrent ? 'overing' : ''}`}
      onClick={(e) => {
        console.log('click container');
      }}
    >
      {children}
    </ContainerWrapper>
  );
};

// TODO: 性能优化
const containerWrapper = (onDrop) => (container, { id, idx }) => {
  const key = wrapID(id, idx);
  return (
    <ContainerWrapperCom
      onDrop={onDrop}
      parentID={id}
      key={key}
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
  const addContainer = (entity) => {
    const entityRuntimeID = increaseID();
    const resEntity = Object.assign({}, entity, {
      id: entityRuntimeID,
      runtimeID: entityRuntimeID,
    });
    setLayoutContentCollection(
      {
        ...layoutContentCollection,
        [entityRuntimeID]: resEntity
      }
    );
  };
  const [
    {
    // isOver,
      isOverCurrent
    },
    drop
  ] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entity }) => {
      // console.log('drop');
      // selectEntity(entity);
      if (isOverCurrent) addContainer(entity);
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const onDropForContainer = (entity) => {
    addContainer(entity);
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
  console.log(layoutContentCollection, parseObjToTreeNode(layoutContentCollection));

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
            containerWrapper: containerWrapper(onDropForContainer)
          }, parserContext)
        }
        {children}
      </StageRender>
    </div>
  );
};

export default CanvasStage;
