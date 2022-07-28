<template>
<div style="height:100%" class="d-flex align-items-center justify-content-start">
    <div>
        <b-button style="width: 150px;" size="md" variant="primary" @click="fetchBill">
            <span class="text-nowrap">Payment Log</span>
        </b-button>
    </div>
    <b-modal size="lg" id="statement-modal" :ref="'statement-modal'+BillID" centered title="Payment Log" hide-footer @show="resetModal" @hidden="resetModal">

        <b-col cols="12" style="padding:1rem">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="myStatement" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection">
                <template #cell(created_at)="data">
                    {{convertDate(data.item.created_at)}}
                </template>
                <template #cell(amount)="data">
                    {{moneyFormat(data.item.amount)}}
                </template>
                <template #cell(outstanding)="data">
                    {{moneyFormat(data.item.outstanding)}}
                </template>

            </b-table>
        </b-col>
            <b-col cols="12">
            <b-pagination v-model="pagination.current_page" :total-rows="pagination.total" :per-page="pagination.per_page" align="center" size="sm" class="my-0" />
        </b-col>
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
            pagination: {
                total: 0,
                count: 0,
                per_page: 5,
                current_page: 1,
                total_pages: 1,
            },

            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],

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
            myStatement: null,
            full_amount: 0,
            fields: [

                {
                    key: 'id',
                    label: 'Statement ID',
                },
                {
                    key: 'created_at',
                    label: 'Issue Date',
                    sortable: true,
                },
                {
                    key: 'amount',
                    label: 'Amount',
                    sortable: true,
                },
                {
                    key: 'outstanding',
                    label: 'Balance',
                    sortable: true,
                },

            ],

        }
    },


    methods: {
        moneyFormat(money) {
            var formatter = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SAR',

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            });
            return formatter.format(money); /* $2,500.00 */

        },
        hidedailog() {
            this.$refs['statement-modal'+this.$props.BillID].hide()
        },
        fetchBill() {
             this.$refs['statement-modal'+this.$props.BillID].show()
            this.openLoading();
            axios.get('/bills/statement/' + this.$props.BillID)
                .then(response => {
                    this.myloader.close();
                    this.myStatement = response.data.data
                                this.pagination.total = this.myStatement.length;

                })
                .catch(error => {
                    this.myloader.close();
                    console.log(error);
                })
        },

        convertDate(date) {
            var currentTime = new Date(date);
            var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
            var day = ("0" + currentTime.getDate()).slice(-2);
            var year = currentTime.getFullYear();
            var date = day + "-" + month + "-" + year;
            return date;
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
