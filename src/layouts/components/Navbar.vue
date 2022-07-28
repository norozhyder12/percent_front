<template>
<div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
        <li class="nav-item">
            <b-link class="nav-link" @click="toggleVerticalMenuActive">
                <feather-icon icon="MenuIcon" size="21" />
            </b-link>
        </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"  style="color:#00a4e5">
     <feather-icon variant="primary" icon="HomeIcon" size="24" />
       
        <span style="font-weight:bold;color:#444444;font-size:18px" class="ml-1" v-if="userData"> {{userData.business_info.business_name}}</span>
    </div>
   
    <b-navbar-nav class="nav align-items-center ml-auto">
        <b-nav-item-dropdown right toggle-class="d-flex align-items-center dropdown-user-link" class="dropdown-user">
            <template #button-content>
                <div class="d-sm-flex d-none user-nav">
                    <p class="user-name font-weight-bolder mb-0">
                        {{ myuser.name }}
                    </p>
                    <span class="user-status">{{ myuser.role }}</span>
                </div>
                <b-avatar size="40" variant="light-primary" badge :src="require('@/assets/images/avatars/13-small.png')" class="badge-minimal" badge-variant="success" />
            </template>

            <b-dropdown-item link-class="d-flex align-items-center" :to="{ name: 'user-profile' }">
                <feather-icon size="16" icon="UserIcon" class="mr-50" />
                <span>Profile</span>
            </b-dropdown-item>

            <b-dropdown-divider />

            <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
                <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
                <span>Logout</span>
            </b-dropdown-item>
        </b-nav-item-dropdown>
    </b-navbar-nav>
</div>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'
import {
    isUserLoggedIn,
    getUserData,
    getHomeRouteForLoggedInUser
} from '@/auth/utils'

import {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import axios from '@axios'

export default {
    components: {
        BLink,
        BNavbarNav,
        BNavItemDropdown,
        BDropdownItem,
        BDropdownDivider,
        BAvatar,

        // Navbar Components
        DarkToggler,
    },
    props: {
        toggleVerticalMenuActive: {
            type: Function,
            default: () => {},
        },
    },
    data(){
        return {
            userData: {},
        }
    },
    computed: {
        myuser() {
            return getUserData()
        },
    },
    mounted() {
        this.fetchUser(this.myuser.id)
    },
    methods: {
        fetchUser(id) {
            this.openLoading()
            axios
                .get(`/users/${id}`)
                .then(response => {
                    console.log(response)
                    this.userData = response.data.data
                    console.log( this.userData)
                    this.myloader.close()
                })
                .catch(error => {
                    console.log(error)
                    this.myloader.close()
                    this.openNotification('top-right', 'danger', error.response.data.status, error.response.data.errors)
                })
        },
        logout() {
            // Remove userData from localStorage
            // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
            localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
            localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

            // Remove userData from localStorage
            localStorage.removeItem('userData')

            // Redirect to login page
            this.$router.push({
                name: 'login'
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
