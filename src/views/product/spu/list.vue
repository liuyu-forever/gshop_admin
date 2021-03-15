<template>
  <div>
    <!--分类组件-->
    <el-card v-show="!isShowSkuForm">
      <CategorySelector @changeCategory="changeCategory" ref="cs" />
    </el-card>

    <!--表格-->
    <!--表格数据-->
    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <!--按钮-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
          >添加SPU</el-button
        >
        <!--表格-->
        <el-table :data="spuInfoList" style="width: 100%" border>
          <el-table-column type="index" width="80" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                title="修改SPU"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showUpdateSpuForm(row.id)"
              />
              <HintButton
                title="查看SKU"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="getSkuInfoList(row.id)"
              />

              <el-popconfirm
                :title="`确定要删除${row.spuName}吗`"
                @onConfirm="deleteSpu(row.id)"
              >
                <HintButton
                  title="删除SPU"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuInfoList"
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->,  sizes, total"
          :total="total"
          style="text-align: center"
        >
        </el-pagination>
      </div>
      <SpuForm
        :visible.sync="isShowSpuForm"
        ref="spuForm"
        @saveSuccess="saveSuccess"
      />
      <!--SkuForm组件-->
      <SkuForm
        v-show="isShowSkuForm"
        @cancel="cancel"
        ref="skuForm"
        @saveSuccess="saveSuccess"
      />
    </el-card>

    <!--对话框-->
    <el-dialog title="SKU列表数据" :visible.sync="dialogTableVisible">
      <el-table :data="skuInfoList">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格(元)"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量(千克)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" :alt="row.skuName" width="100" height="100" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
import SkuForm from '../components/SkuForm'
export default {
  name: 'SpuList',
  data() {
    return {
      category1Id: '', // 一级分类的id
      category2Id: '', // 二级分类的id
      category3Id: '', // 三级分类的id
      page: 1, // 默认页码
      limit: 3, // 每页的条数
      total: 0, // 总条数
      spuInfoList: [], // spu的数组列表数据
      isShowSpuForm: false, // 控制SpuForm组件显示/隐藏
      spuId: '', // 用来存储spuId的数据

      isShowSkuForm: false, // 控制SkuForm组件显示/隐藏

      dialogTableVisible: false, // 控制对话框显示/隐藏
      skuInfoList: [], // 用来存储某个spu对应的所有的sku的列表数据---数组
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    // 获取spuInfoList的数据的方法
    async getSpuInfoList(page = 1) {
      this.page = page
      const result = await this.$API.spu.getSpuInfoList(
        page,
        this.limit,
        this.category3Id
      )
      if (result.code === 200) {
        const { records, total } = result.data
        // 保存数据
        this.spuInfoList = records
        this.total = total
      }
    },
    // 分发的自定义事件,获取对应的分类的id数据
    changeCategory({ categoryId, level }) {
      // 判断
      if (level === 1) {
        this.category1Id = categoryId
        // 清空二三级的分类
        this.category2Id = null
        this.category3Id = null
        this.total = 0
        this.spuInfoList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = null
        this.total = 0
        this.spuInfoList = []
      } else {
        this.category3Id = categoryId
        this.getSpuInfoList()
      }
    },

    // 分页组件的相关的事件的方法
    // 每页显示多少条数据
    handleSizeChange(limit) {
      this.limit = limit
      // 重新获取数据
      this.getSpuInfoList()
    },

    // 点击修改SPU的按钮的回调函数
    showUpdateSpuForm(spuId) {
      // 显示SpuForm的对话框
      this.isShowSpuForm = true
      this.spuId = spuId
      // 调用接口发送请求
      this.$refs.spuForm.initUpdateData(this.spuId)
    },

    //  保存成功了的回调
    saveSuccess() {
      // 判断spuId是否存在
      if (this.spuId) {
        // 修改
        this.getSpuInfoList(this.page)
        this.spuId = ''
      } else {
        // 添加
        this.getSpuInfoList()
      }
    },

    // 点击按钮添加SPU操作
    showAddSpuForm() {
      // 显示SpuForm的对话框
      this.isShowSpuForm = true
      this.$refs.spuForm.initAddData(this.category3Id)
    },

    // 删除SPU
    async deleteSpu(spuId) {
      try {
        await this.$API.spu.deleteSpuById(spuId)
        this.$message.success('删除成功')
        this.getSpuInfoList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },

    // 点击按钮显示添加SkuForm的组件
    showAddSkuForm(spuInfo) {
      this.isShowSkuForm = true
      // 调用SkuForm组件的实例的初始化数据的方法
      // 一级/二级/三级的id----3个
      // spuId----1个
      // spuName---1个
      spuInfo = {
        ...spuInfo,
        category1Id: this.category1Id,
        category2Id: this.category2Id,
      }

      this.$refs.skuForm.initAddData(spuInfo)
    },
    // 隐藏SkuForm组件
    cancel() {
      this.isShowSkuForm = false
    },

    // 点击查看sku列表的按钮的回调函数
    async getSkuInfoList(spuId) {
      this.dialogTableVisible = true
      const result = await this.$API.sku.getSkuInfoListBySpuId(spuId)
      this.skuInfoList = result.data
    },
  },
}
</script>
