import accounting from 'accounting'

// initial state
const state = {
  discountAmount: '',
  discountPercentage: '',
  amount: '',
  quantity: 1
}

// getters
const getters = {
  discountAmount: state => state.discountAmount,
  discountPercentage: state => state.discountPercentage,
  amount: state => state.amount,
  quantity: state => state.quantity
}

// actions
const actions = {

}

// mutations
const mutations = {
  cleanDiscounts (state) {
    state.discountAmount = ''
    state.discountPercentage = ''
  },
  cleanAmount: function () {
    state.amount = ''
  },
  addNumber: function (state, object) {
    switch (object.fieldFocus) {
      case 'discountAmount':
        state.discountAmount = state.discountAmount + object.numberToAdd
        if (state.amount > 0) {
          state.discountPercentage = '' + accounting.toFixed((state.discountAmount / (state.amount * state.quantity)) * 100, 2)
        }
        break
      case 'discountPercentage':
        state.discountPercentage = state.discountPercentage + object.numberToAdd
        if (state.amount > 0) {
          state.discountAmount = '' + String(((state.amount * state.quantity) * state.discountPercentage / 100))
        }
        break
      case 'currentAmount':
        state.amount = '' + state.amount + object.numberToAdd
        break
    }
  },
  negative: function () {
    state.amount = -Math.abs(state.amount)
  },
  incrementQuantity: function (state) {
    this.commit('cleanDiscounts')
    state.quantity++
  },
  decrementQuantity: function (state) {
    this.commit('cleanDiscounts')
    state.quantity--
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
