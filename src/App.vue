<template>
  <div id="app">
    <header>

      <nav class="navbar is-info is-fixed-top">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            NAN POS&nbsp;<i class="fas fa-desktop" aria-hidden="false"></i>
          </a>
          <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu">
          <div class="navbar-start">
            <router-link to="/" class="navbar-item">
              <i class="fa fa-shopping-basket" aria-hidden="true"></i>&nbsp;TICKET
            </router-link>
            <router-link to="/historic" class="navbar-item">
              <i class="fa fa-history" aria-hidden="true"></i>&nbsp;HISTÒRIC
            </router-link>
            <router-link to="/tancaments" class="navbar-item">
              <i class="fa fa-lock" aria-hidden="true"></i>&nbsp;TANCAMENTS
            </router-link>
          </div>

          <div class="navbar-end">
            <a class="navbar-item" href="https://bulma.io/">
              OBRIR CALAIX
            </a>
            <a class="navbar-item" href="https://bulma.io/">
              ABOUT
            </a>
          </div>
        </div>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  /*
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  */
}
</style>
