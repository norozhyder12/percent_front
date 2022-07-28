<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add User
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
          @submit.prevent="handleSubmit(addUser)"
        >

          <!-- Username -->
          <validation-provider
            #default="validationContext"
            name="Username"
            rules="required"
          >
            <b-form-group
              label="Username"
              label-for="username"
            >
              <b-form-input
                id="username"
                v-model="name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Password -->
          <validation-provider
            #default="validationContext"
            name="password"
            rules="required|password"
          >
            <b-form-group
              label="Password"
              label-for="Password"
            >
              <b-form-input
                id="password"
                v-model="password"
                :state="getValidationState(validationContext)"
                type="password"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="required|email"
          >
            <b-form-group
              label="Email"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="email"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- User Role -->
          <validation-provider
            #default="validationContext"
            name="User Role"
            rules="required"
          >
            <b-form-group
              label="User Role"
              label-for="user-role"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="role"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="roleOptions"
                :reduce="val => val.value"
                :clearable="false"
                input-id="user-role"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
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
              Add
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
import countries from '@/@fake-db/data/other/countries'
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
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      name: '',
      email: '',
      role: '',
      password: '',

    }
  },
  methods: {
    addUser() {
      const userData = {
        name: this.name,
        password: this.password,
        role: this.role,
        email: this.email,
      }
      axios
        .post('/users/add',
          userData)
        .then(response => {
          this.$emit('refetch-data')
          this.$emit('update:is-add-new-user-sidebar-active', false)
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getValidationState({
      dirty,
      validated,
      valid = null,
    }) {
      return dirty || validated ? valid : null
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
