<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Edit New
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addItem)">
                <b-form-group label="Type Of Bill" label-for="bill_type">
                    <v-select v-model="itemData.bill_type_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="bills_types" :reduce="(option) => option.id" label="type_name" :clearable="true" input-id="bill_type">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!itemData.bill_type_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                <b-form-group label="Type Of Expense" label-for="expense_id">
                    <v-select v-model="itemData.expense_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="expense_types" :reduce="(option) => option.id" label="exp_name" :clearable="true" input-id="expense_id">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!itemData.expense_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                    <b-form-group label="Branch" label-for="branch">
                    <v-select v-model="itemData.branch_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="branches" :reduce="(option) => option.id" label="name" :clearable="true" input-id="branch">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!itemData.branch_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>

                <b-form-group label="Cost Center" label-for="costcenter">
                    <v-select v-model="itemData.costcenter_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :reduce="(option) => option.id"  :options="costcenters.filter(obj => obj.id == itemData.branch.id)" label="name" :clearable="true" input-id="costcenter">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!itemData.costcenter_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>

                <validation-provider #default="validationContext" name="quantity">
                    <b-form-group label="Quantity" label-for="quantity">
                        <b-form-input id="quantity" type="number" v-model="itemData.quantity" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="unit_price">
                    <b-form-group label="Unit Price" label-for="unit_price">
                        <b-form-input id="unit_price" type="number" v-model="itemData.unit_price" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Total Settlement Value" rules="required">
                    <b-form-group label="Total Settlement Value" label-for="Total Settlement Value">
                        <b-form-input id="Total Settlement Value" type="number" v-model="itemData.total_value" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="description">
                    <b-form-group label="Description" label-for="description">
                        <b-form-textarea id="description" v-model="itemData.description" :state="getValidationState(validationContext)" trim />

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
        prop: 'isAddNewUserSidebarActive',
        event: 'update:is-add-new-user-sidebar-active',
    },
    props: {
        isAddNewUserSidebarActive: {
            type: Boolean,
            required: true,
        },
        itemData:Object

    },
    watch: {
        quantity(val) {
            if (val != 0) {
                if (this.unit_price != 0) {
                    this.total_value = this.unit_price * val;
                }
            }
        },
        unit_price(val) {
            if (val != 0) {
                if (this.quantity != 0) {
                    this.total_value = this.quantity * val;
                }
            }
        }
    },
    data() {
        return {
              expense_types: [],
            bill_type:null,
            description: '',
            total_value: 0,
            expense_id: null,
            branch: '',
            quantity: 0,
            costcenter:'',
            unit_price: 0,
            myloader: null,
            bills_types: [],
            costcenters:[],
            costcentersval:'',
            branches:[],
        }
    },
    beforeMount() {
        this.fetch_type_expense();
        this.fetch_type_bills();
            this.fetchbranches();
        this.fetchcostcenters();
    },
    methods: {
        addItem() {
            const mydata = {
                bill_type_id:this.$props.itemData.bill_type_id,
                expense_id: this.$props.itemData.expense_id,
                description: this.$props.itemData.description,
                total_value: this.$props.itemData.total_value,
                branch_id:this.$props.itemData.branch_id,
                costcenter_id:this.$props.itemData.costcenter_id,
                quantity: this.$props.itemData.quantity,
                unit_price: this.$props.itemData.unit_price,
            }
           axios
                .post(`/settlements/update/item/`+this.$props.itemData.id, mydata, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    console.log(response)
                   // this.$router.push('/bills/'+ this.mybill.id)
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Updated.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
            
            this.$emit('update:is-add-new-user-sidebar-active', false)
        },
        getValidationState({
            dirty,
            validated,
            valid = null,
        }) {
            return dirty || validated ? valid : null
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
               fetchcostcenters() {
            axios
                .get('/cost-center/list')
                .then(response => {
                    this.costcenters = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                })
        },
          fetchbranches() {
            axios
                .get('/branches/list')
                .then(response => {
                    this.branches = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                })
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
