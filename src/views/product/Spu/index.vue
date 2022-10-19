<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene == 0 ? false : true"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示spu列表 -->
      <div v-show="scene == 0">
        <div>
          <el-input
            placeholder="请输入内容"
            v-model="keyword"
            clearable
            @change="keywordChange"
            style="width: 200px; padding-right: 10px"
          >
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="!category3Id && keyword == ''"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <!-- 按钮 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="addSku(row)"
                title="添加sku"
                type="success"
                icon="el-icon-plus"
                size="mini"
              ></el-button>
              <el-button
                @click="updateSpu(row)"
                title="修改spu"
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                title="查看当前spu的所有sku"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                style="margin-left: 10px"
                :title="`是否删除${row.spuName}?`"
                @onConfirm="deleteAttrValue(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :ref="`popover-${$index}`"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeSceneSku="changeSceneSku"
      ></SkuForm>
    </el-card>
    <!-- 展示sku列表的对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      @closed="close"
    >
      <el-table
        :data="skuList"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img v-lazy="row.skuDefaultImg" style="width: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      keyword: '',
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      //存储spu列表
      records: [],
      total: 0,
      scene: 0, //0代表展示spu列表，1代表展示添加或修改spu，2添加sku
      visible: false,
      dialogTableVisible: false, //控制对话框显示
      spu: {}, //保存点击的spu信息
      skuList: [],
      loading: true,
    }
  },
  methods: {
    //自定义事件回调，获取三级选择id
    getCategoryId({ categoryId, level }) {
      switch (level) {
        case 1:
          this.category1Id = categoryId
          this.category2Id = ''
          this.category3Id = ''
          break
        case 2:
          this.category2Id = categoryId
          this.category3Id = ''
          break
        case 3:
          this.category3Id = categoryId
          this.getSpuList()
          break
        default:
          break
      }
    },
    //获取spu列表
    async getSpuList() {
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    //点击分页器按钮
    handleCurrentChange(page) {
      this.page = page
      this.change()
    },
    //单页条数改变
    handleSizeChange(sizes) {
      this.limit = sizes
      this.change()
    },
    //添加spu按钮
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //修改spu按钮
    updateSpu(row) {
      this.scene = 1
      //通知SpuForm
      this.$refs.spu.initSpuData(row)
    },
    //添加sku按钮
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(row, this.category1Id, this.category2Id)
    },
    //SkuForm的自定义事件
    changeSceneSku({ scene }) {
      this.scene = scene
    },
    //SpuForm的自定义事件
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag == '修改' || flag == '') {
        this.handleCurrentChange(this.page)
        this.getSpuList()
      } else {
        this.handleCurrentChange(1)
        this.getSpuList()
      }
    },
    //确认删除spu
    async deleteAttrValue(row) {
      const { id } = row
      let result = await this.$API.spu.reqDeleteSpu(id)
      if (result.code == 200) {
        this.$message({
          message: '删除成功',
          type: 'success',
        })
        this.handleCurrentChange(
          this.records.length > 1 ? this.page : this.page - 1
        )
        this.change()
      }
    },
    //查看sku列表
    async handler(row) {
      this.dialogTableVisible = true
      this.spu = row
      //获取sku列表数据
      let result = await this.$API.spu.reqSkuList(row.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    //对话框关闭之前
    close() {
      this.loading = true
      //清楚数据
      this.skuList = []
    },
    async searchData() {
      const arr = []
      let result = await this.$API.spu.reqSearchSpu(this.keyword)
      if (result.code == 200) {
        for (let i = 0; i < result.data.length; ) {
          arr.push(result.data.slice(i, (i += this.limit)))
        }
        this.records = arr[this.page - 1]
        this.total = result.data.length
      }
    },
    search() {
      if (this.keyword == '') {
        this.$message.error('输入不可空')
      } else {
        this.searchData()
      }
    },
    change() {
      if (this.keyword == '') {
        this.getSpuList()
      } else {
        this.searchData()
      }
    },
    keywordChange() {
      this.change()
    },
  },
}
</script>

<style>
.pagination {
  text-align: center;
}
</style>