<template>
  <div class="bannerbox">
    <Carousel v-model="value"
              :autoplay="setting.autoplay"
              :loop="setting.loop"
              :arrow="setting.arrow"
              :dots="setting.dots"
              :autoplay-speed="setting.autoplaySpeed"
              :class="cclass"
    >

      <CarouselItem v-for="(item, i) in list" :key="i">
        <a v-if="item.urlType==1 && item.url" class="demo-carousel" :href="item.url" :title="item.title" target="_blank" >
          <img :src="imgBasePath+item.image" :alt="item.title" >
        </a>
        <div v-if="item.urlType==0 || item.url==''" class="demo-carousel" :title="item.title">
          <img :src="imgBasePath+item.image">
        </div>
      </CarouselItem>
    </Carousel>
  </div>
</template>

<script>
  import './banner-carousel.less'
  import config from "@/config";
  const imgBasePath = config.imgBasePath;
  export default {
    name: "BannerCarousel",
    props: ["list","cclass"],
    data() {
      return {
        imgBasePath:imgBasePath,
        value: 0,
        setting: {
          autoplay: true,
          loop: true,
          arrow: 'hover',
          dots: 'inside',
          autoplaySpeed: 5000
        }
      }
    },
    mounted(){
    },
    methods: {

    }
  }
</script>

