<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isEditUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-edit-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Edit Employee
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(EditEmployee)">
                <b-form-group label="Select an Employee" label-for="employee">
                    <v-select v-model="Payrollemployee.employee_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :reduce="(option) => option.id" :options="employees" label="full_name" :clearable="true" input-id="employee">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!Payrollemployee.employee_id" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>

                <validation-provider #default="validationContext" name="basic_salary">
                    <b-form-group label="Basic Salary" label-for="basic_salary">
                        <b-form-input id="basic_salary" type="number" v-model="Payrollemployee.basic_salary" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="housing">
                    <b-form-group label="Housing" label-for="housing">
                        <b-form-input id="housing" type="number" v-model="Payrollemployee.housing" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="transportation">
                    <b-form-group label="Transportation" label-for="transportation">
                        <b-form-input id="transportation" type="number" v-model="Payrollemployee.transportation" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <additonsList class="green-back" :additions="Payrollemployee.employment_additions" @reftechemp="refetchemployees"></additonsList><br><br>
                <adddeductionList class="red-back" :deductions="Payrollemployee.employment_deductions" @reftechemp="refetchemployees"></adddeductionList>
                <!-- Form Actions -->
                <div class="d-flex mt-2">
                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" size="lg" variant="primary" class="mr-2" type="submit">
                        Update
                    </b-button>
                    <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" size="lg" type="button" variant="outline-secondary" @click="hide">
                        Cancel
                    </b-button>
                </div>

            </b-form>
        </validation-observer>
    </template>
</b-sidebar>
</template>

<script>
import additonsList from './additionsList2';
import adddeductionList from './adddeductionsList2.vue';

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
        additonsList,
        adddeductionList

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
        Payrollemployee: Object

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

            employees: [],

        }
    },
    beforeMount() {
        this.fetch_employees();
    },
    methods: {
        EditEmployee() {
            var data = {
                basic_salary: parseFloat(this.$props.Payrollemployee.basic_salary),
                housing: parseFloat(this.$props.Payrollemployee.housing),
                transportation: parseFloat(this.$props.Payrollemployee.transportation),
                employee_id: this.$props.Payrollemployee.employee_id,
                payroll_id: parseInt(this.$route.params.id),
                additions: this.$props.Payrollemployee.employment_additions,
                deductions: this.$props.Payrollemployee.employment_deductions,
            }
            console.log(data)

            axios
                .post('/payroll-employees/update/' + this.$props.Payrollemployee.id,
                    data)
                .then(response => {
                    this.$emit('refetch-employees');
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Updated.')
                    this.$emit('update:is-edit-user-sidebar-active', false)

                    this.myloader.close()
                    this.hidedailog();
                })
                .catch(error => {
                    this.myloader.close()

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
        refetchemployees() {
            this.$emit('refetch-employees');
        },
        async fetch_employees() {
            await axios
                .get('/employees/list')
                .then(response => {
                    this.employees = response.data.data.data
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

.green-back {
    background: #0080007d;
    padding: 1rem;
    border-radius: 5px;
    color: #fff !important;

    .table td {
        color: #fff !important;

    }

    .table-hover tbody tr {
        &:hover {
            background: none !important;
        }
    }
}

.red-back {
    background: #ff00007d;
    padding: 1rem;
    border-radius: 5px;
    color: #fff !important;

    .table td {
        color: #fff !important;

    }

    .table-hover tbody tr {
        &:hover {
            background: none !important;
        }
    }
}
</style>
