<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button style="width: 150px;" size="md" variant="primary" @click="fetchBill">
            <span class="text-nowrap">Make Payment</span>
        </b-button>
    </div>
    <b-modal id="Payeemy-modal" :ref="'Payeemy-modal'+BillID" centered title="Make Payment" hide-footer @show="resetModal" @hidden="resetModal" @ok="MakePayment">

        <!-- BODY -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
            <!-- Form -->
            <b-form class="p-2" @submit.prevent="handleSubmit(MakePayment)">
                <b-col>
                    <b-form-radio-group v-model="selected" :options="options" value-field="item" text-field="name" />
                </b-col>
                <b-card-text class="mt-1 mb-0">

                    <validation-provider #default="validationContext" name="Amount" rules="required">
                        <b-form-group label="Amount" label-for="Amount">
                            <b-form-input id="Amount" :disabled="selected == 'Full Amount'" v-model="total_payed" :state="getValidationState(validationContext)" trim />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-card-text>
                <div class="d-flex mt-2 align-items-center justify-content-end">

                    <b-button type="button" class="mr-2" variant="outline-secondary" @click="hidedailog">
                        Cancel
                    </b-button>
                    <b-button variant="primary" type="submit">
                        Make Payment
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
    required,
    alphaNum,
    email,
} from '@validations'
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
        BillID: Number
    },
    data() {
        return {
            total_payed: 0,
            selected: 'Full Amount',
            options: [{
                    item: 'Full Amount',
                    name: 'Full Amount'
                },
                {
                    item: 'Custom Amount',
                    name: 'Custom Amount'
                },
            ],
            full_name: '',
            contact_person: '',
            email: '',
            vat_number: '',
            myloader: null,
            City: '',
            Street: '',
            phone: '',
            mybill: '',
            full_amount: 0,

        }
    },
    watch: {
        selected(val) {
            if (val == 'Full Amount') {
                this.total_payed = this.full_amount;
            } else {
                this.total_payed = 0;
            }

        }
    },

    methods: {
        hidedailog() {
            this.$refs['Payeemy-modal' + this.$props.BillID].hide()
            this.resetForm();
        },
        resetForm() {
            this.amount = 0;

        },
        fetchBill() {
            this.$refs['Payeemy-modal' + this.$props.BillID].show()

            this.openLoading();
            axios.get('/bills/' + this.$props.BillID)
                .then(response => {
                    this.myloader.close();
                    this.mybill = response.data.data
                    if (this.mybill.outstanding == 0 && this.mybill.status != 1) {
                        this.total_payed = this.mybill.total_bill
                        this.full_amount = this.mybill.total_bill
                    } else {
                        this.total_payed = this.mybill.outstanding
                        this.full_amount = this.mybill.outstanding
                    }

                })
                .catch(error => {
                    this.myloader.close();
                    console.log(error);
                })
        },
        MakePayment() {
            this.openLoading();
            const mydata = {
                amount: this.total_payed,
                bill_id: this.$props.BillID,
            }
            axios
                .post('/bills/make-payment/',
                    mydata)
                .then(response => {
                    this.$emit('refetchData');
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
            // this.total_payed = 0;
            this.selected = 'Full Amount';

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
