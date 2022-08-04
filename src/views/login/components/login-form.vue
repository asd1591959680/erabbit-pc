<!-- 表单登录 -->
<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i>
        使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i>
        使用短信登录
      </a>
    </div>
    <Form
      class="form"
      :validation-schema="veeSchema"
      autocomplete="off"
      v-slot="{ errors }"
      ref="formRef"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="isForm.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />
            {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="isForm.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />
            {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="isForm.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />
            {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="isForm.code"
              name="code"
              type="password"
              placeholder="请输入验证码"
            />
            <span @click="send" class="code">
              {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="isForm.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a @click="Login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue-demi'
import { Form, Field } from 'vee-validate'
import veeSchema from '@/utils/vee-validate-schema'
import Message from '@/components/library/message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useIntervalFn } from '@vueuse/shared'
export default {
  name: 'LoginForm',
  components: {
    Form,
    Field,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const isMsgLogin = ref(false)
    const isForm = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null,
    })
    const mySchema = {
      account: veeSchema.account,
      password: veeSchema.password,
      mobile: veeSchema.mobile,
      code: veeSchema.code,
      isAgree: veeSchema.isAgree,
    }
    const Login = async () => {
      const valid = await formRef.value.validate()

      if (valid) {
        let data = null
        try {
          if (!isMsgLogin.value) {
            const { account, password } = isForm
            data = await userAccountLogin({ account, password })
          } else {
            const { mobile, code } = isForm
            data = await userMobileLogin({ mobile, code })
          }
          const { id, avatar, nickname, account, mobile, token } = data.result
          store.commit('user/setUser', {
            id,
            avatar,
            nickname,
            account,
            mobile,
            token,
          })
          store.dispatch('cart/mergeLocalCart').then(() => {
            Message({ type: 'success', text: '登录成功' })
            router.push(route.query.redirectUrl || '/')
          })
        } catch (e) {
          console.log(e)
          Message({
            type: 'error',
            // text: e.response.data.message || "登录失败",
            text: '登录失败',
          })
        }
      } else {
        //短信登录
      }
    }
    const formRef = ref(null)
    //首先需要自己手动清除数据，然后使用Form 组件提供 resetForm 方法对表单进行清除校验结果
    watch(isMsgLogin, () => {
      ;(isForm.isAgree = true),
        (isForm.account = null),
        (isForm.password = null),
        (isForm.mobile = null),
        (isForm.code = null),
        formRef.value.resetForm()
    })
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    const send = async () => {
      const valid = mySchema.mobile(isForm.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userMobileLoginMsg(isForm.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        formRef.value.setFieldError('mobile', valid)
      }
    }
    onUnmounted(() => {
      pause()
    })

    return {
      isMsgLogin,
      isForm,
      veeSchema: mySchema,
      formRef,
      Login,
      time,
      send,
    }
  },
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
