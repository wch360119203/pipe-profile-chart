<template>
  <div class="container" ref="container"></div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {create, line} from 'd3'
import {produceData} from './virtualData'

const container = ref<HTMLElement>()
const svgRoot = create('svg')
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
})
// x轴
const gx = svgRoot.append('g')
// y轴
const gy = svgRoot.append('g')
svgRoot
  .append('rect')
  .attr('width', 20)
  .attr('height', 20)
  .attr('fill', 'red')
  .attr('x', 0)
  .attr('y', 0)
svgRoot
  .append('rect')
  .attr('width', 20)
  .attr('height', 20)
  .attr('fill', 'red')
  .attr('x', 200)
  .attr('y', 0)
console.log(produceData())
</script>
<style lang="scss" scoped>
.container {
  width: 1000px;
  height: 500px;
  background-color: antiquewhite;
}
</style>
