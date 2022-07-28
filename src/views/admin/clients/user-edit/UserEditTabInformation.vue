<template>
<div>
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
        <b-form ref="form" class="mt-1" @submit.prevent="handleSubmit(editInfo)">

        <!-- Header: Personal Info -->
        <div class="d-flex mb-2">
            <feather-icon icon="ApertureIcon" size="19" />
            <h4 class="mb-0 ml-50">
                General Business Details
            </h4>
        </div>
        <b-row>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Business Name" label-for="businessname">
                    <b-form-input id="businessname" v-model="userData.business_info.business_name" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Name In CR" label-for="crname">
                    <b-form-input id="crname" v-model="userData.business_info.business_cr_name" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <!-- Field: Mobile -->
            <b-col cols="12" md="6" lg="4">
                <validation-provider #default="validationContext" name="Type Of Business" rules="required">
                        <b-form-group label="Type Of Business" label-for="Type Of Business">
                            <v-select v-model="userData.business_info.business_type" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="business_types" label="Type Of Business" :clearable="true" input-id="BillType" :state="getValidationState(validationContext)" trim  :disabled="isdisable"/>
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Category" label-for="category">
                    <v-select v-model="userData.business_info.business_category" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="CategoryOptions" :reduce="val => val.value" :clearable="false" input-id="category" :disabled="isdisable" />
                </b-form-group>
            </b-col>

            <!-- Field: Website -->
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="City" label-for="city">
                    <b-form-input id="city" v-model="userData.business_info.business_city" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Address" label-for="address">
                    <b-form-input id="address" v-model="userData.business_info.business_address" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Number of empolyees" label-for="empolyees">
                    <b-form-input id="empolyees" v-model="userData.business_info.business_num_emp" :disabled="isdisable" />
                </b-form-group>
            </b-col>

        </b-row>
        <!-- Header: Personal Info -->
        <div class="d-flex mt-2 mb-2">
            <feather-icon icon="CheckSquareIcon" size="19" />
            <h4 class="mb-0 ml-50">
                Trade Certificate Information
            </h4>
        </div>
        <b-row>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="CR Number" label-for="crnumber">
                    <b-form-input id="crnumber" v-model="userData.business_info.business_cr_num" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="6">
                <b-form-group label="CR Copy" label-for="crname">

                    <b-form-file v-if="userData.business_info.business_cr_file == 'null'  || userData.business_info.business_cr_file == null" ref="file" v-model="userData.business_info.business_cr_file" placeholder="Upload CR Copy..." drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @change="handleFileUpload()" />

                    <div v-else>
                        <span class="d-block"> {{getfilename(userData.business_info.business_cr_file)}}</span>
                        <b-button variant="primary" class="mr-2" @click="openLink(userData.business_info.business_cr_file)" target="_blank">Open File</b-button>
                        <b-button variant="outline-secondary" @click="userData.business_info.business_cr_file = null" target="_blank">Replace File</b-button>
                    </div>
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="VAT Number" label-for="vatnumber">
                    <b-form-input id="vatnumber" v-model="userData.business_info.business_vat_numb" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="6">
                <b-form-group label="VAT Copy" label-for="crname">
                    <b-form-file v-if="userData.business_info.business_vat_file == 'null' || userData.business_info.business_vat_file == null" v-model="userData.business_info.business_vat_file" type="file" placeholder="Upload VAT Copy..." drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @change="handleFileUpload()" />
                    <div v-else>
                        <span class="d-block"> {{getfilename(userData.business_info.business_vat_file)}}</span>
                        <b-button variant="primary" class="mr-2" @click="openLink(userData.business_info.business_vat_file)" target="_blank">Open File</b-button>
                        <b-button variant="outline-secondary" @click="userData.business_info.business_vat_file = null" target="_blank">Replace File</b-button>
                    </div>
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Articles of Association" label-for="articles">
                    <b-form-input id="articles" v-model="userData.business_info.business_aoa" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="6">
                <b-form-group label="Upload AOA" label-for="crname">
                    <b-form-file v-if="userData.business_info.business_aoa_file == 'null' || userData.business_info.business_aoa_file == null" type="file" placeholder="Upload VAT AOA..." v-model="userData.business_info.business_aoa_file" drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @change="handleFileUpload()" />
                    <div v-else>
                        <span class="d-block"> {{getfilename(userData.business_info.business_aoa_file)}}</span>
                        <b-button variant="primary" class="mr-2" @click="openLink(userData.business_info.business_aoa_file)" target="_blank">Open File</b-button>
                        <b-button variant="outline-secondary" @click="userData.business_info.business_aoa_file = null" target="_blank">Replace File</b-button>
                    </div>
                </b-form-group>
            </b-col>

        </b-row>

        <!-- Header: Personal Info -->
        <div class="d-flex mt-2 mb-2">
            <feather-icon icon="DollarSignIcon" size="19" />
            <h4 class="mb-0 ml-50">
                Financial Information
            </h4>
        </div>
        <b-row>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Sales for last Reporting Period" label-for="lastSales">
                    <b-form-input id="lastSales" v-model="userData.business_info.business_last_sales" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Last financials" label-for="lastfinancials">
                    <b-form-input id="lastfinancials" v-model="userData.business_info.business_last_finan" :disabled="isdisable" />
                </b-form-group>
            </b-col>

            <!-- Field: Mobile -->

            <!-- Field: Website -->
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Total Expenses" label-for="TotalExpenses">
                    <b-form-input id="TotalExpenses" v-model="userData.business_info.business_total_exp" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Net Profit" label-for="NetProfit">
                    <b-form-input id="NetProfit" v-model="userData.business_info.business_net_profit" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Last financials" label-for="lastfinancialsoptions" label-class="mb-1">
                    <b-form-checkbox-group id="lastfinancialsoptions" v-model="userData.business_info.business_last_finan_type" :options="lastfinancialsoptions" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Do you have hold stock inventory ?" label-for="havestock" label-class="mb-1">
                    <b-form-checkbox-group id="havestock" v-model="userData.business_info.business_have_stock" :options="havestock" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Do you Sell online ?" label-for="sellonline" label-class="mb-1">
                    <b-form-checkbox-group id="sellonline" v-model="userData.business_info.business_sell_online" :options="havestock" :disabled="isdisable" />
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Header: Personal Info -->
        <div class="d-flex mt-2 mb-2">
            <feather-icon icon="UserIcon" size="19" />
            <h4 class="mb-0 ml-50">
                Contact Person
            </h4>
        </div>
        <b-row>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Full Name" label-for="fullname">
                    <b-form-input id="fullname" v-model="userData.business_info.business_person_full_name" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <b-col cols="12" md="12" lg="4">
                <b-form-group label="Mobile Number" label-for="monile">
                    <b-form-input id="monile" v-model="userData.business_info.business_person_mobile" :disabled="isdisable" />
                </b-form-group>
            </b-col>
            <!-- Field: Mobile -->
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Designation" label-for="Designation">
                    <b-form-input id="Designation" v-model="userData.business_info.business_person_designation" :disabled="isdisable" />
                </b-form-group>
            </b-col>

            <!-- Field: Website -->
            <b-col cols="12" md="6" lg="4">
                <b-form-group label="Email" label-for="Email">
                    <b-form-input id="Email" v-model="userData.business_info.business_person_email" :disabled="isdisable" />
                </b-form-group>
            </b-col>

        </b-row>
        <b-row class="mt-2">
            <b-col v-if="!isdisable">
                <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="editInfo(userData.business_info.id)">
                    Save Changes
                </b-button>
                <b-button variant="outline-secondary" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="$emit('reset')">
                    Reset
                </b-button>
            </b-col>
            <b-col v-else>
                <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :to="{ name: 'clients-admin-edit', params: { id: userData.id } }" :block="$store.getters['app/currentBreakPoint'] === 'xs'">
                    Edit
                </b-button>
            </b-col>
        </b-row>
        </b-form>
    </validation-observer>
