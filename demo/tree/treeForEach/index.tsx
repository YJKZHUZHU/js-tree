import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { cloneDeep, TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState(data);

  const onClick = () => {
    const copy = cloneDeep(tree);
    Tree.treeForEach(copy, (treeItem) => {
      console.log('treeItem', treeItem);
      treeItem['a'] = 111;
    });

    setTree(copy);
  };

  const onReset = () => {
    setTree(data);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          forEach
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>

      <ReactJson src={tree} />
    </Space>
  );
};
