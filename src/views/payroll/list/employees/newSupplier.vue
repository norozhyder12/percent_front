<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="lg" variant="primary" v-b-modal.my-modal>
            <span class="text-nowrap">Add Supplier</span>
        </b-button>
    </div>
    <b-modal id="my-modal" ref="my-modal" centered title="Add Supplier" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

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

                <validation-provider #default="validationContext" name="vat_number" >
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
            contact_person: '',
            email: '',
            vat_number: '',
            myloader: null,
            City:'',
            Street:'',
            bobox:'',

        }
    },
    methods: {
        hidedailog() {
            this.$refs['my-modal'].hide()
        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                full_name: this.full_name,
                contact_person: this.contact_person,
                email: this.email,
                vat_number: this.vat_number,
                City:this.City,
                Street:this.Street,
                bobox:this.bobox,
            }
            axios
                .post('/suppliers/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-suppliers');
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
        resetModal() {
            this.full_name = ''
            this.contact_person = null
            this.email = null
            this.vat_number = null
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
