<template>
  <div>
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <!-- 头部左侧 -->
        <el-tabs class="tab" v-model="activeName" @tab-click="changeBar">
          <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
          <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧 -->
        <div class="right">
          <a @click="setDate">今日</a>
          <a @click="setWeek">本周</a>
          <a @click="setMonth">本月</a>
          <a @click="setYear">本年</a>
          <el-date-picker
            class="date"
            size="small"
            v-model="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 内容区 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 柱状图容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <!-- 排名 -->
          <el-col :span="6">
            <h3>门店{{ activeName }}排名</h3>
            <ul v-if="activeName == '销售额'">
              <li v-for="(order, index) in listState.orderRank" :key="index">
                <span class="rindex">{{ order.no }}</span>
                <span>{{ order.name }}</span>
                <span class="rvalue">{{ order.money }}</span>
              </li>
            </ul>
            <ul v-else>
              <li v-for="(user, index) in listState.userRank" :key="index">
                <span class="rindex">{{ user.no }}</span>
                <span>{{ user.name }}</span>
                <span class="rvalue">{{ user.money }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
//引入dayjs
var dayjs = require('dayjs')
export default {
  name: 'Sale',
  data() {
    return {
      date: [],
      activeName: '销售额',
    }
  },
  computed: {
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  mounted() {
    this.myCharts = this.$echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: this.activeName + '趋势',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: this.listState.userFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.listState.userFullYear,
        },
      ],
    })
  },
  methods: {
    //柱状图切换
    changeBar() {
      this.myCharts.setOption({
        title: {
          text: this.activeName + '趋势',
        },
        xAxis: {
          data:
            this.activeName == '销售额'
              ? this.listState.userFullYearAxis
              : this.listState.orderFullYearAxis,
        },
        series: [
          {
            data:
              this.activeName == '销售额'
                ? this.listState.userFullYear
                : this.listState.orderFullYear,
          },
        ],
      })
    },
    //今日
    setDate() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    //本周
    setWeek() {
      const start = dayjs().day(0).format('YYYY-MM-DD')
      const end = dayjs().day(6).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    },
  },
  watch: {
    listState() {
      this.myCharts.setOption({
        xAxis: [
          {
            data: this.listState.userFullYearAxis,
          },
        ],
        series: [
          {
            data: this.listState.userFullYear,
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
.box-card {
  margin-top: 10px;
}
div >>> .el-card__header {
  border-bottom: none;
}
.clearfix {
  position: relative;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right a {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>