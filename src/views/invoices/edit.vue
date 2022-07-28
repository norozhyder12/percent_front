<template>
<div v-if="mybill != null">

    <b-card title="Invoice Information">
        <b-row>
            <b-col cols="4">
                <b-form-group label="Customer" label-for="Customer">
                    <v-select v-model="mybill.my_customer" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="suppliers" label="full_name" :clearable="true" input-id="supplier">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!mybill.my_customer" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
            </b-col>
            <b-col cols="4">
                <b-form-group label="Status" label-for="Status">
                    <v-select v-model="mybill.status" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :reduce="(option) => option.value" :options="Status_List" label="text" :clearable="true" input-id="Status">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!mybill.Status" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
            </b-col>
        </b-row>
    </b-card>
    <b-card title="Invoice Attachment">
        <b-row>
            <b-alert class="p-2" :show="myerror.length > 0" variant="danger">{{myerror}}</b-alert>

            <b-col cols="12" md="12" lg="12">
                <div class="upload-div" v-b-modal.modal-center>
                    Click To Upload Attachment
                </div>

                <!-- modal vertical center -->
                <b-modal ref="modal-center" id="modal-center" size="lg" centered hide-footer title="Upload Your Attachment" hide-backdrop no-close-on-backdrop>
                    <b-card-text>
                        <b-alert class="p-2" :show="myerror2.length > 0" variant="danger">{{myerror2}}</b-alert>
                        <b-form-group label-for="dropzone">
                            <vue-dropzone id="dropzone" ref="myVueDropzone" v-model="Uploads" :uploadMultiple="false" :options="dropzoneOptions" @vdropzone-file-added="fileAdded" />
                        </b-form-group>
                        <b-form-group label="Type Of Attachment" label-for="BillType">
                            <v-select v-model="upload_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="uploadtypes" label="type_name" :clearable="true" input-id="BillType">
                                <template #search="{attributes, events}">
                                    <input class="vs__search" :required="!upload_type" v-bind="attributes" v-on="events">
                                </template>
                            </v-select>
                        </b-form-group>
                    </b-card-text>
                    <div class="dialog-bottom d-flex">

                        <b-button class="mt-3" variant="outline-primary" block @click="hideModal">Cancel</b-button>
                        <b-button class="mt-3" variant="primary" block @click="AddAttachment">Add</b-button>
                    </div>
                </b-modal>
            </b-col>

        </b-row>
        <b-row>
            <b-col cols="12">
                <b-table striped hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="mybill.files" :fields="files_fileds" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                    <template #cell(path)="data">
                        <div @click="openNewWindow(data.item.path)">
                            <feather-icon icon="DownloadIcon" />
                            <span class="align-middle ml-50">Download</span>

                        </div>

                    </template>
                    <template #cell(actions)="data">
                        <div @click="DeleteFile(data.item.id)">
                            <feather-icon icon="TrashIcon" />
                            <span class="align-middle ml-50">Delete</span>

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
    <b-card title="Invoice Items">
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
                                    <strong>Branch: </strong>{{ row.item.branch.name }}
                                </b-col>
                               
                                <b-col md="4" class="mb-1">
                                    <strong>Cost Center: </strong>{{ row.item.cost_center.name }}
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

                    <template #cell(actions)="data">
                        <EditItem :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive" :itemData="data.item" @itemsUpdated="itemsUpdated" />
                        <div @click="isAddNewUserSidebarActive = true">
                            <feather-icon icon="EditIcon" />
                            <span class="align-middle ml-50">Edit</span>

                        </div>
                        <div @click="DeleteItem(data.item.id)">
                            <feather-icon icon="TrashIcon" />
                            <span class="align-middle ml-50">Delete</span>

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
    <b-card title="Actions">
        <b-row class="mt-4 mb-2">
            <b-col cols="12" md="6" lg="6">

            </b-col>
            <b-col cols="12" md="6" lg="6" class="text-right">
                <b-button size="lg" variant="outline-secondary" class="mr-4" @click="$router.push('/invoices')">
                    Cancel
                </b-button>
                <b-button size="lg" variant="primary" @click="UpdateBill" class="mb-1 mb-sm-0 mr-0 mr-sm-1">
                    Update
                </b-button>

            </b-col>
        </b-row>
    </b-card>
</div>
</template>

<script>
import EditItem from '@/components/uploadInvoice/items/edititem.vue'

