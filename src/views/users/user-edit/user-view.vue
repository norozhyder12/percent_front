<template>
<b-card ref="mytabs">
    <b-tabs v-if="userData" pills>
        <!-- Tab: Account -->
        <b-tab active>
            <template #title>
                <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
                <span class="d-none d-sm-inline">Account</span>
            </template>
            <useredittabaccount :user-data="userData" class="mt-2 pt-75" :isdisable="true" />
        </b-tab>

        <!-- Tab: Information -->
        <b-tab>
            <template #title>
                <feather-icon icon="InfoIcon" size="16" class="mr-0 mr-sm-50" />
                <span class="d-none d-sm-inline">Business Information</span>
            </template>
            <UserEditTabInformation :user-data="userData.business_info" class="mt-2 pt-75" :isdisable="true" />
        </b-tab>
    </b-tabs>
</b-card>
</template>

<script>
import axios from '@axios'
import useredittabaccount from './user-edit-tab-account'
import UserEditTabInformation from './UserEditTabInformation'

export default {
    components: {
        useredittabaccount,
        UserEditTabInformation,
    },
    data() {
        return {
            userData: {},
            myloader: null,
        }
    },
    mounted() {
        this.fetchUser(this.$route.params.id)
        console.log(this.userData)
    },
    methods: {
        fetchUser(id) {
            this.openLoading()
            axios
                .get(`/users/${id}`)
                .then(response => {
                    this.userData = response.data.data
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
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
    },
}
</script>

<style>
.vs-notification__content__header {
    color: #fff !important;
}
</style>
