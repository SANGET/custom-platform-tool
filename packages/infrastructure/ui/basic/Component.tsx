import React, { useEffect } from 'react';
import classNames from 'classnames';
import { BasicComponent } from './types';

type CompType<T> = React.ComponentType<T>
type CompPropsType = BasicComponent

/**
 * 基础组件的 HOC
 * @param Comp 需要被包装的组件
 */
export function basicComponentFac<C>(Comp: CompType<C>) {
  return <P extends (CompPropsType & C)>(props: P): JSX.Element => {
    const {
      onMount, onUnmount, wrapper,
      className, classnames,
      ...otherProps
    } = props;

    /**
     * 执行默认的回调
     */
    useEffect(() => {
      onMount && onMount();
      return () => {
        onUnmount && onUnmount();
      };
    }, []);

    const classes = classNames(className, classnames);

    const child = (
      <Comp
        className={classes}
        {...otherProps}
      />
    );

    return child;
    // return typeof wrapper === 'function'
    //   ? wrapper(child) : child;
  };
}
