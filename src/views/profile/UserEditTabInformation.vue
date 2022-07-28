<template>
<div ref="myform2">
    <validation-observer #default="{ handleSubmit }" ref="myrules">
        <b-form ref="simpleRules" class="mt-1" @submit.prevent="handleSubmit(editInfo)">

            <!-- Header: Personal Info -->
            <div class="d-flex mb-2">
                <feather-icon icon="ApertureIcon" size="19" />
                <h4 class="mb-0 ml-50">
                    General Business Details
                </h4>
            </div>
            <b-row>
                <b-col cols="12" md="12" lg="4">
                    <validation-provider #default="validationContext" name="businessname" rules="required">
                        <b-form-group label="Business Name" label-for="Business Name" class="req">
                            <b-form-input id="businessname" v-model="userData.business_name" :state="getValidationState(validationContext)" trim :disabled="isdisable" />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="12" lg="4">
                    <validation-provider #default="validationContext" name="businessname" class="req" rules="required">
                        <b-form-group label="Name In CR" label-for="crname">
                            <b-form-input id="crname" v-model="userData.business_cr_name" :state="getValidationState(validationContext)" trim :disabled="isdisable" />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>

                </b-col>
                <!-- Field: Mobile -->
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Type Of Business" label-for="Business" class="req">
                        <v-select v-model="userData.business_type_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="business_types" label="name" :reduce="obj => obj.id" :clearable="true" input-id="Type Of Business" :disabled="isdisable">
                            <template #search="{attributes, events}">
                                <input class="vs__search" :required="!userData.business_type_id" v-bind="attributes" v-on="events">
                            </template>
                        </v-select>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Category" label-for="Category" class="req">
                        <v-select v-model="userData.business_category_id" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="business_categories" label="name" :reduce="obj => obj.id" :clearable="true" input-id="Category" :disabled="isdisable">
                            <template #search="{attributes, events}">
                                <input class="vs__search" :required="!userData.business_category_id" v-bind="attributes" v-on="events">
                            </template>
                        </v-select>
                    </b-form-group>
                </b-col>

                <!-- Field: Website -->
                <b-col cols="12" md="6" lg="4">
                    <validation-provider #default="validationContext" name="city" rules="required" class="req">
                        <b-form-group label="City" label-for="crname">
                            <b-form-input id="city" v-model="userData.business_city" :state="getValidationState(validationContext)" trim :disabled="isdisable" />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>

                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <validation-provider #default="validationContext" name="Address" rules="required" class="req">
                        <b-form-group label="Address" label-for="Address">
                            <b-form-input id="Address" v-model="userData.business_address" :state="getValidationState(validationContext)" trim :disabled="isdisable" />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Number of empolyees" label-for="Number of empolyees" class="req">
                        <v-select v-model="userData.business_num_emp" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" required :options="num_emp_list" label="name" :clearable="true" input-id="Number of empolyees" :disabled="isdisable">
                            <template #search="{attributes, events}">
                                <input class="vs__search" :required="!userData.business_num_emp" v-bind="attributes" v-on="events">
                            </template>
                        </v-select>
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
                        <b-form-input id="crnumber" v-model="userData.business_cr_num" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="CR Copy (Max Size 3MB)" label-for="crname" class="req">
                        <b-form-file v-if="userData.business_cr_file == 'null'  || userData.business_cr_file == null ||  userData.business_cr_file == ''" ref="file" v-model="userData.business_cr_file" placeholder="Upload CR Copy..." drop-placeholder="Drop file here..." no-drop @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.business_cr_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.business_cr_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.business_cr_file = null" target="_blank">Replace File</b-button>
                        </div>
                    </b-form-group>

                </b-col>
                <b-col cols="12" md="12" lg="4">
                    <b-form-group label="VAT Number" label-for="vatnumber">
                        <b-form-input id="vatnumber" v-model="userData.business_vat_numb" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="VAT Copy (Max Size 3MB)" label-for="crname" class="req">
                        <b-form-file v-if="userData.business_vat_file == 'null' || userData.business_vat_file == null || userData.business_vat_file == ''" v-model="userData.business_vat_file" type="file" placeholder="Upload VAT Copy..." drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.business_vat_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.business_vat_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.business_vat_file = null" target="_blank">Replace File</b-button>
                        </div>
                    </b-form-group>
                </b-col>

                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="Upload Articles of Association (Max Size 3MB)" label-for="crname" class="req">
                        <b-form-file v-if="userData.business_aoa_file == 'null' || userData.business_aoa_file == null || userData.business_aoa_file == ''" type="file" placeholder="Upload AOA..." v-model="userData.business_aoa_file" drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.business_aoa_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.business_aoa_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.business_aoa_file = null" target="_blank">Replace File</b-button>
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
                    <validation-provider #default="validationContext" name="Address" rules="required" class="req">
                        <b-form-group label="Sales for last Reporting Period" label-for="lastSales" class="req">
                            <b-form-input id="lastSales" v-model="userData.business_last_sales" :disabled="isdisable" :state="getValidationState(validationContext)" trim />
                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>

                </b-col>

                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="Upload Last financials (Max Size 3MB)" label-for="ltb">
                        <b-form-file v-if="userData.last_fin_file == 'null' || userData.last_fin_file == null || userData.last_fin_file == ''" type="file" placeholder="Upload Last financials..." v-model="userData.last_fin_file" drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.last_fin_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.last_fin_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.last_fin_file = null" target="_blank">Replace File</b-button>
                        </div>
                    </b-form-group>
                </b-col>

                <!-- Field: Mobile -->

                <!-- Field: Website -->
                <b-col cols="12" md="6" lg="4">
                    <validation-provider #default="validationContext" name="TotalExpenses" rules="required" class="req">
                        <b-form-group label="Total Expenses" label-for="TotalExpenses" class="req">
                            <b-form-input id="TotalExpenses" v-model="userData.business_total_exp" :disabled="isdisable" :state="getValidationState(validationContext)" trim />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>

                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <validation-provider #default="validationContext" name="Address" rules="required" class="req">
                        <b-form-group label="Net Profit" label-for="NetProfit" class="req">
                            <b-form-input id="NetProfit" v-model="userData.business_net_profit" :disabled="isdisable" :state="getValidationState(validationContext)" trim />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>

                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Capital As Pet CR" label-for="caps">
                        <b-form-input id="business_caps" v-model="userData.business_caps" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Last financials" label-for="lastfinancialsoptions" label-class="mb-1">
                        <b-form-checkbox-group id="lastfinancialsoptions" v-model="userData.business_last_finan_type" :options="lastfinancialsoptions" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="6" lg="4">
                    <b-form-group label="Do you have hold stock inventory ?" label-for="havestock" label-class="mb-1">
                        <b-form-checkbox-group id="havestock" v-model="userData.business_have_stock" :options="havestock" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="4">
                    <b-form-group label="Do you Sell online ?" label-for="sellonline" label-class="mb-1">
                        <b-form-checkbox-group id="sellonline" v-model="userData.business_sell_online" :options="havestock" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="4">
                    <b-form-group label="Do you use POS System ?" label-for="posuse" label-class="mb-1">
                        <b-form-checkbox-group id="posuse" v-model="userData.business_use_pos" :options="havestock" :disabled="isdisable" />
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="Upload Latest Trial Balance (Max Size 3MB)" label-for="ltb">
                        <b-form-file v-if="userData.business_ltb_file == 'null' || userData.business_ltb_file == null || userData.business_ltb_file == ''" type="file" placeholder="Upload Latest Trial Balance..." v-model="userData.business_ltb_file" drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.business_ltb_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.business_ltb_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.business_ltb_file = null" target="_blank">Replace File</b-button>
                        </div>
                    </b-form-group>
                </b-col>
                <b-col cols="12" md="12" lg="6">
                    <b-form-group label="Upload Latest Vat Return (Max Size 3MB)" label-for="ltb">
                        <b-form-file v-if="userData.business_lvr_file == 'null' || userData.business_lvr_file == null || userData.business_lvr_file == ''" type="file" placeholder="Upload Latest Vat Return..." v-model="userData.business_lvr_file" drop-placeholder="Drop file here..." no-drop :disabled="isdisable" @input="handleFileUpload" />
                        <div v-else>
                            <span class="d-block"> {{getfilename(userData.business_lvr_file)}}</span>
                            <b-button variant="primary" class="mr-2" @click="openLink(userData.business_lvr_file)" target="_blank">Open File</b-button>
                            <b-button variant="outline-secondary" @click="userData.business_lvr_file = null" target="_blank">Replace File</b-button>
                        </div>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="mt-2">
                <b-col v-if="!isdisable">
                    <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" type="submit">
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
        welcome: Boolean
    },
    data() {
        return {
            percent: 0,
            num_emp_list: [
                '1-5',
                '6-10',
                '11-20',
                '21-50',
                '50+'
            ],
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
            business_types: [],
            business_categories: [],
            business_designationes: [],
            uploadP: 0
        }
    },
    mounted() {
        this.fetch_types();
        this.fetch_categories();
        this.fetch_des();
    },
    watch: {
        uploadP(val) {
            this.myloader.changePercent(`${val++}%`)
        }
    },
    methods: {
        getfilename(link) {
            var filename = link.split(/[\\\/]/).pop();

            return filename;
        },
        openLink(link) {
            window.open(link, "_target");
        },
        editInfo() {
            var id = this.$props.userData.id;
            var here = this;
            this.$refs.myrules.validate().then(success => {
                if (success) {
                    this.openLoading();
                    const formDataObj = new FormData()
                    formDataObj.append('business_name', this.$props.userData.business_name)
                    formDataObj.append('business_type_id', this.$props.userData.business_type_id)
                    formDataObj.append('business_cr_name', this.$props.userData.business_cr_name)
                    formDataObj.append('business_category_id', this.$props.userData.business_category_id)
                    formDataObj.append('business_caps', this.$props.userData.business_caps)

                    formDataObj.append('business_num_emp', this.$props.userData.business_num_emp)
                    formDataObj.append('business_city', this.$props.userData.business_city)
                    formDataObj.append('business_address', this.$props.userData.business_address)
                    formDataObj.append('business_cr_num', this.$props.userData.business_cr_num)
                    formDataObj.append('business_vat_numb', this.$props.userData.business_vat_numb)
                    formDataObj.append('business_aoa', this.$props.userData.business_aoa)
                    formDataObj.append('business_last_sales', this.$props.userData.business_last_sales)
                    formDataObj.append('business_last_finan', this.$props.userData.business_last_finan)
                    formDataObj.append('business_total_exp', this.$props.userData.business_total_exp)
                    formDataObj.append('business_net_profit', this.$props.userData.business_net_profit)
                    if (this.$props.userData.business_last_finan_type != null) {
                        formDataObj.append('business_last_finan_type', this.$props.userData.business_last_finan_type)
                    }
                    if (this.$props.userData.business_have_stock != null) {
                        formDataObj.append('business_have_stock', this.$props.userData.business_have_stock)
                    }
                    if (this.$props.userData.business_use_pos != null) {
                        formDataObj.append('business_use_pos', this.$props.userData.business_use_pos)
                    }
                    if (this.$props.userData.business_sell_online != null) {
                        formDataObj.append('business_sell_online', this.$props.userData.business_sell_online)
                    }

                    formDataObj.append('business_cr_file', this.$props.userData.business_cr_file)
                    formDataObj.append('business_vat_file', this.$props.userData.business_vat_file)
                    formDataObj.append('business_aoa_file', this.$props.userData.business_aoa_file)
                    formDataObj.append('business_ltb_file', this.$props.userData.business_ltb_file)
                    formDataObj.append('business_lvr_file', this.$props.userData.business_lvr_file)
                    formDataObj.append('last_fin_file', this.$props.userData.last_fin_file)

                    axios
                        .post(`/users/business/update/${id}`, formDataObj, {

                            Headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            onUploadProgress: progressEvent => {
                                var progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                                here.uploadP = progress;
                            }

                        })
                        .then(response => {
                           this.myloader.close()
                            this.$emit('businessUpdated');
                            this.openNotification('top-right', 'success', 'Done !!', 'The Data has been updated.')
                        })
                        .catch(error => {
                            console.log(error.response)
                            this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                            this.myloader.close()
                        })
                }
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
        async fetch_des() {
            await axios
                .get('/business-contact-des/list')
                .then(response => {
                    this.business_designationes = response.data.data.data
                })
                .catch(error => {
                    console.log(error)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        getValidationState({
            dirty,
            validated,
            valid = null,
        }) {
            return dirty || validated ? valid : null
        },
        handleFileUpload(file) {
            console.log(file)
            if (file.size > 3000000) {
                this.openNotification('top-right', 'danger', "File Size", "File Size Should be less than 3MB");
                file = null
            }
        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform2,
                text: 'Please Wait ...',
                percent: this.uploadP,
                color: '#00a4e5',

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
    },
}
</script>

<style lang="scss">
.req {
    label {
        &::before {
            content: "*";
            color: red;
            margin-right: 5px;

        }
    }

    .custom-file-label {
        &::before {
            display: none;
        }
    }
}
</style>
