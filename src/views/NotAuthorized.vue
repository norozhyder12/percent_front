<template>
<div class="misc-wrapper">


    <div class="misc-inner p-2 p-sm-3">
        <div class="w-100 text-center">
            <h2 class="mb-1">
                You are not authorized! 🔐
            </h2>
            <p class="mb-2">
                You don’t have permission to access this page. Go Home!!
            </p>
            <b-button variant="primary" class="mb-1 btn-sm-block" to="/">Back to Home</b-button><br>
            <b-img fluid :src="downImg" alt="Not authorized page" />
        </div>
    </div>
</div>
</template>

<script>
import VuexyLogo from '@core/layouts/components/Logo.vue'

export default {
    components: {
        VuexyLogo,
    },
    data() {
        return {
            downImg: require('@/assets/images/pages/not-authorized.svg'),
        }
    },

}
</script>
