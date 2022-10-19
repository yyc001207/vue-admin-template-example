import request from '@/utils/request'

//获取spu列表 /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
})

// 获取spu信息
export const reqSpu = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})

// 获取品牌信息
export const reqTradeMarkList = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
})

//获取spu图片
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})

//获取平台销售属性
export const reqBaseSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
})

//修改或添加spu
export const reqAddOrUpdateSpu = (spuInfo) => {
    //如果传递参数有id，则是修改请求
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        //添加请求
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

//删除spu
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})

//添加sku
export const reqAddSku = (skuInfo) => request({
    url: '/admin/product/saveSkuInfo',
    method: 'post', data: skuInfo
})

//获取sku列表
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})

//搜索spu
export const reqSearchSpu = (keyword) => request({
    url: `/admin/product/findSpuInfoByKeyword/${keyword}`,
    method: 'get'
})