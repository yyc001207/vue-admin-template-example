<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="请输入Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="请输入Spu描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <!-- 照片墙 -->
      <el-form-item label="Spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" v-lazy="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 销售属性选择 -->
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attr"
        >
          <el-option
            :label="unsale.name"
            :value="`${unsale.id}:${unsale.name}`"
            v-for="unsale in unSelectSaleAttr"
            :key="unsale.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attr"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 销售属性列表 -->
        <el-table
          border
          style="width: 100%; margin-top: 10px"
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="200px">
          </el-table-column>
          <!-- 销售属性值列表 -->
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag, row)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 销售属性输入状态切换 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                icon="el-icon-plus"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="prop" label="操作" width="80px">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存 取消 -->
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      //收集spu
      spu: {
        category3Id: 0, //三级分类id
        description: '', //描述
        tmId: '',
        spuName: '', //spu名称
        spuImageList: [
          //收集spu图片
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          //spu的售卖属性
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      imageList: [], //存储spu图片
      saleList: [], //存储销售属性
      attr: '', //收集未选择的售卖属性id
    }
  },
  computed: {
    //计算未选择的销售属性
    unSelectSaleAttr() {
      return this.saleList.filter((item) => {
        return this.spu.spuSaleAttrList.every((otem) => {
          return item.name != otem.saleAttrName
        })
      })
    },
  },
  methods: {
    //删除图片
    handleRemove(file, fileList) {
      this.imageList = fileList
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //图片上传成功
    handleSuccess(response, file, fileList) {
      this.imageList = fileList
    },
    //初始化修改点击修改按钮进入SpuForm的数据
    async initSpuData(row) {
      let result = await Promise.all([
        this.$API.spu.reqSpu(row.id),
        this.$API.spu.reqTradeMarkList(),
        this.$API.spu.reqSpuImageList(row.id),
        this.$API.spu.reqBaseSaleAttrList(),
      ])
      if (
        result.some((item) => {
          return item.code == 200
        })
      ) {
        const [spuObj, tradeMarkObj, imageObj, saleObj] = result
        //获取spu信息
        this.spu = spuObj.data
        //获取品牌信息
        this.tradeMarkList = tradeMarkObj.data
        //获取spu图片信息
        let listArr = imageObj.data
        listArr.forEach((element) => {
          element.name = element.imgName
          element.url = element.imgUrl
        })
        this.imageList = listArr
        //获取平台销售属性
        this.saleList = saleObj.data
      }
    },
    //添加销售属性按钮
    addSaleAttr() {
      //分割字符串
      const [baseSaleAttrId, saleAttrName] = this.attr.split(':')
      //向spu对象的spuSaleAttrList添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      }
      this.spu.spuSaleAttrList.push(newSaleAttr)
    },
    //点击删除
    handleClose(tag, row) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag), 1)
    },
    //自动获取焦点
    autoFocus() {
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //点击添加销售属性按钮
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.autoFocus()
    },
    //input框失焦或回车回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      //判断属性值是否重复
      let result = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue
      })
      //判断输入框是否为空
      if (inputValue.trim() == '') {
        this.$message({ message: '请输入属性值', type: 'warning' })
      }
      //判断是否重复
      else if (!result) {
        this.$message.error('重复的属性值')
        this.autoFocus()
        return
      }
      //保存输入框
      else {
        let newAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
        row.spuSaleAttrValueList.push(newAttrValue)
      }
      //输入框状态改变
      row.inputVisible = false
    },
    //点击保存按钮
    async save() {
      //整理参数
      //图片列表添加imgUrl和imgName字段
      this.spu.spuImageList = this.imageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        }
      })
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code == 200) {
        this.$message({
          message: '保存成功',
          type: 'success',
        })
        //通知父组件回到默认页面
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? '修改' : '添加',
        })
      }
    },
    //点击添加spu按钮
    async addSpuData(category3Id) {
      Object.assign(this._data, this.$options.data())
      this.spu.category3Id = category3Id
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      //获取平台销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleList = saleResult.data
      }
    },
    //点击取消按钮
    cancle() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      //清理数据
      Object.assign(this._data, this.$options.data())
    },
  },
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>