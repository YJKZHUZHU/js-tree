import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState(data);

  const onClick = () => {
   
    const result = tree.map((d) => {
      const target = Tree.addLevelToTree(d, 1, 'level');
      return target;
    });
    setTree(result);
  };

  const onReset = () => {
    setTree(data);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          addLevelToTree
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>

      <ReactJson src={tree} />
    </Space>
  );
};
