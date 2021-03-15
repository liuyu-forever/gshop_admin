<template>
  <el-form label-width="100px">
    <!--SPU名称-->
    <el-form-item label="SPU名称">
      <span>{{ spuName }}</span>
    </el-form-item>
    <!--SKU名称-->
    <el-form-item label="SKU名称">
      <el-input
        type="text"
        placeholder="请输入SKU的名称"
        v-model="skuInfo.skuName"
      ></el-input>
    </el-form-item>
    <!--价格-->
    <el-form-item label="价格(元)">
      <el-input
        type="number"
        placeholder="请输入价格"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <!--重量-->
    <el-form-item label="重量(千克)">
      <el-input
        type="number"
        placeholder="请输入重量"
        v-model="skuInfo.weight"
      ></el-input>
    </el-form-item>
    <!--规格描述-->
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入规格描述"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <!--平台属性-->
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item
          :label="attr.attrName"
          label-width="100px"
          style="margin-bottom: 10px"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdValId">
            <el-option
              :label="val.valueName"
              :value="attr.id + '_' + val.id"
              v-for="(val, index) in attr.attrValueList"
              :key="val.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!--销售属性-->
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item
          :label="attr.saleAttrName"
          label-width="100px"
          style="margin-bottom: 10px"
          v-for="(attr, index) in saleAttrList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.valueId">
            <el-option
              :label="val.saleAttrValueName"
              :value="val.id"
              v-for="(val, index) in attr.spuSaleAttrValueList"
              :key="val.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!--图片列表-->
    <el-form-item label="图片列表">
      <el-table
        :data="imageList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.imgUrl"
              :alt="row.imgName"
              width="100"
              height="100"
            />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-tag type="success" v-if="row.isDefault === '1'">默认</el-tag>
            <el-button v-else type="primary" @click="setDefault(row)"
              >设为默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!--两个按钮-->
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      skuInfo: {
        // 下面的四个数据,可以直接从表单标签中收集出来
        skuName: '', // 名字
        price: '', // 价格
        skuDesc: '', // 描述信息
        weight: '', // 重量
        // 可以直接从传递过来的spuInfo对象中收集出来
        category3Id: '', // 三级分类的id
        spuId: '', // spu 的id
        tmId: '', // 品牌的id

        // 动态的进行收集
        skuAttrValueList: [], // 平台属性数组
        skuImageList: [], // 选中的图片数组
        skuSaleAttrValueList: [], // 选中的销售属性数组
        skuDefaultImg: '', // 默认选中的图片地址
        // 默认值
        isSale: 0, // 下架 , 1---上架,0---下架
      },
      category1Id: '', // 一级分类id
      category2Id: '', // 二级分类id
      attrList: [], // 平台属性数据---数组
      saleAttrList: [], // 销售属性数据---数组
      imageList: [], // 图片数据----数组
      spuName: '', // spu的名称
      selectedImageList: [], // 用来收集选中的图片数组数据
    }
  },
  methods: {
    // 图片列表选中多个图片
    handleSelectionChange(val) {
      this.selectedImageList = val
    },
    // 初始化数据的方法
    initAddData(spuInfo) {
      // 存储一级/二级/三级的分类的id
      const {
        category1Id,
        category2Id,
        category3Id,
        id,
        spuName,
        tmId,
      } = spuInfo
      // 存储spuName数据
      this.spuName = spuName
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = id
      this.skuInfo.tmId = tmId
      // 调用方法
      this.getInitData()
    },
    // 该方法内部需要调用三个接口
    async getInitData() {
      // 获取所有的平台属性的数据数组
      const promise1 = await this.$API.attr.getAttrList(
        this.category1Id,
        this.category2Id,
        this.skuInfo.category3Id
      )
      // 获取当前的spuInfo对象中的已经存在的销售属性数据数组
      const promise2 = await this.$API.sku.getSpuSaleAttrList(
        this.skuInfo.spuId
      )
      // 获取当前的spuInfo对象中已经存在的图片数据数组
      const promise3 = await this.$API.sku.getspuImagList(this.skuInfo.spuId)
      // 统一处理promise
      const result = await Promise.all([promise1, promise2, promise3])
      // 存储平台属性数据
      this.attrList = result[0].data
      // 存储销售属性数据
      this.saleAttrList = result[1].data
      // 存储图片数据
      const imageList = result[2].data
      imageList.forEach((item) => {
        // 要变成响应式的属性了
        item.isDefault = '0'
      })
      // 为了准确性,可以添加一个判断图片数组的length是否大于0
      // imageList[0].isDefault='1'
      this.imageList = imageList
    },
    // 点击按钮,设置某个图片为默认选中的图片
    setDefault(img) {
      // 不是响应式的属性
      // img.isDefault='1'
      // this.$set(img,'isDefault','1')
      this.imageList.forEach((item) => {
        item.isDefault = '0'
      })
      // 设置当前的这个图片为默认的选中的图片
      img.isDefault = '1'
      // 存储当前默认被选中的图片的路径
      this.skuInfo.skuDefaultImg = img.imgUrl
    },
    // 添加skuInfo对象操作---目前是属于添加(将来的有一天可能会变成修改,但是说不定)
    async save() {
      // 获取平台属性数据数组/销售属性数据数组/选中图片的数据数组/依次进行过滤操作
      const { skuInfo, attrList, saleAttrList, selectedImageList } = this

      // 过滤平台属性数据
      // console.log(attrList)
      skuInfo.skuAttrValueList = attrList.reduce((pre, item) => {
        // 获取对象中的这个属性值(平台属性对象id和属性值id)
        const attrIdValId = item.attrIdValId
        // 判断是否选中
        if (attrIdValId) {
          const [attrId, valueId] = attrIdValId.split('_')
          pre.push({
            attrId,
            valueId,
          })
        }
        return pre
      }, [])

      // console.log(skuInfo.skuAttrValueList)
      // 过滤销售属性
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((pre, item) => {
        const valueId = item.valueId
        if (valueId) {
          pre.push({
            saleAttrValueId: valueId,
          })
        }
        return pre
      }, [])
      // 过滤图片
      skuInfo.skuImageList = selectedImageList.map((item) => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        isDefault: item.isDefault,
        spuImgId: item.id,
      }))

      // 调用接口发送请求,关闭窗口,刷新界面
      const result = await this.$API.sku.addOrUpdateSkuInfo(skuInfo)
      if (result.code === 200) {
        // 提示
        this.$message.success('操作成功')
        // 关闭窗口
        this.$emit('cancel')
        // 通知父级组件
        this.$emit('saveSuccess')
        // 重置数据
        this.resetData()
      } else {
        this.$message.error('操作失败')
      }
    },
    // 重置数据
    resetData() {
      this.skuInfo = {
        // 下面的四个数据,可以直接从表单标签中收集出来
        skuName: '', // 名字
        price: '', // 价格
        skuDesc: '', // 描述信息
        weight: '', // 重量
        // 可以直接从传递过来的spuInfo对象中收集出来
        category3Id: '', // 三级分类的id
        spuId: '', // spu 的id
        tmId: '', // 品牌的id

        // 动态的进行收集
        skuAttrValueList: [], // 平台属性数组
        skuImageList: [], // 选中的图片数组
        skuSaleAttrValueList: [], // 选中的销售属性数组
        skuDefaultImg: '', // 默认选中的图片地址
        // 默认值
        isSale: 0, // 下架 , 1---上架,0---下架
      }
      this.category1Id = '' // 一级分类id
      this.category2Id = '' // 二级分类id
      this.attrList = [] // 平台属性数据---数组
      this.saleAttrList = [] // 销售属性数据---数组
      this.imageList = [] // 图片数据----数组
      this.spuName = '' // spu的名称
      this.selectedImageList = [] // 用来收集选中的图片数组数据
    },
  },
}
</script>
<style scoped>
</style>