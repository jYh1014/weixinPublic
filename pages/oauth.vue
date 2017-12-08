<template lang='pug'>
  
</template>
<script>
function getUrlParam(param){
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)

  return result ?decodeURIComponent(result[2]) : null
}
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `loading`
    }
  },
  async beforeMount(){
    let wx = window.wx
    let url = window.location.href
    
    let {data} = await this.$store.dispatch('getWechatOAuth',url)
    console.log(data)
    if(data.success){
      await this.$store.dispatch('setAuthUser',data.data)
      let paramsArr = getUrlParam('state').split('_')
      let visit = paramsArr.length === 1?`/${paramsArr[0]}`:`${paramsArr[0]}?id=${paramsArr[i]}`
      console.log(paramsArr)
      this.$router.replace(visit)

    }else {
      throw new Error('用户信息获取失败')
    }
    this.$store.dispatch('getUserByOAuth',encodeURIComponent(url))
      .then(res => {
          // console.log(res)
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
