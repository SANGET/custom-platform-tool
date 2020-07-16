import React, { Component } from 'react';
import {
  Tree, Checkbox, Button, Input
} from 'antd';
import Icon from '@ant-design/icons';

import './a.module.less';

import styled from 'styled-components';

const { TreeNode } = Tree;
const splitSymbol = '-';

const dataAddKey = (data) => {
  return data.map((item, index) => {
    item.key = `${index}`;
    item.children = item.children.map((childItem, childIndex) => {
      const nowKey = `${index}${splitSymbol}${childIndex}`;
      childItem.key = nowKey;
      return childItem;
    });
    return item;
  });
};

const getLeftAndRightKey = (data, rightDataKey = {}) => {
  const len = data.length;
  let leftData = new Array(len).fill('').map(() => {
    return { children: [] };
  });
  let rightData = new Array(len).fill('').map(() => {
    return { children: [] };
  });
  let leftTotalCount = 0;
  let rightTotalCount = 0;
  data.map((item, index) => {
    item.children.map((childItem, childIndex) => {
      const nowKey = `${index}${splitSymbol}${childIndex}`;
      if (nowKey in rightDataKey) {
        rightData[index].name = item.name;
        rightData[index].key = `${index}`;
        rightData[index].children.push(childItem);
        rightTotalCount += 1;
      } else {
        leftTotalCount += 1;
        leftData[index].name = item.name;
        leftData[index].key = `${index}`;
        leftData[index].children.push(childItem);
      }
    });
  });
  leftData = leftData.filter((item) => {
    return item.children.length;
  });
  rightData = rightData.filter((item) => {
    return item.children.length;
  });
  return {
    leftData,
    rightData,
    leftTotalCount,
    rightTotalCount
  };
};

const filterData = (data, filterValue) => {
  const filterTrimV = filterValue.trim();
  if (!filterTrimV) {
    return data;
  }
  data = data.filter((item) => {
    if (item.name.includes(filterTrimV)) {
      return true;
    }
    if (item.children && item.children.length) {
      item.children = item.children.filter((childItem) => {
        if (childItem.name.includes(filterTrimV)) {
          return true;
        }
        return false;
      });
      return item.children.length > 0;
    }
    return true;
  });
  return data;
};

class TreeSelectTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSelectKey: {},
      rightDataKey: {},
      rightSelectKey: {},
      leftIptValue: '',
      rightIptValue: '',

      leftFValue: '',
      rightFValue: '',

      targetKeys: []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource != this.props.dataSource) {
      this.setState({
        leftSelectKey: {},
        rightDataKey: {},
        rightSelectKey: {},
        leftIptValue: '',
        rightIptValue: '',
        leftFValue: '',
        rightFValue: '',
        targetKeys: []
      });
    } else if (this.state.targetKeys == this.props.targetKeys) {
      return false;
    }
    return true;
  }

  bindChange = (type, data) => (e, item) => {
    const selectKeyO = { ...this.state[type] };
    const { eventKey } = item.node.props;
    const findSplitSymbol = eventKey.indexOf(splitSymbol) > -1;
    if (!findSplitSymbol) {
      const notSelectA = [];
      const selectA = [];
      if (!data[eventKey]) {
        return;
      }
      const dataChildren = data[eventKey] ? data[eventKey].children : [];
      dataChildren.map(({ id, key }) => {
        // let nowKey = `${eventKey}${splitSymbol}${index}`;
        const nowKey = key;
        if (!(nowKey in selectKeyO)) {
          notSelectA.push({
            key: nowKey,
            title: id
          });
        } else {
          selectA.push(nowKey);
        }
      });
      if (notSelectA.length) {
        notSelectA.map(({ key, title }) => {
          selectKeyO[key] = title;
        });
      } else {
        selectA.map((key) => {
          delete selectKeyO[key];
        });
      }
    } else {
      const { id } = item.node.props;
      if (eventKey in selectKeyO) {
        delete selectKeyO[eventKey];
      } else {
        selectKeyO[eventKey] = id;
      }
    }
    this.setState({
      [type]: selectKeyO
    });
  };

  selectOrCancelAll = (type, selectKeys, data, isSelectAll) => () => {
    if (isSelectAll) {
      this.setState({
        [type]: {}
      });
    } else {
      const newSelectKeys = { ...selectKeys };
      data.map((item) => {
        item.children.map((childItem) => {
          if (!(childItem.key in newSelectKeys)) {
            newSelectKeys[childItem.key] = childItem.id;
          }
        });
      });
      this.setState({
        [type]: newSelectKeys
      });
    }
  };

  selectGoToRight = () => {
    const { onChange } = this.props;
    const { leftSelectKey } = this.state;
    let { rightDataKey } = this.state;
    rightDataKey = { ...rightDataKey, ...leftSelectKey };
    const targetKeys = Object.values(rightDataKey);
    this.setState({
      leftSelectKey: {},
      rightDataKey,
      targetKeys
    });
    if (typeof onChange == 'function') {
      onChange(targetKeys);
    }
  };

  selectGoToLeft = () => {
    const { onChange } = this.props;
    const { rightSelectKey } = this.state;
    const rightDataKey = { ...this.state.rightDataKey };
    for (const key in rightSelectKey) {
      delete rightDataKey[key];
    }
    const targetKeys = Object.values(rightDataKey);
    this.setState({
      rightDataKey,
      rightSelectKey: {},
      targetKeys
    });
    if (typeof onChange == 'function') {
      onChange(targetKeys);
    }
  };

  changeIptValue = (type) => (event) => {
    this.setState({
      [type]: event.target.value
    });
  };

  begineSearch = (type) => () => {
    if (type == 'left') {
      this.setState({
        leftFValue: this.state.leftIptValue
      });
    } else {
      this.setState({
        rightFValue: this.state.rightIptValue
      });
    }
  };

  clearSearchAndValue = (type) => () => {
    if (type == 'left') {
      this.setState({
        leftIptValue: '',
        leftFValue: ''
      });
    } else {
      this.setState({
        rightIptValue: '',
        rightFValue: ''
      });
    }
  };

  render() {
    const {
      leftSelectKey,
      rightDataKey,
      rightSelectKey,
      leftIptValue,
      rightIptValue,
      leftFValue = '',
      rightFValue = ''
    } = this.state;
    const { dataSource = [], titles = [] } = this.props;
    const data = dataAddKey(dataSource);
    const leftSelectCount = Object.keys(leftSelectKey).length;
    const rightSelectCount = Object.keys(rightSelectKey).length;
    const isHaveLeftChecked = leftSelectCount > 0;
    const isHaveRightChecked = rightSelectCount > 0;
    const {
      leftData, rightData, leftTotalCount, rightTotalCount
    } = getLeftAndRightKey(
      data,
      rightDataKey
    );
    const fLeftData = filterData(leftData, leftFValue);
    const fRightData = filterData(rightData, rightFValue);

    const leftSelectAll = leftSelectCount == leftTotalCount;
    const rightSelectAll = rightSelectCount == rightTotalCount;
    // console.log(leftSelectKey, rightSelectKey);
    return (
      <div className="tree-select-transfer">
        <div className="tst-l">
          <div className="tst-header">
            {leftTotalCount ? (
              <Checkbox
                indeterminate={!leftSelectAll && isHaveLeftChecked}
                checked={leftSelectAll}
                onChange={this.selectOrCancelAll(
                  'leftSelectKey',
                  leftSelectKey,
                  leftData,
                  leftSelectAll
                )}
              >
                {`${leftSelectCount ? `${leftSelectCount}/` : ''}${leftTotalCount} 条`}
              </Checkbox>
            ) : null}
            {titles[0] ? <span style={{ float: 'right' }}>{titles[0]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            value={leftIptValue}
            onChange={this.changeIptValue('leftIptValue')}
            style={{ width: '100%', padding: 4 }}
            suffix={
              leftIptValue ? (
                <Icon
                  type="close-circle"
                  theme="filled"
                  onClick={this.clearSearchAndValue('left')}
                />
              ) : (
                <Icon type="search" onClick={this.begineSearch('left')} />
              )
            }
            onPressEnter={this.begineSearch('left')}
          />
          <div style={{ overflow: 'auto', height: 220 }}>
            <Tree
              showIcon
              defaultExpandAll
              onSelect={this.bindChange('leftSelectKey', fLeftData)}
              switcherIcon={<Icon type="down" />}
            >
              {fLeftData.map((item, index) => {
                if (item.children && item.children.length) {
                  return (
                    <TreeNode title={item.name} key={index}>
                      {item.children.map((childItem) => {
                        const isChecked = childItem.key in leftSelectKey;
                        return (
                          <TreeNode
                            icon={<Checkbox checked={isChecked} />}
                            id={childItem.id}
                            onClick={this.bindChange}
                            key={childItem.key}
                            title={childItem.name}
                          />
                        );
                      })}
                    </TreeNode>
                  );
                }
              })}
            </Tree>
          </div>
        </div>
        <div className="tst-m">
          <Button
            type="primary"
            size="small"
            icon="right"
            style={{ marginBottom: 4 }}
            disabled={!isHaveLeftChecked}
            onClick={this.selectGoToRight}
          ></Button>
          <Button
            type="primary"
            size="small"
            disabled={!isHaveRightChecked}
            icon="left"
            onClick={this.selectGoToLeft}
          ></Button>
        </div>
        <div className="tst-r">
          <div className="tst-header">
            {rightTotalCount ? (
              <Checkbox
                indeterminate={!rightSelectAll && isHaveRightChecked}
                checked={rightSelectAll}
                onChange={this.selectOrCancelAll(
                  'rightSelectKey',
                  rightSelectKey,
                  rightData,
                  rightSelectAll
                )}
              >
                {`${rightSelectCount ? `${rightSelectCount}/` : ''}${rightTotalCount} 条`}
              </Checkbox>
            ) : null}
            {titles[1] ? <span style={{ float: 'right' }}>{titles[1]}</span> : null}
          </div>
          <Input
            placeholder="请输入搜索内容, 输入完按Enter键过滤"
            onChange={this.changeIptValue('rightIptValue')}
            value={rightIptValue}
            style={{ width: '100%', padding: 4 }}
            suffix={
              rightIptValue ? (
                <Icon
                  type="close-circle"
                  theme="filled"
                  onClick={this.clearSearchAndValue('right')}
                />
              ) : (
                <Icon type="search" onClick={this.begineSearch('right')} />
              )
            }
            onPressEnter={this.begineSearch('right')}
          />
          <div style={{ overflow: 'auto', height: 220 }}>
            <Tree
              showIcon
              defaultExpandAll
              onSelect={this.bindChange('rightSelectKey', fRightData)}
              switcherIcon={<Icon type="down" />}
            >
              {fRightData.map((item, index) => {
                if (item.children && item.children.length) {
                  return (
                    <TreeNode title={item.name} key={index}>
                      {item.children.map((childItem) => {
                        const isChecked = childItem.key in rightSelectKey;
                        return (
                          <TreeNode
                            icon={<Checkbox checked={isChecked} />}
                            id={childItem.id}
                            onClick={this.bindChange}
                            key={childItem.key}
                            title={childItem.name}
                          />
                        );
                      })}
                    </TreeNode>
                  );
                }
              })}
            </Tree>
          </div>
        </div>
      </div>
    );
  }
}

export default TreeSelectTransfer;

/**
  data: [
  {
    "id": 1,
    "name": "test0",
    "children": [
      {
        "id": 3,
        "name": "test01",
        "children": [
          {
            "id": 8,
            "name": "test011"
          },
          {
            "id": 9,
            "name": "test012"
          },
          {
            "id": 10,
            "name": "test013",
            "node_order": 2
          }
        ]
      },
      {
        "id": 6,
        "name": "test02",
        "children": [
          {
            "id": 14,
            "name": "test021"
          },
          {
            "id": 15,
            "name": "test022"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "test1",
    "children": [
      {
        "id": 5,
        "name": "test11",
        "children": [
          {
            "id": 11,
            "name": "test111"
          },
          {
            "id": 12,
            "name": "test112"
          },
          {
            "id": 13,
            "name": "test113",
            "node_order": 2
          }
        ]
      },
      {
        "id": 7,
        "name": "test12",
        "children": [
          {
            "id": 16,
            "name": "test121"
          },
          {
            "id": 17,
            "name": "test122"
          }
        ]
      }
    ]
  }
]
  example: <TreeSelectTransfer
          dataSource={data}
          titles={['可升级服务列表', "选中列表"]}
        />
*/
