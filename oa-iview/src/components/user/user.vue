<template>
  <div class="user">
    <span v-if="userName">
      您好！<a href="/ucenter/personinfo/userInfoList.jhtml?#menuid=4001" class="corg">{{userName}}</a>
    </span>
    <span v-if="!userName" id="pLoginInfo" class="logininfo">
      <a rel="nofollow" class="jsHephaestusClick" data-hephaestus="login-cecport" href="/ucenter/ulogin/login.jhtml">登录</a>
      <a rel="nofollow" class="jsHephaestusClick" data-hephaestus="register-cecport" href="/ucenter/ureg/reg.jhtml">注册</a>
    </span>

    <a class="user-login-out" href="javascript:void(0);" @click="logout" v-if="userName">退出</a>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import config from '@/config'
const { cookieExpires } = config
import Cookies from 'js-cookie'

export default {
  name: 'User',
  props: {
    userName: {
      type: String,
      default:''
    }
  },
  data(){
    return {
      showCts:false,
      ctsStatus:'',
      toCtsBtn:''
    }
  },
  mounted(){
    // this.checkCts();
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout() {
      this.handleLogOut().then(() => {
        location.href='/ucenter/ulogin/logout.jhtml';
      })

    },
    closeCts(){
      // 关闭显示，如果是保留了登录状态，关闭当天不再显示
      Cookies.set("clstm", this.getCurrDate(), {
        expires: cookieExpires || 1
      });
      this.closeCts = false;
    },
    message() {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    },

    checkCts() {
      let ctsHtml = "";
      // return ctsHtml;// 暂时不需要上线，暂时返回空值
      // Cookies.set(TOKEN_KEY, token, {
      //   expires: cookieExpires || 1
      // })

      var cts = Cookies.get("cts"), pid = Cookies.get("pid"), ctsStatus = "未认证";
      //1 认证中 2 认证异常 3 已认证 4 认证失败 5未认证
      if (cts != null && cts != undefined && cts != "") {
        cts = parseInt(cts);
        switch (cts) {
          case 1:
            this.ctsStatus = "认证中";
            break;
          case 2:
            this.ctsStatus = "认证异常";
            break;
          case 4:
            this.ctsStatus = "认证失败";
            break;
          case 5:
            this.ctsStatus = "未认证";
            break;
          default:
            this.ctsStatus = "未知";
            break;
        }
        var showTipClass = "";
        var clsTm = Cookies.get("clstm");
        if (clsTm && clsTm.replace(/\//ig, "") == this.getCurrDate()) {
          this.showCts = false;
        }else{
          this.showCts = true;
        }
        // 如果是已经认证或非企业账号则不需要显示 ， 跳过
        if (cts == 3 || cts == 0) {
          return;
        }
        // 去认证
        /*this.toCtsBtn = '<a href="/ucenter/personinfo/company/info.jhtml?#menuid=4001" class="corg ml5">去认证&gt;&gt;</a>';
        if (undefined != pid && null != pid && pid == 1) { // 如果是子账号，则不需要”去认证“的字样
          this.toCtsBtn = '';
        }
        ctsHtml = '<span class="corg"><a href="/ucenter/personinfo/company/info.jhtml?#menuid=4001" class="cred">（' + ctsStatus + '）</a>' +
          '<div class="login_ed ' + showTipClass + '">认证后下单更方便哦~' + toRZ +
          '</div></span>';*/


      }
    },

    // 获取当前时间
    getCurrDate(){
      let _date = new Date();
      let _year = _date.getFullYear();
      let _month = (_date.getMonth() + 1)>9?(_date.getMonth() + 1):"0"+(_date.getMonth() + 1);
      let _day = _date.getDate()>9?_date.getDate():"0"+_date.getDate();
      let _dateStr = _year + "" + _month + "" + _day;
      return _dateStr;
    }
  }
}
</script>
