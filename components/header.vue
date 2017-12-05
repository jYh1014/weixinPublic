<template lang='pug'>
  nav#nav(v-if='navVisible')
    nuxt-link(v-for='(item,index) in navList' :key='index' :to='item.path')
      div(v-if='index === 0')
        img(v-if='activeRoute !== item.name' src='~static/img/home.png')
        img(v-else src='~static/img/home-selected.png')
      div(v-else-if='index === 1')
        img(v-if='activeRoute !== item.name' src='~static/img/shopping.png')
        img(v-else src='~static/img/shopping-selected.png')
      div(v-else)
        img(v-if='activeRoute !== item.name' src='~static/img/user.png')
        img(v-else src='~static/img/user-selected.png')
      p {{item.text}}
</template>

<style lang='sass' src='../static/sass/nav.sass'>

</style>
