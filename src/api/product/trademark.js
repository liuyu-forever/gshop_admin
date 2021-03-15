// 引入request 
import request from '@/utils/request'
// 公共的根路径地址
const api_name = `/admin/product/baseTrademark`
export default {
  // 根据关键字搜索品牌信息列表数据
  findBaseTrademarkByKeyword (keyword) {
    return request({
      url: `${api_name}/findBaseTrademarkByKeyword/${keyword}`,
      method: 'GET'
    })
    // return request.get(`${api_name}/findBaseTrademarkByKeyword/${keyword}`)
  },
  // 根据品牌的id获取品牌的数据对象
  getTrademarkById (id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'GET'
    })
    // return request.get(`${api_name}/get/${id}`)
  },
  // 获取品牌的列表数据(无需参数)
  // getTrademarkList1(){
  //   return request({
  //     url:`${api_name}/getTrademarkList`,
  //     method:'GET'
  //   })
  //   // return request.get(`${api_name}/getTrademarkList`)
  // },
  // // 获取品牌的列表数据(分页的方式)
  // getTrademarkLIst2(page,limit){
  //   return request({
  //     url:`${api_name}/${page}/${limit}`,
  //     method:'GET'
  //   })
  //   // return request.get(`${api_name}/${page}/${limit}`)
  // },
  // 获取品牌的列表数据(可以使用分页方式也可以不用)
  getTrademarkList (page, limit) {
    if (page && limit) {
      return request.get(`${api_name}/${page}/${limit}`)
    }
    return request.get(`${api_name}/getTrademarkList`)
  },
  // 新增一个品牌数据
  // addTrademark(trademark){
  //   return request({
  //     url:`${api_name}/save`,
  //     method:'POST',
  //     data:trademark
  //   })
  //   // return request.post(`${api_name}/save`,trademark)
  // },
  // // 修改一个品牌数据
  // updateTrademark(trademark){
  //   return request({
  //     url:`${api_name}/update`,
  //     method:'PUT',
  //     data:trademark
  //   })
  //   // return request.put(`${api_name}/update`,trademark)
  // },
  // 新增或者修改品牌数据
  addOrUpdateTrademark (trademark) {
    if (trademark.id) {
      return request.put(`${api_name}/update`, trademark)
    }
    return request.post(`${api_name}/save`, trademark)
  },
  // 删除品牌数据
  deleteTrademark (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE'
    })
    // return request.delete(`${api_name}/remove/${id}`)
  }
}