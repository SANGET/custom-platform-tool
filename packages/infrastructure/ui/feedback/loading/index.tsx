import React from 'react';
import ReactDOM from 'react-dom';
import './loading.less';
import { Spin } from 'antd';

// 显示loading
function showLoading(requestCount: number): number {
  let count = requestCount;
  // console.log({ count });
  if (count === 0) {
    const dom = document.createElement('div');
    dom.setAttribute('id', 'loading');
    document.body.appendChild(dom);
    ReactDOM.render(<Spin tip="加载中..." size="large" />, dom);
  }
  count++;
  return count;
}
// 隐藏loading
function hideLoading(requestCount: number): number {
  let count = requestCount;
  count--;
  // console.log({ hideLoading: count });

  if (count === 0) {
    const dom = document.getElementById('loading');
    document.body.removeChild(dom as Node);
  }
  return count;
}

export { showLoading, hideLoading };
