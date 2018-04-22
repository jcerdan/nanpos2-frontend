<template>
  <div class="modal-card" style="width: auto" id="modal">
    <header class="modal-card-head">
      <p class="modal-card-title">Resum del ticket creat. <br>
        <small class="is-size-7">ID: {{ ticket.idTickets }}<br>
        {{ ticket.data }}</small></p>
    </header>
    <section class="modal-card-body">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Quantitat x Preu</th>
            <th>Descompte</th>
            <th>Preu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ticketLine, index) in ticket.lines">
            <td>{{ ticketLine.detail }}</td>
            <td>{{ticketLine.quantity }} x {{ ticketLine.amount | currency('',2) }}</td>
            <td style="color:red;">
              <span class="has-text-danger" v-if="ticketLine.discountAmount !== 0">{{ ticketLine.discountAmount | currency('€ ',2) }} ({{ ticketLine.discountPercentage | currency('', 2) }}%)</span>
            </td>
            <td>{{ ticketLine.net | currency('€ ',2) }}</td>
          </tr>
          <tr>
            <td colspan="3" >
              <span class="is-pulled-right has-text-danger has-text-weight-semibold">Descompte Acumulat</span>
            </td>
            <td>
              <span class="has-text-danger has-text-weight-semibold">
                {{ ticket.descompteAcumulat | currency('€ ', 2) }}
              </span>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="is-pulled-right has-text-weight-semibold">IGI inclòs</span>
            </td>
            <td>
              <span class="has-text-weight-semibold">
                {{ ticket.impostos | currency('€ ', 2) }}
              </span>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="is-size-4 is-pulled-right has-text-weight-bold">TOTAL</span>
            </td>
            <td>
              <span class="is-size-4 has-text-weight-bold">
                {{ ticket.importTotal | currency('€ ', 2) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success is-pulled-right" v-on:click="printTicket()">
        Imprimir
      </button>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: ['ticket'],
  name: 'ModalTicketLines',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      ticketLines: 'ticketLines'
    })
  },
  methods: {
    ...mapMutations({
      delTicketLine: 'delTicketLine'
    }),
    printTicket: function (idTickets) {
      console.log(idTickets)
      this.$http({url: '/api/tickets/' + this.ticket.idTickets + '/print', method: 'GET'}).then(function (response) {
        console.log('Sent to printer')
      })
      // this.emptyCurrentTicket()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#modal {
  height: auto;
  /* overflow-y: scroll */
}
</style>
