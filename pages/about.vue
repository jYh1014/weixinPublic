<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    
  </section>
</template>
<script>
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `测试页面`
    }
  },
  beforeMount(){
    let wx = window.wx
    let url = window.location.href

    this.$store.dispatch('getWechatSignature',url)
      .then(res => {
        // console.log(res)
        if(res.data.success){
          let params = res.data.params
          // console.log(params)
          wx.config({
            debug: true,
            appId: params.appId,
            timestamp: params.timestamp,
            nonceStr: params.noncestr,
            signature: params.signature,
            jsApiList: [
              'previewImage',
              'uploadImage',
              'downloadImage',
              'chooseImage',
              'onMenuShareTimeline',
              'hideAllNonBaseMenuItem',
              'showMenuItems'
            ]
          })
          wx.ready(() => {
            wx.hideAllNonBaseMenuItem()
            console.log('success')
          })
        }
      })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
