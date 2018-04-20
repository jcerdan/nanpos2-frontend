<template>
  <div class="columns">
    <div class="column is-6">

      <div class="field">
        <label class="label" for="import">Import</label>
        <div class="field has-addons">
          <p class="control">
            <button class="button" v-bind:class="{ 'is-success': hasAmountTheFocus }" type="button" v-on:click="changeFocus('currentAmount')">
              <i class="fa fa-eye"></i>&nbsp;€
            </button>
          </p>
          <p class="control">
            <input class="input" type="text" placeholder="0.00" v-model="amount" readonly>
          </p>
          <p class="control">
            <button class="button is-danger" type="button" v-on:click="cleanAmount()">X</button>
          </p>
        </div>
      </div>

      <div class="field">
        <label class="label">Quantitat</label>
        <div class="field has-addons">
          <p class="control">
            <button class="button is-info" type="button" v-if="quantity > 1" v-on:click="decrementQuantity()" >-</button>
          </p>
          <p class="control">
            <input class="input" type="text" placeholder="0.00" v-model="quantity">
          </p>
          <p class="control">
            <button class="button is-info" type="button" v-on:click="incrementQuantity()">+</button>
          </p>
        </div>
      </div>

      <div class="field">
        <label class="label">Descompte</label>
        <div class="field has-addons">
          <p class="control">
            <button class="button" v-bind:class="{ 'is-success': hasDiscountAmountTheFocus }" type="button" v-on:click="changeFocus('discountAmount')">
              <i class="fa fa-eye"></i>&nbsp;€
            </button>
          </p>
          <p class="control">
            <input class="input" type="text" placeholder="0.00" v-model="discountAmount" readonly>
          </p>
          <p class="control">
            <button class="button is-danger" type="button" v-on:click="cleanDiscounts()">X</button>
          </p>
        </div>
        <div class="field has-addons">
          <p class="control">
            <button class="button" v-bind:class="{ 'is-success': hasDiscountPercentageTheFocus }" type="button" v-on:click="changeFocus('discountPercentage')">
              <i class="fa fa-eye"></i>&nbsp;%
            </button>
          </p>
          <p class="control">
            <input class="input" type="text" placeholder="0.00" name="valorDescompte" v-model="discountPercentage" readonly>
          </p>
          <p class="control">
            <button class="button is-danger" type="button" v-on:click="cleanDiscounts()">X</button>
          </p>
        </div>
      </div>
      <h4 class="title">{{ net | currency('€ ', 2) }}</h4>
    </div>

    <div class="column is-6">
      <div class="columns">
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(7)"><h4>&nbsp;&nbsp;7&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(8)"><h4>&nbsp;&nbsp;8&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(9)"><h4>&nbsp;&nbsp;9&nbsp;&nbsp;</h4></button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(4)"><h4>&nbsp;&nbsp;4&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(5)"><h4>&nbsp;&nbsp;5&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(6)"><h4>&nbsp;&nbsp;6&nbsp;&nbsp;</h4></button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(1)"><h4>&nbsp;&nbsp;1&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(2)"><h4>&nbsp;&nbsp;2&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(3)"><h4>&nbsp;&nbsp;3&nbsp;&nbsp;</h4></button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="negative()"><h4>&nbsp;<i class="fa fa-minus-circle"></i>&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber(0)"><h4>&nbsp;&nbsp;0&nbsp;&nbsp;</h4></button>
        </div>
        <div class="column is-4">
          <button type="button" class="button is-default is-large" v-on:click="addNumber('.')"><h4>&nbsp;&nbsp;.&nbsp;&nbsp;</h4></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accounting from 'accounting'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Pad',
  data () {
    return {
      fieldFocus: 'currentAmount'
    }
  },
  computed: {
    net: function () {
      return accounting.toFixed(((+this.$store.getters.amount * +this.$store.getters.quantity) - +this.$store.getters.discountAmount), 2)
    },
    hasAmountTheFocus () {
      return this.fieldFocus === 'currentAmount'
    },
    hasDiscountAmountTheFocus () {
      return this.fieldFocus === 'discountAmount'
    },
    hasDiscountPercentageTheFocus () {
      return this.fieldFocus === 'discountPercentage'
    },
    ...mapGetters({
      amount: 'amount',
      quantity: 'quantity',
      discountAmount: 'discountAmount',
      discountPercentage: 'discountPercentage'
    })
  },
  methods: {
    addNumber: function (numberToAdd) {
      this.$store.commit('addNumber', {
        fieldFocus: this.fieldFocus,
        numberToAdd: numberToAdd
      })
    },
    changeFocus: function (focus) {
      this.fieldFocus = focus
    },
    ...mapMutations({
      negative: 'negative',
      cleanAmount: 'cleanAmount',
      cleanDiscounts: 'cleanDiscounts',
      incrementQuantity: 'incrementQuantity',
      decrementQuantity: 'decrementQuantity'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
