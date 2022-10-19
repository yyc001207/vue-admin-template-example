<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <!-- 选择按钮组 -->
        <el-radio-group v-model="value" @change="change">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Category',
  props: ['saleRank'],
  data() {
    return {
      value: '全部渠道',
      datas: [], //展示数据
    }
  },
  watch: {
    saleRank() {
      this.getData()
      this.draw()
    },
  },
  methods: {
    //作图方法
    draw() {
      //饼图
      let mychart = this.$echarts.init(this.$refs.charts)
      mychart.setOption({
        title: {
          text: '家用电器',
          subtext: this.datas[0].value,
          left: 'center',
          top: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: true,
              position: 'outsize',
            },
            labelLine: {
              show: true,
            },
            data: this.datas,
          },
        ],
      })
      //绑定事件
      mychart.on('mouseover', (params) => {
        //获取鼠标移上去那条数据
        const { name, value } = params.data
        //重新设置标题
        mychart.setOption({
          title: {
            text: name,
            subtext: value,
          },
        })
      })
    },
    //数据处理
    getData() {
      //重置数据
      this.datas = []
      //通过for循环将服务器数据的数据结构转化成我们需要的结构
      for (let i = 0; i < this.saleRank.online.name.length; i++) {
        var item = {
          value: 0,
          name: this.saleRank.online.name[i],
        }
        if (this.value == '全部渠道') {
          item.value =
            this.saleRank.online.value[i] + this.saleRank.shop.value[i]
        } else if (this.value == '线上') {
          item.value = this.saleRank.online.value[i]
        } else {
          item.value = this.saleRank.shop.value[i]
        }
        this.datas.push(item)
      }
    },
    // 选择按钮绑定值变化时触发的回调函数
    change() {
      this.getData()
      this.draw()
    },
  },
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
