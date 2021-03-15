<template>
  <el-form v-show="visible" label-width="100px">
    <!--SPU名称-->
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <!--品牌-->
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="(tm, index) in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!--SPU描述-->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入描述信息"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <!--SPU图片-->
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        multiple
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <!--销售属性-->
    <el-form-item label="销售属性">
      <el-select
        :placeholder="`${
          unSelectedSaleAttrList.length > 0
            ? `还有${unSelectedSaleAttrList.length}个可选择`
            : '没有了'
        }`"
        v-model="attrIdAttrName"
      >
        <el-option
          :label="attr.name"
          :value="attr.id + '_' + attr.name"
          v-for="(attr, index) in unSelectedSaleAttrList"
          :key="attr.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrIdAttrName"
        @click="addAttr"
        >添加销售属性</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-table
        :data="spuInfo.spuSaleAttrList"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column type="index" width="80" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              :key="value.id"
              v-for="(value, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="handleClose(row.spuSaleAttrValueList, index)"
            >
              {{ value.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ 添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <HintButton
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteAttr($index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'SpuForm',
  props: ['visible'],
  data() {
    return {
      spuId: '', // spuInfo对象的id值
      spuInfo: {
        spuName: '', // spu的名字
        description: '', // 描述信息
        category3Id: '', // 三级分类的id
        tmId: '', // 品牌的id
        spuSaleAttrList: [], // 销售属性数组
        spuImageList: [], // 图片数组数据
      }, // 用来存储当前的spuInfo对象的数据
      trademarkList: [], // 用来存储所有的品牌信息数据数组
      saleAttrList: [], // 用来存储所有销售属性的数组数据
      spuImageList: [], // 用来存储spu相关的所有的图片数组数据
      attrIdAttrName: '', // 用来存储选中的某个销售属性的id和选中的某个销售属性的名字 '3_类别'

      dialogImageUrl: '', // 用来显示预览图片的地址的
      dialogVisible: false, // 是否要预览

      // inputVisible: false,  // 编辑或者是查看模式的标识
      // inputValue: '', // 收集文本框中输入的数据
    }
  },
  computed: {
    unSelectedSaleAttrList() {
      //  saleAttrList 数组---所有的销售属性  spuInfo.spuSaleAttrList 数组  有的
      const {
        saleAttrList,
        spuInfo: { spuSaleAttrList },
      } = this
      // 过滤
      return saleAttrList.filter(
        (sa) => !spuSaleAttrList.some((ssa) => ssa.saleAttrName === sa.name)
      )
    },
  },
  methods: {
    // 取消
    back() {
      // 不行,子级组件中不建议(不能)直接修改父级组件中的数据,
      // this.visible = false
      this.$emit('update:visible', false)
    },
    // 删除某些图片的回调函数
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    // 预览图片使用的
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 如果上传成功了,则可以获取上传图片成功的一个地址，该地址可以从res中取出
    handleAvatarSuccess(res, file, fileList) {
      this.spuImageList = fileList
    },
    // 限制图片的类型及大小
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg' ||file.type === 'image/png'
      // 设置上传的图片的类型
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      // 限制图片的格式类型
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      // 限制图片的大小
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 该数组中修改spuInfo数据的初始化方法
    initUpdateData(spuId) {
      this.spuId = spuId
      // 获取spuInfo对象的数据
      this.getSpuInfo()
      // 获取所有的品牌信息数据
      this.getTrademarkList()
      // 获取所有的销售属性数据
      this.getSpuSaleAttrList()
      // 获取所有的图片列表数据
      this.getSpuImageList()
    },
    // 获取spuInfo对象的数据
    async getSpuInfo() {
      // 调用接口
      const result = await this.$API.spu.getSpuInfoById(this.spuId)
      this.spuInfo = result.data
    },
    // 获取所有的品牌信息数据
    async getTrademarkList() {
      const result = await this.$API.trademark.getTrademarkList()
      this.trademarkList = result.data
    },
    // 获取所有的销售属性数据
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList()
      this.saleAttrList = result.data
    },
    // 获取所有的图片列表数据
    async getSpuImageList() {
      const result = await this.$API.sku.getspuImagList(this.spuId)
      // 获取图片数组数据
      const spuImageList = result.data
      // 是把每个图片对象中添加一个name和url属性,目的是展示图片
      spuImageList.forEach((item) => {
        item.name = item.imgName
        item.url = item.imgUrl
      })
      // 保存图片数组数据
      this.spuImageList = spuImageList
    },

    // 销售属性值的列表操作的方法
    // 点击某个属性值,进行移除操作
    handleClose(valueList, index) {
      valueList.splice(index, 1)
    },
    // 编辑模式
    showInput(attr) {
      // 判断attr.edit
      if (!attr.hasOwnProperty('edit')) {
        this.$set(attr, 'edit', true)
      } else {
        // 此时有
        attr.edit = true
      }
      this.$nextTick(() => {
        // 个别同学用不了
        this.$refs.saveTagInput.focus()
      })
    },
    // 查看模式
    handleInputConfirm(attr) {
      // 获取当前文本框中输入的内容
      const saleAttrValueName = attr.saleAttrValueName
      if (saleAttrValueName) {
        // 判断当前输入的数据和销售属性值数组中的属性值名字是否相同
        const isRepeat = attr.spuSaleAttrValueList.some(
          (value) => value.saleAttrValueName === saleAttrValueName
        )
        if (!isRepeat) {
          // 不相同
          attr.spuSaleAttrValueList.push({
            // 不经意间发现了一个bug,直接改了
            baseSaleAttrId: attr.baseSaleAttrId,
            saleAttrValueName,
          })
        } else {
          // 相同
          this.$message.warning('不能输入重复内容')
        }
      }
      // 查看模式
      attr.edit = false
      attr.saleAttrValueName = ''
    },
    // 点击按钮添加销售属性
    addAttr() {
      // 对应的销售属性的id和名字需要收集起来
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split('_')
      // 向当前的spuInfo对象中的spuSaleAttrList数组中添加一个对象
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      })
      // 清空
      this.attrIdAttrName = ''
    },
    // 删除某个销售属性
    deleteAttr(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1)
    },
    // 保存操作
    save1(){
      console.log(this.spuInfo)
    },
    async save() {
      // 获取spuInfo对象
      const { spuInfo, spuImageList } = this
      // 过滤销售属性
      // spuInfo.spuSaleAttrList.forEach(item=>{
      //   delete item.edit
      //   delete item.saleAttrValueName
      // })
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter((item) => {
        if (item.spuSaleAttrValueList.length > 0) {
          delete item.edit
          delete item.saleAttrValueName
          return true
        }
        return false
      })
      // 过滤图片数组
      spuInfo.spuImageList = spuImageList.map((item) => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.imgUrl,
      }))
      // 调用接口
      try {
        await this.$API.spu.addOrUpdateSpuInfo(spuInfo)
        // 提示
        this.$message.success('操作成功')
        // 关闭对话框
        this.back()
        // 重置数据
        this.reset()
        // 通知父级组件操作成功了
        this.$emit('saveSuccess')
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    // 重置数据
    reset() {
      this.spuId = '' // spuInfo对象的id值
      this.spuInfo = {
        spuName: '', // spu的名字
        description: '', // 描述信息
        category3Id: '', // 三级分类的id
        tmId: '', // 品牌的id
        spuSaleAttrList: [], // 销售属性数组
        spuImageList: [], // 图片数组数据
      } // 用来存储当前的spuInfo对象的数据
      this.trademarkList = [] // 用来存储所有的品牌信息数据数组
      this.saleAttrList = [] // 用来存储所有销售属性的数组数据
      this.spuImageList = [] // 用来存储spu相关的所有的图片数组数据
      this.attrIdAttrName = '' // 用来存储选中的某个销售属性的id和选中的某个销售属性的名字 '3_类别'

      this.dialogImageUrl = '' // 用来显示预览图片的地址的
      this.dialogVisible = false // 是否要预览
    },
    // 添加SPU的时候调用的方法
    initAddData(category3Id){
      // 保存三级分类的id
      this.spuInfo.category3Id = category3Id
      // 获取所有的品牌
      this.getTrademarkList()
      // 获取所有的销售属性
      this.getSpuSaleAttrList()
    }
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