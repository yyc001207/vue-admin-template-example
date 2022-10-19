<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts
            :lineData="userData"
            :category="`搜索用户数`"
            :num="user"
          ></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts
            :lineData="countData"
            :category="`周涨幅`"
            :num="count"
          ></LineCharts>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="search" style="width: 100%" border>
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜搜关键字" width="180" prop="word">
        </el-table-column>
        <el-table-column label="用户数" sortable prop="user"> </el-table-column>
        <el-table-column label="周涨幅" sortable prop="count">
        </el-table-column>
      </el-table>
      <!-- 分页器 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next"
        :total="length"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './lineCharts'
export default {
  name: '',
  data() {
    return {
      page: 1, //当前页
      limit: 3, //当前页条数
      length: 0, //存储数据条数(wacth中有解释)
      search: [], //请求的数组分割后，存储对应页数的数据 展示数组
      userData: [],
      countData: [],
      user: 0,
      count: 0,
    }
  },
  props: ['searchWord'],
  components: {
    LineCharts,
  },
  watch: {
    searchWord() {
      //数据条数不直接使用this.searchWord.length，是因为searchWord是由父组件的父组件挂载时发请求，再由父组件通过props传递
      // 根据子与父的生命周期，子组件挂载后，父组件才会挂载，而父组件挂载前，子组件拥有searchWord且数据类型为undefind
      // undefind.length没有意义，因此会报错
      this.length = this.searchWord.length
      this.getData()
      this.lineData()
    },
  },
  methods: {
    //处理请求数据 展示在表格中的
    getData() {
      //保存所有分割后的数组
      const list = []
      // 将原数组searchWord分割成n个长度为limit的新数组
      for (let i = 0; i < this.length; ) {
        list.push(this.searchWord.slice(i, (i += this.limit)))
      }
      // 根据当前的页码保存对应的展示数据
      this.search = list[this.page - 1]
    },
    //页码发生改变
    handleCurrentChange(page) {
      this.page = page
      this.getData()
    },
    //当前页数据条数发生改变
    handleSizeChange(limit) {
      this.limit = limit
      this.getData()
    },
    lineData() {
      this.searchWord.forEach((item) => {
        this.userData.push(item.user)
        this.countData.push(item.count)
        this.user += item.user
        this.count += item.count
      })
    },
  },
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 5px 0px;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.pagination {
  float: right;
}
</style>
