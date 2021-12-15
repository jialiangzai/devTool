<template>
  <el-dialog
    title="题目预览"
    :visible="showDialog"
    width="900px"
    @close="handleClose"
  >
    <el-row>
      <el-col :span="6"
        >【题型】：{{ formatQuestionType(questionDetail.questionType) }}</el-col
      >
      <el-col :span="6">【编号】：{{ questionDetail.id }}</el-col>
      <el-col :span="6"
        >【难度】：{{
          formatQuestionDifficulty(questionDetail.difficulty)
        }}</el-col
      >
      <el-col :span="6">【标签】：{{ questionDetail.tags }}</el-col>
      <el-col :span="6">【学科】：{{ questionDetail.subjectName }}</el-col>
      <el-col :span="6">【目录】：{{ questionDetail.directoryName }}</el-col>
      <el-col :span="6">【方向】：{{ questionDetail.direction }}</el-col>
    </el-row>
    <hr />
    【题干】：
    <div v-html="questionDetail.question" style="color: #0000ff"></div>
    <div v-if="questionDetail.questionType !== '3'">
      <div style="padding-bottom: 5px">
        {{ formatQuestionType(questionDetail.questionType) }}
        选项：（以下选中的选项为正确答案）
      </div>
      <div
        class="selectBox"
        v-for="item in questionDetail.options"
        :key="item.id"
      >
        <el-radio
          v-if="questionDetail.questionType === '1'"
          :value="item.isRight"
          :label="1"
          >{{ item.title }}</el-radio
        >
        <el-checkbox
          v-if="questionDetail.questionType === '2'"
          :value="item.isRight ? true : false"
          >{{ item.title }}</el-checkbox
        >
      </div>
    </div>
    <hr />
    【参考答案】：<el-button type="danger" size="small" @click="openVideo"
      >视频答案预览</el-button
    >
    <div class="video" v-if="showVideo">
      <video :src="questionDetail.videoURL" controls ref="video"></video>
    </div>
    <hr />
    【答案解析】：
    <div style="display: inline-block" v-html="questionDetail.answer"></div>
    <hr />
    【题目备注】：{{ questionDetail.remarks }}
    <div slot="footer">
      <el-button type="primary" @click="$emit('update:showDialog', false)"
        >关闭</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// 导入获取问题详情的方法
import { detail as getQuestionDetailApi } from '@/api/hmmm/questions.js'
// 导入获取问题类型和问题难度的枚举类型数据
import { questionType, difficulty } from '@/api/hmmm/constants.js'
export default {
  props: {
    // 控制对话框的显示与隐藏
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 问题详情
      questionDetail: {},
      // 控制视频的显示与隐藏
      showVideo: false
    }
  },
  methods: {
    // 打开对话框时,获取问题详情
    async openDialog (id) {
      const data = await getQuestionDetailApi({ id })
      // console.log(data)
      this.questionDetail = data.data
    },
    // 监听对话框的关闭
    handleClose () {
      this.$emit('update:showDialog', false)
      this.showVideo = false
    },
    // 格式化题型 -> 1:单选 2.多选 3.简答
    formatQuestionType (type) {
      const map = {}
      questionType.forEach(item => {
        map[item.value] = item.label
      })
      return map[type]
    },
    // 格式化难度 -> 1:简单 2.一般 3.困难
    formatQuestionDifficulty (type) {
      const map = {}
      difficulty.forEach(item => {
        map[item.value] = item.label
      })
      return map[type]
    },
    // 点击视频答案预览按钮,打开视频
    openVideo () {
      this.showVideo = true
    }
  }
}
</script>

<style scoped lang='scss'>
.el-col {
  padding: 10px 0;
}

.selectBox {
  padding: 8px 0;
}

.video {
  width: 400px;
  height: 300px;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
