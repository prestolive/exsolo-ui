import { groupBy } from 'lodash'

export interface TreeNode {
  label: string
  value: string
  children?: TreeNode[]
}
type ValueIteratee<T> = (value: T) => string
type TreeNodeCallbackfn<T> = (value: T) => TreeNode

function treeLevelProcess<T>(
  pre: string,
  nodes: string[],
  values: T[],
  result: TreeNode[],
  treeNodeCallbackfn: TreeNodeCallbackfn<T>
) {
  const node = nodes.shift()
  if (node == null) {
    return
  }
  const deep = pre + (pre.length > 0 ? ',' : '') + node
  let obj = result.find((row) => row.value == node)
  if (obj == null) {
    obj = {
      label: node,
      value: node,
      children: [],
    }
    result.push(obj)
  }
  if (nodes.length == 0) {
    obj.children = values.map((row) => treeNodeCallbackfn(row))
  } else {
    treeLevelProcess(
      deep,
      nodes,
      values,
      obj.children || [],
      treeNodeCallbackfn
    )
  }
}

/**
 * Convert the list data into tree data creation at any level
 * @param collection list data.
 * @param treeNodeCallbackfn Callback fn used to create leaf objects.
 * @param iteratees A fn array that returns the grouping keys for each level, from the root directory to the end level.
 * @returns
 */
export function anyTreeData<T>(
  collection: T[],
  treeNodeCallbackfn: TreeNodeCallbackfn<T>,
  ...iteratees: ValueIteratee<T>[]
): TreeNode[] {
  //1.Flatten the end level node groups according to rules
  const flatGroup = groupBy(collection, (row) => {
    return iteratees.map((element) => element(row)).join(',')
  })
  //2.Then just use the first piece of data in the group to create grandpa and dad
  const result: TreeNode[] = []
  for (const key in flatGroup) {
    const nodes = key.split(',')
    treeLevelProcess('', nodes, flatGroup[key], result, treeNodeCallbackfn)
  }
  return result
}
