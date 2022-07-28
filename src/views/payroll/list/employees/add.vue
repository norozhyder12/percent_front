<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Add Employee
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">
                <b-form-group label="Select an Employee" label-for="employee">
                    <v-select v-model="employee" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="employees" label="full_name" :clearable="true" input-id="employee">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!employee" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                    <addNewEmp class="mt-2" @refetch-emps="fetch_employees"></addNewEmp>
                </b-form-group>

                <validation-provider #default="validationContext" name="basic_salary">
                    <b-form-group label="Basic Salary" label-for="basic_salary">
                        <b-form-input id="basic_salary" type="number" v-model="basic_salary" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="housing">
                    <b-form-group label="Housing" label-for="housing">
                        <b-form-input id="housing" type="number" v-model="housing" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="transportation">
                    <b-form-group label="Transportation" label-for="transportation">
                        <b-form-input id="transportation" type="number" v-model="transportation" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <additonsList class="green-back" :additions="additions"></additonsList><br><br>
                <adddeductionList class="red-back" :deductions="deductions"></adddeductionList>
                <!-- Form Actions -->
                <div class="d-flex mt-2">
                    <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" size="lg" variant="primary" class="mr-2" type="submit">
                        Add
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
import additonsList from './additionsList';
import adddeductionList from './adddeductionsList.vue';
import addNewEmp from '@/components/Dialogs/addNewEmp.vue';
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
        adddeductionList,

        addNewEmp

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
        isAddNewUserSidebarActive(val) {
               this.housing = '';
        this.employee = '';
        this.transportation = '';
        this.basic_salary = '';
        this.additions = [];
        this.deductions = [];
        },
    },
    data() {
        return {
            basic_salary: '',
            housing: '',
            employee: '',
            transportation: '',
            employees: [],
            basic_salary: '',
            additions: [],
            deductions: [],

        }
    },
    beforeMount() {
     

        this.fetch_employees();
    },
    methods: {
        addEmployee() {
            var data = {
                basic_salary: parseFloat(this.basic_salary),
                housing: parseFloat(this.housing),
                transportation: parseFloat(this.transportation),
                employee_id: this.employee.id,
                payroll_id: parseInt(this.$route.params.id),
                additions: this.additions,
                deductions: this.deductions,
            }
            console.log(data)

            axios
                .post('/payroll-employees/add',
                    data)
                .then(response => {
                    this.$emit('refetch-employees');
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
                    this.$emit('update:is-add-new-user-sidebar-active', false)

                    this.myloader.close()
                    this.hidedailog();
                })
                .catch(error => {
                   
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                     this.myloader.close()
                })
        },
        addItem() {
            const mydata = {
                employee_id: this.employee.id,
                housing: this.housing,
                transportation: this.transportation,
                basic_salary: this.basic_salary,
                branch_id: this.branch.id,

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
</style>
