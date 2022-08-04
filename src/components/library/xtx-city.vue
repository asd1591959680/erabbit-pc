<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{ active }">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择配送地址',
    },
  },
  setup(props, { emit }) {
    const active = ref(false)
    const loading = ref(false)
    const cityData = ref([])

    const openDialog = () => {
      active.value = true
      loading.value = true
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
      for (let key in changeResult) {
        changeResult[key] = ''
      }
    }
    const closeDialog = () => {
      active.value = false
    }
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })
    const getCityData = () => {
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          resolve(window.cityData)
        } else {
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }
    const currList = computed(() => {
      let currList = cityData.value
      if (changeResult.provinceCode) {
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode) {
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })

    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: '',
    })
    const changeItem = item => {
      //省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      //市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      //地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        closeDialog()
        emit('change', changeResult)
      }
    }
    return { active, toggleDialog, target, currList, loading, changeItem }
  },
}
</script>

<style lang="less" scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
