<template lang='pug'>
  .container
    .character-header
        img.background(v-if='character.images' :src='character.images[character.images.length-1]')
        .media
            img(v-if='character.profile' :src='character.profile')
            .desc
                .names
                    p.cname {{character.cname}}
                    p.name {{character.name}}
    .character-body
        .intro 
            p(v-for='(item,index) in character.intro' :key='index') {{item}}
        .stills
            img(v-for='(item,index) in character.images' :key='index' :src='item')
        .items(v-for='(item,index) in character.sections' :key='index')
            .title {{item.title}}
            .body(v-for='(text,itemIndex) in item.content' :key='itemIndex') {{text}}
        
</template>
<script>
import {mapState} from 'vuex'
export default {
  head(){
      return {
          title: '家族成员详情'
      }
  },
  computed: {
      ...mapState({
          character: 'currentCharacter'
      })
  },
  beforeCreate(){
      let id = this.$route.query.id
      this.$store.dispatch('showCharacter',id)
  }
}
</script>

<style scoped lang='sass' src='../../static/sass/character.sass'>

</style>
