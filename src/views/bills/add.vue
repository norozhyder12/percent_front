<template>
<b-card ref="mytabs" title="Add Bill">
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
        <b-form ref="form" class="mt-1" @submit.prevent="handleSubmit(addnew)">

            <!-- Header: Personal Info -->
            <div class="d-flex mb-2">
                <feather-icon icon="ApertureIcon" size="19" />
                <h4 class="mb-0 ml-50">
                    General Details
                </h4>
            </div>
            <b-row>
                <b-col cols="12" md="6" lg="6">
                    <validation-provider #default="validationContext" name="Bill Type" rules="required">
                        <b-form-group label="Bill Type" label-for="BillType">
                            <v-select v-model="bill_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="bills_types" label="type_name" :clearable="true" input-id="BillType" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="6" lg="6">
                    <validation-provider #default="validationContext" name="supplier" rules="required">
                        <b-form-group label="supplier" label-for="supplier">
                            <v-select v-model="supplier" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="suppliers" label="full_name" :clearable="true" input-id="Supplier" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="6" lg="6">
                    <validation-provider #default="validationContext" name="Expense" rules="required">
                        <b-form-group label="Type of Expense" label-for="Expense">
                            <v-select v-model="expense_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="expense_types" label="exp_name" :clearable="true" large input-id="Expense" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <validation-provider #default="validationContext" name="Expense" rules="required">
                        <b-form-group label="Branch" label-for="Branch">
                            <b-form-input id="Branch" v-model="branch" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <validation-provider #default="validationContext" name="Expense" rules="required">
                        <b-form-group label="Value" label-for="Value">
                            <b-form-input id="Value" v-model="bill_value" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <validation-provider #default="validationContext" name="Uploads" rules="required">
                        <b-form-group label="Uploads" label-for="dropzone">
                            <vue-dropzone id="dropzone" ref="myVueDropzone" v-model="Uploads" :options="dropzoneOptions" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>

            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="addnew">
                        Add
                    </b-button>
                    <b-button variant="outline-secondary" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="$emit('reset')">
                        Reset
                    </b-button>
                </b-col>

            </b-row>
        </b-form>
    </validation-observer>
</b-card>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from '@axios'
import vSelect from 'vue-select'
import {
    ValidationProvider,
    ValidationObserver,
} from 'vee-validate'

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
        vueDropzone: vue2Dropzone,

        vSelect,

    },
    data() {
        return {
            userData: {},
            suppliers: [],
            bills_types: [],
            expense_types: [],

            bill_type: '',
            supplier: '',
            branch: '',
            bill_value: '',
            expense_type: '',

            dropzoneOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 150,
                maxFilesize: 0.5,
                dictDefaultMessage: "<i class='fa fa-upload m-1'></i>Click Or Drag files here to Upload.",
                headers: {
                    'My-Awesome-Header': 'header value',
                },
            },
        }
    },
    async mounted() {
        this.openLoading()
        await this.fetch_suppliers()
        await this.fetch_type_bills()
        await this.fetch_type_expense()
        this.myloader.close()
    },
    methods: {
        addnew() {

        },
        fetchUser(id) {
            this.openLoading()
            axios
                .get(`/users/${id}`)
                .then(response => {
                    this.userData = response.data.data
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_suppliers() {
            await axios
                .get('/suppliers/list')
                .then(response => {
                    this.suppliers = response.data.data.data
                    console.log(this.suppliers)
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_type_bills() {
            await axios
                .get('/billstypes/list')
                .then(response => {
                    this.bills_types = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_type_expense() {
            await axios
                .get('/expensetypes/list')
                .then(response => {
                    this.expense_types = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.mytabs,

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

<style>
.vs-notification__content__header {
    color: #fff !important;
}
</style>
