<template>
<b-card title="Payroll">
    <billtypesAddNew :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" @refetch-data="fetchEmps" />
    <billtypesEdit v-if="currentEdit != null" :is-edit-user-sidebar-active.sync="isEditUserSidebarActive" :myemp="currentEdit" @refetch-data="fetchEmps" />
    <b-row class="mb-2">
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0" />

        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-form-input v-model="filter" class="d-inline-block mr-1" placeholder="Search..." />
                <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Payroll</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>

        <b-col cols="12">
            <b-table @row-clicked="myRowClickHandler" hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                <template #cell(net)="data">

                    <div>
                        {{moneyFormat(data.item.net)}}
                    </div>

                </template>
                <!-- Column: Actions -->
                <template #cell(actions)="data">

                    <div @click="$router.push({name:'payroll-edit',params:{id:data.item.id}})">
                        <feather-icon icon="EditIcon" />
                        <span class="align-middle ml-50">Edit</span>

                    </div>
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
import billtypesAddNew from './AddNew'
import billtypesEdit from './Edit'

export default {
    components: {
        billtypesAddNew,
        billtypesEdit,
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
            sortDesc: true,
            sortDirection: 'desc',
            filter: null,
            filterOn: [],

            fields: [

                {
                    key: 'id',
                    label: '#ID',
                },
                {
                    key: 'month',
                    label: 'Month',
                    sortable: true,
                },
                {
                    key: 'year',
                    label: 'Year',
                    sortable: true,
                },

                {
                    key: 'net',
                    label: 'Net',
                },
                {
                    key: 'actions',
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

        myRowClickHandler(record) {
            this.$router.push({
                name: 'payroll-edit',
                params: {
                    id: record.id
                }
            })
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
        openNotification(position = 'top-right', color, title, message) {
            const noti = this.$vs.notification({
                color,
                position,
                title,
                text: message,
            })
        },
        fetchEmps() {
            this.openLoading()
            axios
                .get('/payroll/list')
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
