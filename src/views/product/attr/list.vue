<template>
  <div>
    <!--分类组件-->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" ref="cs" />
    </el-card>
    <!--表格数据-->
    <el-card style="margin-top: 20px">
      <div v-show="isShowAddOrUpdateAttr">
        <!--按钮-->
        <el-button type="primary" icon="el-icon-plus" @click="showAddAttr" :disabled="!category3Id"
          >添加属性</el-button
        >
        <!--表格-->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" width="80" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="info"
                v-for="(val, index) in row.attrValueList"
                :key="val.id"
                >{{ val.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="warning"
                @click="showAddOrUpdateAttr(row)"
              ></el-button>
              <!--删除按钮-->
              <!--删除操作按钮-->
              <el-popconfirm
                :title="`确定要删除${row.attrName}吗`"
                @onConfirm="deleteAttr(row.id)"
              >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--添加或者修改平台属性的界面-->
      <div v-show="!isShowAddOrUpdateAttr">
        <!--文本框,属性名字-->
        <el-form inline :model="formData">
          <el-form-item label="属性名称">
            <el-input type="text" v-model="formData.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!--两个按钮-->
        <div style="margin-bottom: 20px">
          <el-button type="primary" icon="el-icon-plus" @click="addValue" :disabled="!formData.attrName.trim()"
            >添加属性值</el-button
          >
          <el-button @click="isShowAddOrUpdateAttr = true">取消</el-button>
        </div>
        <!--表格-->
        <el-table
          :data="formData.attrValueList"
          style="width: 100%; margin-bottom: 20px"
          border
        >
          <el-table-column type="index" width="80" label="序号" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!--row.edit为true,则是编辑模式,否则是查看模式,但是,edit这个属性在当前的对象中根本不存在
                row----属性值对象
                keyup是一个自定义事件
                blur 是自定义事件?
              -->

              <!--编辑模式-->
              <el-input
                type="text"
                v-if="row.edit"
                size="mini"
                v-model="row.valueName"
                @blur="toView(row)"
                :ref="$index"
                @keyup.enter.native="toView(row)"
              ></el-input>
              <!--查看模式-->
              <span
                v-else
                @click="toEdit(row, $index)"
                style="width: 100%; display: inline-block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!--删除操作按钮-->
              <el-popconfirm
                :title="`确定要删除${row.valueName}`"
                @onConfirm="deleteValueName($index)"
              >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="addOrUpdateAttr" :disabled="!isSaveValid">保存</el-button>
        <el-button @click="isShowAddOrUpdateAttr = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入深拷贝的函数
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'AttrList',
  data() {
    return {
      category1Id: '', // 一级分类的id
      category2Id: '', // 二级分类的id
      category3Id: '', // 三级分类的id
      attrList: [], // 平台属性数据数组
      isShowAddOrUpdateAttr: true,
      // 存储的是平台属性对象
      formData: {
        attrName: '', // 平台属性的名字
        attrValueList: [], //
      },
    }
  },
  computed: {
    // 用来设定保存按钮是否可以被禁用
    isSaveValid(){
      // 文本框是否为空(平台属性的名字是否为空),同时还看属性值数组中的数据是否为
      return this.formData.attrName.trim()&&this.formData.attrValueList.some(attr=>attr.valueName.trim())
    }
  },
  // 监视
  watch: {
    isShowAddOrUpdateAttr(val){
      this.$refs.cs.isDisabled=!val
    }
  },
  methods: {
    // 获取平台属性数据的方法
    async getAttrList() {
      const result = await this.$API.attr.getAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 分类信息的组件中某个下拉框选中内容改变后就会触发该事件,调用该回调函数
    changeCategory({ categoryId, level }) {
      // 判断
      if (level === 1) {
        // 保存一级分类的id
        this.category1Id = categoryId
        // 清空二级三级的分类的id及平台属性数组
        this.category2Id = null
        this.category3Id = null
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = null
        this.attrList = []
      } else {
        // 三级分类了
        this.category3Id = categoryId
        // 发送请求获取平台属性数据
        this.getAttrList()
      }
    },

    // 点击修改按钮显示修改平台属性的界面
    showAddOrUpdateAttr(attr) {
      // 把当前这一行的平台属性对象传递过来
      // this.formData = attr // 有bug,原因:两个对象指向了同一块空间,同一个地址
      // 浅拷贝(只解构一层)
      // this.formData = { ...attr }
      this.formData = cloneDeep(attr)
      // 深拷贝
      this.isShowAddOrUpdateAttr = false
    },

    // 删除某个属性值操作
    deleteValueName(index) {
      // 从当前的属性值列表的数组中移除一个属性值对象
      this.formData.attrValueList.splice(index, 1)
    },
    // 点击添加属性值按钮的回调函数
    addValue() {
      // 添加属性值对象
      this.formData.attrValueList.push({
        valueName: '', // 属性值名字
        attrId: this.formData.id, // 当前这个属性值对象所在的attrValueList数组所在的平台属性对象的id
        edit: true, // 如果是true,则是编辑模式,否则是查看模式
      })
      this.$nextTick(() => {
        this.$refs[this.formData.attrValueList.length - 1].focus()
      })

      // console.log(this.$refs.input)
    },
    // 查看模式
    toView(attrValue) {
      if (attrValue.valueName.trim() === '') return
      const isRepeat =
        this.formData.attrValueList.filter(
          (attr) => attr.valueName === attrValue.valueName
        ).length === 2
      if (isRepeat) {
        this.$message.warning('内容不能重复')
        attrValue.valueName = ''
        return
      }
      // if(attrValue.valueName.trim()===''){
      //    this.$message.warning('必须输入内容')
      //     attrValue.valueName = ''
      //    return
      // }
      // 查看模式
      attrValue.edit = false
    },
    // 编辑模式

    toEdit(attrValue, index) {
      // 先判断当前的属性值对象中是否存在edit这个属性
      if (!attrValue.hasOwnProperty('edit')) {
        // 添加一个响应式的属性
        this.$set(attrValue, 'edit', true)
      } else {
        attrValue.edit = true
      }
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 添加或者修改平台属性操作
    async addOrUpdateAttr() {
      // 干掉无效数据,干掉edit属性
      this.formData.attrValueList = this.formData.attrValueList.filter(
        (attr) => {
          // 干掉edit
          delete attr.edit
          return attr.valueName.trim()
        }
      )

      // 调用接口
      try {
        await this.$API.attr.addOrUpdate(this.formData)
        this.$message.success('操作成功')
        // 关闭界面
        this.isShowAddOrUpdateAttr = true
        // 刷新
        this.getAttrList()
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    // 点击添加平台属性操作
    showAddAttr() {
      this.isShowAddOrUpdateAttr = false
      this.formData = {
        attrName: '', // 平台属性名字
        attrValueList: [], // 属性值数组
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3, // 3级
      }
    },
    // 删除平台属性
    async deleteAttr(attrId){
      try {
        await this.$API.attr.deleteAttrById(attrId)
        this.$message.success('删除成功')
        // 刷新
        this.getAttrList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
