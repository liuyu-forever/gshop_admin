<template>
  <div>
    <!--按钮-->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 20px"
      @click="showAddTrademark"
      >添加</el-button
    >
    <!--表格-->
    <el-table :data="trademarkList" stripe style="width: 100%" border>
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.logoUrl"
            :alt="row.tmName"
            style="width: 100px; height: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="warning"
            @click="showUpdateTrademark(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <!--

      @size-change="handleSizeChange"  改变每页的条数
      @current-change="handleCurrentChange" 改变的显示第几页
      :current-page="page"  默认选中的是第几页
      :page-sizes="[3,6,9,12]"  可以显示每页3条/6条/9条/12条
      :page-size="limit"  默认每页显示多少条
      上一页   中间的页码    下一页    跳转到那一页    产生距离  总条数   每页的条数
      prev,   pager,        next,     jumper,        ->,      total    sizes
      layout="total, sizes, prev, pager, next, jumper"  分页中的布局的结构
      :total="total"  总条数

    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->,  sizes, total"
      :total="total"
      style="text-align: center; margin-top: 20px"
    >
    </el-pagination>

    <!--对话框,用来添加品牌和修改品牌的-->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form
        :model="formData"
        style="width: 80%"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <el-input v-model="formData.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formData.logoUrl"
              :src="formData.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!--对话框中的确定和取消的按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      page: 1, // 页码数
      limit: 3, // 每页的条数
      total: 0, // 总条数
      trademarkList: [], // 品牌列表数据
      // 控制当前的对话框显示/隐藏
      dialogFormVisible: false,
      // 表单项中所需要的数据对象
      formData: {
        tmName: '', // 品牌的名称
        logoUrl: '', // 品牌的图片地址
      },
      formLabelWidth: '100px',

      // 表单验证的规则
      rules: {
        // 品牌的名字
        tmName: [
          { required: true, message: '请您输入品牌名称' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'change',
          },
        ],
        logoUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
      },
    }
  },
  // 页面加载后的生命周期回调
  mounted() {
    // 获取品牌相关的列表数据
    this.getTrademarkList()
  },
  methods: {
    // 获取品牌相关的列表数据
    async getTrademarkList(page = 1) {
      // 更新页码
      this.page = page
      // 调用接口获取品牌列表数据
      const result = await this.$API.trademark.getTrademarkList(
        page,
        this.limit
      )
      if (result.code === 200) {
        // 更新数据(总条数/品牌数组)
        const { records, total } = result.data
        this.total = total
        this.trademarkList = records
      } else {
        this.$message.error(result.message || '获取品牌列表数据失败了')
      }
    },
    // 分页组件的相关的事件的方法
    // 每页显示多少条数据
    handleSizeChange(limit) {
      this.limit = limit
      // 重新获取数据
      this.getTrademarkList()
    },
    // 改变页码
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getTrademarkList()
    // },

    // 上传图片的组件所需的方法
    // 如果上传成功了,则可以获取上传图片成功的一个地址，该地址可以从res中取出
    handleAvatarSuccess(res, file) {
      // 保存上传成功后的图片的地址
      this.formData.logoUrl = res.data
      // 清空图片的验证的提示信息
      this.$refs.ruleForm.clearValidate('logoUrl')
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

    // 点击添加品牌的按钮显示对应的对话框
    showAddTrademark() {
      // 清空对话框中的数据
      this.formData = {
        tmName: '',
        logoUrl: '',
      }

      // 显示对话框
      this.dialogFormVisible = true

      this.$nextTick(() => {
        // 清空所有的表单验证的提示信息
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 点击修改品牌的按钮显示对应的对话框
    showUpdateTrademark(trademark) {
      // this.formData = trademark
      // 通过解构的方式形成一个新的对象
      this.formData = { ...trademark }
      this.dialogFormVisible = true
    },
    // 添加或者修改品牌的信息数据操作
    addOrUpdateTrademark() {
      // 表单的验证
      this.$refs.ruleForm.validate(async (valid) => {
        // 表单验证通过了
        if (!valid) return
        const result = await this.$API.trademark.addOrUpdateTrademark(
          this.formData
        )
        if (result.code === 200) {
          this.$message.success('操作成功')
          // 关闭对话框
          this.dialogFormVisible = false
          // 重新刷新一下品牌信息的数据
          this.getTrademarkList(this.formData.id ? this.page : 1)
        } else {
          this.$message.error('操作失败')
        }
      })
    },

    // 删除操作
    deleteTrademark(trademark) {
      // 弹框
      this.$confirm(`您确定要删除${trademark.tmName}吗`, '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 调用接口
          await this.$API.trademark.deleteTrademark(trademark.id)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          // 刷新操作
          this.getTrademarkList(
            this.trademarkList.length === 1 && this.page > 1
              ? this.page - 1
              : this.page
          )
        })
        .catch((error) => {
          // 点击的是取消
          if (error === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          }
        })
    },
  },
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
