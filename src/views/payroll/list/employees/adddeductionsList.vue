<template>
<div>
    <b-row class="mb-2">

        <b-col cols="12" md="12" class="d-flex align-items-center justify-content-end">
            <div>
                <b-button size="md" variant="light" v-b-modal.my-modal2>
                    <span class="text-nowrap">Add deductions</span>
                </b-button>
            </div>
            <b-modal id="my-modal2" ref="my-modal2" centered title="Add deductions" hide-footer @ok="addItem">

                <!-- BODY -->
                <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
                    <!-- Form -->
                    <b-form class="p-2" @submit.prevent="handleSubmit(addItem)">

                        <!-- Username -->
                        <validation-provider #default="validationContext" name="Deductions Name" rules="required">
                            <b-form-group label="Deductions Name" label-for="deductions NAME">
                                <b-form-input id="deductions NAME" v-model="deductions_name" :state="getValidationState(validationContext)" trim />

                                <b-form-invalid-feedback>
                                    {{ validationContext.errors[0] }}
                                </b-form-invalid-feedback>
                            </b-form-group>
                        </validation-provider>
                        <validation-provider #default="validationContext" name="Value" rules="required">
                            <b-form-group label="Value SAR" label-for="Value">
                                <b-form-input id="Value" type="number" v-model="deductions_value" :state="getValidationState(validationContext)" trim />

                                <b-form-invalid-feedback>
                                    {{ validationContext.errors[0] }}
                                </b-form-invalid-feedback>
                            </b-form-group>
                        </validation-provider>

                        <div class="d-flex mt-2 align-items-center justify-content-end">

                            <b-button type="button" class="mr-2" variant="outline-secondary" @click="hidedailog">
                                Cancel
                            </b-button>
                            <b-button variant="primary" type="submit">
                                Add
                            </b-button>
                        </div>
                    </b-form>
                </validation-observer>
            </b-modal>
        </b-col>
    </b-row>
    <b-row >
        <b-col cols="12" md="12">
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="deductions" :fields="fields" class="removetop">

                <!-- Column: Actions -->
                <template #cell(actions)="data">

                    <div @click="removeitem(data.item)">
                        <feather-icon icon="TrashIcon" />

                    </div>

                </template>

            </b-table>
        </b-col>

      
    </b-row>
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

    data() {
        return {
            pagination: {
                total: 0,
                count: 0,
                per_page: 20,
                current_page: 1,
                total_pages: 1,
            },
            deductions_name: '',
            deductions_value: null,
            fields: [

                {
                    key: 'name',
                    label: 'Name',
                    sortable: true,
                },
                {
                    key: 'value',
                    label: 'Value',
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
        //  this.totalRows = this.$props.myPayroll.length
    },
    props: {
        deductions: Array
    },
    methods: {
        hidedailog() {
            this.$refs['my-modal2'].hide()
        },
        addItem() {
            var data = {
                name: this.deductions_name,
                value: parseFloat(this.deductions_value),
            }
            this.$props.deductions.push(data);
            this.$refs['my-modal2'].hide()
            this.deductions_name = null;
            this.deductions_value = null;
        },
        removeitem(myitem) {
            var myarray = this.$props.deductions;
            myarray.splice(myarray.findIndex(item => item === myitem), 1)
            this.items = myarray;

        },

        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.mytabs,

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
