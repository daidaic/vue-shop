<template>
  <div>
    <bread nav1="权限管理" nav2="角色列表"></bread>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(item1.id, scope.row)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限   -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag closable @close="removeRight(item2.id, scope.row)" type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" :class="[index3 === 0 ? '' : 'bdtop']" v-for="(item3, index3) in item2.children" :key="item3.id" closable @close="removeRight(item3.id, scope.row)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <slot>
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetting(scope.row)">分配权限</el-button>
            </slot>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限  -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialog">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightsAll" show-checkbox default-expand-all :default-checked-keys="defKeys" node-key="id" :props="treeProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 分配权限对话框
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsAll: [],
      // shuxingkongjian
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前分配权限的id值
      roleId: ''
    }
  },
  created() {
    this.getroleList()
  },
  methods: {
    async getroleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.roleList = res.data
    },
    // 根据id删除对应权限
    async removeRight(id, userid) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消本次操作')
      }
      const { data: res } = await this.$http.delete(`roles/${userid.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error('取消权限失败')
      //   this.getroleList()
      userid.children = res.data
      this.$message.success('取消权限成功')
    },
    // 展示分配权限的对话框
    async showSetting(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限信息失败')
      // 获取到的权限数据保存到data中
      this.rightsAll = res.data
      // console.log(this.rightsAll)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取角色下所有三级权限的id 并保存到数组defKeys中
    getLeafKeys(node, arr) {
      // 如果node节点当前不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的事件
    setRightDialog() {
      this.defKeys = []
    },
    // 点击为角色添加权限
    async alloRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      let idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('更新列表成功')
      this.getroleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
