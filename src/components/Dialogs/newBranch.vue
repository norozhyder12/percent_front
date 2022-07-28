<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="md" variant="primary" v-b-modal.branch-modal>
            <span class="text-nowrap">Add Branch</span>
        </b-button>
    </div>
    <b-modal id="branch-modal" ref="branch-modal" centered title="Add Payee" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                 <validation-provider #default="validationContext" name="Branch Name" rules="required">
                    <b-form-group label="Branch Name" label-for="Branch Name">
                        <b-form-input id="Branch Name" v-model="type_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <validation-provider #default="validationContext" name="type_dec">
                    <b-form-group label="Description" label-for="type_dec">
                        <b-form-input id="type_dec" v-model="type_dec" :state="getValidationState(validationContext)" trim />

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
            name:'',
            description:''


        }
    },
    methods: {
        hidedailog() {
            this.$refs['branch-modal'].hide()
            this.resetForm()
        },
         resetForm() {
            this.type_name = '';
            this.type_dec = '';

        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                  name: this.type_name,
                description: this.type_dec,
            }
            axios
                .post('/branches/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-branches');
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
