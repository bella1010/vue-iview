<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :error="loginError"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      loginError: ''
    }
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password, code, uniqueId, callback }) {
      this.loginError = ''
      this.handleLogin({ userName, password, code, uniqueId }).then(() => {
        // 还需要查询后台菜单栏，存到store里面
        this.getUserInfo().then(() => {
          this.$router.push({
            name: this.$config.homeName
          });
          callback(true)
        }).catch(error => {
          setTimeout(() => {
            this.loginError = error
            callback(false)
          }, 500)
        });
      }).catch(error => {
        setTimeout(() => {
          this.loginError = error
          callback(false)
        }, 500)
      });
    }
  }
};
</script>

<style>
</style>
