<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isEditUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-edit-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Edit Contact Person
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(EditContact)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="Full Name" rules="required">
                    <b-form-group label="Full Name" label-for="Full Name">
                        <b-form-input id="Full Name" v-model="mycontact.full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="email" rules="email">
                    <b-form-group label="email" label-for="email">
                        <b-form-input id="email" v-model="mycontact.email" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="designation" rules="required">
                    <b-form-group label="designation" label-for="designation">
                        <v-select v-model="mycontact.designation_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :reduce="(option) => option.id" label="name" :options="designation_list" />
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <!-- Form Actions -->
                <div class="d-flex mt-2">
                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2" type="submit">
                        Update
                    </b-button>
                    <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="button" variant="outline-secondary" @click="hide">
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

        mycontact: Object,

    },
    data() {
        return {

            myloader: null,
designation_list:[]
        }
    },
    mounted() {
        this.fetch_designation_types();
    },
    methods: {
        EditContact() {
            this.openLoading();
            const mydata = {

                full_name: this.$props.mycontact.full_name,
                mobile: this.$props.mycontact.mobile,
                email: this.$props.mycontact.email,
                designation_id: this.$props.mycontact.designation_id,


            }
            const mythis = this
            axios
                .post(`/contact-persons/update/${this.$props.mycontact.id}`,
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
  async fetch_designation_types() {
            await axios
                .get('/business-contact-des/list')
                .then(response => {
                    this.designation_list = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
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
