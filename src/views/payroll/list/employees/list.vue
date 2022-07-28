<template>
<div>
    <addnew :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" @refetch-employees="refetchemployees" />
    <editEmp v-if="currentEdit != null" :is-edit-user-sidebar-active.sync="isEditUserSidebarActive" :Payrollemployee="currentEdit" @refetch-employees="refetchemployees" />

    <b-row class="mb-2">

        <b-col cols="12" md="12" class="d-flex align-items-center justify-content-end">
            <div>
                <b-button size="lg" variant="primary" @click="isAddNewUserSidebarActive = true">
                    <span class="text-nowrap">Add Employee</span>
                </b-button>
            </div>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12" md="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="myPayroll" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">

                <!-- Column: Actions -->
                <template #cell(net)="data">

                    <div>
                        {{moneyFormat(data.item.net)}}
                    </div>

                </template>

                  <!-- Column: Actions -->
                <template #cell(total_additions)="data">

                    <div>
                        {{moneyFormat(data.item.employment_additions.reduce(function (acc, obj) { return acc + obj.value; }, 0) )}}
                    </div>

                </template>
                  <!-- Column: Actions -->
                <template #cell(total_deductions)="data">

                    <div>
                        {{moneyFormat(data.item.employment_deductions.reduce(function (acc, obj) { return acc + obj.value; }, 0) )}}
                    </div>

                </template>

                <!-- Column: Actions -->
                <template #cell(actions)="data">

                    <div @click="edit_my_emp(data.item)">
                        <feather-icon icon="EditIcon" />
                        <span class="align-middle ml-50">Edit</span>

                    </div>
                    <div @click="DeleteEmp(data.item.id)">
                        <feather-icon icon="TrashIcon" />
                        <span class="align-middle ml-50">Delete</span>

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
import editEmp from './edit'
import addnew from './add'
export default {
    components: {
        addnew,
        vSelect,
        editEmp

    },
    props: {

        myPayroll: Array,
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
            fields: [
 {
                    key: 'employee.full_name',
                    label: 'Employee Name',
                    sortable: true,
                },
                {
                    key: 'employee.employee_number',
                    label: 'Employee Number',
                    sortable: true,
                },
               
                {
                    key: 'basic_salary',
                    label: 'Basic Salary',
                    sortable: true,
                },
                {
                    key: 'housing',
                    label: 'Housing',
                    sortable: true,
                },
                {
                    key: 'transportation',
                    label: 'Transportation',
                    sortable: true,
                },
                {
                    key: 'total_additions',
                    label: 'Additions',
                    sortable: true,
                },
                  {
                    key: 'total_deductions',
                    label: 'Deductions',
                    sortable: true,
                },

                {
                    key: 'net',
                    label: 'Net',
                    sortable: true,
                },

                {
                    key: 'actions',
                },

            ],
            items: [],
            myloader: null,
            boxOne: ''
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
        //  this.totalRows = this.$props.myPayroll.length
    },
    methods: {
        addItem(data) {
            this.$props.myPayroll.push(data);
        },
        removeitem(myitem) {
            var myarray = this.$props.myPayroll;
            myarray.splice(myarray.findIndex(item => item === myitem), 1)
            this.items = myarray;

        },
        edit_my_emp(emp) {
            this.currentEdit = emp
            this.isEditUserSidebarActive = true
        },
        refetchemployees() {
            this.$emit('refetch-employees');
        },
        DeleteEmp(id) {
            this.boxOne = ''
            this.$bvModal
                .msgBoxConfirm('Please confirm that you want to delete this Employee.', {
                    title: 'Please Confirm',
                    size: 'sm',
                    okVariant: 'danger',
                    okTitle: 'Yes',
                    cancelTitle: 'No',
                    cancelVariant: 'outline-secondary',
                    hideHeaderClose: false,
                    centered: true,
                })
                .then(value => {
                    this.boxOne = value;
                    if (value) {
                        this.DeleteEmpHard(id);

                    }
                })
        },
        DeleteEmpHard(id) {
            axios
                .post(`/payroll-employees/employees/delete/` + id, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    this.refetchemployees();
                    this.openNotification('top-right', 'success', 'Done !!', 'The Employee Has Been Deleted.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
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

        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },

    },
}
</script>
