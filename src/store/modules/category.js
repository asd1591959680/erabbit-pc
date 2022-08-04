// 分类模块
import { topCategory } from "@/api/constants";
import { findAllCategory } from "@/api/category";
export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合
      list: topCategory.map((item) => ({ name: item })),
    };
  },
  mutations: {
    setList(state, headCategory) {
      state.list = headCategory;
    },
    //修改当前一级分类数据open为true
    show(state, item) {
      const category = state.list.find((e) => e.id === item.id);
      category.open = true;
    },
    //修改当前一级分类数据open为tfalse
    hide(state, item) {
      const category = state.list.find((e) => e.id === item.id);
      category.open = false;
    },
  },
  actions: {
    async getList({ commit }) {
      const { result } = await findAllCategory();
      result.forEach((i) => {
        i.open = false;
      });
      commit("setList", result);
    },
  },
};
