<template>
  <main class="container" style="margin-top: 30px;">
    <h2 class="title">Històric del dia</h2>

    <div class="columns">
      <div class="column is-4">
        <b-field label="Data:" class="field is-horizontal">&nbsp;&nbsp;
          <b-datepicker placeholder="Click to select..." icon="calendar-today" v-model="dataTickets">
            <div class="columns">
              <div class="column is-6"><button class="button is-danger is-fullwidth" @click="dataTickets = yesterday">
                <b-icon icon="calendar-today"></b-icon>
                <span>Ahir</span>
            </button></div>
              <div class="column is-6"><button class="button is-success is-fullwidth" @click="dataTickets = new Date()">
                <b-icon icon="calendar-today"></b-icon>
                <span>Avui</span>
            </button></div>
            </div>


          </b-datepicker>&nbsp;&nbsp;
          <button v-on:click="changeDate()" type="button" class="button is-default">Canvia data</button>
        </b-field>
      </div>
      <div class="column is-8">
         <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Filtre de tickets</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="search">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-12">
        <table class="table is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Print</th>
              <th>Veure</th>
              <th>#</th>
              <th style="text-align: center;">idTicket</th>
              <th style="text-align: center;">Hora</th>
              <th style="text-align: right;">Import</th>
              <th style="text-align: right;">Desc. acumulat</th>
              <th style="text-align: right;">IGI  inclòs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ticket, index) in filterBy(tickets.list, search)">
              <td><button class="button is-info" v-on:click="printTicket(ticket.idTickets)"><i class="fa fa-print"></i>&nbsp;Imprimir</button></td>
              <td><button class="button is-success" v-on:click="showTicket(ticket.idTickets)"><i class="fa fa-eye"></i>&nbsp;Veure</button></td>
              <td>{{ index + 1 }}</td>
              <td style="text-align: center;">{{ ticket.idTickets }}</td>
              <td style="text-align: center;">{{ ticket.data }}</td>
              <td style="text-align: right;">{{ ticket.importTotal | currency("€ ", 2) }}</td>
              <td style="text-align: right;">{{ ticket.descompteAcumulat | currency("€ ", 2) }}</td>
              <td style="text-align: right;">{{ ticket.impostos | currency("€ ", 2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5"></td>
              <td style="text-align: right;"><strong>{{ sum | currency("€ ", 2) }}</strong></td>
              <td style="text-align: right;"><strong>{{ discount | currency("€ ", 2) }}</strong></td>
              <td style="text-align: right;"><strong>{{ tax | currency("€ ", 2) }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <b-modal :active.sync="isComponentModalActive" has-modal-card>
      <modal-ticket-lines v-bind="formProps"></modal-ticket-lines>
    </b-modal>
  </main>
</template>

<script>
import moment from 'moment'
import ModalTicketLines from '@/components/ModalTicketLines'

export default {
  components: {
    ModalTicketLines
  },
  name: 'Historic',
  data () {
    return {
      isComponentModalActive: false,
      formProps: {
        ticket: {}
      },
      dataTickets: '',
      yesterday: new Date(moment().add(-1, 'days')),
      search: '',
      tickets: {
        list: [
          {
            idTickets: '1',
            data: '2018-03-01',
            importTotal: '1.00',
            descompteAcumulat: '0.20',
            impostos: '0.12'
          }
        ]
      }
    }
  },
  beforeMount: function () {
    this.dataTickets = new Date()
    this.changeDate()
  },
  computed: {
    sum: function () {
      return this.tickets.list.reduce(function (prev, line) {
        return prev + line.importTotal
      }, 0)
    },
    discount: function () {
      return this.tickets.list.reduce(function (prev, line) {
        return prev + line.descompteAcumulat
      }, 0)
    },
    tax: function () {
      return this.tickets.list.reduce(function (prev, line) {
        return prev + line.impostos
      }, 0)
    }
  },
  methods: {
    changeDate: function () {
      console.log(this.dataTickets)
      this.$http.get('http://localhost:8081/api/ticketsHistory?date=' + moment(this.dataTickets).format('YYYY-MM-DD')).then(function (response) {
        console.log(response.data)
        this.tickets.list = response.data
        this.search = ''
      }, function (response) {
        console.log('error: ' + response)
      })
    },
    showTicket: function (idTickets) {
      this.$http.get('http://localhost:8081/api/tickets/' + idTickets).then(function (response) {
        console.log(response.data)
        this.formProps.ticket = response.data
        this.isComponentModalActive = true
      }, function (response) {
        console.log('error: ' + response)
      })
    },
    printTicket: function (idTickets) {
      this.$http({url: '/api/tickets/' + idTickets + '/print', method: 'GET'}).then(function (response) {
        console.log(response.data)
        idTickets = null
      }, function (response) {
        console.log('error: ' + response)
      })
    }
  }
}
</script>

<style scoped>

</style>
