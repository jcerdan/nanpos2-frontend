<template>
  <main class="container is-fullhd" style="margin-top: 30px;">
    <div class="columns">
      <div class="column is-7">
        <TicketLines></TicketLines>
      </div>

      <div class="column is-5">
        <pad></pad>

        <Categories></Categories>
      </div>
    </div>
  </main>
</template>

<script>
import Pad from '@/components/Pad.vue'
import TicketLines from '@/components/TicketLines.vue'
import Categories from '@/components/Categories.vue'

export default {
  name: 'ticket',
  data () {
    return {
      ticketLines: []
    }
  },
  components: {
    Pad,
    TicketLines,
    Categories
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
