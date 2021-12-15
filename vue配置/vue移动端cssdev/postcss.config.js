// postcss.config.js
module.exports = {
  plugins: {
    // 不能转换元素行内样式的单位
    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    'postcss-pxtorem': {
      // rootValue ({ file }) {
      //   return file.indexOf('vant') !== -1 ? 37.5 : 75
      // },
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
