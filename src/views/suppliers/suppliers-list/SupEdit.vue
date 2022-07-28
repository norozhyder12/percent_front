<template>
<b-sidebar id="add-new-user-sidebar" ref="myform" :visible="isEditUserSidebarActive" bg-variant="white" sidebar-class="sidebar-lg" shadow backdrop no-header right @change="(val) => $emit('update:is-edit-user-sidebar-active', val)">
    <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
            <h5 class="mb-0">
                Edit Supplier
            </h5>

            <feather-icon class="ml-1 cursor-pointer" icon="XIcon" size="16" @click="hide" />

        </div>

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(EditEmployee)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="SUPPLIER NAME" rules="required">
                    <b-form-group label="SUPPLIER NAME" label-for="SUPPLIER NAME">
                        <b-form-input id="SUPPLIER NAME" v-model="myemp.full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Contact Person" rules="required">
                    <b-form-group label="Contact Person" label-for="Contact Person">
                        <b-form-input id="Contact Person" v-model="myemp.contact_person" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <!-- Username -->
                <validation-provider #default="validationContext" name="id_number" rules="email">
                    <b-form-group label="email" label-for="email">
                        <b-form-input id="email" v-model="myemp.email" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="vat_number" >
                    <b-form-group label="VAT NUMBER" label-for="vat_number">
                        <b-form-input id="vat_number" v-model="myemp.vat_number" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>


                <validation-provider #default="validationContext" name="City" >
                    <b-form-group label="City" label-for="City">
                        <b-form-input id="City" v-model="myemp.City" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="Street" >
                    <b-form-group label="Street Address" label-for="Street">
                        <b-form-input id="Street" v-model="myemp.Street" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>

                <validation-provider #default="validationContext" name="P.O.BOX" >
                    <b-form-group label="P.O.BOX" label-for="P.O.BOX">
                        <b-form-input id="P.O.BOX" v-model="myemp.bobox" :state="getValidationState(validationContext)" trim />

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
            contact_person: '',
            email: '',
            vat_number: '',
            myloader: null,

        }
    },
    methods: {
        EditEmployee() {
            const mydata = {
                full_name: this.$props.myemp.full_name,
                contact_person: this.$props.myemp.contact_person,
                email: this.$props.myemp.email,
                vat_number: this.$props.myemp.vat_number,
                City:this.$props.myemp.City,
                Street:this.$props.myemp.Street,
                bobox:this.$props.myemp.bobox,
            }
            const mythis = this
            axios
                .post(`/suppliers/update/${this.$props.myemp.id}`,
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
