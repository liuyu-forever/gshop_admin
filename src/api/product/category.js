
// 引入request 
import request from '@/utils/request'
// 公共的根路径地址
const api_name = `/admin/product`
export default {
  // 获取一级分类的信息,不需要任何参数
  getCategory1(){
    return request.get(`${api_name}/getCategory1`)
  },
  // 根据一级分类信息的id获取对应的二级分类信息数据
  getCategory2(category1Id){
    return request.get(`${api_name}/getCategory2/${category1Id}`)
  },
  // 根据二级分类信息的id获取对应的三级分类信息数据
  getCategory3(category2Id){
    return request.get(`${api_name}/getCategory3/${category2Id}`)
  },
}
