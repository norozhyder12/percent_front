<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Add TopUp
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->

                <b-form-group label="Select Payee" label-for="Payee">
                    <v-select v-model="payee" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="payees" label="full_name" :clearable="true" input-id="payee">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!payee" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                    <newPayeeDailog class="mt-2" @refetch-suppliers="fetch_payees"></newPayeeDailog>

                </b-form-group>
                <b-form-group label="Select Fund Source" label-for="moneysource">
                    <v-select v-model="moneysource" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="money_sources" label="name" :clearable="true" input-id="moneysource">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!moneysource" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                <validation-provider #default="validationContext" name="Cash">
                    <b-form-group label="Amount" label-for="Cash">
                        <b-form-input id="cash" v-model="cash" type="number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <!-- Form Actions -->
                <div class="d-flex mt-2">
                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2" type="submit">
                        Add
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
import newPayeeDailog from '@/components/Dialogs/newPayee.vue'

export default {
    components: {
        vSelect,
        // Form Validation
        ValidationProvider,
        ValidationObserver,
        newPayeeDailog

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
    mounted() {
        this.fetch_money_sources();
        this.fetch_payees();
    },
    methods: {
        addEmployee() {
            const mydata = {
                cash: this.cash,
                moneysource_id: this.moneysource.id,
                payee_id: this.payee.id,
            }
            console.log(mydata)
            axios
                .post('/top-up/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-data')
                    this.$emit('update:is-add-new-user-sidebar-active', false)
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                    this.myloader.close()
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
