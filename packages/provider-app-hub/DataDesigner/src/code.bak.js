/*
 * @Author: your name
 * @Date: 2020-08-07 14:22:42
 * @LastEditTime: 2020-08-12 15:13:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesign\src\codeBak.js
 */

/**
   * 拖拽位置处理
   * @param info ={event, node, dragNode, dragNodesKeys}
   * @param node 目标节点
   * @param dragNode 拖拽节点
   * @param dragNodesKeys 拖拽节点的key
   * @param event 拖拽dom事件属性
   * @param dropToGap: 代表连接到节点之间的缝隙中，为true,表示拖拽与目标节点是前后邻居关系，为false表示拖拽与目标节点是子节点关系。
   * @param dropPosition antd 依赖了 rc-tree，在 rc-tree 里 dropPosition 是一个相对地址。
   * 如果拖到了目标节点的上面是 -1，下面则是 1。antd 里则是相对于目标节点的 index。
   * 如果拖动时正好落在该节点上，dropPosition 就是该节点的 index。
   * 如果落在目标节点的上方, dropPosition=目标节点的index-1
   * 如果落在目标节点的下方, dropPosition=目标节点的index+1
   */

// const onDrop = (info) => {
//   const {
//     event, node, dragNode, dragNodesKeys
//   } = info;
//   // console.log(info, event, node, dragNode, dragNodesKeys);
//   /** 目标节点的key */
//   const dropKey = node.key;
//   /** 拖拽节点的key */
//   const dragKey = dragNode.key;
//   /** 目标节点在其父节点下的路径,最后一位是子节点的序号 */
//   const dropPos = node.pos.split('-');
//   // 计算相对位置
//   // dropPosition=-1,拖拽节点被拖拽到目标节点上方
//   // dropPosition=0,拖拽节点被拖拽到目标节点上
//   // dropPosition=1,拖拽节点被拖拽到目标节点下方
//   const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
//   // console.log(info.dropToGap, info.dropPosition, dropPos, node, dropPosition);

//   // 根据节点的key,从data对象中找到对应节点的完整属性
//   const loop = (data, key, callback) => {
//     for (let i = 0; i < data.length; i++) {
//       if (data[i].key === key) {
//         return callback(data[i], i, data);
//       }
//       if (data[i].children) {
//         loop(data[i].children, key, callback);
//       }
//     }
//   };
//   const data = [...treeData];
//   let dragObj; // 存放被拖拽的节点
//   loop(data, dragKey, (item, index, arr) => {
//     arr.splice(index, 1); // 从data对象中删除被拖拽元素
//     dragObj = item;
//   });
//   // 拖拽节点是目标节点的子节点
//   if (!info.dropToGap) {
//     // 找到目标节点,把拖拽节点添加到目标节点子节点的尾部
//     loop(data, dropKey, (item) => {
//       item.children = item.children || [];
//       item.children.push(dragObj);
//     });
//   } // 拖拽与目标节点是前后相邻关系
//   else {
//     let ar; // 存放剔除了被拖拽节点的树形节点集合
//     let i; // 存放放置节点的位置
//     loop(data, dropKey, (item, index, arr) => {
//       ar = arr;
//       i = index;
//     });
//     // 将拖拽节点移动到目标节点上方
//     if (dropPosition === -1) {
//       ar.splice(i, 0, dragObj);
//     } else {
//       // 将拖拽节点移动到目标节点下方
//       ar.splice(i + 1, 0, dragObj);
//     }
//   }

//   // console.log(data);
//   setTreeData(data);
// };

// console.log(isShowLoading);

// console.log('占位 click ', e.key);
// setTimeout(() => {
//   dispatch({ type: 'triggerLoading', isShowLoading: !isShowLoading });
// }, 1000);

// dispatch({ type: 'triggerLoading', isShowLoading: !isShowLoading });

// <h1>

//   {isShowLoading ? '1' : '0'} times
// </h1>;

// if (isShowLoading) {
//   // console.log(isShowLoading, test);
//   dispatch({ type: 'setTreeData', treeData: test });
// } else {
//   dispatch({ type: 'setTreeData', treeData: [] });
// }
