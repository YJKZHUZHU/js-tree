export enum CloneType {
  Object = 'Object',
  Array = 'Array',
  Date = 'Date',
  RegExp = 'RegExp',
  Function = 'Function',
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Undefined = 'Undefined',
  Null = 'Null',
  Symbol = 'Symbol',
  Set = 'Set',
  Map = 'Map',
}

export type _CloneType = keyof typeof CloneType;

/**
 * 检测数据类型
 * @param type cloneType
 * @param obj 检测的数据源
 * @returns Boolean
 */
function isType<T>(type: _CloneType, obj: T) {
  return Object.prototype.toString.call(obj) === `[object ${type}]`;
}

/**
 * 深拷贝
 * @param obj 要克隆的对象
 * @param cache 缓存对象，用于解决循环引用的问题
 *  */
function cloneDeep<T>(obj: T, cache = new WeakMap()): T {
  // 如果不是对象或者是null，直接返回（终止条件）
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 如果类型是Symbol，直接返回一个新的Symbol
  if (isType(CloneType.Symbol, obj)) {
    return obj.constructor((obj as unknown as symbol).description);
  }
  // 如果已经缓存过，直接返回缓存的值
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // 初始化返回结果
  let temp: T, param: T;
  // 如果是日期对象，直接返回一个新的日期对象
  if (isType(CloneType.Date, obj) || isType(CloneType.RegExp, obj)) {
    param = obj;
  }
  // @ts-ignore
  temp = new obj!.constructor(param);
  // 如果是数组或者对象，需要遍历
  if (isType(CloneType.Array, obj) || isType(CloneType.Object, obj)) {
    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        // @ts-ignore
        temp[key] = cloneDeep(obj[key], cache);
         // @ts-ignore
        // console.log('temp[key]1', obj[key], temp[key]);
        // @ts-ignore
        if (isType(CloneType.Array, temp[key]) && temp[key].some(d => !d)) {
          // @ts-ignore
          temp[key] = temp[key].filter(Boolean);
        }
        // @ts-ignore
        // console.log('temp[key]2', obj[key], temp[key]);
      }
    });
  }
  // 如果是Set
  if (isType(CloneType.Set, obj)) {
    // @ts-ignore
    for (let value of obj as unknown as Set<T>) {
      (temp as Set<T>).add(cloneDeep(value, cache));
    }
  }
  // 如果是Map
  if (isType(CloneType.Map, obj)) {
    // @ts-ignore
    for (let [key, value] of obj as unknown as Map<T, T>) {
      (temp as Map<T, T>).set(cloneDeep(key, cache), cloneDeep(value, cache));
    }
  }
  // 缓存值
  cache.set(obj, temp);
  return temp;
}

export default cloneDeep;
