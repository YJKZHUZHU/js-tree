import cloneDeep from '../cloneDeep';

export interface ITree {
  children?: ITree[];
  level?: number;
  [props: string]: any;
}

export type ILevel = {
  key: string;
  insert: boolean;
  from: number;
};

export default class Tree {
  /**
   * @desc 转化
   * @param tree
   * @param config
   * @returns
   */
  static transformTree<T extends ITree>(
    source: T[],
    config: Record<string, keyof T>,
    level: ILevel | boolean = false,
  ): T[] {
    // 深拷贝一份
    const tree = cloneDeep(source);


    const keys = Object.keys(config);

    const result = keys.reduce<Array<[keyof T, keyof T]>>((memo, item) => {
      memo.push([config[item], item as keyof T]);
      return memo;
    }, []);

    this.treeForEach(tree, (o: T) => {
      result.forEach((item) => {
        const [key, value] = item;
        o[key] = o[value];
        // if (o?.[key] && o?.[value]) {
        //   // console.log('key--', o[value], key, value);
        //   o[key] = o[value];
        // }
      });
    });


    const target = tree.map((o: ITree) => {
      if (typeof level === 'boolean' && level) {
        return this.addLevelToTree(o) as any;
      } else if (typeof level === 'object' && level.insert) {
        return this.addLevelToTree(o, level.from, level.key);
      }
      return o;
    });

    return target;
  }

  /**
   * @desc 添加层级
   * @param root
   * @param from
   * @param key
   */
  static addLevelToTree(
    root: ITree,
    from: number = 0,
    key: string = 'level',
  ): ITree {
    let level = from;
    const copy = cloneDeep(root);
    const source = [copy];
    // 深拷贝一份
    let queue = source;
    while (queue.length > 0) {
      let levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        let node = queue.shift()!;
        node[key] = level;
        if (node.children) {
          queue.push(...node.children);
        }
      }
      level++;
    }
    return copy;
  }

  /**
   * @desc 遍历树,会改变原数据
   * @param tree
   * @param func
   * @returns
   */
  static treeForEach<T extends ITree = ITree>(
    tree: T[],
    func: (treeItem: T) => void,
  ): T[] {
    // if()
    tree.forEach((node) => {
      func(node);
      // 如果子树存在，递归调用
      if (node?.children?.length) {
        this.treeForEach<ITree>(
          node?.children,
          func as (treeItem: ITree) => void,
        );
      }
    });
    return tree;
  }

  /**
   * @desc 扁平化
   * @param tree
   * @returns
   */
  static treeToList<T extends ITree>(tree: T[]) {
    const result: T[] = [];
    let node: T;
    let list = cloneDeep(tree);
    while ((node = list.shift()!)) {
      result.push(node);
      if (node.children) {
        list.push(...(node.children as T[]));
      }
    }
    return result;
  }

  /**
   * @todo 有重复数据
   * @desc 列表转树
   * @param list
   * @returns
   */
  static listToTree<T extends ITree>(
    list: T[],
    filterFn?: (code: string) => boolean,
  ) {
    const obj = list.reduce<Record<string, T>>(
      (map, node) => ((map[node.code] = node), (node.children = []), map),
      {},
    );
    return list.filter((node) => {
      if (obj[node.parentCode]) {
        obj[node.parentCode].children?.push(node);
      }
      if (filterFn || typeof filterFn === 'function') {
        return filterFn(node.parentCode);
      }
      // 根节点没有pid，可当成过滤条件
      return !node.parentCode;
    });
  }

  /**
   * @desc 查找节点
   * @param tree
   * @param func
   * @returns
   */
  static findTreeItem<T extends ITree>(
    source: T[],
    func: (node: T) => boolean,
  ): T | false {
    const tree = cloneDeep(source);
    for (let node of tree) {
      if (func(node)) {
        return node;
      }
      if (node.children) {
        const result = this.findTreeItem(node.children as T[], func);
        if (result) {
          return result;
        }
      }
    }
    return false;
  }

  /**
   * @desc 过滤节点
   * @param treeData
   * @param targetLevel
   * @param key
   * @param isDelete
   * @returns
   */
  static filterTree<T extends ITree>(
    source: T[],
    targetLevel: number,
    key: string = 'level',
    isDelete: boolean = false,
  ) {
    const treeData = cloneDeep(source);
    return treeData.filter((node) => {
      if (isDelete && node[key] === targetLevel) {
        delete node.children;
      }
      if (node[key] === targetLevel + 1) {
        // 如果当前节点的层级等于目标层级，返回 false，表示需要过滤掉该节点
        return false;
      } else if (node.children) {
        // 如果当前节点有子节点，则递归调用 filterTree 函数，并更新当前节点的子节点数组
        const target = this.filterTree(
          node.children,
          targetLevel,
          key,
          isDelete,
        );
        node.children = target;
      }
      // 返回 true，表示保留当前节点
      return true;
    });
  }

  /**
   * @desc 获取树节点路径
   * @param {array} tree 树
   * @param {string} key 树节点标识的值
   * @param {string} value 树节点标识的值
   *
   * @returns {array} result 存放搜索到的树节点到顶部节点的路径节点
   */
  static treeFindPath<T extends ITree>(
    source: T[],
    key: string = 'id',
    value: string,
  ) {
    const tree = cloneDeep(source);
    /** 存放搜索到的树节点到顶部节点的路径节点 */
    let result: T[] = [];
    /**
     * 路径节点追踪
     * @param {*} curKey 树节点标识的值
     * @param {array} path 存放搜索到的树节点到顶部节点的路径节点
     * @param {*} tree 树
     * @returns undefined
     */
    let traverse = (value: string, path: T[], tree: T[]) => {
      // 树为空时，不执行函数
      if (tree.length === 0) {
        return;
      }

      // 遍历存放树的数组
      for (let item of tree) {
        // 遍历的数组元素存入path参数数组中
        path.push(item);
        // 如果目的节点的id值等于当前遍历元素的节点id值
        if (item[key] === value) {
          // 把获取到的节点路径数组path赋值到result数组
          result = JSON.parse(JSON.stringify(path));
          return;
        }

        // 当前元素的children是数组
        const children = Array.isArray(item.children) ? item.children : [];
        // 递归遍历子数组内容
        traverse(value, path, children as T[]);
        // 利用回溯思想，当没有在当前叶树找到目的节点，依次删除存入到的path数组路径
        path.pop();
      }
    };
    traverse(value, [], tree);
    // 返回找到的树节点路径
    return result.map<string>((item) => item[key]);
  }

  /**
   * @desc 删除树的某些节点
   * @param node 树节点
   * @param filterFn 过滤规则
   * @returns
   */
  static filterTreeFn<T extends ITree>(
    node: T,
    filterFn: (node: T) => boolean,
  ): T | null {
    if (!node) {
      return null;
    }
    const filteredChildren = node?.children
      ?.map((child) => this.filterTreeFn(child as T, filterFn))
      .filter(Boolean);
    if (filterFn(node) || filteredChildren!?.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }
    return null;
  }
}
