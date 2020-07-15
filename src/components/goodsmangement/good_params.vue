<template>
     <div class="params-container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
           <!-- 级联选择器 -->
           <span>选择商品分类: </span>
            <el-cascader v-model="selectedValue" :options="CategoriesInfo" :props="CasConfig" @change="casChange" clearable size="mini">
            </el-cascader>
            <!-- tab栏组件 -->
            <el-tabs v-model="currentTab" @tab-click="tabChange" size="medium">
                <el-tab-pane label="动态参数" name="many" :disabled="addBtnStatus">
                    <el-button type="primary" :disabled="addBtnStatus" @click="addDialogClick">添加参数</el-button>
                    <!-- 表格组件 -->
                    <el-table :data="dynamicArr" style="width: 100%"  :border="true" :stripe="true">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteTag(scope.row, index)">
                                   {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogClick(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only" :disabled="addBtnStatus">
                    <el-button type="primary" :disabled="addBtnStatus" @click="addDialogClick">添加参数</el-button>
                    <!-- 表格组件 -->
                    <el-table :data="staticArr" style="width: 100%"  :border="true" :stripe="true">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteTag(scope.row, index)">
                                   {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column label="属性名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="描述">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogClick(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog :title="'添加' + calTitle" :visible.sync="addDialogVisible" width="30%">
            <!-- 表单内容区域 -->
            <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="calTitle" prop="attr_name">
                  <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategories">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog :title="'编辑' + calTitle" :visible.sync="editDialogVisible" width="30%">
            <!-- 表单内容区域 -->
            <el-form :model="editForm" :rules="addFromRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="calTitle" prop="attr_name">
                  <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="less" scoped>
    .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
<script>
    export default {
        data () {
            return {
                //  级联选择框被选中数据数组
                selectedValue: [],
                // 级联选择框配置
                CasConfig: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                //  储存二级表格数据数组
                CategoriesInfo: [],
                // tab栏当前激活项
                currentTab: 'many',
                // 添加按钮状态
                addBtnStatus: true,
                // 储存动态参数数组
                dynamicArr: [],
                // 储存静态参数数组
                staticArr: [],
                // 对话框状态
                addDialogVisible: false,
                //  添加表单数据
                addForm: {
                    attr_name: '',
                    attr_sel: '',
                    attr_vals: ''
                },
                // 添加表单验证规则
                addFromRules: {
                    attr_name: [
                            { required: true, message: '请输入参数名', trigger: 'blur' },
                            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                        ]
                },
                // 对话框状态
                editDialogVisible: false,
                //  添加表单数据
                editForm: {
                    attrId: '',
                    attr_name: '',
                    attr_sel: '',
                    attr_vals: ''
                }
            }
        },
        created () {
            this.getCategories()
        },
        computed: {
            calId () {
                return this.selectedValue[this.selectedValue.length - 1]
            },
            calTitle () {
                if (this.currentTab === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        },
        methods: {
            // 获取商品分类
            async getCategories () {
                const { data: result } = await this.$http.get('categories', { params: { type: 3 } })
                if (result.meta.status !== 200) {
                    return this.$message(result.meta.msg)
                }
                this.CategoriesInfo = result.data
                console.log(this.CategoriesInfo)
            },
            // 获取参数列表
            async getParams () {
                const { data: result } = await this.$http.get(`categories/${this.calId}/attributes`, { params: { sel: this.currentTab } })
                if (result.meta.status !== 200) {
                    return this.$message(result.meta.msg)
                }
                result.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // 控制文本框的显示与隐藏
                    item.inputVisible = false
                    item.inputValue = ''
                })
                if (this.currentTab === 'only') {
                    this.staticArr = result.data
                    console.log(this.staticArr)
                } else {
                    this.dynamicArr = result.data
                    console.log(this.dynamicArr)
                }
            },
            // 级联选择器状态变更后触发函数
            casChange () {
                if (this.selectedValue.length !== 0) {
                    this.getParams()
                    this.addBtnStatus = false
                } else {
                    this.addBtnStatus = true
                    this.selectedValue = []
                    this.dynamicArr = []
                    this.staticArr = []
                }
            },
            // tab栏状态变更后触发函数
            tabChange () {
                this.getParams()
            },
            // 按下添加按钮后触发函数
            addDialogClick () {
               this.addForm.attr_sel = this.currentTab
               this.addDialogVisible = true
            },
            // 发送添加请求
            addCategories () {
                    this.$refs.addFormRef.validate(async (valid) => {
                        if (!valid) {
                            return this.$message.error('请检查输入是否有误')
                        }
                        const { data: result } = await this.$http.post(`categories/${this.calId}/attributes`, this.addForm)
                        console.log(result)
                        if (result.meta.status !== 201) {
                        return this.$message.error('添加失败，请重试添加')
                        }
                        this.$message.success('添加成功')
                        // 关闭对话框
                        this.addDialogVisible = false
                        // 重新加载页面
                        this.getParams()
                    })
            },
            // 按下编辑按钮后触发函数
           async editDialogClick (catInfo) {
                const { data: result } = await this.$http.get(`categories/${this.calId}/attributes/${catInfo.attr_id}`, {
                    params: {
                    attr_sel: this.currentTab
                }
            })
                    if (result.meta.status !== 200) {
                        return this.$message.error(result.meta.msg)
                    }
                this.editForm.attr_sel = this.currentTab
                this.editForm.attr_name = result.data.attr_name
                this.editForm.attr_vals = result.data.attr_vals
                this.editForm.attr_id = result.data.attr_id
                this.editDialogVisible = true
            },
            // 发送添加请求
           editDialogSubmit () {
                    this.$refs.editFormRef.validate(async (valid) => {
                        if (!valid) {
                            return this.$message.error('请检查输入是否有误')
                        }
                        const { data: result } = await this.$http.put(`categories/${this.calId}/attributes/${this.editForm.attr_id}`, this.editForm)
                        console.log(result)
                        if (result.meta.status !== 200) {
                        return this.$message.error('编辑失败，请重试添加')
                        }
                        this.$message.success('编辑成功')
                        // 关闭对话框
                        this.editDialogVisible = false
                        // 重新加载页面
                        this.getParams()
                    })
            },
            // 删除对应分类
            deleteBtn (catInfo) {
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: result } = await this.$http.delete(`categories/${this.calId}/attributes/${catInfo.attr_id}`)
                    if (result.meta.status !== 200) {
                       return this.$message.error('删除失败，请重试删除')
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    // 重新加载页面
                    this.getParams()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 修改tag请求函数
            async submitTagChange (catInfo) {
                const { data: result } = await this.$http.put(`categories/${this.calId}/attributes/${catInfo.attr_id}`, {
                    attr_name: catInfo.attr_name,
                    attr_sel: catInfo.attr_sel,
                    attr_vals: catInfo.attr_vals.join(' ')
                })
                console.log(result)
                if (result.meta.status !== 200) {
                    return this.$message.error('添加失败，请重试添加')
                }
                this.$message.success('添加成功')
            },
            // 删除tag
            deleteTag (catInfo, index) {
                catInfo.attr_vals.splice(index, 1)
                this.submitTagChange(catInfo)
            },
            // 新增tag相关
            showInput (catInfo) {
                catInfo.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            handleInputConfirm (catInfo) {
                if (catInfo.inputValue.trim().length === 0) {
                    catInfo.inputValue = ''
                    catInfo.inputVisible = false
                    return this.$message.error('不能为空')
                }
                catInfo.attr_vals.push(catInfo.inputValue.trim())
                this.submitTagChange(catInfo)
                catInfo.inputValue = ''
                catInfo.inputVisible = false
            }
        }
    }
</script>
