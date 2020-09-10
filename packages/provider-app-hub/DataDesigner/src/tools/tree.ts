/*
 * @Author: wph
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-08-19 14:59:09
 * @LastEditors: Please set LastEditors
 * @Description: 权限功能单元与页面状态无关的方法
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\features\authItem\authItem.ts
 */
/** 树节点类型接口定义 */
interface ITreeNode{
  title:string
  key:string
  children?:ITreeNode[]
}
/**
 * 递归遍历树,禁用已经勾选过的节点
 * @param treeNodes    整棵树
 * @param checkedKeys  选中过的节点key的集合
 */
const disTreeNode = (treeNodes, checkedKeys) => {
  return treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: children && disTreeNode(children, checkedKeys)
  }));
};
/**
 * 树过滤--过滤掉选中的节点
 * @param {* 树形数据} treeData
 * @param {* 过滤函数} filter-过滤条件可以自定义
 */
const treeFilter = ({ treeData, filter }) => treeData.map((item) => {
  const {
    key, title, children
  } = item;

  if (filter(item)) {
    /** 如果有子节点，递归查找 */
    if (children) {
      /**
     * 有子节点,返回节点属性中有children属性
     */
      return { title, key, children: treeFilter({ treeData: children, filter }) };
    }
    /**
     * 没有子节点的节点没有children属性
     */
    return {
      title,
      key
    };
  }
  /** 不符合过滤条件,返回null */
  /** 最终结果会过滤掉这些null值 */
  return null;
}).filter((item) => item);

/**
 * 根据节点key,从源树中查找节点完整属性
 * @param treeData   嵌套树形数据
 * @param key        节点key
 */
const treeQuery = (treeData, key) => {
  /** 每个节点项 */
  let node;
  let queue: Array<ITreeNode> = [];
  /** 生成根节点队列,遍历从根节点开始 */
  queue = queue.concat(treeData);

  /** 按照广度优先遍历子节点,广度优先的好处是节点数量比较大时,不会造成栈溢出 */
  while (queue.length) {
    /** 不断从队列头部取出节点 */
    node = queue.shift();
    /** 节点存在子节点,继续往节点队列后面拼接 */
    if (node && node.children) {
      queue = queue.concat(node.children);
    }
    /** 节点key与传入的key匹配时 ,结束循环,返回结果 */
    if (node && node.key === key) {
      return node;
    }
  }
  /** 没找到返回null */
  return { key: '', title: '' };
};

/**
 * 根据子节点的key递归向上查找父节点的key
 * @param key  子节点的key
 * @param treeData  树节点数据
 * @return 父节点的key
 */
const getParentKey = (key, treeData) => {
  /** 存储父节点的key,找不到的话就是undefined */
  // let parentKey;
  for (let i = 0, len = treeData.length; i < len; i++) {
    const node = treeData[i];
    /** 既然是根据要查找的节点的key，寻找其父节点的key,那么当前遍历项有子节点,查找才有意义 */
    if (node.children) {
      /** 在当前节点的子节点集合中找到要找的节点,说明当前节点是所要找的节点的父节点 */
      if (node.children.some((item) => item.key === key)) {
        return node.key;
      }
      // 在当前节点的子节点集合中未找到,继续在当前节点的子节点集合的下一级递归查找
      const parentKey = getParentKey(key, node.children);
      /** 未找到继续遍历,找到了才返回 */
      if (parentKey) {
        return parentKey;
      }
    }
  }
  /** 未找到返回null */
  return null;
};
/**
* 寻找与输入值匹配的子节点项
* treeList--扁平树
* treeData--嵌套树
* searchValue--输入值
* 返回: 数组对象,数组每项是子节点,子节点对应父节点,祖父节点的key的集合
*/
const findMatch = ({ treeList, treeData, searchValue }) => treeList
  .map((item) => {
    /**
    * 程序执行流程:
    * 先遍历扁平数组的每一项
    * 判断搜索文字与当前遍历节点的文本是否匹配
    * 匹配的话从树源中查找子节点的父节点,否则返回null
    * 最后从结果数组中过滤掉空值和重复值
    */
    if (item.title.indexOf(searchValue) > -1) {
      return getParentKey(item.key, treeData);
    }
    return null;
  })
  .filter((item, i, self) => item && self.indexOf(item) === i);

