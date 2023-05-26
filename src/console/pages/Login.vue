<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">TDesign Starter</h1>
        <LoginForm></LoginForm>
        <div class="sub-title">
          <p
            class="tip"
            @click="switchType(type == 'register' ? 'login' : 'register')"
          >
            {{ type == 'register' ? '登录' : '注册新账号' }}
          </p>
        </div>
      </div>
    </div>
    <div class="login-bg">
      <img src="@/assets/image/bg_login.png" />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
}
</script>
<script setup lang="ts">
import { ref } from 'vue'

import LoginForm from './components/LoginForm.vue'
// import Register from './components/Register.vue'
// import LoginHeader from './components/Header.vue'
// import TdesignSetting from '@/layouts/setting.vue'

const type = ref('login')
const switchType = (val: string) => {
  type.value = val
}
</script>

<style scoped>
.login-wrapper h1 {
  font-size: 2em;
}
.login-container {
  width: 500px;
  position: absolute;
  top: 22%;
  left: 5%;
}
.login-bg {
  position: absolute;
  right: 25%;
  top: 22%;
}
.login-bg img {
  width: 320px;
}
@media screen and (max-width: 760px) {
  .login-bg {
    display: none;
  }
}
</style>
