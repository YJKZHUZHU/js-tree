import { Button, Space } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { TreeV2 as Tree } from 'js-tree';
import data from '../tree.json';

export default () => {
  const [tree, setTree] = useState(data);
  const [path, setPath] = useState([]);

  const onClick = () => {
    // const copy = JSON.parse(JSON.stringify(tree));
    const result = Tree.treeFindPath(tree, 'code', 'P633CSB');
    console.log('result', result);

    setPath(result);

    // setTree(item);
  };

  const onReset = () => {
    setTree(data);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Button type="primary" onClick={onClick}>
          treeFindPath
        </Button>
        <Button type="primary" onClick={onReset}>
          reset
        </Button>
      </Space>
      <Space>
        <ReactJson src={tree} />
        <div>{JSON.stringify(path)}</div>
      </Space>
    </Space>
  );
};
