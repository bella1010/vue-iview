<template>
  <div>
    <h1>pages index</h1>
    <User :user-name="userName"></User>
    <div>
      <div v-if="banners && banners.length>1">
        <banner-carousel :list="banners" :cclass="indexstyle"></banner-carousel>
      </div>
      <div v-else-if="banners.length === 1" class="banne-img">
        <a :href="banners[0].url" :title="banners[0].title" target="_blank">
          <img :src="imgBasePath+banners[0].image" :alt="banners[0].title">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import User from "@/components/user/user";
  import config from "@/config";
  const imgBasePath = config.imgBasePath;
  import {mapActions, mapMutations} from 'vuex';
  import BannerCarousel from "@/components/banner-carousel/banner-carousel";
  import {getBannersByCode} from '@/api/common';
  import {getIndexBannerListInLocalstorage} from '@/libs/util'

  export default {
    name: 'Index',
    data() {
      return {
        banners: [],  // 滚动banner
        imgBasePath: imgBasePath,
      }
    },
    components: {
      User
    },
    mounted() {
      this.getBanner()
    },
    computed: {
      userName() {
        return this.$store.state.user.userName
      }
    },
    methods: {
      ...mapMutations([
        'setIndexBannerList'
      ]),
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit({userName, password}) {

      },
      getBanner() {
        if(getIndexBannerListInLocalstorage().length>0){
          this.banners = getIndexBannerListInLocalstorage();
        }
        getBannersByCode({code: '302'}).then(res => {
          if (res.code === '100'&&res.data && res.data.length>0 ) {
            this.banners = res.data;
            this.setIndexBannerList(res.data)
          }else{
            this.banners = [];
            this.setIndexBannerList()
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