import vue2Dropzone, {
    mounted
} from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from '@axios'
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal.vue'
import vSelect from 'vue-select'
export default {
    components: {
        StatisticCardHorizontal,
        vSelect,
        vueDropzone: vue2Dropzone,
        EditItem
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
            supplier: '',
            suppliers: [],
            sortDirection: 'asc',
            filter: null,
            Status: '',
            filterOn: [],
            myerror: '',
            myerror2: '',
            mybill: null,
            dropzoneOptions: {
                url: 'https://',
                autoProcessQueue: false,
                autoQueue: false,
                disablePreviews: false,
                addRemoveLinks: true,
                uploadMultiple: false,
                thumbnailWidth: 150,
                maxFilesize: 8,
                dictDefaultMessage: "<i class='fa fa-upload m-1'></i>Click Or Drag file here to Upload.",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            },
            Status_List: [{
                    text: 'UnPaid',
                    value: 0
                },
                {
                    text: 'Paid',
                    value: 1
                },
                {
                    text: 'Paid Partial',
                    value: 2
                }
            ],
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
                {
                    key: 'actions',
                },
            ],
            fields: [
                'show_details',
                {
                    key: 'id',
                    label: 'Item Number',
                },
                  {
                    key: 'description',
                    label: 'Description',
                },
                {
                    key: 'created_at',
                    label: 'Issue Date',
                    sortable: true,
                },
  {
                    key: 'revenue.name',
                    label: 'revenue Type',
                    sortable: true,
                },
                {
                    key: 'unit_price',
                    label: 'Unit Price',
                    sortable: true,
                },
                {
                    key: 'quantity',
                    label: 'Quantity',
                    sortable: true,
                },
                {
                    key: 'total_value',
                    label: 'Total Value',
                    sortable: true,
                },
                {
                    key: 'actions',
                },

            ],
            items: [],
            myloader: null,
            uploadtypes: [],
            upload_type: '',
            Uploads: null,
            files_form: [],
            boxOne: '',
            revenue_types:[]
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
        this.fetch_suppliers();
        this.fetch_type_upload();
        this.fetch_type_revenue();
        this.totalRows = this.items.length
    },

    methods: {
        DeleteItem(id) {
            this.boxOne = ''
            this.$bvModal
                .msgBoxConfirm('Please confirm that you want to delete this Item.', {
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
                    this.DeleteItemHard(id);

                    }
                })
        },
        DeleteItemHard(id) {
            axios
                .post(`/invoices/items/delete/` + id, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    this.fetchbill(this.$route.params.id)
                    this.openNotification('top-right', 'success', 'Done !!', 'The Item Has Been Deleted.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
         DeleteFile(id) {
            this.boxOne = ''
            this.$bvModal
                .msgBoxConfirm('Please confirm that you want to delete this File.', {
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
                    this.DeleteFileHard(id);

                    }
                })
        },
        DeleteFileHard(id) {
            axios
                .post(`/invoices/files/delete/` + id, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    this.fetchbill(this.$route.params.id)
                    this.openNotification('top-right', 'success', 'Done !!', 'The File Has Been Deleted.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        UpdateBill() {
              var here = this;
            this.openLoading();
            const formDataObj = new FormData()
            //files
            for (var i = 0; i < this.mybill.files.length; i++) {
                if (!this.mybill.files[i].invoice_id) {
                    formDataObj.append('attachment[' + i + '][path]', this.mybill.files[i].file)
                    formDataObj.append('attachment[' + i + '][type]', this.mybill.files[i].uploadtype.id)
                }
            }
            formDataObj.append('status', this.mybill.status)
            formDataObj.append('customer_id', this.mybill.customer_id)

            if (this.mybill.items != null) {
                for (var i = 0; i < this.mybill.items.length; i++) {
                    formDataObj.append('items[' + i + '][revenue_type_id]', this.mybill.items[i].revenue_type_id)
                    formDataObj.append('items[' + i + '][branch_id]', this.mybill.items[i].branch_id)
                    formDataObj.append('items[' + i + '][costcenter_id]', this.mybill.items[i].costcenter_id)
                    formDataObj.append('items[' + i + '][description]', this.mybill.items[i].description)

                    formDataObj.append('items[' + i + '][unit_price]', parseFloat(this.mybill.items[i].unit_price))
                    formDataObj.append('items[' + i + '][quantity]', parseFloat(this.mybill.items[i].quantity))
                    formDataObj.append('items[' + i + '][total_value]', parseFloat(this.mybill.items[i].total_value))
                }
            }

            axios
                .post(`/invoices/update/` + this.mybill.id, formDataObj, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    console.log(response)
                    this.myloader.close()
                    this.$router.push('/invoices/view/' + this.mybill.id)
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                    this.myloader.close()
                })
        },
        itemsUpdated() {

        },
        hideModal() {
            this.$refs['modal-center'].hide()
        },
        AddAttachment() {
            this.myerror = '';
            if (this.upload_type == '') {
                this.myerror2 = 'Please Select Type of Attachment'
                return;
            }
            if (this.files_form.length == 0) {
                this.myerror2 = 'Please Upload File'
                return;
            }

            for (var i = 0; i < this.files_form.length; i++) {
                var data = {
                    media: [{
                        file_name: this.files_form[i].name
                    }],
                    file: this.files_form[i],
                    uploadtype: this.upload_type
                }
                this.mybill.files.push(data);
            }
            this.files_form = [];
            this.upload_type = '';
            this.hideModal();
        },
        fileAdded(file) {
            const myfile = {
                name: file.name,
                size: file.size,
                type: file.type,
            }
            this.files_form.push(file)
        },
        async fetch_type_upload() {
            await axios
                .get('/uploadtypes/list')
                .then(response => {
                    this.uploadtypes = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        removeitem(myitem) {
            var myarray = this.upload_items_files;
            myarray.splice(myarray.findIndex(item => item === myitem), 1)
            this.items = myarray;

        },
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
              async fetch_type_revenue() {
            await axios
                .get('/revenue-types/list')
                .then(response => {
                    this.revenue_types = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        async fetch_suppliers() {
            await axios
                .get('/customers/list')
                .then(response => {
                    this.suppliers = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
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
        openNewWindow(path) {
            window.open(path, '_blank')
        },
        fetchbill(id) {
            this.openLoading()
            axios
                .get('/invoices/' + id)
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

.dialog-bottom {
    justify-content: end;
    padding: 1rem 0;

    button {
        width: 150px;
        margin-left: 2rem;
    }
}

.upload-div {
    border: 2px dashed #38b8eb;
    width: 100%;
    padding: 4rem 0;
    text-align: center;
    color: #38b8eb;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 2rem;
}
</style>
