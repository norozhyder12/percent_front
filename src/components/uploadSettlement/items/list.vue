<template>
<div>
    <addnew :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" @addItem="addItem" />
    <b-row class="mb-2">

        <b-col cols="12" md="12" class="d-flex align-items-center justify-content-end">
            <div>
                <b-button size="lg" variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Item</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12" md="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="itemsList" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">

                <!-- Column: Actions -->
                <template #cell(actions)="data">

                    <div @click="removeitem(data.item)">
                        <feather-icon icon="TrashIcon" />
                        <span class="align-middle ml-50">Remove</span>

                    </div>

                </template>

            </b-table>
        </b-col>

        <b-col cols="12">
            <b-pagination v-model="pagination.current_page" :total-rows="pagination.total" :per-page="pagination.per_page" align="center" size="sm" class="my-0" />
        </b-col>
    </b-row>
</div>
</template>

<script>
import axios from '@axios'
import vSelect from 'vue-select'

import addnew from './add'
export default {
    components: {
        addnew,
        vSelect

    },
    props: {

        itemsList: Array,
    },
    watch: {
        supplier(val) {
            this.$emit('Changesupplier', val);
        }
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
            supplier: '',
            fields: [{
                    key: 'description',
                    label: 'Description',
                    sortable: true,
                },
                {
                    key: 'expense_name',
                    label: 'Expense Type',
                    sortable: true,
                },
                {
                    key: 'branch_name',
                    label: 'Branch',
                    sortable: true,
                },
                {
                    key: 'unit_price',
                    label: 'Uint Price',
                    sortable: true,
                },
                {
                    key: 'quantity',
                    label: 'Quantity',
                    sortable: true,
                },
                {
                    key: 'total_value',
                    label: 'Total Settlement Value',
                    sortable: true,
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
        this.totalRows = this.$props.itemsList.length
    },
    methods: {
        addItem(data) {
            this.$props.itemsList.push(data);
        },
        removeitem(myitem) {
            var myarray = this.$props.itemsList;
            myarray.splice(myarray.findIndex(item => item === myitem), 1)
            this.items = myarray;

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

        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },

    },
}
</script>
