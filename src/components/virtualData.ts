import {randomRange} from '../utils'

export interface nodeData {
  relationId: number
  wallDepth: number
  depth: number
  bottomAltitude: number
}

export interface linkData {
  relationId: number
  begNodeId: number
  endNodeId: number
  begAltitude: number
  endAltitude: number
  begDepth: number
  endDepth: number
  linkHeight: number
  distance: number
}

export interface chartData {
  node: nodeData[]
  link: linkData[]
}

/** 生成随机测试数据 */
function produceData(count = 10) {
  const virtualData: chartData = {
    node: [],
    link: [],
  }
  for (let i = 0; i < count; i++) {
    virtualData.node.push({
      relationId: i,
      wallDepth: randomRange([3, 5]),
      depth: randomRange([1, 5]),
      bottomAltitude: randomRange([3, 10]),
    })
    if (i > 0) {
      virtualData.link.push({
        relationId: i,
        begNodeId: i - 1,
        endNodeId: i,
        begAltitude:
          virtualData.node[i - 1].bottomAltitude + randomRange([0, 3]),
        endAltitude: virtualData.node[i].bottomAltitude + randomRange([0, 3]),
        linkHeight: 1.5,
        begDepth: randomRange([0, 1.5]),
        endDepth: randomRange([0, 1.5]),
        distance: randomRange([20, 100]),
      })
    }
  }
  return virtualData
}
export {produceData}
