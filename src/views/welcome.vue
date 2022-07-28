<template>
<div ref="myform" class="auth-wrapper auth-v1 px-2">
   
    <div class="auth-welcome py-2">

        <!-- Login v1 -->
        <b-card class="mb-0">
              <b-link class="brand-logo">
                <vuexy-logo />

            </b-link>
            <h1 class="text-center mb-4">Please Complete Your Business Information</h1>
            <businessinfo v-if="userData" :userData="userData" @businessUpdated="businessUpdated" :welcome="true"></businessinfo>
        </b-card>
        <!-- /Login v1 -->
    </div>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'
import axios from '@axios'
import {
    isUserLoggedIn,
    getUserData,
    getHomeRouteForLoggedInUser
} from '@/auth/utils'

import VuexyLogo from '@core/layouts/components/Logo.vue'
import businessinfo from '@/views/users/user-edit/UserEditTabInformation.vue';
import {
    required,
    email,
} from '@validations'
import {
    togglePasswordVisibility,
} from '@core/mixins/ui/forms'

export default {
    components: {
        VuexyLogo,
   
        businessinfo
    },
    mixins: [togglePasswordVisibility],
    data() {
        return {
            userEmail: '',
            password: '',
            Username: '',
            status: '',
            // validation rules
            required,
            email,
            myerrors: '',
            myloader: '',
            sent_again: false,
            countDown: 60,
            mail_sent: false,
            userData: {}
        }
    },
    computed: {
        passwordToggleIcon() {
            return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },
        myuser() {
            return getUserData()
        },
    },
    watch: {
        countDown(val) {
            if (val == 0) {
                this.sent_again = false;
                this.countDown = 60;
            }

        }
    },
    methods: {
            logout() {
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

      // Remove userData from localStorage
      localStorage.removeItem('userData')

      // Reset ability
      this.$ability.update(initialAbility)

      // Redirect to login page
      this.$router.push({ name: 'login' })
    },
        businessUpdated() {
            var id =this.myuser.id;
            var here = this;
            this.openLoading()
            axios
                .post(`users/changeStatus/${id}/3`)
                .then(response => {
                    console.log(response)
                    here.$router.push({name:'under-review'});
                    here.logout();
                    here.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        fetchUser(id) {
            this.openLoading()
            axios
                .get(`/users/${id}`)
                .then(response => {
                    console.log(response)
                    this.userData = response.data.data.business_info
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        openLoading(type, ref) {
            this.myloader = this.$vs.loading({
                target: this.$refs.myform2,
                type,
            })
        },
        closeLoading() {
            this.myloader.close()
        },

    },
    mounted() {
        this.fetchUser(this.myuser.id);
    }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.auth-welcome {
    width: 70%;
}
</style>
