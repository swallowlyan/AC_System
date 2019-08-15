<template>
    <div>
    <div class="demo-input-suffix">
      <div style="font-size:24px;font-weight:700;margin:0px 14px 0px -23px">|</div>上传服务
    </div>
    <div class="demo-input-suffix">
      <span>上传服务:</span>
      <el-input style="width:300px;"v-model="input" placeholder="请输入内容"></el-input>
    </div>
    <div class="demo-input-suffix">
      <span>行业分类:</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
    </el-select>
  </div>
    <div class="demo-input-suffix">
    <span>领域分类:</span>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
    <div class="demo-input-suffix">
    <span>交付方式:</span>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select></div>
    <div class="demo-input-suffix">
    <span>服务介绍:</span>
    <el-input
      type="textarea"
      :rows="2"
      style="width:300px;"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    </div>
    <div class="demo-input-suffix">
    <span>服务支持:</span>
     <el-input
      type="textarea"
      style="width:300px;"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    </div>
    <div class="demo-input-suffix">
    <span>规格报价:</span></div>
    <div class="demo-input-suffix">
    <span>部署使用说明: </span><el-input
      type="textarea"
      style="width:300px;"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    </div>
    <div class="demo-input-suffix"><span>上传图标:</span>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      list-type="picture">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload></div>
  <div style="margin-left:200px;"><el-button type="primary">云化服务</el-button></div>
    <div style="margin-left:200px;"><el-button>&emsp;安装&emsp;</el-button></div>
</div>
</template>
<script>
    export default {
      data(){
          return{
            username:sessionStorage.getItem('username'),
            roleId:'',
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            input:'',
            textarea: '',
            options: [{
              value: '',
              label: ''
            }],
            value: ''
          }
      },

      mounted(){
          this.getUsername();
          this.getRoleId();
      },

      methods:{
        getUsername(){
          this.username = sessionStorage.getItem('username');
          // console.log(this.username);
        },

        getRoleId(){
          this.roleId = sessionStorage.getItem("roleId");
          // console.log(this.roleId);
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
         handleChange(file, fileList) {
          this.fileList = fileList.slice(-3);
        }
      },
    }
</script>

<style scoped>
.main-part{
  margin: 20px;
}
.line_style div{
 margin:10px 0;
}
.line_style div span{
 display:inline-block;
 width:120px;
}
.demo-input-suffix{
 display:flex;
 align-items:center;
}
</style>
