<template>
  <div>
    <el-card>
      <div>
        <el-tabs v-model="activeName" @tab-click="change">
          <el-tab-pane label="角色活动祈愿" name="first"></el-tab-pane>
          <el-tab-pane label="武器活动祈愿" name="second"></el-tab-pane>
          <el-tab-pane label="常驻祈愿" name="thrid"></el-tab-pane>
        </el-tabs>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 图形容器 -->
            <div class="chart" ref="chart"></div>
          </el-col>
          <el-col :span="6">
            <el-card style="width: 100%">
              <div>
                <div>
                  一共 {{ num.length }} 抽已累计{{ noWinning }}抽未出5星
                </div>
                <div>
                  5星：{{ name.length }} [{{
                    ((name.length / num.length) * 100).toFixed(2)
                  }}%]
                </div>
                <div>
                  5星历史记录：
                  <span
                    v-for="(n, index) in nameAndNum"
                    :key="index"
                    style="margin: 0 5px"
                  >
                    {{ n }}
                  </span>
                </div>
                <div>5星平均出货次数：{{ newNum }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'lineCharts',
  computed: {
    ...mapGetters(['role', 'weapons', 'resident']),
    newNum() {
      return (
        (eval(this.number.join('+')) - this.number[this.number.length - 1]) /
        (this.number.length - 1)
      ).toFixed(2)
    },
  },
  data() {
    return {
      activeName: 'first', //标签页切换标识
      name: [], //x轴
      number: [], //y轴对应数据
      num: [], //存储不同数据的中间变量
      nameAndNum: [],
      noWinning: 0, //存储多少次未中
    }
  },
  methods: {
    //画图方法
    draw() {
      // 解决多次创建myChart引起的警告，节约资源
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.myChart = this.$echarts.init(this.$refs.chart)
      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: this.name,
          axisLabel: {
            interval: 0, //显示x轴上的所有数据
            rotate: -38, //设置x轴文本的倾斜
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.number,
            type: 'line',
            label: {
              show: true,
              //在折线上显示数字
              formatter: function (data) {
                return data.value
              },
            },
          },
        ],
      })
    },
    //计算数据
    getData(num) {
      let index = 0 //计数变量
      this.number = [] //初始化x轴
      this.name = [] //初始化y轴值
      this.nameAndNum = []
      //遍历数组
      num.forEach((element) => {
        //如果星级rank_type不是5则，index加1
        if (element.rank_type != '5') {
          index++
          if (element === num[num.length - 1]) {
            this.noWinning = index
            this.number.push(this.noWinning)
          }
        } else if (element.rank_type == '5') {
          //当星级rank_type等于5，则index先加1，并将index值保存在y轴数组中，将数组中当前索引的对象的name值保存在x轴数组中
          index++
          this.number.push(index)
          this.name.push(element.name)
          this.nameAndNum.push(element.name + '[' + index + ']')
          //重置index
          index = 0
        }
      })
      this.name.push('未知')
    },
    //切换标签页的回调
    change() {
      //初始化num
      this.num = []
      //通过activeName的值，赋予num不同的值
      if (this.activeName == 'first') {
        this.num = this.role
      } else if (this.activeName == 'second') {
        this.num = this.weapons
      } else {
        this.num = this.resident
      }
      //调用getData方法，并将num存储数据传入
      this.getData(this.num)
      //调用draw生成图形
      this.draw()
    },
  },
  watch: {
    //设置初始化的图形，当vuex获得数据前role为空，获得后role改变，调用change方法获得默认图形
    role() {
      this.change()
    },
  },
}
</script>

<style>
.chart {
  height: 300px;
  width: 100%;
}
</style>