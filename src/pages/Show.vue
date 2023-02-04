<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-space warp alignment="center">
                    <span>Code: </span>
                    <span>{{ data.hash }}</span>
                    <el-button @click="copyLink">Copy</el-button>
                    
                    <span>Nav: </span>
                    <el-link :href="$glb.site_prefix">Home</el-link>
                    <el-link :href="rawLink">Raw</el-link>
                </el-space>
                <el-icon :class="status == 'checking' ? 'is-loading' : ''">
                    <Loading v-if="status == 'checking'" />
                    <Check v-if="status == 'ready'" />
                    <CloseBold v-if="status == 'error'" />
                </el-icon>
            </div>
        </template>

        <highlightjs 
            :language="data.code"
            :code="data.value"
        />
    </el-card>
</template>

<script>
import { Loading, Check, CloseBold } from "@element-plus/icons-vue"
import { ElNotification } from 'element-plus'

export default {
    methods: {
        goHome() {
            this.$router.push('/');
        },
        async copyLink() {
            console.log(this.pageLink)
            await navigator.clipboard.writeText(this.pageLink)
            ElNotification({
                title: 'Notice',
                message: 'Link copied to clipboard'
            })
        },
        fetchContent() {
            if (!this.data.hash) {
                this.status = 'error'
                this.txt = 'Empty request!'
            } else {
                this.$axios
                    .post('fetch', {
                        hash: this.data.hash
                    }).then((res) => {
                        console.log(res)

                        let data = res['data']
                        if (data['code'] == -1) {
                            this.status = 'error'
                            this.data.value = data['msg']
                        } else {
                            data = data['payload']
                            this.data = data
                            this.status = 'ready'

                            // Render
                            console.log(this.data)
                        }
                    }).catch((err) => {
                        this.status = 'error';
                        this.data.value = 'Unknown response!'
                    })
            }
        }
    },
    data() {
        return {
            status: 'checking',
            data: {
                'hash': '',
                'value': '',
                'code': ''
            }
        }
    },
    mounted() {
        console.log(this.$route.params)
        this.data.hash = this.$route.params.hash
        this.fetchContent()
    },
    computed: {
        pageLink() {
            return this.$glb.site_prefix + this.data.hash
        },
        rawLink() {
            return this.$glb.site_prefix + "d/" + this.data.hash
        }
    },
}
</script>