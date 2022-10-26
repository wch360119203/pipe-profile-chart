<template>
  <div class="container" ref="container"></div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {
  create,
  line,
  scaleLinear,
  axisBottom,
  axisLeft,
  zoom,
  ZoomTransform,
} from 'd3'
import {v4 as uuidv4} from 'uuid'
import {produceData} from './virtualData'
import {formatChartData, getTotalParams, nodeDataRes} from '../utils'

const container = ref<HTMLElement>()
const svgRoot = create('svg')
const margin: Record<'right' | 'top' | 'left' | 'bottom', number> = {
  left: 40,
  right: 20,
  top: 15,
  bottom: 30,
}
svgRoot.attr('preserveAspectRatio', 'none')
onMounted(() => {
  const myline = line()
  myline.x(() => 1)
  container.value!.appendChild(svgRoot.node()!)
  const {clientWidth, clientHeight} = container.value!
  // 设置边框
  svgRoot
    .attr('width', clientWidth)
    .attr('height', clientHeight)
    .attr('viewBox', [0, 0, clientWidth, clientHeight])
  // 模拟数据
  const data = produceData()
  const totalDistance = getTotalParams(data)
  // x轴
  const gx = svgRoot.append('g').call(g => {
    g.attr('transform', `translate(0,${clientHeight - margin.bottom})`)
  })
  const xScale = scaleLinear()
    .domain([0, totalDistance.totalDistance])
    .range([margin.left, clientWidth - margin.right])
    .nice()
  const xAxis = axisBottom(xScale)
  gx.call(xAxis)
  // y轴
  const gy = svgRoot
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
  const [minY, maxY] = [
    totalDistance.minAltitude ?? 0,
    totalDistance.maxAltitude ?? 0,
  ]
  const yScale = scaleLinear()
    .domain([minY, maxY].reverse())
    .range([margin.top, clientHeight - margin.bottom])
    .nice()
  const yAxis = axisLeft(yScale)
  gy.call(yAxis)
  const clipPathId = uuidv4()
  const clipPath = svgRoot
    .append('defs')
    .append('clipPath')
    .attr('id', clipPathId)
  clipPath
    .append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', clientWidth - margin.left - margin.right)
    .attr('height', clientHeight - margin.top - margin.bottom)
  const dataG = svgRoot.append('g').attr('clip-path', `url(#${clipPathId})`)
  const formatData = formatChartData(data)
  const nodeG = dataG.append('g')
  nodeG
    .selectAll('g')
    .data(formatData.node, d => (d as nodeDataRes).relationId)
    .join(enter => {
      const selection = enter.append('g')
      selection
        .append('rect')
        .attr('class', 'nodeItem')
        .attr('width', 20)
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.bottomAltitude + d.wallDepth))
        .attr('height', d => yScale(0) - yScale(d.wallDepth))
        .attr('transform', 'translate(-10,0)')

      return selection
    })
  // 缩放
  const zoomHandle = zoom<SVGSVGElement, undefined>()
    .extent([
      [0, maxY],
      [totalDistance.totalDistance, minY],
    ])
    .filter(event => {
      event.preventDefault()
      return (!event.ctrlKey || event.type === 'wheel') && !event.button
    })
    .on('zoom', ({transform}: {transform: ZoomTransform}) => {
      dataG
        .selectAll<SVGRectElement, nodeDataRes>('.nodeItem')
        .attr('x', t => `${xScale(t.x) * transform.k + transform.x}`)
      // .attr('width', `${20 * transform.k > 20 ? 20 : 20 * transform.k}`)
      gx.call(xAxis.scale(transform.rescaleX(xScale)))
    })
  svgRoot.call(zoomHandle)
})
</script>
<style lang="scss" scoped>
.container {
  width: 1000px;
  height: 500px;
  background-color: antiquewhite;
}
</style>
