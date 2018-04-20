<template>
  <div>
  <table class="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th></th>
        <th>Categoria</th>
        <th>Quantitat x Preu</th>
        <th>Descompte</th>
        <th>Preu</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ticketLine, index) in ticketLines">
        <td>
          <button class="button is-danger" type="button" v-on:click="delTicketLine(index)">X</button>
        </td>
        <td>{{ ticketLine.category }}</td>
        <td>{{ticketLine.quantity }} x {{ ticketLine.amount | currency('',2) }}</td>
        <td style="color:red;">
          <span class="has-text-danger" v-if="ticketLine.discountAmount !== ''">{{ ticketLine.discountAmount | currency('€ ',2) }} ({{ ticketLine.discountPercentage | currency('', 2) }}%)</span>
        </td>
        <td>{{ ticketLine.net | currency('€ ',2) }}</td>
      </tr>
      <tr>
        <td colspan="4" >
          <span class="is-pulled-right has-text-danger has-text-weight-semibold">Descompte Acumulat</span>
        </td>
        <td>
          <span class="has-text-danger has-text-weight-semibold">
            {{ this.$store.getters.descompteAcumulat | currency('€ ', 2) }}
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <span class="is-pulled-right has-text-weight-semibold">IGI inclòs</span>
        </td>
        <td>
          <span class="has-text-weight-semibold">
            {{ this.$store.getters.IGI | currency('€ ', 2) }}
          </span>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <span class="is-size-4 is-pulled-right has-text-weight-bold">TOTAL</span>
        </td>
        <td>
          <span class="is-size-4 has-text-weight-bold">
            {{ this.$store.getters.totalTicket | currency('€ ', 2) }}
          </span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5" style="text-align: right;">
          <button v-if="this.$store.getters.totalTicket != 0" class="button is-success" v-on:click="saveAndPrintTicket()">
            Guardar i Imprimir
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
  <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <modal-ticket-lines v-bind="formProps"></modal-ticket-lines>
  </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ModalTicketLines from '@/components/ModalTicketLines'

export default {
  components: {
    ModalTicketLines
  },
  name: 'TicketLines',
  data () {
    return {
      isComponentModalActive: false,
      formProps: {
        ticket: {}
      }
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
    saveAndPrintTicket: function () {
      this.isComponentModalActive = true
      var ticket = {
        totalTicket: this.$store.getters.totalTicket,
        descompteAcumulat: this.$store.getters.descompteAcumulat,
        IGI: this.$store.getters.IGI,
        lines: this.$store.getters.ticketLines
      }
      this.$http.post('http://localhost:8081/api/tickets', ticket).then(function (response) {
        console.log('response:', response)
        let ticketID = response.data.result
        this.$store.commit('delTicket')
        this.$http.get('http://localhost:8081/api/tickets/' + ticketID).then(function (response) {
          this.formProps.ticket = response.data
          console.log(this.formProps.ticket)
          this.showModal = true
        }, function (error) {
          console.log('error: ' + error)
        })
      }, function (error) {
        console.log('error: ' + error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
