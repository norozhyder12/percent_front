<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button size="md" variant="primary" v-b-modal.branch2-modal2>
            <span class="text-nowrap">Add Cost Center</span>
        </b-button>
    </div>
    <b-modal id="branch2-modal2" ref="branch2-modal2" centered title="Add Cost Center" hide-footer @show="resetModal" @hidden="resetModal" @ok="addEmployee">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(addEmployee)">

                <!-- Username -->
                <!-- Username -->
                <validation-provider #default="validationContext" name="Cost Center Name" rules="required">
                    <b-form-group label="Cost Center Name" label-for="Cost Center Name">
                        <b-form-input id="Cost Center Name" v-model="type_name" :state="getValidationState(validationContext)" trim />

                        <b-form-invalid-feedback>
                            {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </validation-provider>
                <b-form-group label="Select Branch" label-for="Branch">
                    <v-select v-model="branch" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="branches" label="name" :clearable="true" input-id="branch">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!branch" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>

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
    props: {
        branch_id: Number
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
            phone: '',
            name: '',
            description: '',
            branches: [],
            type_dec: '',
            type_name: '',
            branch: ''

        }
    },
    mounted() {
        this.fetch_branches();
    },

    methods: {
          resetForm() {
            this.type_name = '';
            this.type_dec = '';
            this.branch = '';

        },
        hidedailog() {
            this.$refs['branch2-modal2'].hide()
            this.resetForm()
        },
        async fetch_branches() {
            await axios
                .get('/branches/list')
                .then(response => {
                    this.branches = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        addEmployee() {
            this.openLoading();
            const mydata = {
                name: this.type_name,
                description: this.type_dec,
                branch_id: this.branch.id
            }
            axios
                .post('/cost-center/add',
                    mydata)
                .then(response => {
                    this.$emit('refetch-costcenters');
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
