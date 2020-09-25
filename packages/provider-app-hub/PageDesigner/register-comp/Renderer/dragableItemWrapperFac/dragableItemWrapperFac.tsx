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
  DragableItemTypes,
  getCompEntity, DragableItemWrapperFac
} from '@engine/visual-editor/spec';
import { TempEntityTip } from './TempEntityTip';
import { ComponentRenderer } from './ComponentRenderer';
import { EditBtn } from './EditBtn';
// import { Debounce } from '@mini-code/base-func';

// const debounce = new Debounce();

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const dragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onDrop, onMove, onClick, onDelete,
    getLayoutNode, getSelectedState, getEntityProps,
    UpdateEntityState
    // getHoveringEntity, setHoveringEntity
  },
) => (propsForChild) => {
  const {
    id, idx, nestingInfo: _nestingInfo, children
  } = propsForChild;

  /** nestingInfo 由于变量被后来的覆盖了，需要采用不可变数据 */
  const nestingInfo = [..._nestingInfo];

  const ctx = { idx, id, nestingInfo };
  const isSelected = getSelectedState(ctx);
  const entityState = getEntityProps(ctx) || {};
  const currEntity = getLayoutNode(ctx);
  // const isHovering = getHoveringEntity(id);
  const classes = classnames([
    // isHovering && 'hovering',
    'dragable-item',
    isSelected && 'selected',
  ]);

  const updateCtx = {
    nestingInfo, entity: currEntity
  };

  const isTempEntity = currEntity._state === TEMP_ENTITY_ID;

  return isTempEntity ? <TempEntityTip key={id} /> : (() => {
    const { component } = currEntity;

    // TODO: 调整获取组件的链路，通过远程获取的方式处理
    const registeredEntity = getCompEntity(component.type);
    const { propEditor: PropEditor } = registeredEntity || {};
    const actionCtx = { entity: currEntity, idx, nestingInfo };
    return (
      <div
        className={classes}
        key={id}
      >
        <DragItemComp
          id={id}
          index={idx}
          onDrop={onDrop}
          onMove={onMove}
          dragItemClass={currEntity}
          type={DragableItemTypes.DragItemEntity}
          className="relative drag-item"
          accept={[DragableItemTypes.DragItemEntity, DragableItemTypes.DragItemClass]}
        >
          <ComponentRenderer
            {...propsForChild}
            onClick={(e) => {
              e.stopPropagation();
              onClick(e, actionCtx);
            }}
            entity={currEntity}
            registeredEntity={registeredEntity}
            entityState={entityState || {}}
          >
            {children}
          </ComponentRenderer>
          <div className="action-area">
            {
              // const nestingIfx = nestingInfo;
              PropEditor && (
                /** 自定义编辑器的接口 */
                <EditBtn
                  editorRenderer={() => {
                    return (
                      <PropEditor
                        compContext={{
                          entityState
                        }}
                        onChange={(changeVal) => {
                          // updateEntityState(changeVal);
                          UpdateEntityState(updateCtx, changeVal);
                        }}
                      />
                    );
                  }}
                />
              )
            }
            <span
              className="default btn red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, actionCtx);
              }}
            >
              删除
            </span>
          </div>
        </DragItemComp>
      </div>
    );
  })();
};
