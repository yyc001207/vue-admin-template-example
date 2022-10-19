<template>
  <div>
    <!-- 饼图 -->
    <div class="pie">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card>
            <div slot="header" class="pie-header">角色活动祈愿</div>
            <div>
              <pieCharts :data="role"></pieCharts>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header" class="pie-header">武器活动祈愿</div>
            <div>
              <pieCharts :data="weapons"></pieCharts>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div slot="header" class="pie-header">常驻祈愿</div>
            <div>
              <pieCharts :data="resident"></pieCharts>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 折线图 -->
    <div class="line">
      <lineCharts></lineCharts>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pieCharts from './pieCharts'
import lineCharts from './lineCharts'
export default {
  name: 'Dashboard',
  computed: {
    //获取vuex中的数据
    ...mapGetters(['name', 'role', 'weapons', 'resident']),
  },
  components: { pieCharts, lineCharts },
  mounted() {
    //派发action获取数据
    this.$store.dispatch('getGenshinData')
  },
}
</script>

<style  scoped>
.pie {
  margin: 5px;
}
.pie-header {
  text-align: center;
}
.line {
  margin: 5px;
}
</style>
