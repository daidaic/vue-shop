<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>嗨马电商管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="btn">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ?'64px':'200px'">
         <!-- 折叠栏 -->
         <div class="toggle-button" @click='togglechange'>
           |||
         </div>
        <!-- 侧边栏菜单区 -->
        <el-menu  :default-active="actName" :router='true' :collapse-transition='false' :collapse='isCollapse' :unique-opened="true" background-color="#545c64" text-color="#fff" active-text-color="#409eff">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for=" item in menuList " :key='item.id'>
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="fontMenu[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" 
            v-for="subItem in item.children" 
            :key="subItem.id"
            @click = "savaName( '/' + subItem.path )">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      fontMenu: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的连接地址
      actName: ''
    }
  },
  created() {
    this.getList()
    this.actName = window.sessionStorage.getItem('k')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    togglechange() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接激活状态
    savaName(k) {
      window.sessionStorage.setItem('k', k)
      this.actName = k
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 18px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    background-color:  #333744 !important;
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
  margin-top: 3px;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
