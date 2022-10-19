import request from '@/utils/request'

//获取图片数组
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//获取销售属性数组
export const reqSpuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId} `,
    method: 'get'
})
//获取平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get"
})

//获取sku列表
export const reqSkuList = (page, limit) => request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
})

//删除sku
export const reqDeleteSku = (skuId) => request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'delete'
})

//sku下架
export const reqCancelSale = (skuId) => request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
})

//sku上架
export const reqOnSale = (skuId) => request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
})

//获取某个sku
export const reqGetSku = (skuId) => request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
})