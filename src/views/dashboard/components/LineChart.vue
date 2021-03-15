<template>
  <div :class="className" :style="{ width, height }"></div>
</template>
<script>
// 引入echarts
import echarts from 'echarts'
// 引入主体样式
require('echarts/theme/macarons') // echarts theme
// 响应式
import resize from './mixins/resize'
export default {
  name: 'LineChart',
  mixins: [resize],
  props: {
    // 宽度
    width: {
      type: String,
      default: '100%',
    },
    // 高度
    height: {
      type: String,
      default: '350px',
    },
    className:{
      type:String,
      default:''
    },
    // 配置选项对象
    chartData: {
      type: Object,
      required: true, // 必须的
    },
    // y轴的名称
    yTittle: {
      type: String,
      required: true, // 必须的
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true, // 深度监视
      handler(val) {
        this.setOptions(val)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化实例对象
      this.initChart()
    })
  },
  methods: {
    initChart() {
      // 初始化echart实例对象,$el-当前组件的根标签
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    // 配置选项数据
    setOptions({ expectedData = [], actualData = [] }) {
      this.chart.setOption({
        // 包含主标题和副标题。
        title: {
          text: '商品销量',
          subtext: '本年度销量',
        },
        // 提示框组件
        tooltip: {
          // 提示信息触发时机
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        // 图例组件
        legend: {
          data: ['期望', '实际'],
        },
        // x轴
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        // y轴
        yAxis: {
          name: this.yTittle,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        // 网格
        grid: {
          left: 20,
          top: 40,
          right: 20,
          bottom: 40,
        },
        series: [
          {
            name: '期望',
            type: 'line',
            data: expectedData,
            // 线的颜色
            itemStyle: {
              color: 'green',
            },
            // 阴影的颜色
            areaStyle: {
              color: 'pink',
            },
          },
          {
            name: '实际',
            type: 'line',
            data: actualData,
          },
        ],
      })
    },
  },
}
</script>
