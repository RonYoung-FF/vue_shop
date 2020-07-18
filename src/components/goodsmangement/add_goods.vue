<template>
    <div class="goods-container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="currentStep - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单组件 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" label-position="top">
                 <!-- tab栏 -->
                <el-tabs tab-position="left" v-model="currentStep" @tab-click="tabClick" :before-leave="checkCas">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input  v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input type="number" v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input type="number" v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input type="number" v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <!-- 级联选择器 -->
                            <el-cascader v-model="selectedValue" :options="categoriesInfo" :props="CasConfig" clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :key="index" v-for="(item,index) in dynamicArr" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :key="index" v-for="(item2,index) in item.attr_vals" :label="item2" border>{{item2}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :key="item.attr_id" v-for="item in staticArr" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="uploadConfig" :on-success="arrPush">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4" style="text-align: right;">
                        <quill-editor v-model="addForm.goods_introduce"/>
                        <el-button type="primary" style="margin-top: 20px;" @click="submitForm">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 编辑对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="70%">
            <img class="previewPic" :src="previewPath" alt="上传图片">
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
    .el-checkbox{
        margin:0 10px 0 0 !important;
    }
    .previewPic{
        width: 100%;
    }
</style>
<script>
    export default {
         data () {
            return {
                currentStep: '0',
                addForm: {
                    goods_name: '',
                    goods_cat: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    goods_introduce: '',
                    pics: [],
                    attrs: []
                },
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ]
                },
                 //  级联选择框被选中数据数组
                selectedValue: [],
                // 级联选择框配置
                CasConfig: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                 // 储存表格数据数组
                categoriesInfo: [],
                // 储存动态参数数组
                dynamicArr: [],
                // 储存静态参数数组
                staticArr: [],
                // tab栏当前激活项
                currentTab: '',
                // 储存复选框数组
                dynamicCheckList: [],
                // 上传参数
                uploadConfig: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 预览路径暂存
                previewPath: '',
                // 预览对话框状态
                previewDialogVisible: false
            }
        },
        created () {
            this.getCategories()
        },
        methods: {
            async getCategories () {
            const { data: result } = await this.$http.get('categories')
            if (result.meta.status !== 200) {
                return this.$message(result.meta.msg)
            }
            this.categoriesInfo = result.data
            },
            // 获取参数列表
            async getParams () {
                const { data: result } = await this.$http.get(`categories/${this.calId}/attributes`, { params: { sel: this.currentTab } })
                if (result.meta.status !== 200) {
                    return this.$message(result.meta.msg)
                }
                if (this.currentTab === 'only') {
                    this.staticArr = result.data
                    console.log(this.staticArr)
                } else {
                    result.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                })
                    this.dynamicArr = result.data
                    console.log(this.dynamicArr)
                }
            },
            // tab栏点击后触发
            checkCas () {
                if (this.selectedValue.length !== 3) {
                    this.$message.error('必须选择一个分类才可以进行下一步操作')
                    return false
                }
            },
            // tab栏点击后且正确跳转后触发
            tabClick () {
                console.log(this.currentStep)
                if (this.currentStep === '1') {
                    this.currentTab = 'many'
                    console.log(this.currentTab)
                    this.getParams()
                } else if (this.currentStep === '2') {
                    this.currentTab = 'only'
                    console.log(this.currentTab)
                    this.getParams()
                }
            },
            // 上传文件组件删除
            handleRemove (file) {
                const deleteIndex = this.addForm.pics.indexOf(file.response.data.tmp_path)
                this.addForm.pics.splice(deleteIndex, 1)
                console.log(this.addForm)
            },
            // 上传文件组件预览
            handlePreview (file) {
                this.previewPath = file.response.data.url
                this.previewDialogVisible = true
            },
            // 把上传文件的地址添加到表单数据
            arrPush (res) {
                const picInfo = { pic: res.data.tmp_path }
                this.addForm.pics.push(picInfo)
                console.log(this.addForm)
            },
            submitForm () {
                this.$refs.addFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    this.addForm.goods_cat = this.selectedValue.join(',')
                    // 遍历动态参数添加到表单
                    this.dynamicArr.forEach(item => {
                        const dynamicInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        console.log(dynamicInfo)
                        this.addForm.attrs.push(dynamicInfo)
                    })
                    // 遍历静态参数添加到表单
                    this.staticArr.forEach(item => {
                        const staticInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        console.log(staticInfo)
                        this.addForm.attrs.push(staticInfo)
                    })
                    console.log(this.addForm)
                    const { data: result } = await this.$http.post('goods', this.addForm)
                    console.log(result)
                    if (result.meta.status !== 201) {
                        return this.$message.error('添加失败，请重试添加')
                    }
                    this.$message.success('添加商品成功')
                    // 重定向到商品列表
                    this.$router.push('/goods')
                })
            }
        },
        computed: {
            calId () {
                return this.selectedValue[this.selectedValue.length - 1]
            }
        }
    }
</script>
