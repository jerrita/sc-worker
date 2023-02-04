<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>Shortcut Creator</span>
            </div>
        </template>


        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="type">
                <el-radio-group v-model="form.type" size="default">
                    <el-radio label="code">code</el-radio>
                    <el-radio label="redir">redir</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="code" v-if="form.type == 'code'">
                <el-select v-model="form.code">
                    <el-option v-for="item in codeOptions" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="value" prop="value">
                <el-input v-model="form.value" rows="10" :type="form.type == 'redir' ? '' : 'textarea'" />
            </el-form-item>

            <el-form-item label="shortcut" prop="hash">
                <el-input v-model="form.hash" placeholder="leave black to auto gen" :suffix-icon="statusIcon" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit()" plain>Generate</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { Loading, Check, CloseBold } from "@element-plus/icons-vue"
import { ElNotification } from 'element-plus'
// status will be in: ready, checking, error

const urlRe = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
export default {
    methods: {
        scValidator(rule, value, callback) {
            if (rule.field == 'value') {
                if (value == '')
                    callback(new Error('Value cannot be empty!'))

                if (this.form.type == 'redir' && !this.form.value.match(urlRe)) {
                    callback(new Error('Not a valid url!'))
                }

                callback()
            } else {
                // validate hash
                if (value == '') {
                    this.status = 'ready';
                    callback();
                } else {
                    this.status = 'checking'
                    this.$axios.post('check', {
                        hash: value
                    }).then((res) => {
                        console.log(res)
                        if (res.data.code != 0) {
                            this.status = 'error'
                            callback(new Error('Occupied'))
                        }
                        else {
                            this.status = 'ready';
                            callback()
                        }
                    }).catch((err) => {
                        this.status = 'error'
                        alert(err)
                        callback()
                    })
                }
            }
        },
        onSubmit() {
            console.log("Submit Fire!");

            this.$refs['form'].validate((valid) => {
                if (valid && this.status == "ready") {
                    console.log("Check pass, submitting")
                    
                    ElNotification({
                        title: 'Generating',
                        message: 'Please wait a few seconds.'
                    });

                    this.$axios.post('create', this.form)
                        .then((res) => {
                            console.log(res)


                            this.$router.push("/" + res["data"]["path"])
                        }).catch((err) => {
                            alert(err)
                        })
                } else {
                    console.log('Submit error')
                }
            })
        },
    },
    data() {
        return {
            status: 'ready',
            dialog: false,
            form: {
                type: "code",
                value: "",
                code: "text",  // Code type
                hash: "",
            },
            rules: {
                value: {
                    validator: this.scValidator,
                    trigger: 'blur'
                },
                hash: {
                    validator: this.scValidator,
                    trigger: 'blur'
                }
            },

            codeOptions: [
                'text',
                'cpp',
                'js',
                'java',
                'go',
                'python',
                'bash'
            ],
        }
    },
    computed: {
        statusIcon: function () {
            switch (this.status) {
                case 'ready': return Check
                case 'loading': return Loading
                default:
                    return CloseBold
            }
        }
    }
}
</script>

<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>