<template>
  <div class="upload-excel">
    <!-- 按钮盒子 -->
    <div class="btn-upload">
      <el-button
        :loading="loading"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        点击上传
      </el-button>
    </div>

    <!-- 隐藏的文件选择框 -->
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    >

    <!-- 拖拽的盒子 -->
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      // 存储excel数据对象
      excelData: {
        header: null, // 表头
        results: null // 表内容
      }
    }
  },
  methods: {
    generateData({ header, results }) {
    // 存了一下读取的结果 header results
      this.excelData.header = header
      this.excelData.results = results

      // 如果有配置成功的函数, 那么调用一下该函数, 并传递{ header, results }
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
    // 阻止冒泡以及默认行为, 解决兼容+ 阻止浏览器的默认下载行为
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return

      // 文件选择框 => e.target.files[0]
      // 拖拽来的文件 => e.dataTransfer.files
      const files = e.dataTransfer.files
      if (files.length !== 1) {
      // 进来了表示你拖拽的文件数量不是1个, 不行
        this.$message.error('仅支持拖拽单个文件!!!')
        return
      }
      // 取出那个文件
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
      // 如果不是xlsx xls csv文件后缀 不行
        this.$message.error('只支持xlsx csv xls文件格式!!!')
        return false
      }
      // 开始解析文件
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
    // 拿到文件以后, 就可以清空input:file框的值了
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      // 判断有没有配置检验函数
      if (!this.beforeUpload) {
      // 如果没有配置, 我就认为你不需要校验,
      // 开始解析文件
        this.readerData(rawFile)
        return
      }

      // 配置了校验函数, 进行校验  成功 true ;  失败 false
      const before = this.beforeUpload(rawFile)
      if (before) {
      // 检验成功
      // 开始解析文件
        this.readerData(rawFile)
      }
    },
    // 解析文件的方法
    readerData(rawFile) {
      this.loading = true
      // 解析文件是一个耗时的操作, 异步, 如果你希望在读文件这个异步操作结束以后, 做某件事
      // 封装promise
      return new Promise((resolve, reject) => {
      // 创建FileReader实例, html5新出的用于读取文件的api
        const reader = new FileReader()
        // 监听文件读取,  读取结束了, 会自动触发load事件
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)

          // 读完的结果 => header 表格头部的数据 results 表格每一行数据
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        // 调用方法, 开始读取
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    // 正则校验你的文件格式
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
