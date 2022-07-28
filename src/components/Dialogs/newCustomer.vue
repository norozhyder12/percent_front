<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="md" variant="primary" v-b-modal.customer-modal>
            <span class="text-nowrap">Add Customer</span>
        </b-button>
    </div>
    <b-modal id="customer-modal" ref="customer-modal" centered title="Add Customer" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="Customer NAME" rules="required">
                    <b-form-group label="Customer Name" label-for="Customer NAME">
                        <b-form-input id="Customer NAME" v-model="full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="Description" rules="required">
                    <b-form-group label="Description" label-for="Description">
                        <b-form-input id="Description" v-model="description" :state="getValidationState(validationContext)" trim />

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
            phone:'',
            description:''

        }
    },
    methods: {
        hidedailog() {
            this.$refs['customer-modal'].hide()
        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                name: this.full_name,
                description: this.description,
            }
            axios
                .post('/customers/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-customers');
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
