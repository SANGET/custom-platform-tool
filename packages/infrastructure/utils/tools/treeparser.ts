interface IConfig {
	id?: string
	pid?: string
  children?: string

  mapping?: object
}

/**
 * constrcut 方法
 * 根据提供的 id, pid 和 children 将一个个节点构建成一棵或者多棵树
 * @param nodes 节点对象
 * @param config 配置对象
 */
export function construct(nodes: object[], config?: IConfig) {
	const id = config && config.id || 'id'
	const pid = config && config.pid || 'pid'
  const children = config && config.children || 'children'
  const mapping = config && config.mapping || {}

	const idMap = {}
	const jsonTree: IConfig[] = []

	nodes.forEach((node) => { node && (idMap[node[id]] = node) })
	nodes.forEach((node) => {
		if (node) {
      Object.keys(mapping).map(item=>{
        node[item] = node[mapping[item]]
      })
			let parent = idMap[node[pid]]
			if (parent) {
				!parent[children] && (parent[children] = [])
				parent[children].push(node)
			} else {
				jsonTree.push(node)
			}
		}
	})

	return jsonTree
}

/**
 * destruct 方法
 * 根据配置的 id, pid 和 children 把解构化的树型对象拆解为一个个节点
 * @param forest 单个或者多个树型对象
 * @param config 配置
 */
export function destruct(forest: object[] | object, config?: IConfig) {
	const id = config && config.id || 'id'
	const pid = config && config.pid || 'pid'
	const children = config && config.children || 'children'

	function flatTree(tree: object) {
		const queue = [tree]
		const result = []
		while (queue.length) {
			let currentNode: Object = queue.shift() || {}
			if (currentNode.hasOwnProperty(id)) {
				if (!currentNode.hasOwnProperty(pid)) {
					currentNode = { ...currentNode, [pid]: null }
				}
				if (currentNode[children]) {
					currentNode[children].forEach((v) => { v && queue.push({ ...v, [pid]: currentNode[id] }) })
        }
        // @ts-ignore
				result.push(currentNode)
				delete currentNode[children]
			} else {
				throw new Error('you need to specify the [id] of the json tree')
			}
		}
		return result
	}

	if (Array.isArray(forest)) {
		return forest.map((v) => flatTree(v)).reduce((pre, cur) => pre.concat(cur))
	} else {
		return flatTree(forest)
	}
}

export default {
	construct,
	destruct,
}
