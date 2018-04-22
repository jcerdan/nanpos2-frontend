<template>
  <div>
    <div class="columns">
      <div class="column is-3">Nivell: {{ categories.level }}</div>
      <div class="column is-9">Camí:  {{ path }}</div>
    </div>

    <div class="columns">&nbsp;</div>

    <div class="columns is-multiline is-centered is-2">
      <div class="column is-one-quarter" style="margin-bottom: 10px;" v-for="(category, index) in categories.list">
        <button v-if="category.last == 1" type="button" class="button is-primary is-size-6 is-fullwidth" style="height: 4em !important;" v-on:click="addTicketLine(category.name)">{{ category.name }}</button>
        <button v-else type="button" class="button is-info is-fullwidth is-size-6" style="height: 4em !important;"  v-on:click="forwardCategory(category)">{{ category.name }}</button>
      </div>
      <button class="button is-danger is-size-6 is-fullwidth" style="height: 4em !important;" v-if="categories.level >= 1" v-on:click="backwardCategory()"> << </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      categories: {
        level: 0,
        path: [],
        list: []
      }
    }
  },
  beforeMount: function () {
    this.$http({url: '/api/categories', method: 'GET'}).then(function (response) {
      this.categories.list = response.data
    }, function (response) {
      console.log('error: ' + response.data)
    })
  },
  computed: {
    path: function () {
      var fullpath = ''
      this.categories.path.forEach(function (element, index) {
        fullpath = fullpath + ' / ' + element.name
      })
      return fullpath
    }
  },
  methods: {
    forwardCategory: function (category) {
      this.$http({url: 'http://localhost:8081/api/categories/' + category.idCategories, method: 'GET'}).then(function (response) {
        this.categories.list = response.data
        this.$set(this.categories.path, this.categories.level, category)
        this.categories.level += 1
      }, function (error) {
        console.log('error: ' + error)
      })
    },
    backwardCategory: function () {
      // let category = this.categories.path[this.categories.level - 1]
      this.categories.path.pop()
      this.categories.level -= 1
      if (this.categories.level > 0) {
        let category = this.categories.path[this.categories.level - 1]
        console.log('url', 'http://localhost:8081/api/categories/' + category.idCategories)
        this.$http({url: 'http://localhost:8081/api/categories/' + category.idCategories, method: 'GET'}).then(function (response) {
          this.categories.list = response.data
        }, function (response) {
          console.log('error: ' + response)
        })
      // the false case
      } else {
        this.$http({url: 'http://localhost:8081/api/categories', method: 'GET'}).then(function (response) {
          console.log(response.data)
          this.categories.list = response.data
        }, function (error) {
          console.log('error: ' + error)
        })
      }
    },
    addTicketLine: function (category) {
      if (+this.$store.getters.amount !== 0) {
        this.$store.commit('addTicketLine', {
          path: this.path.trim(),
          category: category.trim()
        })
        this.$http({url: 'http://localhost:8081/api/categories', method: 'GET'}).then(function (response) {
          this.categories.list = response.data
        }, function (response) {
          console.log('error: ' + response)
        })
        this.categories.level = 0
        this.categories.path = []
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
