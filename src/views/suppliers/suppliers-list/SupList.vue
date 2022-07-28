<template>
<b-card title="Suppliers List">
    <SupAddNew :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" @refetch-data="fetchEmps" />
    <SupEdit v-if="currentEdit != null" :is-edit-user-sidebar-active.sync="isEditUserSidebarActive" :myemp="currentEdit" @refetch-data="fetchEmps" />
    <b-row class="mb-2">
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0" />

        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-form-input v-model="filter" class="d-inline-block mr-1" placeholder="Search..." />
                <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Supplier</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>

        <b-col cols="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">

                <!-- Column: Actions -->
                <template #cell(status)="data">

                    <b-form-checkbox :checked="data.item.published == 1 ? 'true' : 'false'" class="custom-control-success" name="check-button" switch @change="UpdateStatus(data.item.id)" />

                </template>
                <!-- Column: Actions -->
                <template #cell(actions)="data">

                    <div @click="edit_my_emp(data.item)">
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
import SupAddNew from './SupAddNew'
import SupEdit from './SupEdit'

export default {
    components: {
        SupAddNew,
        SupEdit,
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
                    label: '#ID',
                },
                {
                    key: 'full_name',
                    label: 'Supplier Name',
                    sortable: true,
                },
                {
                    key: 'contact_person',
                    label: 'Contact Person',
                    sortable: true,
                },
                {
                    key: 'email',
                    label: 'Email',
                    sortable: true,
                },
                {
                    key: 'vat_number',
                    label: 'vat Number',
                    sortable: true,
                },
                {
                    key: 'status',
                    label: 'Enable / Disable'
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
  
        async UpdateStatus(id) {
            await axios
                .post(`/suppliers/changeStatus/` + id, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                               this.openNotification('top-right', 'success', 'Done !!', 'The Status has been Updated.')

                })
                .catch(error => {
                    console.log(error.response)
                   // this.openNotification('top-right', 'danger', error.status, error.errors)
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
                .get('/suppliers/list')
                .then(response => {
                    this.items = response.data.data.data
                    this.pagination = response.data.data.pagination
                    this.myloader.close()
                })
                .catch(error => {
                    this.myloader.close()

                    console.log(error)
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
