import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState(data);

  const onClick = () => {
    const transformTree = Tree.transformTree(tree, {}, true);
    setTree(transformTree);
  };

  const onReset = () => {
    setTree(data);
  };

  const onLevel = () => {
    const levelTree = Tree.transformTree(
      data,
      {},
      { key: 'level', insert: true, from: 1 },
    );
    setTree(levelTree);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          默认level
        </Button>
        <Button type="primary" onClick={onLevel}>
          自定义level
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>

      <ReactJson src={tree} />
    </Space>
  );
};
