<template>
<div>
    <b-row class="mb-2">

        <b-col cols="12" md="12" class="d-flex align-items-center justify-content-end">
            <div>
                <b-button size="md" variant="light" v-b-modal.modaladd>
                    <span class="text-nowrap">Add Addition</span>
                </b-button>
            </div>
            <b-modal id="modaladd" ref="modaladd" centered title="Add Addition" hide-footer @ok="addItem">

                <!-- BODY -->
                <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
                    <!-- Form -->
                    <b-form class="p-2" @submit.prevent="handleSubmit(addItem)">

                        <!-- Username -->
                        <validation-provider #default="validationContext" name="Addition Name" rules="required">
                            <b-form-group label="Addition Name" label-for="SUPPLIER NAME">
                                <b-form-input id="Addition NAME" v-model="addition_name" :state="getValidationState(validationContext)" trim />

                                <b-form-invalid-feedback>
                                    {{ validationContext.errors[0] }}
                                </b-form-invalid-feedback>
                            </b-form-group>
                        </validation-provider>
                        <validation-provider #default="validationContext" name="Value" rules="required">
                            <b-form-group label="Value SAR" label-for="Value">
                                <b-form-input id="Value" type="number" v-model="addition_value" :state="getValidationState(validationContext)" trim />

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
            <b-table hover responsive :per-page="pagination.per_page" :current-page="pagination.current_page" :items="additions" :fields="fields" class="removetop">

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
            addition_name: '',
            addition_value: null,
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
        additions: Array
    },
    methods: {
        hidedailog() {
            this.$refs['modaladd'].hide()
        },
        addItem() {
            var data = {
                name: this.addition_name,
                value: parseFloat(this.addition_value),
            }
            this.$props.additions.push(data);
            this.$refs['modaladd'].hide()
            this.addition_name = null;
            this.addition_value = null;
        },
        removeitem(myitem) {
            var myarray = this.$props.additions;
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
