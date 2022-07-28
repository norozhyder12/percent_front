<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="md" variant="primary" v-b-modal.Payeemy-modal>
            <span class="text-nowrap">Add Payee</span>
        </b-button>
    </div>
    <b-modal id="Payeemy-modal" ref="Payeemy-modal" centered title="Add Payee" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                <validation-provider #default="validationContext" name="Payee NAME" rules="required">
                    <b-form-group label="Payee NAME" label-for="Payee NAME">
                        <b-form-input id="Payee NAME" v-model="full_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="phone" rules="required">
                    <b-form-group label="phone" label-for="phone">
                        <b-form-input id="phone" v-model="phone" :state="getValidationState(validationContext)" trim />

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

        }
    },
    methods: {
        hidedailog() {
            this.$refs['Payeemy-modal'].hide()
        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                full_name: this.full_name,
                phone: this.phone,
            }
            axios
                .post('/payees/add',
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
            this.mobile = null

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
