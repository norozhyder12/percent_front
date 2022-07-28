<template>
<b-card title="My Bills">
    <b-row class="mb-2">
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0" />

        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-form-input v-model="filter" class="d-inline-block mr-1" placeholder="Search..." />
                <b-button variant="primary" @click="$router.push({ name: 'upload-bill' })">
                    <span class="text-nowrap">Add Bill</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>

        <b-col cols="12">
            <b-table @row-clicked="myRowClickHandler" hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
    <template #cell(id)="data">

                    #{{data.item.id}}

                </template>
                <!-- Column: Actions -->
                <template #cell(status)="data">

                    <b-badge pill :variant="get_status_color(data.item.status)">
                        {{ get_status_name(data.item.status) }}
                    </b-badge>

                </template>

                <template #cell(actions)="data">

                    <div @click="$router.push({name:'bill-view',params:{id:data.item.id}})">
                        <feather-icon icon="EyeIcon" />
                        <span class="align-middle ml-50">Details</span>

                    </div>
                    <div @click="$router.push({name:'bill-edit',params:{id:data.item.id}})">
                        <feather-icon icon="EditIcon" />
                        <span class="align-middle ml-50">Edit</span>

                    </div>

                </template>
                <template #cell(total_bill)="data">
                    {{ moneyFormat(data.item.items.reduce(function (acc, obj) { return acc + parseFloat(obj.total_value); }, 0) )}}
                </template>
                <template #cell(Payment)="data">
                    
                      <b-dropdown variant="link" no-caret :right="$store.state.appConfig.isRTL">

                        <template #button-content>
                            <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
                        </template>
                        <b-dropdown-item >
                            <makePayment class="mb-1" @refetchData="fetchbills" :BillID="data.item.id"></makePayment>
                        </b-dropdown-item>

                        <b-dropdown-item >
                           <billStatement :BillID="data.item.id"></billStatement>
                        </b-dropdown-item>

              
                    </b-dropdown>

                </template>

            </b-table>
        </b-col>

        <b-col cols="12">
            <b-pagination v-model="pagination.current_page" :total-rows="pagination.total" :per-page="pagination.per_page" align="center" size="sm" class="my-0" />
        </b-col>
    </b-row>
</b-card>
</template>

<script>
import axios from '@axios'
import makePayment from '@/components/Dialogs/makePayment'
import billStatement from '@/components/Dialogs/billStatment'

export default {
    components: {
        makePayment,
        billStatement
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
            currentEdit: null,
            isAddNewUserSidebarActive: false,
            isEditUserSidebarActive: false,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],

            fields: [

                {
                    key: 'id',
                    label: 'Bill Number',
                },
                {
                    key: 'created_at',
                    label: 'Issue Date',
                    sortable: true,
                },
                {
                    key: 'mysuppliers.full_name',
                    label: 'Supplier Name',
                    sortable: true,
                },
                {
                    key:'total_bill'
                },
                {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                },
                {
                    key: 'actions',
                },
                {
                    key: 'Payment',
                },

            ],
            items: [],
            myloader: null,
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => ({
                    text: f.label,
                    value: f.key,
                }))
        },

    },
    mounted() {
        // Set the initial number of items
        this.fetchbills()
        this.totalRows = this.items.length
    },
    methods: {
        myRowClickHandler(record) {
          this.$router.push({ name: 'bill-view', params: { id: record.id } })
        },

        get_status_color(val) {
            if (val == 0) return 'warning';
            else if (val == 1) return 'success';
            else if (val == 2) return 'primary';
        },
        get_status_name(val) {
            if (val == 0) return 'UnPaid';
            else if (val == 1) return 'Paid';
            else if (val == 2) return 'Paid Partial';
        },
        edit_my_emp(emp) {
            this.currentEdit = emp
            this.isEditUserSidebarActive = true
        },

        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.mytabs,

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
        fetchbills() {
            this.openLoading()
            axios
                .get('/bills/list')
                .then(response => {
                    this.items = response.data.data.data
                    console.log(this.items)
                    this.pagination = response.data.data.pagination
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                })
        },
         moneyFormat(money) {
           var formatter= Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SAR',

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            });
           return  formatter.format(money); /* $2,500.00 */


        },
        convertDate(date) {
            var currentTime = new Date(date);
            var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
            var day = ("0" + currentTime.getDate()).slice(-2);
            var year = currentTime.getFullYear();
            var date = day + "-" + month + "-" + year;
            return date;
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
    },
}
</script>
