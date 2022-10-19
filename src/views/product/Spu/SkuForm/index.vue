<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input
          placeholder="重量（千克）"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="value.valueName"
                :value="`${attr.id}:${value.id}`"
                v-for="value in attr.attrValueList"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="sale in spuSaleAttrList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.saleIdAndValueId">
              <el-option
                :label="value.saleAttrValueName"
                :value="`${sale.id}:${value.id}`"
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuIamgeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60px" align="center">
          </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row }">
              <img style="width: 100px" v-lazy="row.imgUrl" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="small"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      //存储图片信息
      spuIamgeList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //存储平台属性
      attrInfoList: [],
      //收集sku信息
      skuInfo: {
        //第一类父组件提供的数据
        category3Id: '', //三级分类id
        spuId: '',
        tmId: '',
        //第二类 需要v-model收集
        price: 0, //价格
        skuName: '', //sku名字
        weight: '', //重量
        skuDesc: '', //规格描述
        //第三类 书写代码收集
        //收集图片（处理后）
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //默认图片
        skuDefaultImg: '',
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
      spu: {},
      //收集图片（未处理，缺少isDefault字段）
      imageList: [],
    }
  },
  methods: {
    //取消按钮
    cancel() {
      this.$emit('changeSceneSku', { scene: 0 })
      //清楚数据
      Object.assign(this._data, this.$options.data())
    },
    //获取初始数据，平台属性，销售属性，图片列表，父组件数据
    async getData(row, category1Id, category2Id) {
      const { id, category3Id, tmId } = row
      //收集父组件提供的数据
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = id
      this.skuInfo.tmId = tmId
      this.spu = row
      //向服务器获取数据
      let result = await Promise.all([
        this.$API.sku.reqSpuImageList(id),
        this.$API.sku.reqSpuSaleAttrList(id),
        this.$API.sku.reqAttrInfoList(category1Id, category2Id, category3Id),
      ])
      let a = result.some((item) => {
        return item.code == 200
      })
      if (a) {
        const [obj1, obj2, obj3] = result
        let list = obj1.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuIamgeList = list
        this.spuSaleAttrList = obj2.data
        this.attrInfoList = obj3.data
      }
      /* .then((res) => {
        let list = res[0].data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuIamgeList = list
        this.spuSaleAttrList = res[1].data
        this.attrInfoList = res[2].data
      }) */
    },
    //表格复选框事件  默认带参数
    handleSelectionChange(selection) {
      //获取用户选中图片信息（缺少默认图片标识字段：isDefault）
      this.imageList = selection
    },
    //设置默认图片（排他）
    changeDefault(row) {
      this.spuIamgeList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      //收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //保存按钮
    async save() {
      //整理参数
      const { attrInfoList, skuInfo, spuSaleAttrList } = this
      //平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      //整理图片数据
      skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })
      //数据发送至服务器
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({
          message: '保存成功',
          type: 'success',
        })
        this.$emit('changeSceneSku', { scene: 0 })
      }
    },
  },
}
</script>