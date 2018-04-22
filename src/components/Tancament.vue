<template>
    <main class="container" style="margin-top: 30px;">
      <div class="panel">
        <div class="panel-heading is-success">Parcial del dia {{ partial.data }}</div>
        <div class="panel-block">
          <div class="columns is-vcentered">
            <div class="column is-3">
              <b-field label="Trieu data...">
                <b-datepicker placeholder="Click to select..." icon="calendar-today" v-model="fieldDataPartial">
                  <div class="columns">
                    <div class="column is-6">
                      <button class="button is-danger is-fullwidth" @click="fieldDataPartial = yesterday">
                        <b-icon icon="calendar-today"></b-icon>
                        <span>Ahir</span>
                      </button>
                    </div>
                    <div class="column is-6">
                      <button class="button is-success is-fullwidth" @click="fieldDataPartial = new Date()">
                        <b-icon icon="calendar-today"></b-icon>
                        <span>Avui</span>
                      </button>
                    </div>
                  </div>
                </b-datepicker>
              </b-field>
              <button v-on:click="changeDate()" type="button" class="button is-success">Canvia data</button>
            </div>
            <div class="column">
              <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Número de tickets&nbsp;</th>
                    <th>Descomptes&nbsp;</th>
                    <th>Impostos&nbsp;</th>
                    <th>Total&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>&nbsp;{{ partial.data }}</td>
                    <td>&nbsp;{{ partial.numberOfTickets }}</td>
                    <td>&nbsp;{{ partial.discounts | currency("€ ", 2)  }}</td>
                    <td>&nbsp;{{ partial.taxes | currency("€ ", 2) }}</td>
                    <td>&nbsp;{{ partial.amount | currency("€ ", 2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="column is-2 has-text-centered">
              <button class="button is-danger" v-on:click="closeDay()">Tancar el dia</button>
            </div>
          </div>
        </div>
      </div>
      <h2 class="title">Tancaments</h2>
      <div class="columns">
        <div class="column is-6">
          <b-field grouped>
                <b-select placeholder="Trieu el mes" v-model="selectedMonth">
                    <option v-for="(mes, index) in mesos" :value="index" :key="index">
                        {{ mes }}
                    </option>
                </b-select>
                <b-select placeholder="Trieu l'any" v-model="selectedYear">
                    <option v-for="(any, index) in anys" :value="any" :key="index">
                        {{ any }}
                    </option>
                </b-select>
              <button class="button is-success" v-on:click="changeMonth()">Canvi mes</button>
          </b-field>
        </div>
        <div class="column is-6">
          <b-field class="is-horizontal" label="Filtre de tickets">
            &nbsp;&nbsp;<b-input v-model="search"></b-input>
          </b-field>

        </div>
      </div>

      <table class="table is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Print</th>
            <th style="text-align: center;">Data</th>
            <th style="text-align: right;">Número de tickets</th>
            <th style="text-align: right;">Descomptes</th>
            <th style="text-align: right;">Impostos</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(closing, index) in filterBy(closings.list, search)">
            <td><button class="button is-info" v-on:click="printClosing(closing.idClosings)"><i class="fa fa-print"></i>&nbsp;Imprimir</button></td>
            <td style="text-align: center;">{{ closing.data }}</td>
            <td style="text-align: right;">{{ closing.numberOfTickets }}</td>
            <td style="text-align: right;">{{ closing.discounts | currency("€ ", 2)  }}</td>
            <td style="text-align: right;">{{ closing.taxes | currency("€ ", 2)  }}</td>
            <td style="text-align: right;">{{ closing.amount | currency("€ ", 2)  }}</td>
          </tr>
        </tbody>
        <tfoot v-if="search === ''">
          <tr>
            <td colspan="2"></td>
            <td style="text-align: right;"><button class="button is-success" v-on:click="printMonthlyResume()">Imprimir resum mensual</button></td>
            <td style="text-align: right;"><strong>{{ discount | currency("€ ", 2)  }}</strong></td>
            <td style="text-align: right;"><strong>{{ tax | currency("€ ", 2)  }}</strong></td>
            <td style="text-align: right;"><strong>{{ sum | currency("€ ", 2)  }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </main>
</template>

<script>
import accounting from 'accounting'
import moment from 'moment'
moment.locale('ca')

export default {
  data () {
    return {
      fieldDataPartial: new Date(),
      dataClosings: '',
      yesterday: new Date(moment().add(-1, 'days')),
      closings: {
        list: []
      },
      mesos: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Ocutbre', 'Novembre', 'Desembre'],
      anys: ['2018', '2017', '2016', '2015'],
      selectedMonth: moment().month(),
      selectedYear: moment().year(),
      partial: {
        data: '',
        amount: 0,
        disounts: 0,
        taxes: 0,
        numberOfTickets: 0
      },
      sortKey: 'data',
      reverse: true,
      search: ''
    }
  },
  computed: {
    sum: function () {
      var pivot = this.closings.list.reduce(function (prev, line) {
        return prev + line.amount
      }, 0)
      return accounting.toFixed(pivot, 2)
    },
    discount: function () {
      var pivot = this.closings.list.reduce(function (prev, line) {
        return prev + line.discounts
      }, 0)
      return accounting.toFixed(pivot, 2)
    },
    tax: function () {
      var pivot = this.closings.list.reduce(function (prev, line) {
        return prev + line.taxes
      }, 0)
      return accounting.toFixed(pivot, 2)
    }
  },
  beforeMount: function () {
    this.dataClosings = moment().format('YYYY-MM')
    this.getClosings()
    this.$http.get('http://localhost:8081/api/closing?date=' + moment().format('YYYY-MM-DD')).then(function (response) {
      this.partial = {
        data: moment().format('YYYY-MM-DD'),
        amount: response.data.total,
        discounts: response.data.descomptes,
        taxes: response.data.impostos,
        numberOfTickets: response.data.totalTickets
      }
    }, function (response) {
      console.log('error', response)
    })
  },
  methods: {
    getClosings: function () {
      this.$http.get('http://localhost:8081/api/closings?date=' + this.dataClosings).then(function (response) {
        this.closings.list = response.data
      }, function (response) {
        console.log('error: ', response)
      })
    },
    changeDate: function (data) {
      this.$http.get('http://localhost:8081/api/closing?date=' + moment(this.fieldDataPartial).format('YYYY-MM-DD')).then(function (response) {
        this.partial = {
          data: moment(this.fieldDataPartial).format('YYYY-MM-DD'),
          amount: response.data.total,
          discounts: response.data.descomptes,
          taxes: response.data.impostos,
          numberOfTickets: response.data.totalTickets
        }
      }, function (response) {
        console.log('error', response)
      })
    },
    closeDay: function () {
      this.$http.post('http://localhost:8081/api/closings', this.partial).then(function (response) {
        this.getClosings()
        /*
        console.log(response.data)
        this.partial.idClosings = response.data
        this.closings.list.push(this.partial)
        console.log('Closing saved.', response.data)
        */
      }, function (error) {
        console.log('error', error)
      })
    },
    changeMonth: function () {
      console.log(moment().month(this.selectedMonth))
      this.$http.get('http://localhost:8081/api/closings?date=' + this.selectedYear + '-' + moment().month(this.selectedMonth).format('MM')).then(function (response) {
        this.closings.list = response.data
      }, function (response) {
        console.log('error: ', response)
      })
    },
    printClosing: function (idClosings) {
      this.$http({url: '/api/closings/' + idClosings + '/print', method: 'GET'}).then(function (response) {
        console.log(response.data)
        this.currentClosing = response.data
      }, function (response) {
        console.log('error: ' + response)
      })
    },
    printMonthlyResume: function () {
      var mes = moment(this.dataClosings)
      var params = {
        month: mes.format('MMMM YYYY').toUpperCase(),
        sum: this.sum,
        discount: this.discount,
        taxes: this.tax
      }
      this.$http({
        url: '/api/closings/monthly/print',
        method: 'GET',
        params
      }).then(function (response) {
        console.log(response.data)
        this.currentClosing = response.data
      }, function (response) {
        console.log('error: ' + response)
      })
    }
  }
}
</script>

<style scoped>
.panel-block .columns{
  width: 100%;
}
</style>