/**
 * 根据选中key的数组集合,生成嵌套树
 * @param nodes 树形源数据
 * @param targetKeys 选中的节点key集合
 * 返回：选中的节点的树形
 */
const generateSelectedTree = (nodes, targetKeys) => {
  return nodes
    .map((node) => {
      /**
       * 若有子节点，递归处理
       * 返回的数组如果有元素，说明子孙级有节点被选中
       */
      const children = node.children && node.children.length ? generateSelectedTree(node.children, targetKeys) : [];

      /**
       * 节点被选中有两种情况
       * 情况一：子孙级节点被选中,children.length 是大于0的
       * 情况二：选中节点是当前节点的话，当前节点在targetKeys中
       * 这两种情况下返回节点信息,其余情况返回null
       */
      if (children.length || targetKeys.includes(node.key)) {
        const newNode = {
          key: node.key,
          title: node.title,
          children: [],
        };
        /** 子孙级节点被选中 */
        if (children.length) {
          newNode.children = children;
        } else {
          /** 选中节点是当前节点,删除newNode的children属性 */
          delete newNode.children;
        }
        return newNode;
      }

      /** 当前节点未选中，返回 null */
      return null;
    })
    .filter((node) => node);
};

/**
 * 扁平转嵌套
 * @param list 扁平树
 * 返回 tree--嵌套树
 * 核心逻辑： 用键值对映射id和node之间的关系,把相同pid的子节点,push到对应键值的children数组中
 */
const listToTree = (list = []) => {
  /** 建立节点id和节点之间的映射 */
  const map = {};
  /** 节点信息 */
  let node;
  /** 不这样定义，tree.push(node)会告警 类型any的参数不能赋值给类型never */
  const tree:Array<unknown> = [];

  /** 用节点id生成键值对,节点的children属性初始化为空数组 */
  for (let i = 0, len = list.length; i < len; i++) {
    map[list[i].id] = list[i];
    list[i].children = [];
  }
  // console.log(list, map);
  /** 遍历扁平树 */
  for (let i = 0, len = list.length; i < len; i++) {
    node = list[i];
    /** antd-Tree组件必须有title和key这两个值 */
    /** 后端返回的数据没有这两个字段,需要加上 */
    node.title = node.name;
    node.key = node.id;
    /** antd-TreeSelect组件每个节点需要value字段,需要加上 */
    node.value = node.id;
    /** 当为叶子节点 */
    /** 后端返回数据中的pid不一定有对应的真实节点,所以要进行判空 */
    if (node.pid && map[node.pid]) {
      /** 这里是重点 */
      /** map[node.id] 和 分别对应的list[i],node,指向同一块引用 */
      /** 修改了map[node.id],就相当于修改了分别对应的 list[i] 和 node */
      /** 而压入tree的node,实际上就是map[node.pid] */
      // console.log(node.pid);
      map[node.pid].children.push(node);
    } else {
      /** 根节点 */
      tree.push(node);
    }
  }
  return tree;
};

/**
 * 嵌套转扁平
 * @param  treeData 树形嵌套数据
 * @param  treeList 树形扁平数据
 * 返回  树形扁平数据
 */
const treeToList = (treeData, treeList) => {
  /** 遍历根级树形数据 */
  for (let i = 0, len = treeData.length; i < len; i++) {
    /** 导出当前节点的属性 */
    const { key, title, children } = treeData[i];

    /** 这一句是重点 */
    /** 扁平树是不需要children属性的,有children属性的话就不是扁平树了 */
    treeList.push({ key, title });
    /** 当前节点有子节点,递归遍历向treeList追加节点 */
    if (children) {
      treeToList(children, treeList);
    }
  }
  return treeList;
};

export {
  generateSelectedTree, treeFilter, disTreeNode, treeQuery, findMatch, treeToList, listToTree, ITreeNode, getParentKey
};
