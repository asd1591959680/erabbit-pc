import {
  checkAllCart,
  deleteCart,
  findCartList,
  getNewCartGoods,
  insertCart,
  mergeLocalCart,
  updateCart,
} from '@/api/cart'

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: [],
    }
  },
  getters: {
    /// 有效商品列表
    validList(state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    //有效商品总数
    validTotal(state, getters) {
      return getters.validList.reduce((p, v) => p + v.count, 0)
    },
    //有效商品总价
    validAmount(state, getters) {
      return getters.validList.reduce((p, v) => p + v.nowPrice * 100 * v.count, 0) / 100
    },

    //无效商品列表
    invalidList(state) {
      return state.list.filter(i => !(i.stock > 0 && i.isEffective))
    },
    selectedList(state, getters) {
      return getters.validList.filter(i => i.selected)
    },
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, v) => p + v.count, 0)
    },
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, v) => p + v.nowPrice * 100 * v.count, 0) / 100
    },
    isCheckAll(state, getters) {
      return (
        getters.validList.length === getters.selectedList.length &&
        getters.selectedList.length !== 0
      )
    },
  },
  mutations: {
    insertCart(state, goods) {
      const sameIndex = state.list.findIndex(item => item.skuId === goods.skuId)
      if (sameIndex >= 0) {
        goods.count = state.list[sameIndex].count + goods.count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    //修改购物车商品
    updateCart(state, goods) {
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (let key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    setCartList(state, list) {
      state.list = list
    },
  },
  actions: {
    insertCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {
          insertCart(goods)
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },
    findCartList(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          //本地购物车更新
          const promiseArr = ctx.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr)
            .then(dataArr => {
              dataArr.forEach((data, i) => {
                ctx.commit('updateCart', {
                  skuId: ctx.state.list[i].skuId,
                  ...data.result,
                })
              })
              resolve()
            })
            .catch(e => {
              reject(e)
            })
        }
      })
    },
    deleteCart(ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          deleteCart([skuId])
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    updateCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          updateCart(goods)
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters.validList.map(i => i.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          //更改所有购物车商品选中信息
          ctx.getters.validList.forEach(i => {
            ctx.commit('updateCart', { skuId: i.skuId, selected })
          })
          resolve()
        }
      })
    },

    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(i => i.skuId)
          deleteCart(ids)
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(i => {
            ctx.commit('deleteCart', i.skuId)
          })
          resolve()
        }
      })
    },

    updateCartSku(ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const oldGoods = ctx.state.list.find(i => i.skuId === oldSkuId)
          deleteCart(oldSkuId)
            .then(() => {
              return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
            })
            .then(() => {
              return findCartList()
            })
            .then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          const oldGoods = ctx.state.list.find(i => i.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },

    async mergeLocalCart(ctx) {
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      //合并成功删除本地购物车列表
      ctx.commit('setCartList', [])
    },
  },
}
