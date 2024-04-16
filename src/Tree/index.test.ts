import Tree from './index';
import data from './test.json';

type ITree = {
  children?: ITree[];
  id?: number;
  level?: number;
  code: string;
  name: string;
  parentCode: string;
  [props: string]: any;
};

describe('Tree', () => {
  const tree: ITree[] = data;

  test('transformTree', () => {
    const config = { name: 'title', code: 'key' };
    const transformed = Tree.transformTree<ITree>(
      JSON.parse(JSON.stringify(tree)),
      config,
    );
    expect(transformed[0].code).toBe('CN32');
    expect(transformed[0].children?.[0]?.code).toBe('P010Y');
    expect(transformed[0].children?.[0].children?.[0].code).toBe('P024LYB');
    expect(
      transformed[0].children?.[0].children?.[0].children?.[0].children?.[0]
        .children,
    ).toBeUndefined();

    expect(transformed[0].name).toBe(transformed[0].title);
    expect(transformed[0].children?.[0]?.name).toBe(
      transformed[0].children?.[0]?.title,
    );
    expect(transformed[0].children?.[0].children?.[0].name).toBe(
      transformed[0].children?.[0].children?.[0].title,
    );
    expect(transformed[0].code).toBe(transformed[0].key);
    expect(transformed[0].children?.[0]?.code).toBe(
      transformed[0].children?.[0]?.key,
    );
    expect(transformed[0].children?.[0].children?.[0].code).toBe(
      transformed[0].children?.[0].children?.[0].key,
    );
    // 增加level
    const levelTransformed = Tree.transformTree<ITree>(
      JSON.parse(JSON.stringify(tree)),
      config,
      true,
    );
    expect(levelTransformed[0].level).toBe(0);
    const levelConfigTransformed = Tree.transformTree<ITree>(
      JSON.parse(JSON.stringify(tree)),
      config,
      {
        key: 'index',
        insert: true,
        from: 2,
      },
    );
    expect(levelConfigTransformed[0].index).toBe(2);
  });

  test('treeForEach', () => {
    const result: ITree[] = [];
    Tree.treeForEach(tree, (node) => {
      result.push({ ...node, name: '我是新加的属性' });
    });
    expect(result[0].children?.[0]?.code).toBe('P010Y');
    expect(result[0].children?.[0].children?.[0].code).toBe('P024LYB');
    expect(
      result[0].children?.[0].children?.[0].children?.[0].children?.[0]
        .children,
    ).toBeUndefined();
    expect(result[0].name).toBe('我是新加的属性');
  });

  test('treeToList', () => {
    const result = Tree.treeToList(JSON.parse(JSON.stringify(tree)));
    expect(result.length).toBe(428);
    expect(result[0].name).toBe('冷运事业部');
    expect(result[1].name).toBe('华北区域公司');
    expect(result[2].name).toBe('华东区域公司');
  });

  test('listToTree', () => {
    const list = Tree.treeToList(JSON.parse(JSON.stringify(tree)));
    const empty = Tree.listToTree(JSON.parse(JSON.stringify(list)));
    const result = Tree.listToTree(
      JSON.parse(JSON.stringify(list)),
      (code) => code === '001',
    );
    expect(empty.length).toBe(0);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('冷运事业部');
    expect(result[0].code).toBe('CN32');
    expect(result[0].children?.[0]?.code).toBe('P010Y');
    expect(result[0].children?.[0].children?.[0].code).toBe('P024LYB');
    expect(result[0].children?.[0].children?.[0].children?.length).toBe(0);
  });

  test('findTreeItem', () => {
    const result = Tree.findTreeItem<ITree>(
      JSON.parse(JSON.stringify(tree)),
      (node) => node.code === 'P024LYB',
    ) as ITree;
    expect(result?.name).toBe('沈阳DC');

    const empty = Tree.findTreeItem<ITree>(
      tree,
      (node) => node.code === '1111',
    );
    expect(empty).toBeFalsy();
  });

  test('treeFindPath', () => {
    const result = Tree.treeFindPath(
      JSON.parse(JSON.stringify(tree)),
      'code',
      'P411CKA',
    );
    expect(result).toEqual(['CN32', 'P010Y', 'P024LYB', 'P411LYB', 'P411CKA']);
  });

  test('filterTree', () => {
    const data = Tree.transformTree(
      JSON.parse(JSON.stringify(tree)),
      { name: 'title', code: 'key' },
      { key: 'level', insert: true, from: 1 },
    );
    const result = Tree.filterTree(JSON.parse(JSON.stringify(data)), 1);
    expect(result[0]?.children?.length).toBe(0);

    const resultByDelete = Tree.filterTree(
      JSON.parse(JSON.stringify(data)),
      1,
      'level',
      true,
    );
    expect(resultByDelete[0]?.children).toBeUndefined();
  });
});
