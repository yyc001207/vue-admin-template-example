//品牌数据
import request from '@/utils/request'

//获取品牌信息
export const reqTradeMarkList = (page, limit) =>
    request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//添加或修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //修改品牌信息时需要获得品牌的id，我们通过是否存在品牌id，判断需要发送什么请求
    if (tradeMark.id) {
        //修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        //添加
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

//删除品牌
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})

//搜索品牌
export const reqSearchTradeMark = (keyword) => request({
    url: `/admin/product/baseTrademark/findBaseTrademarkByKeyword/${keyword}`,
    method: 'get'
})