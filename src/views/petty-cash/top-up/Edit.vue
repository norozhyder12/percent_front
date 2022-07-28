<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isEditUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-edit-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Edit TopUp
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(EditEmployee)">

                <!-- Username -->
                <b-form-group label="Select Payee" label-for="Payee">
                    <v-select v-model="myemp.payee_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :reduce="(option) => option.id" :options="payees" label="full_name" :clearable="true" input-id="payee">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!myemp.payee_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                <b-form-group label="Select Fund Source" label-for="moneysource">
                    <v-select v-model="myemp.moneysource_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :reduce="(option) => option.id" :options="money_sources" label="name" :clearable="true" input-id="moneysource">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!myemp.moneysource_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                <validation-provider #default="validationContext" name="Cash">
                    <b-form-group label="Amount" label-for="Cash">
                        <b-form-input id="cash" v-model="myemp.cash" type="number" :state="getValidationState(validationContext)" trim />

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

        myemp: Object,

    },
    data() {
        return {
            type: '',
            cash: '',
            moneysource: '',
            payees: [],
            payee: '',

            myloader: null,
            money_sources: [],

        }
    },
     mounted(){
        this.fetch_money_sources();
        this.fetch_payees();
    },
    methods: {
        EditEmployee() {
            const mydata = {
                cash: this.$props.myemp.cash,
                moneysource_id: this.$props.myemp.moneysource_id,
                payee_id: this.$props.myemp.payee_id,
            }
            const mythis = this
            axios
                .post(`/top-up/update/${this.$props.myemp.id}`,
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
        async fetch_money_sources() {
            await axios
                .get('/money-sources/list')
                .then(response => {
                    this.money_sources = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_payees() {
            await axios
                .get('/payees/list')
                .then(response => {
                    this.payees = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
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
