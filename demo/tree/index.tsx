import { Button, Space, Table, Tree as TreeCom, TreeProps } from 'antd';
import { Tree } from 'js-tree';
import React, { useState } from 'react';
import data from './data.json';
import listData from './test.json';

const test = () => {
  const parentCodeArr = listData.map((d) => d.parentCode).filter(Boolean);
  const target = listData.map((d) => {
    return {
      dimName: d.parentDimName,
      code: d.parentCode,
      children: [{ ...d }],
    };
  });
  const source: any[][] = [];

  parentCodeArr.forEach((d) => {
    const result = target.filter((item) => item.code === d);
    source.push(result);
  });

  const result = source.map((arr) => {
    const target = arr.reduce<Record<string, any>>((memo, item) => {
      const children = memo.children
        ? [...memo.children, ...item.children]
        : item.children;
      const countInfo = children.reduce(
        (m, i) => {
          const numerator = m.numerator + i.numerator;
          const denominator = m.denominator + i.denominator;
          m = {
            ...m,
            numerator,
            denominator,
            num: String(parseFloat((numerator / denominator).toFixed(2))),
          };
          return m;
        },
        {
          numerator: 0,
          denominator: 0,
          num: '',
        },
      );
      memo = {
        dimName: item.dimName,
        code: item.code,
        ...countInfo,
        children,
      };
      return memo;
    }, {} as any);
    return target;
  });
  console.log('target', source, result, target, parentCodeArr);
};

export default () => {
  test();
  const tree = Tree.transformTree(
    data.data,
    { name: 'title', code: 'key' },
    { key: 'level', insert: true, from: 3 },
  );

  const list = Tree.treeToList(tree);

  const [isTree, setIsTree] = useState(true);

  // const a = Tree.treeFindPath(tree, 'code', (node) => node.code === 'P411CKA');

  const b = Tree.treeFindPath(tree, 'code', 'P411CKA');

  console.log(
    'result',
    b,
    Tree.filterTree(JSON.parse(JSON.stringify(tree)), 3, 'level', true),
    tree,
  );

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  const onTreeToList = () => {
    setIsTree(!isTree);
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '父节点',
      dataIndex: 'parentCode',
      key: 'parentCode',
    },
  ];

  return (
    <Space style={{ width: '100%' }} direction="vertical">
      <Space>
        <Button type="primary" onClick={onTreeToList}>
          {isTree ? '转成表结构' : '转成树结构'}
        </Button>
      </Space>
      {isTree ? (
        <TreeCom
          checkable
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={tree}
        />
      ) : (
        <Table
          expandable={{ childrenColumnName: 'null' }}
          dataSource={list}
          columns={columns}
        />
      )}
    </Space>
  );
};
