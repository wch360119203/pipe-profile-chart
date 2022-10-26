import {
  type nodeData,
  type chartData,
  type linkData,
} from '../components/virtualData'

/** 生成随机数 */
export function randomRange(range: [number, number]) {
  if (range[1] < range[0]) {
    throw new Error('range[1]应大于range[0]')
  }
  const dValue = range[1] - range[0]
  return Math.random() * dValue + range[0]
}

/** 求出总和数据 */
export function getTotalParams(data: chartData) {
  let totalDistance = 0
  data.link.forEach(item => {
    totalDistance += item.distance
  })
  let maxAltitude: number | undefined
  let minAltitude: number | undefined
  data.node.forEach(item => {
    const itemMax = item.bottomAltitude + item.wallDepth
    maxAltitude = Math.max(itemMax, maxAltitude ?? itemMax)
    minAltitude = Math.min(
      item.bottomAltitude,
      minAltitude ?? item.bottomAltitude,
    )
  })
  return {totalDistance, maxAltitude, minAltitude}
}

export type nodeDataRes = nodeData & {x: number}
export type linkDataRes = Omit<
  linkData,
  'begAltitude' | 'endAltitude' | 'begDepth' | 'endDepth'
> & {
  leftx: number
  rightx: number
  leftAltitude: number
  rightAltitude: number
  leftDepth: number
  rightDepth: number
}
export function omit<
  T extends Record<string | number | symbol, any>,
  K extends keyof T,
>(input: T, omitKey: K[]): Omit<T, K> {
  const res: Record<string | number | symbol, unknown> = {}
  for (const key of Object.keys(input)) {
    if (omitKey.find(item => item === key)) {
      continue
    }
    res[key] = input[key]
  }
  return res as Omit<T, K>
}

export function formatChartData(data: chartData): {
  node: nodeDataRes[]
  link: linkDataRes[]
} {
  const nodeArr = data.node
  const linkArr = data.link
  const resNodeArr: nodeDataRes[] = []
  const resLinkArr: linkDataRes[] = []
  resNodeArr.push({...nodeArr[0], x: 0})
  for (let i = 0; i < linkArr.length; i++) {
    const linkEl = linkArr[i]
    const begIsLeft = linkEl.endNodeId === nodeArr[i + 1].relationId
    const tempLinkEl = omit(linkEl, [
      'begAltitude',
      'endAltitude',
      'begDepth',
      'endDepth',
    ])
    const endX = resNodeArr[i].x + linkEl.distance
    if (begIsLeft) {
      const resLinkEl: linkDataRes = Object.assign(tempLinkEl, {
        leftx: resNodeArr[i].x,
        rightx: endX,
        leftAltitude: linkEl.begAltitude,
        rightAltitude: linkEl.endAltitude,
        leftDepth: linkEl.begDepth,
        rightDepth: linkEl.endDepth,
      })
      resLinkArr.push(resLinkEl)
    } else {
      const resLinkEl: linkDataRes = Object.assign(tempLinkEl, {
        rightx: resNodeArr[i].x,
        leftx: endX,
        rightAltitude: linkEl.begAltitude,
        leftAltitude: linkEl.endAltitude,
        rightDepth: linkEl.begDepth,
        leftDepth: linkEl.endDepth,
      })
      resLinkArr.push(resLinkEl)
    }
    resNodeArr.push({...nodeArr[i + 1], x: endX})
  }
  return {node: resNodeArr, link: resLinkArr}
}
