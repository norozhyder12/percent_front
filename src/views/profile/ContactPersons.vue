<template>
<b-card >
    <addNewPerson :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" @refetch-data="fetchEmps" />
    <EditContactPerson v-if="currentEdit != null" :is-edit-user-sidebar-active.sync="isEditUserSidebarActive" :mycontact="currentEdit" @refetch-data="fetchEmps" />
    <b-row class="mb-2">
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0" />

        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Contact Person</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>

        <b-col cols="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">

                
         
                <template #cell(designation_id)="data">
                    <div>
                     {{designation_list.find(x => x.id == data.item.designation_id).name}}
                    </div>
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
import addNewPerson from './addNewPerson'
import EditContactPerson from './EditContactPerson'

export default {
    components: {
        addNewPerson,
        EditContactPerson,
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
                    key: 'full_name',
                    label: 'Full Name',
                },
                {
                    key: 'email',
                    label: 'Email',
                    sortable: true,
                },
                {
                    key: 'mobile',
                    label: 'Mobile',
                    sortable: true,
                },
                {
                    key: 'designation_id',
                    label: 'Designation',
                    sortable: true,
                },

                {
                    key: 'actions',
                },

            ],
            items: [],

            myloader: null,
            emptypes:[],
            designation_list:[]
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
        this.totalRows = this.items.length;
        this.fetch_designation_types();
    },
    methods: {
     
        async fetch_designation_types() {
            await axios
                .get('/business-contact-des/list')
                .then(response => {
                    this.designation_list = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
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
                .get('/contact-persons/list')
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
