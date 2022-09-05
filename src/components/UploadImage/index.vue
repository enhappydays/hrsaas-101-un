<template>
  <div>
    <!--
      action 必传 需要给一个后端接口地址, elementui会帮你发送请求
      我们不需要它自动发请求, 我们将来自己发送请求, 此时给空 不让他报错

      list-type 文件列表的类型, 此处选择的是以照片墙的形式进行展示

      file-list 文件列表数组

      on-preview 当你点击预览的+号时, 会自动触发, 接收一个函数, 会把点击的图片文件作为参数传递

      limit 限制用户上传图片数量

       6. on-remove
        当你点击垃圾篓的时候会自动触发
        会接收一个函数, 函数会有两个参数: file, fileList
        file: 是被删除的那个文件对象
        fileList: 返回最新的文件列表 (结构中的列表, 不是数据中的列表)
          7. http-request
       覆盖默认的上传行为，可以自定义上传的实现
       接收的是一个函数 函数接收一个参数: 对象 (obj.file -- 就是要上传的文件对象)
       一旦配置了自定义上传, 当选择一张图片时, 默认会以本地预览的形式展示图片
       类似于: blob:http://localhost:8888/bc04f586-b0c1-48bd-9102-46f7ddf32926
       临时生成一个本地图片用于预览, 增强用户体验
        8. on-change
       文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
       接收的是一个函数 function(file, fileList)
            9. before-upload
       图片文件在真正上传之前触发, 接收的是一个函数   function(file)
       一般用于校验图片的格式或者图片的大小...
    -->
    <el-upload
      action=""
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :limit="limit"
      :class="{disabled: isDisabled}"
      :on-remove="handleRemove"
      :http-request="handleUpload"
      :on-change="handleChange"
    >
      <i class="el-icon-plus" />

    </el-upload>
    <el-dialog title="图片预览" :visible="dialogVisible" @close="dialogVisible = false">
      <img :src="dialogImageUrl" style="width: 100%;">

    </el-dialog>

  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDgCTVIq9C0YqtgEWZNvEI6ex0oMfiV2JO',
  SecretKey: 'tZ0C9qIUQ7ZlhOp0wc2D8nDNIxNXYP3S'
})
export default {
  name: 'UploadImage',
  props: {
    // 图片上传的最大数量
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 1. 上传文件列表
      fileList: [],
      // 2. 图片预览对话框显示/隐藏
      dialogVisible: false,
      // 3. 用于展示的图片地址,
      dialogImageUrl: '',
      // 4. 控制进度条百分比
      percentage: 0

    }
  },
  computed: {
    // 1. 控制上传按钮显示/隐藏
    isDisabled() {
      return this.fileList.length >= this.limit
    },
    isUploadAll() {
      return this.fileList.every(item => item.status === 'success')
    }
  },
  methods: {
    // 1. 图片预览
    handlePictureCardPreview(file) {
      // console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      // file 你当前删除的文件对象
      // fileList 结构中的文件列表
      // this.fileList 自己的文件列表
      // 其实, 你删除以后, 结构中的文件列表更新了, 但是我们自己的文件列表fileList还没更新
      // 怎么办呢? 手动同步
      console.log(file, fileList, this.fileList)
      // 方式一:
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // 方式二:
      // 注意: 引用数据类型不能直接赋值, 要深拷贝再赋值(形成独立的数组)
      this.fileList = [...fileList]
    },
    handleBeforeUpload(file) {
      // file => 添加的文件对象
      // console.log(file)
      // this.$message.error('你错了!')
      // return false

      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }

      return true
    },
    handleUpload(obj) {
      // 3.0 从自己的数据数组中找到上传的对象
      const uid = obj.file.uid
      const file = this.fileList.find(item => item.uid === uid)

      // 在图片文件对象被上传之前修改对象的status值
      file.status = 'uploading'

      // 3.1 调用腾讯云的接口函数实现文件上传
      cos.putObject({
        Bucket: '101-hrsass-1312445828', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: `101-hrsass-${+new Date()}-${obj.file.name}`, /* 必须, 上传文件的名称 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        // 获取文件上传进度
        onProgress: (progressData) => {
          console.log(progressData)
          file.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) {
          this.$message.error('图片上传失败')
          return
        }
        // 3.2 后续处理 更新本地图片对象的 status 和 url
        // console.log(data)
        // 延迟更高文件的状态, 主要目的在于提升用户体验
        setTimeout(() => {
          file.status = 'success'
        }, 500)
        file.url = 'https://' + data.Location
      })
    },
    handleChange(file, fileList) {
      // 手动同步结构中的fileList 和 数据中的 this.fileList
      this.fileList = [...fileList]
    }

  }
}

</script>
<style lang="scss" scoped>
.disabled {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}

</style>
