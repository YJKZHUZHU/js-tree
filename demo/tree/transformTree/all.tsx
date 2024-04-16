import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState<any[]>(data);

  const onClick = () => {
    const transformTree = Tree.transformTree(
      data,
      { name: 'label', code: 'value' },
      { key: 'level', insert: true, from: 1 },
    );
    const list = Tree.treeToList(transformTree);
    console.log('list', transformTree, list);
    setTree(transformTree);
  };

  const onReset = () => {
    setTree(data);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          transformTree
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>

      <ReactJson src={tree} />
    </Space>
  );
};
