/**
 * CanvasStage
 */
import React, { useState, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import update from 'immutability-helper';
import {
  LayoutRenderer, LayoutNodeInfo, parseFlatNodeToNestNode
} from '@engine/layout-renderer';
import { SelectEntityState } from '@engine/visual-editor/core/reducers';
import { layoutInfoReducer, LayoutInfoActionReducerState, LayoutInfoActionReducerAction } from '@engine/visual-editor/core/reducers/layout-info';
import { ItemTypes } from '@engine/visual-editor/spec/types';
import ContainerWrapperCom from '@engine/visual-editor/spec/template/ContainerWrapperCom';
import ComponentWrapperCom from '@engine/visual-editor/spec/template/ComponentWrapperCom';
import {
  EntitiesStateStore,
  EditorPageEntity
} from '@engine/visual-editor/types';
import {
  dragableItemWrapperFac, FacToComponentProps, WrapperFacOptions
} from '@engine/visual-editor/spec/dragable-item-wrapper-fac';
import { Grid } from '@infra/ui';
import { constructCompClass } from './utils/component-constructor';
import { PropertiesEditorProps } from '../PropertiesEditor';
import { Dispatcher } from '../../core/actions';
import { pageProperties } from '../../mock-data/page-perproties';
import DropStageContainer from './DropStageContainer';
import { DnDContext } from '../../spec/DragItem';

const PAGE_ENTITY_ID = '__PAGE__ENTITY__ID__';

const PageEntity: EditorPageEntity = {
  id: PAGE_ENTITY_ID,
  pageID: '',
  bindProps: {
    rawProp: pageProperties
  },
};

/**
 * 中央舞台组件的 props
 */
export interface CanvasStageProps {
  /** 组件包装器，提供标准接口，详情查看 @engine/visual-editor/spec/template/ComponentWrapperCom  */
  ComponentWrapper?: React.ElementType<FacToComponentProps>
  /** 容器组件包装器，提供标准接口，详情查看 @engine/visual-editor/spec/template/ContainerWrapperCom  */
  ContainerWrapper?: React.ElementType<FacToComponentProps>
  /** 选中组件实例的方法 */
  selectEntity: Dispatcher['SelectEntity']
  /** 保存属性的回调 */
  updateEntityState: Dispatcher['UpdateEntityState']
  /** 初始化实例的回调 */
  initEntityState: Dispatcher['InitEntityState']
  /** 选中的组件实例 */
  selectedEntities: SelectEntityState
  /** 组件实例的状态集合 */
  entitiesStateStore: EntitiesStateStore
  /** */
  PropEditorRenderer: React.ElementType<PropertiesEditorProps>
}

/**
 * 中央舞台组件
 */
class CanvasStageClass extends React.Component<CanvasStageProps & {
  layoutNodeInfo: LayoutInfoActionReducerState
  layoutInfoDispatcher: React.Dispatch<LayoutInfoActionReducerAction>
}> {
  /** 用于记录最后拖拽的实例的 idx */
  lastMoveIdx!: number | undefined

  componentDidMount() {
    this.props.selectEntity(PageEntity);
  }

  getLayoutNode = (entityIdx: number) => {
    return this.props.layoutNodeInfo[entityIdx];
  }

  /**
   * 查看组件实例是否被选中
   * @param entityID entityID
   */
  getSelectedState = (entityID: string) => {
    return !!this.props.selectedEntities.selectedList[entityID];
  };

  getEntityProps = (entityID: string) => {
    return this.props.entitiesStateStore[entityID];
  };

  /**
   * 相应拖放的放的动作的过滤器
   * 用于实例化 componentClass 或者更新 componentEntity
   */
  dropDispatcher = (componentClass, dropCtx?: DnDContext) => {
    const {
      layoutNodeInfo,
      layoutInfoDispatcher,
      selectEntity
    } = this.props;
    const { id: parentID = null, idx } = dropCtx || {};
    let _idx = idx;
    if (typeof _idx === 'undefined') {
      if (typeof this.lastMoveIdx === 'undefined') {
        _idx = layoutNodeInfo.length;
      } else {
        _idx = this.lastMoveIdx;
      }
    }
    const itemClassCopy = Object.assign({}, componentClass);
    if (parentID) {
      itemClassCopy.parentID = parentID;
    }
    let _entity = itemClassCopy;

    /** 如果已经实例化的组件 */
    const isMotify = itemClassCopy._state === 'active';

    if (isMotify) {
      /** 更新布局 */
      // layoutInfoDispatcher({
      //   type: 'motify',
      //   entity: itemClassCopy
      // });
    } else {
      /** 实例化组件类 */
      const entity = constructCompClass(itemClassCopy);
      _entity = entity;
      this.addElement(_entity, _idx);
    }

    /** 选中被操作的组件 */
    setTimeout(() => selectEntity(_entity));
    this.lastMoveIdx = undefined;
  };

  addElement = (entity, idx) => {
    this.props.layoutInfoDispatcher({
      type: 'add',
      entity,
      idx
    });
  }

  deleteElement = (event, { idx, entity }) => {
    const {
      layoutInfoDispatcher,
    } = this.props;

    layoutInfoDispatcher({
      type: 'del',
      entityIdx: idx
    });
  };

  /**
   * 点击选择组件实例的处理
   */
  onSelectEntityForClick = (clickEvent, { entity, idx }) => {
    const {
      selectEntity
    } = this.props;
    selectEntity(entity);
  };

  /**
   * 响应元素的拖事件，作用于排序
   */
  onMove = (dragIndex, hoverIndex, dragItem) => {
    const {
      layoutNodeInfo,
      layoutInfoDispatcher,
    } = this.props;
    let dragEntity = layoutNodeInfo[dragIndex];
    let removeItem = false;
    // console.log(dragEntity);
    if (!dragEntity) {
      /** 如果没有实例，则创建临时实例 */
      dragEntity = constructCompClass(dragItem.dragItemClass, '', 'temp');
      removeItem = true;
    }
    const nextState = update(layoutNodeInfo, {
      $splice: [
        [dragIndex, removeItem ? 0 : 1],
        [hoverIndex, 0, dragEntity],
      ],
    });
    /** 将最后的实例 idx 存储下来 */
    this.lastMoveIdx = hoverIndex;
    layoutInfoDispatcher({
      type: 'set',
      state: nextState,
    });
  }

  /**
   * 布局包装渲染器的上下文
   */
  wrapperContext: WrapperFacOptions = {
    getLayoutNode: this.getLayoutNode,
    getSelectedState: this.getSelectedState,
    getEntityProps: this.getEntityProps,
    onDrop: this.dropDispatcher,
    onMove: this.onMove,
    onDelete: this.deleteElement,
    onClick: this.onSelectEntityForClick,
  };

  render() {
    const {
      selectEntity,
      selectedEntities,
      entitiesStateStore,
      ComponentWrapper = ComponentWrapperCom,
      ContainerWrapper = ContainerWrapperCom,
      PropEditorRenderer,
      layoutNodeInfo,
      initEntityState,
      updateEntityState,
    } = this.props;
    console.log(layoutNodeInfo);

    const { activeEntityID, activeEntity } = selectedEntities;

    const selectPage = () => {
      // pageProperties
      selectEntity(PageEntity);
    };

    const pageEntityState = entitiesStateStore[PAGE_ENTITY_ID];
    const pageStyle = pageEntityState?.style;

    // console.log(activeEntity, entitiesStateStore);

    return (
      <div
        className="canvas-stage-container"
      >
        <Grid
          container
          space={10}
        >
          <Grid
            lg={9}
            md={9}
            sm={9}
            xs={9}
            item
          >
            <LayoutRenderer
              layoutNode={layoutNodeInfo}
              RootRender={(child) => (
                <DropStageContainer
                  accept={[ItemTypes.DragItemClass, ItemTypes.DragItemEntity]}
                  onDrop={(_dragItemClass, dropOptions) => {
                    if (dropOptions.type !== ItemTypes.DragItemClass) return;
                    /** 清除 parentID */
                    delete _dragItemClass.parentID;
                    this.dropDispatcher(_dragItemClass);
                  }}
                  onStageClick={(e) => {
                    // console.log('编辑页面属性');
                    selectPage();
                  }}
                  style={pageStyle}
                >
                  {child}
                </DropStageContainer>
              )}
              componentRenderer={dragableItemWrapperFac(
                ComponentWrapper,
                this.wrapperContext,
              )}
              containerWrapper={dragableItemWrapperFac(
                ContainerWrapper,
                this.wrapperContext,
              )}
            />
          </Grid>
          {
            activeEntity && (
              <Grid
                lg={3}
                md={3}
                sm={3}
                xs={3}
                item
              >
                <PropEditorRenderer
                  key={activeEntityID}
                  propertiesConfig={activeEntity.bindProps}
                  selectedEntity={activeEntity}
                  defaultEntityState={entitiesStateStore[activeEntityID]}
                  initEntityState={(entityState) => initEntityState(activeEntity, entityState)}
                  updateEntityState={(entityState) => updateEntityState(activeEntity, entityState)}
                />
              </Grid>
            )
          }
        </Grid>
      </div>
    );
  }
}

const CanvasStage: React.FC<CanvasStageProps> = (props) => {
  const [
    layoutNodeInfo, layoutInfoDispatcher
  ] = useReducer(layoutInfoReducer, []);

  return (
    <CanvasStageClass
      {...props}
      layoutNodeInfo={layoutNodeInfo}
      layoutInfoDispatcher={layoutInfoDispatcher}
    />
  );
};

export default CanvasStage;
