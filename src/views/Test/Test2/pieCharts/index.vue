<template>
  <div>
    <!-- 图形容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script>
export default {
  name: 'pieCharts',
  data() {
    return {
      list: [], //存储数组
      rFive: 0, //存储5星人物数量
      wFive: 0, //存储5星武器数量
      rFour: 0, //存储4星人物数量
      wFour: 0, //存储4星武器数量
      three: 0, //存储3星武器数量
    }
  },
  props: ['data'], //获取父组件数据
  methods: {
    //创建图形方法
    draw() {
      this.myChart = this.$echarts.init(this.$refs.charts)
      this.myChart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: this.list,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      })
    },
    //计算父组件传送数据
    getData() {
      //遍历数组
      this.data.forEach((item) => {
        //判断道具星级
        switch (item.rank_type) {
          case '3':
            this.three++
            break
          case '4':
            //判断道具类型
            if (item.item_type == '武器') {
              this.wFour++
            } else {
              this.rFour++
            }
            break
          case '5':
            if (item.item_type == '武器') {
              this.wFive++
            } else {
              this.rFive++
            }
            break
          default:
            break
        }
      })
      //根据是否含有特殊类型区分图形
      if (this.wFive == 0) {
        this.list = [
          { value: this.rFive, name: '5星角色' },
          { value: this.rFour, name: '4星角色' },
          { value: this.wFour, name: '4星武器' },
          { value: this.three, name: '3星武器' },
        ]
      } else if (this.rFive == 0) {
        this.list = [
          { value: this.wFive, name: '5星武器' },
          { value: this.rFour, name: '4星角色' },
          { value: this.wFour, name: '4星武器' },
          { value: this.three, name: '3星武器' },
        ]
      } else {
        this.list = [
          { value: this.rFive, name: '5星角色' },
          { value: this.wFive, name: '5星武器' },
          { value: this.rFour, name: '4星角色' },
          { value: this.wFour, name: '4星武器' },
          { value: this.three, name: '3星武器' },
        ]
      }
    },
  },
  watch: {
    //监听数据data，data是由父组件发请求后传递过来的，在组件挂载时data为空，当请求完成后data发生变化，调用数据计算和画图方法
    data() {
      this.getData()
      this.draw()
    },
  },
}
</script>

<style>
.charts {
  width: 100%;
  height: 300px;
}
</style>