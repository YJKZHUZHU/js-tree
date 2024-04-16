import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState(Tree.treeToList(data));

  const onClick = () => {
    // const copy = JSON.parse(JSON.stringify(tree));
    const list = Tree.listToTree(tree);

    console.log('list--', list);

    setTree(list);
  };

  const onReset = () => {
    setTree(Tree.treeToList(data));
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          listToTree
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>

      <ReactJson src={tree} />
    </Space>
  );
};
