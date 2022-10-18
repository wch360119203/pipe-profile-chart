import {randomRange} from '../utils'

interface nodeData {
  relationId: number
  wallDepth: number
  depth: number
  bottomAltitude: number
}

interface linkData {
  relationId: number
  startAltitude: number
  endAltitude: number
  linkHeight: number
  depth: number
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
      wallDepth: randomRange([6, 10]),
      depth: randomRange([1, 10]),
      bottomAltitude: randomRange([3, 5]),
    })
    if (i > 0) {
      virtualData.link.push({
        relationId: i,
        startAltitude:
          virtualData.node[i - 1].bottomAltitude + randomRange([0, 3]),
        endAltitude: virtualData.node[i].bottomAltitude + randomRange([0, 3]),
        linkHeight: 1.5,
        depth: randomRange([0, 1.5]),
        distance: randomRange([20, 100]),
      })
    }
  }
  return virtualData
}
export {produceData}
