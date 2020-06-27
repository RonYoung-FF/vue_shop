<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" class="loginForm" :rules="inputRules">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button @click="login" type="primary">登陆</el-button>
                <el-button @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            //  登陆表单数据
            loginForm: {
                username: '',
                password: ''
            },
            // 登陆表单验证规则
            inputRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields()
        },
        login () {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: result } = await this.$http.post('login', this.loginForm)
                if (result.meta.status !== 200) {
                return this.$message({
                    message: '登陆失败',
                    type: 'error'
                    })
                }
                window.sessionStorage.setItem('token', result.data.token)
                this.$message({
                    message: '登陆成功',
                    type: 'success'
                    })
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    width: 100%;
    height: 100%;
    background: #2b4b6b;
        .login_box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 450px;
        height: 300px;
        background: #ffffff;
        border-radius: 10px;
            .avatar_box{
            position: absolute;
            left:50%;
            transform: translate(-50%,-50%);
            padding: 10px;
            height: 130px;
            width: 130px;
            background: inherit;
            border-radius: 50%;
            box-shadow: 0 0 5px #ddd;
            img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }
            .loginForm{
            position: absolute;
            bottom: 0;
            padding: 0 20px;
            box-sizing: border-box;
            width: 100%;
            }
        }
}
</style>
