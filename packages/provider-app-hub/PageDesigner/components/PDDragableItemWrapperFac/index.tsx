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
  DragableItemWrapperFac
} from '@engine/visual-editor/spec';
import { getWidget } from '@spec/business-widget';
import { TempEntityTip } from './TempEntityTip';
import { WidgetRenderer } from '../WidgetRenderer';
import { EditBtn } from './EditBtn';

/**
 * 可视化编辑器引擎的组件抽象实现
 */
export const PDdragableItemWrapperFac: DragableItemWrapperFac = (
  {
    onItemDrop, onItemMove, onItemClick, onDelete,
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
    const { widgetDef } = currEntity;

    // TODO: 调整获取组件的链路，通过远程获取的方式处理
    const registeredEntity = getWidget(widgetDef.type) || {};
    const { propEditor: PropEditor } = registeredEntity;
    const actionCtx = { entity: currEntity, idx, nestingInfo };
    return (
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
              onItemClick(e, actionCtx);
            }}
            entity={currEntity}
            businessWidgetConfig={registeredEntity}
            entityState={entityState || {}}
          >
            {children}
          </WidgetRenderer>
          <div className="action-area">
            {
              // const nestingIfx = nestingInfo;
              PropEditor && (
                /** 自定义编辑器的接口 */
                <EditBtn
                  editorRenderer={(modalOptions) => {
                    return (
                      <PropEditor
                        modalOptions={modalOptions}
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