</div>
</template>

<script>
import axios from '@axios'

import vSelect from 'vue-select'
import {
    ValidationProvider,
    ValidationObserver,
} from 'vee-validate'
export default {
    components: {
        vSelect,
        ValidationProvider,
        ValidationObserver,
    },
    props: {
        userData: Object,
        isdisable: Boolean,
    },
    data() {
        return {
            CategoryOptions: [{
                label: 'test',
                value: 'test',
            }],
            lastfinancialsoptions: [{
                    text: 'Audited',
                    value: 0,
                },
                {
                    text: 'Internal',
                    value: 1,
                },
            ],
            havestock: [{
                    text: 'YES',
                    value: 1,
                },
                {
                    text: 'NO',
                    value: 0,
                },
            ],
            business_types:[],
            business_categories:[],
        }
    },
    mounted(){
        this.fetch_types();
        this.fetch_categories();
    },
    methods: {
        getfilename(link) {
            var filename = link.split(/[\\\/]/).pop();

            return filename;
        },
        openLink(link) {
            window.open(link, "_target");
        },
        editInfo(id) {
            this.openLoading()
            const formDataObj = new FormData()
            
              formDataObj.append('user_id', this.$props.userData.business_info.user_id)
            formDataObj.append('business_name', this.$props.userData.business_info.business_name)
            formDataObj.append('business_type', this.$props.userData.business_info.business_type)
            formDataObj.append('business_cr_name', this.$props.userData.business_info.business_cr_name)
            formDataObj.append('business_category', this.$props.userData.business_info.business_category)
            formDataObj.append('business_num_emp', this.$props.userData.business_info.business_num_emp)
            formDataObj.append('business_city', this.$props.userData.business_info.business_city)
            formDataObj.append('business_address', this.$props.userData.business_info.business_address)
            formDataObj.append('business_cr_num', this.$props.userData.business_info.business_cr_num)
            formDataObj.append('business_vat_numb', this.$props.userData.business_info.business_vat_numb)
            formDataObj.append('business_aoa', this.$props.userData.business_info.business_aoa)
            formDataObj.append('business_last_sales', this.$props.userData.business_info.business_last_sales)
            formDataObj.append('business_last_finan', this.$props.userData.business_info.business_last_finan)
            formDataObj.append('business_total_exp', this.$props.userData.business_info.business_total_exp)
            formDataObj.append('business_net_profit', this.$props.userData.business_info.business_net_profit)
            formDataObj.append('business_last_finan_type', this.$props.userData.business_info.business_last_finan_type)
            formDataObj.append('business_have_stock', this.$props.userData.business_info.business_have_stock)
            formDataObj.append('business_sell_online', this.$props.userData.business_info.business_sell_online)
            formDataObj.append('business_person_full_name', this.$props.userData.business_info.business_person_full_name)
            formDataObj.append('business_person_mobile', this.$props.userData.business_info.business_person_mobile)
            formDataObj.append('business_person_designation', this.$props.userData.business_info.business_person_designation)
            formDataObj.append('business_person_email', this.$props.userData.business_info.business_person_email)

            formDataObj.append('business_cr_file', this.$props.userData.business_info.business_cr_file)
            formDataObj.append('business_vat_file', this.$props.userData.business_info.business_vat_file)
            formDataObj.append('business_aoa_file', this.$props.userData.business_info.business_aoa_file)

            axios
                .post(`/users-admin/business/update/${id}`, formDataObj, {

                    'Content-Type': 'multipart/form-data',

                })
                .then(response => {
                    this.myloader.close();

                    console.log(response)
                    this.$emit('businessUpdated');
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been updated.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                    this.myloader.close()
                })
        },
        async fetch_types() {
            await axios
                .get('/business-types/list')
                .then(response => {
                    this.business_types = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
           async fetch_categories() {
            await axios
                .get('/business-categories/list')
                .then(response => {
                    this.business_categories = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        handleFileUpload() {
            this.file = this.$ref.files.files[0]
            console.log(this.file)
        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform,

            })
        },
         getValidationState({
            dirty,
            validated,
            valid = null,
        }) {
            return dirty || validated ? valid : null
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
}
</script>
