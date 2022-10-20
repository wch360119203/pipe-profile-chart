import {type chartData} from '../components/virtualData'

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
