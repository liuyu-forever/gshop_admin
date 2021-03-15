
// 引入request 
import request from '@/utils/request'
// 公共的根路径地址
const api_name = `/admin/product`
export default {
  // 获取所有的销售属性接口
  getBaseSaleAttrList(){
    return request.get(`${api_name}/baseSaleAttrList`)
  },
  // 删除SPU
  deleteSpuById(spuId){
    return request.delete(`${api_name}/deleteSpu/${spuId}`)
  },
  // 根据关键字查找对应的spuInfo对象的数据
  findSpuInfoByKeyword(keyword){
    return request.get(`${api_name}/findSpuInfoByKeyword/${keyword}`)
  },
  // 根据spuId获取spuInfo对象数据
  getSpuInfoById(spuId){
    return request.get(`${api_name}/getSpuById/${spuId}`)
  },
  // 根据spuId的数组获取对应的spuInfo的数据
  findSpuInfoBySpuIdList(spuIdList){
    return request.post(`${api_name}/inner/findSpuInfoBySpuIdList`,spuIdList)
  },
  // 添加或者修改SpuInfo数据
  addOrUpdateSpuInfo(spuInfo){
    // 是否有id,则是修改
    if(spuInfo.id){
      return request.post(`${api_name}/updateSpuInfo`,spuInfo)
    }
    return request.post(`${api_name}/saveSpuInfo`,spuInfo)
  },
  // 分页的方式获取spuInfo列表数据,
  getSpuInfoList(page,limit,category3Id){
    return request({
      url:`${api_name}/${page}/${limit}`,
      method:'GET',
      params:{category3Id}
    })
  }
}

