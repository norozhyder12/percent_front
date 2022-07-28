<template>
<div>
    <!-- User Info: Input Fields -->
    <b-form ref="myform">
        <b-row class="mb-2 mt-2">
            <b-col cols="12" md="8">
                <b-row>
                    <!-- Field: Username -->
                    <b-col cols="12" md="6" class="mb-2">
                        <b-form-group label="Username" label-for="username">
                            <b-form-input id="username" v-model="userData.name" :disabled="isdisable" />
                        </b-form-group>
                    </b-col>

                    <!-- Field: Email -->
                    <b-col cols="12" md="6" class="mb-2">
                        <b-form-group label="Email" label-for="email">
                            {{userData.email}}
                        </b-form-group>
                    </b-col>

                </b-row>
            </b-col>

        </b-row>
    </b-form>

    <b-row class="mt-2">
        <b-col v-if="!isdisable">
            <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="EditUser(userData.id)">
                Save Changes
            </b-button>
            <b-button variant="outline-secondary" :block="$store.getters['app/currentBreakPoint'] === 'xs'" @click="$emit('reset')">
                Reset
            </b-button>
        </b-col>
        <b-col v-else>
            <b-button variant="primary" class="mb-1 mb-sm-0 mr-0 mr-sm-1" :to="{ name: 'user-edit', params: { id: userData.id } }" :block="$store.getters['app/currentBreakPoint'] === 'xs'">
                Edit
            </b-button>
        </b-col>
    </b-row>
</div>
</template>

<script>
import vSelect from 'vue-select'
import axios from '@axios'

export default {
    components: {
        vSelect,
    },
    props: {
        userData: Object,
        isdisable: Boolean,
    },
    data() {
        return {
            roleOptions: [{
                    label: 'Admin',
                    value: 'admin',
                },
                {
                    label: 'Subscriber',
                    value: 'Subscriber',
                },
            ],

            statusOptions: [{
                    label: 'Pending',
                    value: 0,
                },
                {
                    label: 'Active',
                    value: 1,
                },
                {
                    label: 'Banned',
                    value: 2,
                },
            ],
            myloader: [],
        }
    },
    methods: {
        EditUser(id) {
            this.openLoading()
            const newdata = {
                name: this.$props.userData.name,
                email: this.$props.userData.email,

            }
            axios
                .post(`/users/update/${id}`, newdata)
                .then(response => {
                    console.log(response)
                    this.myloader.close()
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been updated.')
                })
                .catch(error => {
                    console.log(error.response)
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                    this.myloader.close()
                })
        },
        openLoading() {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform,

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
