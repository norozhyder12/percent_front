<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" bg-variant="white" @hidden="resetForm" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Add Item
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addItem)">
                <b-form-group label="Type Of Revenue" label-for="revenue_type">
                    <v-select v-model="revenue_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="revenue_types" label="name" :clearable="true" input-id="revenue_type">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!revenue_type" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
                <b-form-group label="Branch" label-for="branch">
                    <v-select v-model="branch" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="branches" label="name" :clearable="true" input-id="branch">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!branch" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                    <addnewBranch @refetch-branches="fetchbranches" class="mt-2"></addnewBranch>

                </b-form-group>

                <b-form-group label="Cost Center" label-for="costcenter" v-if="branch != '' && branch != null">
                    <v-select v-model="costcenter" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="costcenters.filter(obj => obj.branch_id == branch.id)" label="name" :clearable="true" input-id="costcenter">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!costcenter" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                    <addnewCostCenter :branch_id="branch.id" @refetch-costcenters="fetchcostcenters"  class="mt-2"></addnewCostCenter>

                </b-form-group>

                <validation-provider #default="validationContext" name="quantity">
                    <b-form-group label="Quantity" label-for="quantity">
                        <b-form-input id="quantity" type="number" v-model="quantity" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="unit_price">
                    <b-form-group label="Unit Price" label-for="unit_price">
                        <b-form-input id="unit_price" type="number" v-model="unit_price" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Total Value" rules="required">
                    <b-form-group label="Total Value" label-for="Total Value">
                        <b-form-input id="total_value" type="number" v-model="total_value" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="description">
                    <b-form-group label="Description" label-for="description">
                        <b-form-textarea id="description" v-model="description" :state="getValidationState(validationContext)" trim />

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
import addnewBranch from '@/components/Dialogs/newBranch.vue'
import addnewCostCenter from '@/components/Dialogs/newCostCenter.vue'
export default {
    components: {
        vSelect,
        // Form Validation
        ValidationProvider,
        ValidationObserver,
        addnewBranch,
        addnewCostCenter

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
            bill_type: null,
            description: '',
            total_value: 0,
            expense_id: null,
            branch: '',
            quantity: 0,
            costcenter: '',
            unit_price: 0,
            myloader: null,
            bills_types: [],
            costcenters: [],
            costcentersval: '',
            branches: [],
            revenue_types: [],
            revenue_type: ''

        }
    },
    beforeMount() {
        this.fetch_type_revenue();
        this.fetchbranches();
        this.fetchcostcenters();
    },
    methods: {
                resetForm() {
            this.revenue_type_id = '';
            this.description = '';
            this.total_value = '';
            this.quantity = '';
            this.costcenter = '';
            this.unit_price = '';
            this.branch = '';
        },
        addItem() {
            const mydata = {
                revenue_type_id: this.revenue_type.id,
                description: this.description,
                total_value: this.total_value,
                branch_id: this.branch.id,
                costcenter_id: this.costcenter.id,
                quantity: this.quantity,
                unit_price: this.unit_price,
                     branch_name: this.branch.name
            }
            this.$emit('addItem', mydata);
            this.$emit('update:is-add-new-user-sidebar-active', false)
            this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
        },
        getValidationState({
            dirty,
            validated,
            valid = null,
        }) {
            return dirty || validated ? valid : null
        },

        async fetch_type_revenue() {
            await axios
                .get('/revenue-types/list')
                .then(response => {
                    this.revenue_types = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform,

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
