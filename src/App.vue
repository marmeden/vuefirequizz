<template>
  <v-app>    
    <toolbar
      :login="login"
      :logout="logout"
      :profile="profile"
      :loggedIn="loggedIn"
    />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Toolbar from '@/components/Toolbar'

export default {
  name: 'app',
  components: { Toolbar },
  computed: {
    ...mapGetters('user', {
      profile: 'profile',
      loggedIn: 'loggedIn'
    })
  },
  methods: {
    ...mapActions('user', {
      login: 'login',
      logout: 'logout'
    })
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
