<template>
  <el-dropdown trigger="hover" @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  name: 'Lang',
  methods: {
    // lang===》点击中文是zh 英文en   command的值
    changeLanguage (lang) {
      // Cookie.set(键，存储的数据，{})======>第三个参数是时间对象格式/数字默认天
      // let expires = 2  // 天 默认session会话结束
      const expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2小时后过期
      // Cookie.set('name', 'value', { expires })

      Cookie.set('lang', lang, { expires })
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')
    }
  }
}
</script>

