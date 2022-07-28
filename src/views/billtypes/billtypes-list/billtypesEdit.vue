<template>
  <b-sidebar
    id="add-new-user-sidebar"
    ref="myform"
    :visible="isEditUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
@change="(val) => $emit('update:is-edit-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Edit Payee
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(EditEmployee)"
        >

          <!-- Username -->
          <validation-provider
            #default="validationContext"
            name="TYPE NAME"
            rules="required"
          >
            <b-form-group
              label="TYPE NAME"
              label-for="TYPE NAME"
            >
              <b-form-input
                id="TYPE NAME"
                v-model="myemp.type_name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <validation-provider
            #default="validationContext"
            name="type_dec"
          >
            <b-form-group
              label="Description"
              label-for="type_dec"
            >
              <b-form-input
                id="type_dec"
                v-model="myemp.type_dec"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Update
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import axios from '@axios'
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate'
import {
  ref,
} from '@vue/composition-api'
import {
  required,
  alphaNum,
  email,
} from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import store from '@/store'

export default {
  components: {
    vSelect,
    // Form Validation
    ValidationProvider,
    ValidationObserver,

  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEditUserSidebarActive',
    event: 'update:is-edit-user-sidebar-active',
  },
  props: {
    isEditUserSidebarActive: {
      type: Boolean,
      required: true,
    },

    myemp: Object,

  },
  data() {
    return {
      type_name: '',
      type_dec: '',
      myloader: null,

    }
  },
  methods: {
    EditEmployee() {
      const mydata = {
        type_name: this.$props.myemp.type_name,
        type_dec: this.$props.myemp.type_dec,
      }
      const mythis = this
      axios
        .post(`/billstypes/update/${this.$props.myemp.id}`,
          mydata)
        .then(response => {
          this.$emit('refetch-data')
          this.$emit('update:is-edit-user-sidebar-active', false)
          mythis.openNotification('top-right', 'success', 'Done !!', 'The Data has been Updated.')
          this.myloader.close()
        })
        .catch(error => {
          console.log(error.response)
          this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
          mythis.myloader.close()
        })
    },
    getValidationState({
      dirty,
      validated,
      valid = null,
    }) {
      return dirty || validated ? valid : null
    },
    openLoading() {
      this.myloader = this.$vs.loading({
        target: this.$refs.myform,

      })
    },
    openNotification(position = 'top-right', color, title, message) {
      const noti = this.$vs.notification({
        color,
        position,
        title,
        text: message,
      })
    },
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
    .vs__dropdown-menu {
        max-height: 200px !important;
    }
}
</style>
