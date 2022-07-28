<template>
<div v-if="mybill != null">
    <div title="Bill Info">
        <b-row class="bill_info">
            <b-col>
                <statistic-card-horizontal icon="HashIcon" :statistic="'#'+mybill.id" statistic-title="Bill ID" />
            </b-col>
            <b-col>
                <statistic-card-horizontal icon="DollarSignIcon" :statistic="mybill.items.reduce(function (acc, obj) { return acc + parseFloat(obj.total_value); }, 0) + ' SAR'" statistic-title="Bill Total" />
            </b-col>
            <b-col>
                <b-card>
                    <div style="display:flex;justify-content: space-between;    align-items: center;">
                        <label><span style="font-size:18px;font-weight:bold;">status</span></label>
                        <b-badge pill :variant="get_status_color(mybill.status)" style="font-size:18px;padding:1rem">
                            {{ get_status_name(mybill.status) }}
                        </b-badge>
                    </div>

                </b-card>
            </b-col>
            <b-col>
                <b-card>
                    <div style="display:flex;justify-content: space-between;    align-items: center;">
                        <label><span style="font-size:18px;font-weight:bold;">Supplier</span></label>

                        <b-badge pill variant="primary" style="font-size:18px;padding:1rem">
                            {{ mybill.mysuppliers.full_name}}
                        </b-badge>
                    </div>

                </b-card>
            </b-col>
        </b-row>
    </div>
    <b-card title="Bill Attachment">
        <b-row>
            <b-col cols="12">
                <b-table striped hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="mybill.files" :fields="files_fileds" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                    <template #cell(path)="data">
                        <div @click="openNewWindow(data.item.path)">
                            <feather-icon icon="DownloadIcon" />
                            <span class="align-middle ml-50">Download</span>

                        </div>

                    </template>

                    <!-- Column: Actions -->
                    <template #cell(created_at)="data">
                        {{convertDate(data.item.created_at)}}
                    </template>
                </b-table>
            </b-col>

            <b-col cols="12">
                <b-pagination v-model="pagination.current_page" :total-rows="pagination.total" :per-page="pagination.per_page" align="center" size="sm" class="my-0" />
            </b-col>
        </b-row>
    </b-card>
    <b-card title="Bill Items">
        <b-row>
            <b-col cols="12">
                <b-table striped hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="mybill.items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
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
                                    <strong>branch: </strong>{{ row.item.branch }}
                                </b-col>
                                <b-col md="4" class="mb-1">
                                    <strong>Description : </strong>{{ row.item.description }}
                                </b-col>
                            </b-row>

                            <b-button size="sm" variant="outline-secondary" @click="row.toggleDetails">
                                Hide Details
                            </b-button>
                        </b-card>
                    </template>

                    <!-- Column: Actions -->
                    <template #cell(created_at)="data">
                        {{convertDate(data.item.created_at)}}
                    </template>
                </b-table>
            </b-col>

            <b-col cols="12">
                <b-pagination v-model="pagination.current_page" :total-rows="pagination.total" :per-page="pagination.per_page" align="center" size="sm" class="my-0" />
            </b-col>
            <b-col>
                <b-btn variant="primary">
                    <div @click="$router.push({name:'bill-admin-edit',params:{id:mybill.id}})">
                        <feather-icon icon="EditIcon" />
                        <span class="align-middle ml-50">Edit Bill</span>

                    </div>
                </b-btn>
            </b-col>
        </b-row>
    </b-card>
</div>
</template>

<script>
import axios from '@axios'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'

export default {
    components: {
        StatisticCardHorizontal
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
            mybill: null,
            files_fileds: [{
                    key: 'id',
                    label: '#ID',
                },
                {
                    key: 'media[0].file_name',
                    label: 'File Name',
                    sortable: true,
                },
                {
                    key: 'path',
                    label: 'File',
                    sortable: true,
                },
                {
                    key: 'uploadtype.type_name',
                    label: 'Attachment Type',
                    sortable: true,
                },

            ],
            fields: [
                'show_details',
                {
                    key: 'id',
                    label: 'Item Number',
                },
                {
                    key: 'created_at',
                    label: 'Issue Date',
                    sortable: true,
                },
                {
                    key: 'expense_id',
                    label: 'Expense',
                    sortable: true,
                },
                {
                    key: 'unit_price',
                    label: 'Unit Price',
                    sortable: true,
                },
                {
                    key: 'quantity',
                    label: 'QTA',
                    sortable: true,
                },
                {
                    key: 'total_value',
                    label: 'Total Price',
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
        this.fetchbill(this.$route.params.id)
        this.totalRows = this.items.length
    },

    methods: {
        convertDate(date) {
            var currentTime = new Date(date);
            var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
            var day = ("0" + currentTime.getDate()).slice(-2);
            var year = currentTime.getFullYear();
            var date = day + "-" + month + "-" + year;
            return date;
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
        openNewWindow(path) {
            window.open(path, '_blank')
        },
        fetchbill(id) {
            this.openLoading()
            axios
                .get('/bills/' + id)
                .then(response => {

                    this.mybill = response.data.data
                    console.log(this.mybill)
                    // this.pagination = response.data.data.pagination
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

<style lang="scss">
.bill_info {
    .badge-pill {
        align-items: center;
        display: flex;

    }
}
</style>
