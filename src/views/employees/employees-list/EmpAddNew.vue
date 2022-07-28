<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" @hidden="resetForm" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
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
            <b-form ref="myForm" class="p-2" @submit.prevent="handleSubmit(addEmployee)" >

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

                <!-- <validation-provider #default="validationContext" name="deductions">
                    <b-form-group label="Deductions" label-for="deductions">
                        <v-select :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" multiple v-model="deductions" taggable push-tags label="Deductions" />
                        <span>deduction follow by ,</span>
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="additions">
                    <b-form-group label="Additions" label-for="deductions">
                        <v-select :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" multiple v-model="additions" taggable push-tags label="Additions" />
                        <span>addition follow by ,</span>
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider> -->
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

        }
    },
    mounted() {
        this.fetch_emp_types();
    },

    methods: {
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
