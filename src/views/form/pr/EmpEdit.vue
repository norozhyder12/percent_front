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

                <!-- Username -->
                <validation-provider #default="validationContext" name="EMPLOYEE NAME" rules="required">
                    <b-form-group label="EMPLOYEE NAME" label-for="EMPLOYEE NAME">
                        <b-form-input id="EMPLOYEE NAME" v-model="myemp.full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Employment TYPE" rules="required">
                    <b-form-group label="Employment TYPE" label-for="Employment TYPE">
                        <v-select v-model="myemp.employment_type_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="emptypes" :reduce="(option) => option.id" label="name" />
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="Employment_number" >
                    <b-form-group label="Employment Number" label-for="Employment_number">
                        <b-form-input id="Employment_number" v-model="myemp.employee_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <!-- Username -->
                <validation-provider #default="validationContext" name="id_number" >
                    <b-form-group label="ID Number" label-for="id_number">
                        <b-form-input id="id_number" v-model="myemp.id_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="nationality" >
                    <b-form-group label="Nationality" label-for="nationality">
                        <b-form-input id="nationality" v-model="myemp.nationality" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="joining_date">
                    <b-form-group label="Joining Date" label-for="joining_date">
                        <b-form-datepicker id="datepicker-placeholder" v-model="myemp.joining_date" placeholder="Choose a date" local="en" />
                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="contract_duration">
                    <b-form-group label="Contract Duration" label-for="contract_duration">
                        <b-form-input id="contract_duration" v-model="myemp.contract_duration" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <b-form-group label="Gosi Registerd" label-for="gosi" label-class="mb-1">
                    <b-form-checkbox-group id="gosi" v-model="myemp.gosi" :options="gosiOptions" />
                </b-form-group>
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
            full_name: '',
            id_number: '',
            nationality: '',
            joining_date: '',

            basic_salary: '',
            housing: '',
            transportation: '',

            myloader: null,
            employment_type: '',
            deductions: ['deductions1'],
            additions: ['additions1'],
            employment_number: '',
            emptypes: [],
            myloader: null,
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
        EditEmployee() {
            // var deductions = [];
            // var additions = [];
            // this.$props.myemp.employment_deductions.forEach(element => {
            //     if (element.name != null) {
            //         deductions.push(element.name);
            //     } else {
            //         deductions.push(element)
            //     }
            // });
            // this.$props.myemp.employment_additions.forEach(element => {
            //     if (element.name != null) {
            //         additions.push(element.name);
            //     } else {
            //         additions.push(element)
            //     }
            // });
            const mydata = {

                full_name: this.$props.myemp.full_name,
                id_number: this.$props.myemp.id_number,
                nationality: this.$props.myemp.nationality,
                employment_type_id: this.$props.myemp.employment_type_id,
                joining_date: this.$props.myemp.joining_date,
                employee_number: this.$props.myemp.employee_number,
                gosi: this.$props.myemp.gosi,
                contract_duration: this.$props.myemp.contract_duration
            }
            const mythis = this
            console.log(mydata)
            axios
                .post(`/employees/update/${this.$props.myemp.id}`,
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
