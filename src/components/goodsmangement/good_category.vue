<template>
    <div class="goodCate_container">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users' }">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 搜索框组件 -->
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-button type="primary" @click="getSecCategories">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格组件 -->
            <tree-table :data="categoriesInfo" :columns="columns" :selection-type="false" :border="true" :expand-type="false" :show-index="true" index-text="#" :show-row-hover="false">
                <template slot="deleted" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: rgb(2, 138, 120);"></i>
                    <i v-else class="el-icon-error" style="color: rgb(138, 2, 9);"></i>
                </template>
                <template slot="level" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" type="primary">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
                <template slot="option" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="getIdCategories(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategories(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页组件 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]" :page-size="pageInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage">
            </el-pagination>
        </el-card>
         <!-- 分配角色对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%" @close="clrAddDialog">
            <!-- 表单内容区域 -->
            <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
                <el-form-item label="分类名" prop="cat_name">
                  <el-input v-model="addForm.cat_name"></el-input>
                </el-form-item>
                <!-- 级联选择器 -->
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectedValue" :options="secCategoriesInfo" :props="CasConfig" @change="casChange" clearable size="mini">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategories">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 编辑分类对话框 -->
         <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="30%">
            <!-- 表单内容区域 -->
            <el-form :model="editForm" :rules="editFromRules" ref="editFormRef" label-width="100px">
                <el-form-item label="分类名" prop="cat_name">
                  <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCategories">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 页面信息
            pageInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 10
            },
            // 总页数
            totalpage: 0,
            // 储存表格数据数组
            categoriesInfo: [],
            // 添加对话框状态
            addDialogVisible: false,
            // 表格列参数
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'deleted'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'level'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'option'
                }
            ],
            //  添加分类表单数据
            addForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
                },
            // 添加分类表单验证规则
            addFromRules: {
                cat_name: [
                        { required: true, message: '请输入分类名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
            },
            //  级联选择框被选中数据数组
            selectedValue: [],
            // 级联选择框配置
            CasConfig: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            //  储存二级表格数据数组
            secCategoriesInfo: [],
            // 编辑对话框状态
            editDialogVisible: false,
            //  编辑分类表单数据
            editForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0,
                cat_id: 3
                },
            // 添加分类表单验证规则
            editFromRules: {
                cat_name: [
                        { required: true, message: '请输入分类名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
            }
        }
    },
    created () {
        this.getCategories()
    },
    methods: {
        // 查询所有商品分类函数
        async getCategories () {
            const { data: result } = await this.$http.get('categories', { params: this.pageInfo })
            if (result.meta.status !== 200) {
                return this.$message(result.meta.msg)
            }
            this.categoriesInfo = result.data.result
            this.totalpage = result.data.total
        },
        // 更改分类页数
        handleSizeChange (val) {
            this.pageInfo.pagesize = val
            this.getCategories()
        },
        // 页面切换函数
        handleCurrentChange (val) {
            this.pageInfo.pagenum = val
            this.getCategories()
        },
        // 获取前两级商品分类
        async getSecCategories () {
            const { data: result } = await this.$http.get('categories', { params: { type: 2 } })
            if (result.meta.status !== 200) {
                return this.$message(result.meta.msg)
            }
            this.secCategoriesInfo = result.data
            console.log(this.secCategoriesInfo)
            this.addDialogVisible = true
        },
        // 级联选择框数据更改函数
        casChange () {
           if (this.selectedValue.length > 0) {
            this.addForm.cat_pid = this.selectedValue[this.selectedValue.length - 1]
            this.addForm.cat_level = this.selectedValue.length
           } else {
            this.addForm.cat_pid = 0
            this.addForm.cat_level = 0
           }
        },
        // 发送添加分类请求
        addCategories () {
                this.$refs.addFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    const { data: result } = await this.$http.post('categories', this.addForm)
                    console.log(result)
                    if (result.meta.status !== 201) {
                       return this.$message.error('添加失败，请重试添加')
                    }
                    this.$message.success('添加成功')
                    // 关闭对话框
                    this.addDialogVisible = false
                    // 重新加载页面
                    this.getCategories()
                })
            },
        // 关闭对话框时清空
        clrAddDialog () {
            this.$refs.addFormRef.resetFields()
            this.addForm.cat_pid = 0
            this.addForm.cat_level = 0
        },
        // 查询对应ID函数
        async getIdCategories (catInfo) {
            const { data: result } = await this.$http.get(`categories/${catInfo}`)
                if (result.meta.status !== 200) {
                    return this.$message.error(result.meta.msg)
                }
            this.editForm.cat_pid = result.data.cat_pid
            this.editForm.cat_name = result.data.cat_name
            this.editForm.cat_level = result.data.cat_level
            this.editForm.cat_id = result.data.cat_id
            this.editDialogVisible = true
        },
        // 提交分类名称更改
        editCategories () {
                this.$refs.editFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查输入是否有误')
                    }
                    const { data: result } = await this.$http.put(`categories/${this.editForm.cat_id}`, {
                        cat_name: this.editForm.cat_name
                    })
                    console.log(result)
                    if (result.meta.status !== 200) {
                        return this.$message.error('编辑失败，请重试')
                    }
                    this.$message.success('编辑成功')
                    // 关闭对话框
                    this.editDialogVisible = false
                    // 重新加载页面
                    this.getCategories()
                })
            },
        // 删除对应分类
        deleteCategories (catInfo) {
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const { data: result } = await this.$http.delete(`categories/${catInfo}`)
                    if (result.meta.status !== 200) {
                       return this.$message.error('删除失败，请重试删除')
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    // 重新加载页面
                    this.getCategories()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
    }
}
</script>
