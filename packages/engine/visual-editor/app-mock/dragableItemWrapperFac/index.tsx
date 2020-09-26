/**
 * @author zxj
 *
 * 这里是画布与组件渲染的稳定抽象
 */

import React from 'react';
import classnames from 'classnames';
import { TEMP_ENTITY_ID } from '@engine/visual-editor/data-structure';
import {
  DragItemComp,
  DragableItemTypes, DragableItemWrapperFac
} from '@engine/visual-editor/spec';

import { TempEntityTip } from './TempEntityTip';
import { WidgetRenderer } from './WidgetRenderer';
// import { Debounce } from '@mini-code/base-func';

// const debounce = new Debounce();

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const dragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onItemDrop, onItemMove, onItemClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    UpdateEntityState,
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const {
    id, idx, nestingInfo, children
  } = propsForChild;
  const ctx = { idx, id, nestingInfo };
  const isSelected = getSelectedState(ctx);
  const entityState = getEntityProps(ctx);
  const currEntity = getLayoutNode(ctx);
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    'dragable-item',
    isSelected && 'selected',
  ]);
  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;

  return isTempEntity ? <TempEntityTip key={id} /> : (
    <div
      className={classes}
      key={id}
    >
      <DragItemComp
        id={id}
        index={idx}
        onItemDrop={onItemDrop}
        onItemMove={onItemMove}
        dragableWidgetType={currEntity}
        type={DragableItemTypes.DragItemEntity}
        className="relative drag-item"
        accept={[DragableItemTypes.DragItemEntity, DragableItemTypes.DragableItemType]}
      >
        <WidgetRenderer
          {...propsForChild}
          onClick={(e) => {
            e.stopPropagation();
            onItemClick(e, { entity: currEntity, idx });
          }}
          entity={currEntity}
          entityState={entityState || {}}
        >
          {children}
        </WidgetRenderer>
        <div
          className="t_red rm-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e, { idx, entity: currEntity });
          }}
        >
          删除
        </div>
      </DragItemComp>
    </div>
  );
};
