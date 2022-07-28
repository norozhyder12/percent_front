<template>
<b-card title="Petty Cash Transactions">

   
    <b-row>

        <b-col cols="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                <template #cell(id)="data">
                    #{{data.item.id}}
                </template>

                <template #cell(status)="data">

                    <b-form-checkbox :checked="data.item.published == 1 ? 'true' : 'false'" class="custom-control-success" name="check-button" switch @change="UpdateStatus(data.item.id)" />

                </template>
                <template #cell(created_at)="data">
                    {{convertDate(data.item.created_at)}}
                </template>
                <!-- Column: Actions -->

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

export default {

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
                    label: '#ID',
                },
                {
                    key: 'type',
                    label: 'Type',
                    sortable: true,
                },
                   {
                    key: 'created_at',
                    label: 'Date'
                },
                {
                    key: 'payee.full_name',
                    label: 'Payee',
                    sortable: true,
                },
                {
                    key: 'cash',
                    label: 'Amount',
                    sortable: true,
                },
             
                {
                    key: 'source',
                    label: 'Source',
                    sortable: true,
                },

                {
                     key: 'balance',
                    label: 'Balance',
                    sortable: true,
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
        this.fetchEmps()
        this.totalRows = this.items.length
    },
    methods: {

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
        convertDate(date) {
            var currentTime = new Date(date);
            var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
            var day = ("0" + currentTime.getDate()).slice(-2);
            var year = currentTime.getFullYear();
            var date = day + "-" + month + "-" + year;
            return date;
        },
        fetchEmps() {
            this.openLoading()
            axios
                .get('/transactions/list')
                .then(response => {
                    this.items = response.data.data.data
                    this.pagination = response.data.data.pagination
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                })
        },

        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
    },
}
</script>
