// 引入request 
import request from '@/utils/request'
// 公共的根路径地址
const api_name = `/admin/product`
export default{
  // 下架
  cancelSale(skuId){
    return request.get(`${api_name}/cancelSale/${skuId}`)
  },
  // 上架
  onSale(skuId){
    return request.get(`${api_name}/onSale/${skuId}`)
  },
  // 根据id删除sku
  deleteSkuById(skuId){
    return request.delete(`${api_name}/deleteSku/${skuId}`)
  },
  // 根据spuId查找对应的skuInfo的对象数组数据
  getSkuInfoListBySpuId(spuId){
    return request.get(`${api_name}/findBySpuId/${spuId}`)
  },
  // 根据sku的id获取skuInfo对象的数据
  getSkuInfoById(skuId){
    return request.get(`${api_name}/getSkuById/${skuId}`)
  },
  // 根据关键字查找对应sku信息数据
  findSkuInfoByKeyword(keyword){
    return request.get(`${api_name}/inner/findSkuInfoByKeyword/${keyword}`)
  },
  // 根据sku的id数组查找对应的sku数据
  findSkuInfoBySkuIdList(skuIdList){
    return request.post(`${api_name}/inner/findSkuInfoBySkuIdList`,skuIdList)
  },
  // 分页的方式获取sku列表的数据
  getSkuInfoList(page,limit){
    return request.get(`${api_name}/list/${page}/${limit}`)
  },
  // 添加和修改sku的数据
  addOrUpdateSkuInfo(skuInfo){
    if(skuInfo.id){
      // 修改
      return request.post(`${api_name}/updateSkuInfo`,skuInfo)
    }
    // 增加
    return request.post(`${api_name}/saveSkuInfo`,skuInfo)
  },
  // 根据spuId获取对应的spu中图片数组
  getspuImagList(spuId){
    return request.get(`${api_name}/spuImageList/${spuId}`)
  },
  // 根据spuId获取当前的spu中的销售属性
  getSpuSaleAttrList(spuId){
    return request.get(`${api_name}/spuSaleAttrList/${spuId}`)
  }
}
