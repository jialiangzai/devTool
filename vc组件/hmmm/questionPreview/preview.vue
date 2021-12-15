<template>
  <div class="container">
    <!-- 试题预览对话框 -->
    <el-dialog
      title="题目预览"
      :visible="showPreview"
      width="900px"
      @close="close"
    >
      <!-- 内容开始 -->
      <el-row :gutter="20" class="text">
        <!-- 【题型】 -->
        <el-col :span="6">
          <span>【题型】: </span>
          <span v-if="previewItems.questionType === '1'">单选题</span>
          <span v-else-if="previewItems.questionType === '2'">多选题</span>
          <span v-else>简答题</span>
        </el-col>
        <!-- 编号 -->
        <el-col :span="6">
          <span>【编号】: </span>
          <span>{{ previewItems.id }}</span>
        </el-col>
        <el-col :span="6">
          <span>【难度】: </span>
          <span v-if="previewItems.difficulty === '1'">简单</span>
          <span v-else-if="previewItems.difficulty === '2'">一般</span>
          <span v-else>困难</span>
        </el-col>
        <!-- 【标签】:  -->
        <el-col :span="6">
          <span>【标签】: </span>
          <span>{{ previewItems.tags }}</span>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row :gutter="20" class="text">
        <!-- 【学科】： -->
        <el-col :span="6">
          <span>【学科】： </span>
          <span>{{ previewItems.subject }}</span>
        </el-col>
        <!-- 编号 -->
        <el-col :span="6">
          <span>【目录】 </span>
          <span>{{ previewItems.catalog }}</span>
        </el-col>
        <el-col :span="6">
          <span>【方向】： </span>
          <span>{{ previewItems.direction }}</span>
        </el-col>
      </el-row>
      <!-- 分割线 -->
      <el-divider class="dividerHr"></el-divider>
      <!-- 题干 -->
      <el-row>
        <el-col>【题干】：</el-col>
      </el-row>
      <el-row>
        <el-col style="color: blue">
          <p v-html="previewItems.question"></p>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 多选题（试题类型） 选项：（以下选中的选项为正确答案） -->
          <span v-if="previewItems.questionType === '1'">单选题 </span>
          <span v-else-if="previewItems.questionType === '2'">多选题 </span>
          <span v-else>简答题 </span>
          <span>选项：（以下选中的选项为正确答案）</span>
        </el-col>
      </el-row>
      <!-- 单选题 -->
      <el-radio-group
        v-model="isRadio"
        class="radioSel"
        v-if="previewItems.questionType === '1'"
        @change="change"
      >
        <!--  :label="1"只能是1，虽然和value一致。0的时候不显示 -->
        <el-row v-for="(item, index) in previewItems.options" :key="index">
          <el-radio :label="item.isRight">{{ item.title }}</el-radio>
        </el-row>
      </el-radio-group>
      <!-- 多选题 -->
      <div v-if="previewItems.questionType === '2'">
        <el-row
          v-for="(item, index) in options"
          :key="index"
          style="margin: 10px 0px"
        >
          <el-checkbox
            v-model="item.isRight"
            :disabled="item.isRight === 0"
            @change="testChange(item)"
          >
            {{ item.title }}
          </el-checkbox>
        </el-row>
      </div>
      <!-- 分割线 -->
      <el-divider class="dividerHr"></el-divider>
      <!-- 【参考答案】： -->
      <el-row type="flex" align="middle" class="dividerHr">
        <el-col>
          【参考答案】：
          <el-button type="danger" size="small" @click="isShowVideo = true"
            >视频答案预览</el-button
          >
        </el-col>
      </el-row>
      <!-- 视频解析 -->
      <el-row v-if="isShowVideo">
        <video
          width="400px"
          :src="previewItems.videoURL"
          controls="controls"
        ></video>
      </el-row>

      <!-- 分割线 -->
      <el-divider class="dividerHr"></el-divider>
      <el-row class="answerKey">
        <el-col
          >【答案解析】：
          https://element.eleme.cn/#/zh-CN/component/i18n</el-col
        >
      </el-row>
      <!-- 分割线 -->
      <el-divider class="dividerHr"></el-divider>
      <el-row class="answerKey">
        <el-col
          >【题目备注】：
          https://element.eleme.cn/#/zh-CN/component/i18n</el-col
        >
      </el-row>
      <!-- 内容结束 -->
      <!-- 底部 -->
      <div slot="footer" class="questionpre">
        <el-button type="primary" @click="$emit('update:showPreview', false)">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 【题型】：单选题【编号】：27【难度】：简单【标签】：测试
// 【学科】：前端【目录】：js基础【方向】：外包服务
// 获取当前试题详情
import { detail } from '@/api/hmmm/questions.js'
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    showPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 单选框 1是选中 0 是未选中
      isRadio: 1,
      // 多选
      cheBox: [],
      // 试题详情id
      questionsId: 0,
      // 最新试题详情
      previewItems: {},
      // video
      isShowVideo: false
    }
  },
  // 点击预览时如果是多选框那么就把它选项为1激活选项框状态
  computed: {
    // 判断是不是多选框
    options () {
      // 单选 多选 简答
      if (!this.previewItems.questionType === '2') {
        return
      }
      this.previewItems.options.forEach(els => {
        if (els.isRight === 1) {
          // 激活当前选项框
          els.isRight = true
        }
      })
      return this.previewItems.options
    }
  },
  methods: {
    close () {
      this.$emit('update:showPreview', false)
      // console.log('我关闭了')
      this.isShowVideo = false
    },
    // 打开弹层渲染数据获取最新的试题详情
    async openDialog (id) {
      const { data } = await detail({ id: this.id })
      console.log('最新的试题详情', data)
      this.previewItems = data
    },
    // 单选
    change () {
      // 1标识表示选中激活
      this.isRadio = 1
    },
    // 多选状态切换
    testChange (item) {
      // console.log(item)// 对象
      return !!item.isRight
    }
  }
}
</script>

<style scoped lang='scss'>
.questionpre {
  text-align: right;
}
.text {
  margin: 14px 0;
  .el-col {
    span {
      font-size: 14px;
      line-height: 14px;
    }
  }
}
.dividerHr {
  margin: 12px 0;
}
.radioSel {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.el-radio {
  margin-top: 20px;
}
.answerKey {
  padding: 8px 0;
}
</style>
