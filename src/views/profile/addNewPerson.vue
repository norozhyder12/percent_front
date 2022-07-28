<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" @hidden="resetForm" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Add Contact Person
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addContact)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="Full Name" rules="required">
                    <b-form-group label="Full Name" label-for="Full Name">
                        <b-form-input id="Full Name" v-model="full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="email" rules="email">
                    <b-form-group label="email" label-for="email">
                        <b-form-input id="email" v-model="email" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <b-form-group label="mobile" label-for="mobile">
                    <vue-phone-number-input v-model="mobile2" default-country-code="SA" @update="onUpdate" />

                </b-form-group>

                <validation-provider #default="validationContext" name="designation" rules="required">
                    <b-form-group label="designation" label-for="designation">
                        <v-select v-model="designation" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" label="name" :reduce="(option) => option.id" :options="designation_list" />
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
            designation: 1 || '',
            mobile: '',
            email: '',
            myloader: null,
            designation_list: [],
            mobile2: ''

        }
    },
    mounted() {
        this.fetch_designation_types();
    },

    methods: {
        resetForm() {
            this.full_name = '';
            this.designation = '';
            this.mobile = '';
            this.email = '';
        },
        addContact() {
            console.log(this.deductions)
            const mydata = {
                full_name: this.full_name,
                designation_id: this.designation,
                mobile: this.mobile,
                email: this.email,

            }
            console.log(mydata)
            axios
                .post('/contact-persons/add',
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
        onUpdate(payload) {
            this.mobile = payload.formatInternational;
        },
        getValidationState({
            dirty,
            validated,
            valid = null,
        }) {
            return dirty || validated ? valid : null
        },
        async fetch_designation_types() {
            await axios
                .get('/business-contact-des/list')
                .then(response => {
                    this.designation_list = response.data.data.data
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
