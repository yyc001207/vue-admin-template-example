<template>
  <div>
    <el-table style="width: 100%" :data="skuList" border>
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column
        prop="prop"
        label="默认图片"
        align="center"
        width="width"
      >
        <template slot-scope="{ row }">
          <img v-lazy="row.skuDefaultImg" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量（KG）" width="100px">
      </el-table-column>
      <el-table-column prop="price" label="价格（元）" width="100px">
      </el-table-column>
      <!-- 按钮 -->
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架"
            v-if="row.isSale == 0"
            @click="Onsale(row)"
          ></el-button>
          <el-button
            v-else
            type="warning"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="sku信息"
            @click="getSku(row)"
          ></el-button>
          <el-button
            @click="deleteSku(row)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5"> 名称 </el-col>
        <el-col :span="16">{{ sku.skuName }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"> 描述 </el-col>
        <el-col :span="16">{{ sku.skuDesc }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"> 价格 </el-col>
        <el-col :span="16">{{ sku.price }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"> 平台属性 </el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin-right: 10px"
              type="success"
              v-for="attr in sku.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrName }}-{{ attr.valueName }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"> 图片 </el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in sku.skuImageList" :key="item.id">
              <img v-lazy="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template> 

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      total: 0,
      limit: 3,
      skuList: [],
      sku: {},
      drawer: false,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleSizeChange(sizes) {
      this.limit = sizes
      this.getData()
    },
    handleCurrentChange(pager) {
      this.page = pager
      this.getData()
    },
    //获取sku列表数据
    async getData() {
      let result = await this.$API.sku.reqSkuList(this.page, this.limit)
      if ((result.code = 200)) {
        this.skuList = result.data.records
        this.total = result.data.total
      }
    },
    //删除sku
    deleteSku(row) {
      this.$confirm(`确定删除${row.skuName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let result = await this.$API.sku.reqDeleteSku(row.id)
          if (result.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.handleCurrentChange(
              this.skuList.length > 1 ? this.page : this.page - 1
            )
          }
        })
        .catch(() => {})
    },
    //sku上架
    async Onsale(row) {
      let result = await this.$API.sku.reqOnSale(row.id)
      if (result.code == 200) {
        this.$message({
          message: '上架成功',
          type: 'success',
        })
        this.getData()
      }
    },
    //sku下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        this.$message({
          message: '下架成功',
          type: 'warning',
        })
        this.getData()
      }
    },
    //修改sku
    edit() {
      this.$message({
        message: '功能开发中...',
        type: 'info',
      })
    },
    //查看sku详情
    async getSku(row) {
      let result = await this.$API.sku.reqGetSku(row.id)
      if (result.code == 200) {
        this.sku = result.data
        this.drawer = true
      }
    },
  },
}
</script>
<style>
.el-carousel__item img {
  display: block;
  margin: auto;
  height: 100%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style scoped>
.pagination {
  text-align: center;
}
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}
/* 深度选择器
>>> 用于原生css
/deep/  用于less
::v-deep  用于scss
*/
div >>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>