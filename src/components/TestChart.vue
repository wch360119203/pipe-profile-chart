<template>
  <div class="container" ref="container"></div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {create, line, scaleLinear, axisBottom, axisLeft, zoom, symbol} from 'd3'
import {v4 as uuidv4} from 'uuid'
import {produceData} from './virtualData'
import {getTotalParams} from '../utils'

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
  const gx = svgRoot.append('g').call((g, x) => {
    g.attr('transform', `translate(0,${clientHeight - margin.bottom})`)
  })
  const xScale = scaleLinear()
    .domain([0, totalDistance.totalDistance])
    .range([margin.left, clientWidth - margin.right])
    .nice()
  const xAxis = axisBottom(xScale)
  gx.call(xAxis)
  // y轴
  const gy = svgRoot.append('g').call(g => {
    g.attr('transform', `translate(${margin.left},0)`)
  })
  const yScale = scaleLinear()
    .domain(
      [
        totalDistance.minAltitude ?? 0,
        totalDistance.maxAltitude ?? 0,
      ].reverse(),
    )
    .range([margin.top, clientHeight - margin.bottom])
    .nice()
  const yAxis = axisLeft(yScale)
  gy.call(yAxis)
  // 缩放
  const zoomHandle = zoom()
    .extent([
      [margin.left, 0],
      [clientWidth - margin.right, clientHeight],
    ])
    .translateExtent([
      [margin.left, -Infinity],
      [clientWidth - margin.right, Infinity],
    ])
    .on('zoom', e => {
      const {transform} = e
      console.log(transform)
    })

  const clipPathId = uuidv4()
  const clipPath = svgRoot.append('clipPath').attr('id', clipPathId)
  clipPath
    .append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', clientWidth - margin.left - margin.right)
    .attr('height', clientHeight - margin.top - margin.bottom)
  const dataG = svgRoot.append('g').attr('clip-path', `url(#${clipPathId})`)
  dataG
    .append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', 'red')
    .attr('transform', 'translate(-10,-20)')
    .attr('x', xScale(0))
    .attr('y', yScale(4))
})
</script>
<style lang="scss" scoped>
.container {
  width: 1000px;
  height: 500px;
  background-color: antiquewhite;
}
</style>
