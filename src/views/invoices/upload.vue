<template>
<div ref="myform">
    <uploadform @submitUpload="submitUpload" ></uploadform>
</div>
</template>

<script>
import uploadform from '@/components/uploadInvoice/upload-form'
import axios from '@axios'

export default {
    components: {
        uploadform,

    },
    data() {
        return {
            step: 0,
            upload_data: [],
            myloader: '',
            uploadP:0

        }
    },
 watch: {
        uploadP(val) {
            this.myloader.changePercent(`${val++}%`)
        }
    },
    methods: {
        submitUpload(data) {
            this.openLoading();
            const formDataObj = new FormData()
            //files
            for (var i = 0; i < data.files.length; i++) {
                formDataObj.append('attachment[' + i + '][path]', data.files[i].file)
                formDataObj.append('attachment[' + i + '][type]', data.files[i].type.id)
            }

            formDataObj.append('customer_id', data.customer.id)
          
            var here = this;
            if (data.items != null) {
                for (var i = 0; i < data.items.length; i++) {
                    formDataObj.append('items[' + i + '][revenue_type_id]', data.items[i].revenue_type_id)
                    formDataObj.append('items[' + i + '][branch_id]', data.items[i].branch_id)
                    formDataObj.append('items[' + i + '][costcenter_id]', data.items[i].costcenter_id)
                    formDataObj.append('items[' + i + '][description]', data.items[i].description)

                    formDataObj.append('items[' + i + '][unit_price]', parseFloat(data.items[i].unit_price))
                    formDataObj.append('items[' + i + '][quantity]', parseFloat(data.items[i].quantity))
                    formDataObj.append('items[' + i + '][total_value]', parseFloat(data.items[i].total_value))
                }
            }

            axios
                .post(`/invoices/add/`, formDataObj, {

                 
                        'Content-Type': 'multipart/form-data',
                    
                    onUploadProgress: progressEvent => {
                        var progress = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
                        here.uploadP = progress;
                    }

                })
                .then(response => {
                    console.log(response)
                    this.myloader.close()
                    this.$router.push('/invoices/list')
                    this.openNotification('top-right', 'success', 'Done !!', 'The Data has been Added.')
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
                text: 'Please Wait while ...',
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
