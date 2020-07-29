import React from 'react';
import ReactDOM from 'react-dom';
import './loading.less';
import { Spin } from 'antd';

/**
 * 创建加载动画节点
 * @param requestCount 发请求的数量
 */
function showLoading(requestCount: number): number {
  let count = requestCount;
  // console.log({ count });
  /** 请求数量为0时,创建加载动画节点 */
  if (count === 0) {
    const dom = document.createElement('div');
    dom.setAttribute('id', 'loading');
    document.body.appendChild(dom);
    ReactDOM.render(<Spin tip="加载中..." size="large" />, dom);
  }
  count++;
  return count;
}
/**
 * 移除加载动画节点
 * @param requestCount 发请求的数量
 */
function hideLoading(requestCount: number): number {
  let count = requestCount;
  count--;
  // console.log({ hideLoading: count });
  /** 请求数量为0时,移除加载动画节点 */
  if (count === 0) {
    const dom = document.getElementById('loading');
    document.body.removeChild(dom as Node);
  }
  return count;
}

export { showLoading, hideLoading };
