<template>
<b-card title="PR FORM">
    <EmpAddNew :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" :role-options="roleOptions" @refetch-data="fetchEmps" />
    <b-row class="">
        <b-col cols="12" md="6">
            <div class="d-flex flex-column">
                    <b-form-group class="w-100" label="Cost Center" label-for="cost center">
                        <b-form-select id="cost center" class="d-inline-block w-100 mr-1" :options="['Canada','United States']"/>
                    </b-form-group>
                    <b-form-group class="w-100" label="Branch" label-for="branch">
                        <b-form-select id="branch" class="d-inline-block w-100 mr-1" :options="['Canada','United States']"/>
                    </b-form-group>
                    <div class="d-flex flex-column align-items-start justify-content-start mb-1">
                        <p class="mr-3">City</p>
                        <p>Country</p>
                    </div>
            </div>
        </b-col>
        <b-col cols="12" md="6">
                <div class="d-flex flex-column justify-content-end align-items-end">
                  <div class="text-center">
                    <h4>PURCHASE REQUEST</h4>
                    <p class="mb-0">PR-</p>
                    <p >0001</p>
                  </div>
                </div>
        </b-col> 
    </b-row>
    <b-row class="">
        <b-col cols="12" md="6">
            <div class="d-flex flex-column justify-content-start align-items-start">
                  <b-form-group class="w-50" label="Form Date" label-for="form-date">
                        <b-form-datepicker id="form-date" v-model="form_date" placeholder="Choose a date" local="en" />
                  </b-form-group>
                </div>
        </b-col> 
        <b-col cols="12" md="6">
                
        </b-col> 
    </b-row>
    
    <b-row class="mb-2">
        <b-col cols="12" md="6" />
        
        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-form-input v-model="filter" class="d-inline-block mr-1" placeholder="Search..." />
                <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Item</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">

                <template #cell(show_details)="row">
                    <b-form-checkbox v-model="row.detailsShowing" plain class="vs-checkbox-con" @change="row.toggleDetails">
                        <span class="vs-checkbox">
                            <span class="vs-checkbox--check">
                                <i class="vs-icon feather icon-check" />
                            </span>
                        </span>
                        <span class="vs-label">{{ row.detailsShowing ? 'Hide' : 'Show' }}</span>
                    </b-form-checkbox>
                </template>

                <template #row-details="row">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col md="4" class="mb-1">
                                <strong>Employment Type : </strong>{{ emptypes.filter(obj=> obj.id == row.item.employment_type_id)[0].name }}
                            </b-col>
                            <b-col md="4" class="mb-1">
                                <strong>Employment Number : </strong>{{ row.item.employee_number }}
                            </b-col>

                            <b-col md="4" class="mb-1">
                                <strong>Contract Duration : </strong>{{ row.item.contract_duration }}
                            </b-col>
                            <b-col md="4" class="mb-1">
                                <strong>Gosi Registerd: </strong>{{ gosiOptions.filter(obj=> obj.value == row.item.gosi)[0].text }}
                            </b-col>
                        </b-row>

                        <b-button size="sm" variant="outline-secondary" @click="row.toggleDetails">
                            Hide Details
                        </b-button>
                    </b-card>
                </template>
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
    <b-row class="my-3">
        <div class="w-100 border-top-dark border-top-2 border-bottom-dark border-bottom-2 mx-2 pr-5 d-flex justify-content-end">
            <h4 class="m-0 text-right pr-5 mr-5">total</h4>
            <h4 class="m-0 text-right mr-5">0</h4>
        </div>
    </b-row>
    <b-row class="mb-2">
        <b-col cols="12" md="6">
                    <b-form-group class="w-100" label="Add Authority" label-for="authority-1">
                        <b-form-select id="authority-1" class="d-inline-block w-100" :options="['Authority 1','Authority 2','Authority 3','Authority 4','Authority 5']"/>
                    </b-form-group>
                    <b-form-group class="w-100" label="Add Authority" label-for="authority-2">
                        <b-form-select id="authority-2" class="d-inline-block w-100" :options="['Authority 1','Authority 2','Authority 3','Authority 4','Authority 5']"/>
                    </b-form-group>
                    <b-form-group class="w-100" label="Add Authority" label-for="authority-3">
                        <b-form-select id="authority-3" class="d-inline-block w-100" :options="['Authority 1','Authority 2','Authority 3','Authority 4','Authority 5']"/>
                    </b-form-group>
                    <b-form-group class="w-100" label="Approved By" label-for="approved">
                        <b-form-select id="approved" class="d-inline-block w-100" :options="['Authority 1','Authority 2','Authority 3','Authority 4','Authority 5']"/>
                    </b-form-group>
                    <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Save</span>
                    </b-button>
        </b-col> 
    </b-row>
</b-card>
</template>

<script>
import axios from '@axios'
import EmpAddNew from './EmpAddNew'
import EmpEdit from './EmpEdit'

export default {
    components: {
        EmpAddNew,
        EmpEdit,
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
            gosiOptions: [{
                    text: 'YES',
                    value: 1,
                },
                {
                    text: 'NO',
                    value: 0,
                },
            ],
            fields: [
                '#',
                {
                    key: 'id_number',
                    label: 'Description',
                },
                {
                    key: 'full_name',
                    label: 'Item Code',
                },
                {
                    key: 'joining_date',
                    label: 'Qty',
                },
                {
                    key: 'nationality',
                    label: 'Rate',
                },
                {
                    key: 'total',
                    label: 'SubTotal',
                },
            ],
            items: [],
            status: [{
                    3: 'Pending',
                    1: 'Active',
                    2: 'Banned',
                },
                {
                    3: 'light-warning',
                    1: 'light-success',
                    2: 'light-danger',
                },
            ],

            roleOptions: [{
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'Subscriber',
                    value: 'Subscriber',
                },
            ],
            myloader: null,
            emptypes: []
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
        this.fetch_emp_types();
    },
    methods: {
        async UpdateStatus(id) {
            await axios
                .post(`/employees/changeStatus/` + id, {

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

        async fetch_emp_types() {
            await axios
                .get('/employment-types/list')
                .then(response => {
                    this.emptypes = response.data.data.data
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
                .get('/employees/list')
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
