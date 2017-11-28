<template lang='pug'>
  .container
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

    this.$store.dispatch('getUserByOAuth',encodeURIComponent(url))
      .then(res => {
          console.log(res)
        if(res.data.success){
          let params = res.data.params
        //   console.log(params)
             
        }
      })
  }
}
</script>

<style scoped>

</style>
