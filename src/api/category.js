import request from "@/utils/request";

//获取首页头部分类数据
export const findAllCategory = () => {
  return request("/home/category/head", "get");
};

export const findTopCategory = (id) => {
  return request("/category", "get", { id });
};
/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request("/category/sub/filter", "get", { id });
};

export const findSubCategoryGoods = (params) => {
  return request("/category/goods/temporary", "post", params);
};
