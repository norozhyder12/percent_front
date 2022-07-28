<template>
<b-card>
    <user-list-add-new :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" :role-options="roleOptions" @refetch-data="fetchUsers" />

    <b-row class="mb-2">
        <b-col cols="12" md="6" class="d-flex align-items-center justify-content-start mb-1 mb-md-0" />

        <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
                <b-form-input v-model="filter" class="d-inline-block mr-1" placeholder="Search..." />
                <b-button variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Client</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>

        <b-col cols="12">
            <b-table striped hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                <template #cell(role)="data">
                    <div class="text-nowrap">
                        <feather-icon :icon="resolveUserRoleIcon(data.item.role)" size="18" class="mr-50" :class="`text-${resolveUserRoleVariant(data.item.role)}`" />
                        <span class="align-text-top text-capitalize">{{ data.item.role }}</span>
                    </div>
                </template>
 <template #cell(created_at)="data">
                   {{convertDate(data.item.created_at)}}
                </template>
                <template #cell(status)="data">
                    <b-badge :variant="status[1][data.value]">
                        {{ status[0][data.value] }}
                    </b-badge>
                </template>
                <!-- Column: Actions -->
                <template #cell(actions)="data">
                    <b-dropdown variant="link" no-caret :right="$store.state.appConfig.isRTL">

                        <template #button-content>
                            <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
                        </template>
                        <b-dropdown-item :to="{ name: 'clients-admin-view', params: { id: data.item.id } }">
                            <feather-icon icon="FileTextIcon" />
                            <span class="align-middle ml-50">Details</span>
                        </b-dropdown-item>

                        <b-dropdown-item :to="{ name: 'clients-admin-edit', params: { id: data.item.id } }">
                            <feather-icon icon="EditIcon" />
                            <span class="align-middle ml-50">Edit</span>
                        </b-dropdown-item>

                        <b-dropdown-item>
                            <feather-icon icon="TrashIcon" />
                            <span v-if="data.item.status != 2" class="align-middle ml-50" @click="ChangeStatus(data.item,2)">Banned</span>
                            <span v-else class="align-middle ml-50" @click="ChangeStatus(data.item,1)">Activate</span>
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
import UserListAddNew from './UserListAddNew'

export default {
    components: {
        UserListAddNew,
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

            isAddNewUserSidebarActive: false,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],

            fields: [{
                    key: 'id',
                    label: 'Id',
                },
                {
                    key: 'name',
                    label: 'Account Name',
                    sortable: true,
                },
                  {
                    key: 'business_info.business_name',
                    label: 'Business Name',
                    sortable: true,
                },
                {
                    key: 'email',
                    label: 'Email',
                    sortable: true,
                },
                  {
                    key: 'created_at',
                    label: 'Registered',
                    sortable: true,
                },
                {
                    key: 'role',
                    label: 'Role',
                    sortable: true,
                },
                {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                },
                {
                    key: 'actions',
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
        this.fetchUsers()
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
        ChangeStatus(user, status) {
            this.openLoading()
            axios
                .post(`/users-admin/update/${user.id}`, {
                    name: user.name,
                    email: user.email,
                    status,
                })
                .then(response => {
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been updated.')
                    this.myloader.close()
                    this.fetchUsers()
                })
                .catch(error => {
                    this.myloader.close()
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
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
        fetchUsers() {
            this.openLoading()
            axios
                .get('/users-admin/listall')
                .then(response => {
                    this.items = response.data.data.user
                    this.pagination = response.data.data.pagination
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                })
        },
           changeDate(date) {
            return this.fromNow(date);
        },
        fromNow(date, nowDate = Date.now(), rft = new Intl.RelativeTimeFormat(undefined, {
            numeric: "auto"
        })) {
            const SECOND = 1000;
            const MINUTE = 60 * SECOND;
            const HOUR = 60 * MINUTE;
            const DAY = 24 * HOUR;
            const WEEK = 7 * DAY;
            const MONTH = 30 * DAY;
            const YEAR = 365 * DAY;
            const intervals = [{
                    ge: YEAR,
                    divisor: YEAR,
                    unit: 'year'
                },
                {
                    ge: MONTH,
                    divisor: MONTH,
                    unit: 'month'
                },
                {
                    ge: WEEK,
                    divisor: WEEK,
                    unit: 'week'
                },
                {
                    ge: DAY,
                    divisor: DAY,
                    unit: 'day'
                },
                {
                    ge: HOUR,
                    divisor: HOUR,
                    unit: 'hour'
                },
                {
                    ge: MINUTE,
                    divisor: MINUTE,
                    unit: 'minute'
                },
                {
                    ge: 30 * SECOND,
                    divisor: SECOND,
                    unit: 'seconds'
                },
                {
                    ge: 0,
                    divisor: 1,
                    text: 'just now'
                },
            ];
            const now = typeof nowDate === 'object' ? nowDate.getTime() : new Date(nowDate).getTime();
            const diff = now - (typeof date === 'object' ? date : new Date(date)).getTime();
            const diffAbs = Math.abs(diff);
            for (const interval of intervals) {
                if (diffAbs >= interval.ge) {
                    const x = Math.round(Math.abs(diff) / interval.divisor);
                    const isFuture = diff < 0;
                    return interval.unit ? rft.format(isFuture ? x : -x, interval.unit) : interval.text;
                }
            }
        },

        resolveUserRoleVariant(role) {
            if (role === 'subscriber') return 'primary'
            if (role === 'admin') return 'danger'
            return 'primary'
        },

        resolveUserRoleIcon(role) {
            if (role === 'subscriber') return 'UserIcon'
            if (role === 'admin') return 'ServerIcon'
            return 'UserIcon'
        },
        info(item, index, button) {
            this.infoModal.title = `Row index: ${index}`
            this.infoModal.content = JSON.stringify(item, null, 2)
            this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
        resetInfoModal() {
            this.infoModal.title = ''
            this.infoModal.content = ''
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
    },
}
</script>
