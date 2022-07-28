<template>
<div>
    <b-card title="Upload Your Attachment" hide-backdrop no-close-on-backdrop>
        <b-form ref="form" class="mt-1">
            <b-row>
                <b-alert class="p-2" :show="myerror.length > 0" variant="danger">{{myerror}}</b-alert>

                <b-col cols="12" md="12" lg="12">
                    <div class="upload-div" v-b-modal.modal-center>
                        Click To Upload Attachment
                    </div>

                    <!-- modal vertical center -->
                    <b-modal ref="modal-center" id="modal-center" size="lg" centered hide-footer title="Upload Your Attachment"  hide-backdrop no-close-on-backdrop>
                        <b-card-text>

                            <b-alert class="p-2" :show="fileerror != ''" variant="danger">{{fileerror}}</b-alert>

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
            <b-row class="mt-4 mb-4">
                <b-col cols="12" md="12">
                    <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="upload_items_files" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection">

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
        </b-form>
    </b-card>
    <b-card title="Select Supplier">
        <b-row>
            <b-col md="6" lg="4">
                <b-form-group label="Supplier" label-for="Supplier">
                    <v-select v-model="mysupplier" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="suppliers" label="full_name" :clearable="true" input-id="supplier">
                        <template #search="{attributes, events}">
                            <input class="vs__search" :required="!mysupplier" v-bind="attributes" v-on="events">
                        </template>
                    </v-select>
                </b-form-group>
            </b-col>
            <b-col md="6" lg="6">
                <suppliderDailog @refetch-suppliers="fetch_suppliers"></suppliderDailog>

            </b-col>
        </b-row>
    </b-card>
    <b-card title="Add Bill Items">
        <b-form ref="form" class="mt-1">
            <b-row>
                <b-col>
                    <itemslist :itemsList="itemsList" @submitdata="listdata"></itemslist>
                </b-col>
            </b-row>
            <b-row class="mt-4 mb-2">
                <b-col cols="12" md="6" lg="6">
                    <b-button size="lg" variant="outline-secondary" @click="$router.push('/')">
                        Cancel
                    </b-button>
                </b-col>
                <b-col cols="12" md="6" lg="6" class="text-right">
                    <b-button size="lg" variant="primary" @click="submit" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :block="$store.getters['app/currentBreakPoint'] === 'xs'">
                        submit
                    </b-button>

                </b-col>
            </b-row>
        </b-form>
    </b-card>
</div>
</template>

<script>
import suppliderDailog from '@/components/Dialogs/newSupplier.vue'
import vue2Dropzone, {
    mounted
} from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from '@axios'
import vSelect from 'vue-select'
import itemslist from './items/list';
export default {
    components: {

        vueDropzone: vue2Dropzone,
        itemslist,
        vSelect,
        suppliderDailog

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
            Uploads: null,
            upload_type: '',
            files_form: [],
            myerror: '',
            myerror2: '',
            mysupplier: null,
            upload_items_files: [],
            uploadtypes: [],
            sortBy: '',
            sortDesc: false,
            itemsList: [],
            sortDirection: 'asc',
            fileerror: '',
            suppliers: [],
            bills_types: [],
            dropzoneOptions: {
                url: 'https://',
                autoProcessQueue: false,
                autoQueue: false,
                disablePreviews: false,
                addRemoveLinks: true,
                uploadMultiple: false,
                thumbnailWidth: 150,
                maxFilesize: 15,
                dictDefaultMessage: "<i class='fa fa-upload m-1'></i>Click Or Drag file here to Upload.",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            },
            fields: [

                {
                    key: 'file.name',
                    label: 'File Name',
                    sortable: true,
                },
                {
                    key: 'type.type_name',
                    label: 'Type Name',
                    sortable: true,
                },

                {
                    key: 'actions',
                },

            ],
        }
    },

    methods: {

        hideModal() {
            this.$refs['modal-center'].hide()
        },
        AddAttachment() {
            this.myerror = '';
            if (this.upload_type == '') {
                this.myerror2 = 'Please Select Type of Attachment'
                return;
            }
            this.fileerror = false;

            if (this.files_form.length == 0) {
                this.myerror2 = 'Please Upload File'
                return;
            }

            for (var i = 0; i < this.files_form.length; i++) {
                if (this.files_form[i].size > 150000000) {
                    this.fileerror = 'photo size should be less than 15 MB!';
                    return;
                }
                var data = {
                    file: this.files_form[i],
                    type: this.upload_type
                }
                console.log(data)
                this.upload_items_files.push(data);
            }
            this.files_form = [];
            this.upload_type = '';
            this.hideModal();
        },

        listdata(data) {
            this.upload_items = data;
        },
        submit() {
            this.myerror = ''
            if (this.upload_items_files.length == 0) {
                this.openNotification('top-right', 'danger', "Validation", "Please Upload File")
                return;
            }
            if (this.mysupplier == null) {
                this.openNotification('top-right', 'danger', "Validation", "Please Select Supplier")
                return;
            }

            const mydata = {
                files: this.upload_items_files,
                items: this.itemsList,
                supplier: this.mysupplier
            }
            console.log(mydata)
            this.$emit('submitUpload', mydata);
        },
        fileAdded(file) {
            const myfile = {
                name: file.name,
                size: file.size,
                type: file.type,
            }
            this.fileerror = false;
            this.files_form.push(file)
            if (!file) {
                return;
            }
            if (file.size > 150000000) {
                this.fileerror = 'photo size should be less than 15 MB!';
                return;
            }

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
        async fetch_suppliers() {
            await axios
                .get('/suppliers/list')
                .then(response => {
                    this.suppliers = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        removeFile(file) {
            this.$refs.myVueDropzone.removeFile(file)
        },
        openNotification(position = 'top-right', color, title, message) {
            const noti = this.$vs.notification({
                color,
                position,
                title,
                text: message,
            })
        },

    },
    async beforeMount() {
        this.fetch_suppliers();
        this.fetch_type_upload();
    },
}
</script>

<style lang="scss">
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
}
.vue-dropzone>.dz-preview .dz-error-message{
    top:10 px !important;
}
</style>
