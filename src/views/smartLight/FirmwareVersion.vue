<template>
  <div class="containersty">
    <div class="contents">
      <h1>固件版本</h1>
      <div class="table-title">
        <div>
          <div class="buttons">
            <span style="float: left;display: block;margin-top: 7px;">关键字：</span>
            <el-input v-model="keywords" placeholder="关键字" size="small" class="inputsty" @input="keywords = keywords.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')" clearable />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="searchInfo()">搜索</el-button>
            <el-button style="float:right" size="mini" type="primary" icon="el-icon-plus" @click="addVersion()">添加</el-button>
          </div>
        </div>
      </div>
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableList" height="calc(100vh - 336px)" tooltip-effect="dark" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="软件名称" show-overflow-tooltip />
          <el-table-column prop="version" align="center" label="版本号" show-overflow-tooltip />
          <el-table-column prop="createTime" align="center" label="创建日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{
								scope.row.endTime !== null
									? scope.row.createTime.substring(0, scope.row.createTime.length - 3)
									: ''
							}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button size="mini" type="text" title="编辑" @click="editItem(scope.row, scope.$index)" style="margin-right:50px">
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button size="mini" type="text" title="删除" @click="deleteEnt(scope.row, scope.$index)">
                  <i class="iconfont leansite-delete deleteIconBtn"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogs" :close-on-click-modal="false" class="dialg" width="600px" append-to-body @close="resetFrom('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="80px">
        <el-form-item label="软件名称" prop="name">
          <el-input v-model="machineForm.name" placeholder="请输入软件名称" maxlength="30" @input="machineForm.name = machineForm.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g, '')" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="machineForm.version" placeholder="请输入版本号" maxlength="15" />
        </el-form-item>
        <el-form-item label="附件" prop="filePath">
          <el-input ref="customerInput" v-model="machineForm.filePath" placeholder="请输入软件名称" style="display: none" />
          <el-upload ref="uploadFile" class="upload-demo" :action="actionUrl" :show-file-list="true" :file-list="fileList" :before-upload="beforeFile" :on-remove="removeFile" :http-request="uploadImage">
            <el-button size="mini" type="primary" icon="el-icon-upload2">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogs = false">取消</el-button>
        <el-button :disabled="disabled" type="primary" @click="submitForm('machineForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import leftmenu from './leftMenu'
import Pagination from '../../components/Pagination.vue'
const validateParameterDesc = (rule, value, callback) => {
  let newValue = value.trim()
  if (newValue.length == 0) {
    callback(new Error('请输入名称(2~30个字符)'))
  } else if (newValue.length < 2 || newValue.length > 50) {
    callback(new Error('名称必须是2~30个字符'))
  } else {
    callback()
  }
}
export default {
  components: {
    leftmenu,
    Pagination
  },
  data() {
    return {
      keywords: '',
      pageObj: {
        pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
        total: 0, //数据总数
        pageSize: this.API.leansite.constObj.pageSize //页大小
      },
      actionUrl: '',
      machineForm: {
        name: '',
        version: '',
        filePath: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            validator: validateParameterDesc,
            trigger: 'blur'
          }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          }
        ],
        filePath: [
          {
            required: true,
            message: '请选择附件',
            trigger: 'blur'
          }
        ]
      },
      currentId: 0,
      tableList: [],
      fileList: [],
      dialogs: false,
      dialogTitle: '',
      disabled: false
    }
  },
  mounted() {
    this.fetchDate()
  },
  methods: {
    searchInfo() {
      this.pageObj.pageIndex = 1
      this.fetchDate()
    },
    PageTurning(page_obj) {
      this.pageObj.pageIndex = page_obj.page_index
      this.pageObj.pageSize = page_obj.page_size
      this.fetchDate()
    },
    fetchDate() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.firmwareVersionList,
          params: {
            pageNum: this.pageObj.pageIndex,
            pageSize: this.pageObj.pageSize,
            name: this.keywords
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.tableList = res.data.data.list
            this.pageObj.total = res.data.data.total
          } else {
            this.$message({
              type: 'error',
              message: '查询失败，请刷新重试！'
            })
          }
        })
    },
    addVersion() {
      this.dialogs = true
      this.dialogTitle = '新增'
      this.machineForm = {
        name: '',
        version: '',
        filePath: ''
      }
    },
    editItem(item, index) {
      this.dialogs = true
      this.dialogTitle = '编辑'
      this.currentId = item.id
      this.machineForm = {
        name: item.name,
        version: item.version,
        filePath: ''
      }
    },
    /**
     * 文件上传之前 判断格式
     */
    beforeFile(file) {
      let name = file.name
      let type = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
      // if (type != 'gz' && type != 'rar' && type != 'zip') {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传gz/rar/zip格式图片！'
      //   })
      //   return false
      // }
      this.fileList = [file]
      console.log(this.fileList)
    },
    removeFile(file, fileList) {
      this.machineForm.filePath = ''
      this.fileList = []
      let self = this
      setTimeout(() => {
        self.$refs.machineForm.validateField('filePath')
      }, 500)
    },
    uploadImage(item) {
      let formDatas = new FormData()
      formDatas.append('file', item.file)
      formDatas.append('isAdd', true)
      this.$axios
        .leansite({
          method: 'POST',
          url: this.API.leansite.upLoadImg,
          data: formDatas,
          heards: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(this.fileList)
          if (res.data.code == 0) {
            this.machineForm.filePath = res.data.data.path
            let self = this
            setTimeout(() => {
              self.$refs.machineForm.validateField('filePath')
            }, 500)
            this.$message({
              type: 'success',
              message: '上传成功！'
            })
          }
        })
    },
    resetFrom(formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.disabled = true
        this.$axios
          .leansite({
            method: 'POST',
            url: this.API.leansite.firmwareVersionUpload,
            data: {
              address: this.machineForm.filePath,
              version: this.machineForm.version,
              name: this.machineForm.name,
              id: this.dialogTitle === '新增' ? '' : this.currentId
            }
          })
          .then(res => {
            this.disabled = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '上传成功！'
              })
              this.$refs.uploadFile.clearFiles() //上传成功之后清除历史记
              this.fileList = []
              this.dialogs = false
              this.$refs[formName].resetFields()
              this.fetchDate()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          .catch(err => {
            this.disabled = false
          })
      })
    },
    deleteEnt(item, index) {
      this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">确定删除该版本吗?</div><div class="contents">删除版本之后，数据将不可恢复。</div></div>', '', {
        customClass: 'deleteclass',
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.$axios
          .leansite({
            method: 'get',
            url: this.API.leansite.firmwareVersionDelete,
            params: {
              ids: item.id
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              if (this.tableList.length === 1 && this.pageObj.pageIndex > 1) {
                this.pageObj.pageIndex = this.pageObj.pageIndex - 1
              }
              this.fetchDate()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialg {
  /deep/ .el-button--mini {
    padding: 7px 20px;
    background-color: #006fe6;
    border-color: #006fe6;
    margin-top: 1px;
  }
  /deep/ .el-button--text {
    color: #006fe6;
  }
  .dialog-footer {
    /deep/ .el-button {
      padding: 7px 20px;
      border-color: #006fe6;
    }
    /deep/ .el-button--default {
      color: #006fe6;
    }
    /deep/ .el-button--primary {
      background-color: #006fe6;
      border-color: #006fe6;
      margin-top: 1px;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
  }
}
.containersty {
  height: calc(100vh - 97px);
  padding: 0px 10px;
  .contents {
    height: calc(100vh - 97px);
    overflow: auto;
    .tits {
      padding-left: 15px;
      padding-top: 5px;
    }
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 13px 30px;
    }
    .spanti {
      font-weight: bold;
      font-size: 18px;
      margin-right: 10px;
    }
    .tabsty {
      margin: 10px 30px;
      margin-top: 17px;
      border: 1px solid #bebebe;
      padding: 0px 10px;
      padding-bottom: 75px;
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #bebebe;
      }
      .el-table--border::after,
      .el-table--group::after {
        background-color: #bebebe;
      }
      .el-table::before {
        background: #fff;
      }
      /deep/ .is-leaf {
        border-bottom: 1px solid #bebebe;
        color: #323232;
        // border-right: 1px solid #bebebe;
      }
      /deep/ .el-table__row td {
        border-bottom: 1px solid #bebebe;
      }
    }
    .table-title {
      height: 40px;
      margin: 10px 30px;
      margin-bottom: 0px;
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
  }
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .title {
    padding: 10px 15px;
    font-size: 14px;
  }
  .buttons {
    margin-bottom: 15px;
    /deep/ .el-button--mini {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
      margin-top: 1px;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
    .flt {
      margin-left: 15px;
    }
    .flts {
      margin-left: 15px;
      background: #fff;
      color: #66b1ff;
    }
    .inputsty {
      margin-right: 15px;
      float: left;
      width: 200px;
    }
  }
}
</style>
