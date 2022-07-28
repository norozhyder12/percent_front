<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="md" variant="primary" v-b-modal.emp-modal>
            <span class="text-nowrap">Add Employee</span>
        </b-button>
    </div>
    <b-modal id="emp-modal" ref="emp-modal" centered title="Add Employee" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="EMPLOYEE NAME" rules="required">
                    <b-form-group label="EMPLOYEE NAME" label-for="EMPLOYEE NAME">
                        <b-form-input id="EMPLOYEE NAME" v-model="full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Employment TYPE" rules="required">
                    <b-form-group label="Employment TYPE" label-for="Employment TYPE">
                        <v-select v-model="employment_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" label="name" :options="emptypes" />
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="Employment_number">
                    <b-form-group label="Employment Number" label-for="Employment_number">
                        <b-form-input id="Employment_number" v-model="employment_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <!-- Username -->
                <validation-provider #default="validationContext" name="id_number">
                    <b-form-group label="ID Number" label-for="id_number">
                        <b-form-input id="id_number" v-model="id_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="nationality">
                    <b-form-group label="Nationality" label-for="nationality">
                        <b-form-input id="nationality" v-model="nationality" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="joining_date">
                    <b-form-group label="Joining Date" label-for="joining_date">
                        <b-form-datepicker id="datepicker-placeholder" v-model="joining_date" placeholder="Choose a date" local="en" />
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="contract_duration">
                    <b-form-group label="Contract Duration" label-for="contract_duration">
                        <b-form-input id="contract_duration" v-model="contract_duration" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <b-form-group label="Gosi Registerd" label-for="gosi" label-class="mb-1">
                    <b-form-checkbox-group id="gosi" v-model="gosi" :options="gosiOptions" />
                </b-form-group>

                <div class="d-flex mt-2 align-items-center justify-content-end">

                    <b-button type="button" class="mr-2" variant="outline-secondary" @click="hidedailog">
                        Cancel
                    </b-button>
                    <b-button variant="primary" type="submit">
                        Add
                    </b-button>
                </div>
            </b-form>
        </validation-observer>
    </b-modal>
</div>
</template>

<script>
import axios from '@axios'

import {
    ValidationProvider,
    ValidationObserver,
} from 'vee-validate'
import vSelect from 'vue-select'

export default {
    components: {
        vSelect,
        // Form Validation
        ValidationProvider,
        ValidationObserver,

    },
    data() {
        return {
            full_name: '',
            id_number: '',
            nationality: '',
            joining_date: '',

            basic_salary: '',
            housing: '',
            transportation: '',
            contract_duration: '',
            myloader: null,
            employment_type: '',
            deductions: ['deductions1'],
            additions: ['additions1'],
            employment_number: '',
            emptypes: [],
            net: '',
            gosi: 1,
            gosiOptions: [{
                    text: 'YES',
                    value: 1,
                },
                {
                    text: 'NO',
                    value: 0,
                },
            ],
            myloader: null,

        }
    },
    mounted() {
        this.fetch_emp_types()
    },
    methods: {
        hidedailog() {
            this.$refs['emp-modal'].hide()
            this.resetForm();
        },
        resetForm() {
            this.full_name = '';
            this.id_number = '';
            this.nationality = '';
            this.joining_date = '';
            this.employment_type = '';
            this.employment_number = '';
            this.contract_duration = '';
            this.gosi = '';

        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                full_name: this.full_name,
                id_number: this.id_number,
                nationality: this.nationality,
                joining_date: this.joining_date,
                employment_type_id: this.employment_type.id,
                employee_number: this.employment_number,
                contract_duration: this.contract_duration,
                gosi: this.gosi,

            }
            axios
                .post('/employees/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-emps');
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
                    this.myloader.close()
                    this.hidedailog();
                })
                .catch(error => {
                    this.myloader.close()

                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_emp_types() {
            await axios
                .get('/employment-types/list')
                .then(response => {
                    this.emptypes = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        resetModal() {
            this.name = ''
            this.description = null

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
