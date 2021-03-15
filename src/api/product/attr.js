// 引入request 
import request from '@/utils/request'
// 公共的根路径地址
const api_name = `/admin/product`
export default {
  // 根据三个分类的id获取对应的平台属性信息数据
  getAttrList(category1Id,category2Id,category3Id){
    return request.get(`${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 根据平台属性的id删除对应的平台属性
  deleteAttrById(attrId){
    return request.delete(`${api_name}/deleteAttr/${attrId}`)
  },
  // 根据某个平台属性的id,获取里面所有的该平台属性值
  getAttrValueList(attrId){
    return request.get(`${api_name}/getAttrValueList/${attrId}`)
  },
  // 添加/修改平台属性
  addOrUpdate(attrInfo){
    return request.post(`${api_name}/saveAttrInfo`,attrInfo)
  }
}
