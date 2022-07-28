<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isAddNewUserSidebarActive" @hidden="resetForm" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Add Supplier
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="SUPPLIER NAME" rules="required">
                    <b-form-group label="SUPPLIER NAME" label-for="SUPPLIER NAME">
                        <b-form-input id="SUPPLIER NAME" v-model="full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Contact Person" rules="required">
                    <b-form-group label="Contact Person" label-for="Contact Person">
                        <b-form-input id="Contact Person" v-model="contact_person" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <!-- Username -->
                <validation-provider #default="validationContext" name="email" rules="email">
                    <b-form-group label="email" label-for="email">
                        <b-form-input id="email" v-model="email" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="vat_number">
                    <b-form-group label="VAT NUMBER" label-for="vat_number">
                        <b-form-input id="vat_number" v-model="vat_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="City" >
                    <b-form-group label="City" label-for="City">
                        <b-form-input id="City" v-model="City" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="Street" >
                    <b-form-group label="Street Address" label-for="Street">
                        <b-form-input id="Street" v-model="Street" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="P.O.BOX" >
                    <b-form-group label="P.O.BOX" label-for="P.O.BOX">
                        <b-form-input id="P.O.BOX" v-model="bobox" :state="getValidationState(validationContext)" trim />

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
            contact_person: '',
            email: '',
            vat_number: '',
            myloader: null,
            City: '',
            Street: '',
            bobox: '',

        }
    },
    methods: {
        resetForm() {
            this.full_name = '';
            this.contact_person = '';
            this.email = '';
            this.vat_number = '';
            this.City = '';
            this.Street = '';
            this.bobox = '';

        },
        addEmployee() {
            const mydata = {
                full_name: this.full_name,
                contact_person: this.contact_person,
                email: this.email,
                vat_number: this.vat_number,
                City: this.City,
                Street: this.Street,
                bobox: this.bobox,
            }
            axios
                .post('/suppliers/add',
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
