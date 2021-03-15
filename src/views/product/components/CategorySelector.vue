<template>
  <el-form inline :model="formData">
    <!--一级分类-->
    <el-form-item label="一级分类">
      <el-select
        placeholder="请选择"
        v-model="formData.category1Id"
        @change="changeCategory1"
        :disabled="isDisabled"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="(c1, index) in category1List"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!--二级分类-->
    <el-form-item label="二级分类">
      <el-select
        placeholder="请选择"
        v-model="formData.category2Id"
        @change="changeCategory2"
         :disabled="isDisabled"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="(c2, index) in category2List"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!--三级分类-->
    <el-form-item label="三级分类">
      <el-select
        placeholder="请选择"
        v-model="formData.category3Id"
        @change="changeCategory3"
         :disabled="isDisabled"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="(c3, index) in category3List"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      formData: {
        category1Id: '', // 一级分类的id
        category2Id: '', // 二级分类的id
        category3Id: '', // 三级分类的id
      },

      category1List: [], // 一级分类的数据
      category2List: [], // 二级分类的数据
      category3List: [], // 三级分类的数据

      isDisabled:false, // 是否禁用下拉框的标识
    }
  },
  mounted() {
    // 获取一级分类信息的数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类的数据
    async getCategory1List() {
      // 调用接口,暂时会报错
      const result = await this.$API.category.getCategory1()
      if (result.code === 200) {
        this.category1List = result.data
      }
    },
    // 一级分类的选中内容改变后获取对应的二级分类信息数据
    async changeCategory1(categoryId) {
      // 清除二级分类的id及数组(三级分类的id及数组)
      this.formData.category2Id = ''
      this.formData.category3Id = ''
      this.category2List = []
      this.category3List = []
      // 分发事件
      this.$emit('changeCategory', { categoryId, level: 1 })
      // 调用接口
      const result = await this.$API.category.getCategory2(categoryId)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },
    // 二级分类的选中内容改变后获取对应的三级分类信息数据
    async changeCategory2(categoryId) {
      // 清除三级分类的id及数组
      this.formData.category3Id = ''
      this.category3List = []
      // 分发事件
      this.$emit('changeCategory', { categoryId, level: 2 })
      // 调用接口
      const result = await this.$API.category.getCategory3(categoryId)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },
    // 三级分类的选中内容改变后获取对应的平台属性信息数据
    changeCategory3(categoryId) {
      // 分发事件
      this.$emit('changeCategory', { categoryId, level: 3 })
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
