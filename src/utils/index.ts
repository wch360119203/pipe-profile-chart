/** 生成随机数 */
export function randomRange(range: [number, number]) {
  if (range[1] < range[0]) {
    throw new Error('range[1]应大于range[0]')
  }
  const dValue = range[1] - range[0]
  return Math.round(Math.random() * dValue) + range[0]
}
