import Vue from 'vue'
import Vuex from 'vuex'
import pad from './modules/pad'
import accounting from 'accounting'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    pad
  },
  state: {
    ticketLines: [],
    numberOfLines: 0,
    totalTicket: 0
  },
  getters: {
    ticketLines: state => state.ticketLines,
    descompteAcumulat: state => {
      let descompte = 0
      state.ticketLines.forEach(function (element, index) {
        descompte = +descompte + +element.discountAmount
      })
      return +accounting.toFixed(descompte, 2)
    },
    totalTicket: state => {
      let total = 0
      state.ticketLines.forEach(function (element, index) {
        total = +total + +accounting.toFixed(((element.amount * element.quantity) - element.discountAmount), 2)
      })
      return total
    },
    IGI: (state, getters) => {
      return accounting.toFixed((getters.totalTicket * 4.5 / 100), 2)
    }
  },
  mutations: {
    addTicketLine: function (state, line) {
      if (+state.pad.amount !== 0) {
        Vue.set(state.ticketLines, state.numberOfLines, {
          amount: state.pad.amount,
          discountPercentage: state.pad.discountPercentage,
          discountAmount: state.pad.discountAmount,
          quantity: state.pad.quantity,
          net: (accounting.toFixed(((+state.pad.amount * +state.pad.quantity) - +state.pad.discountAmount), 2)),
          category: line.path + ' / ' + line.category
        })
        state.numberOfLines++
        state.pad.amount = ''
        state.pad.discountAmount = ''
        state.pad.discountPercentage = ''
        state.pad.quantity = 1
        /*
        this.currentLine.category = this.path + ' / ' + category
        this.currentLine.net = this.net
        this.ticketLines.$set(this.numberOfLines, this.currentLine)
        this.numberOfLines = this.numberOfLines + 1
        // this.emtpyCurrentLine()

        */
      }
    },
    delTicketLine: function (state, line) {
      state.ticketLines.splice(line, 1)
      this.numberOfLines = this.numberOfLines - 1
    },
    delTicket: function (state) {
      state.ticketLines = []
      state.numberOfLines = 0
      state.totalTicket = 0
    }
  }

})
