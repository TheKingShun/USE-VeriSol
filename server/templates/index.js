// import Vue from 'vue'
import axios from 'axios'
<script src="//vuejs.org/js/vue.min.js"></script>
    var root = new Vue({
        el:"#root",
        data:{
            radio:'1',
            textarea : '',
            options: [{
                value: '1',
                label: '0.4.20'
            }, {
                value: '2',
                label: '0.5.15'
            }, {
                value: '3',
                label: '0.6.10'
            }, {
                value: '4',
                label: '0.7.2'
            }, {
                value: '5',
                label: '0.8.5'
            }],
            version: '',
            res_boogie:'',
            res_corral:'',
            res_cmd:'',
            isLoading:false,
            url_upload:'http://127.0.0.1:5000/upload',
            url_deal:'http://127.0.0.1:5000/deal',
            c_name:'',
            sol2boogie:'',
            result_rows:8,
            write_code_rows:19
        },
        methods:{
            
            httpRequest:function(param){
                console.log('===param===',param);
                console.log('===httprequest test===');          
                let fileObj = param.file; // 相当于input里取得的files
                console.log('===fileobj is ===',fileObj);

                let data = new FormData(); // FormData 对象

                data.append("file", fileObj); // 文件对象
                data.append('name',root.c_name)
                console.log('===c_name is ===',root.c_name);
                console.log('===data is  start===');
                data.forEach((value, key) => {
                    console.log("key %s: value %s", key, value);
                })
                console.log('===data is  end===');

                axios({
                    method: "POST",
                    url: this.url_upload,
                    headers: {
                    'Content-Type': "multipart/form-data",
                    },
                    //这部分非常重要，否则formdata会被转格式
                    transformRequest: [function(){
                        return data;
                    }],
                    // data: data,
                    // params: data,
                })
                .then(res => {
                    console.log('===res===',res);
                    this.res_boogie = res.data.res_boogie
                    root.res_corral = res.data.res_corral == ''?
                        (res.data.cmd_output.includes('Compilation Error')?'编译错误,可能引入了其他文件':'完全正确'):res.data.res_corral.includes('Invalid input: Implementation of main procedure not found')?
                        '合约名提供错误':res.data.res_corral.includes('This assertion can fail')?'断言不能通过，该程序存在问题':res.data.res_corral
                    this.res_cmd = res.data.cmd_output
                    this.textarea = res.data.source_file
                    this.isLoading = falseg
                    root.sol2boogie = res.data.sol2boogie
                })
                .catch(err => {
                console.log(err);
                this.isLoading = false
                });

            },



            click2start:function () {

                if(this.version == ''){
                    this.windowMsg('error','please choose the same version of you solidity file')
                    return 
                }

                if(this.c_name == ''){
                    this.windowMsg('error','please write ths main name of this contract file')
                    return 
                }
                

                this.isLoading = true
                if(this.radio == '1'){
                    this.cleanAll(1)
                    this.radio = '2',
                    this.$refs.upload.submit()
                    this.windowMsg('success','上传成功，正在进行形式化验证......')
                    return 
                }


                this.cleanAll(2)
                this.windowMsg('success','自定义成功，正在进行形式化验证......')
 
                
                axios.post('http://127.0.0.1:5000/deal',{
                   solFile:this.textarea,
                   c_name:this.c_name
               }).then(function (res) {
                   root.isLoading = false
                   console.log(res);
                   console.log(res.status)

                   root.res_boogie = res.data.res_boogie
                   root.res_corral = res.data.res_corral == ''?
                        (res.data.cmd_output.includes('Compilation Error')?'编译错误,可能引入了其他文件':'完全正确'):res.data.res_corral.includes('Invalid input: Implementation of main procedure not found')?
                        '合约名提供错误':res.data.res_corral.includes('This assertion can fail')?'断言不能通过，该程序存在问题':res.data.res_corral
                   root.res_cmd = res.data.cmd_output
                   root.sol2boogie = res.data.sol2boogie

                
               }).catch(function (error) {
                   console.log('==err==',error)
                   root.isLoading = false
               })



            },
            beforeAvatarUpload:function (file) {
                const isLt2K = file.size/ 1024 < 2;
                if(isLt2K){
                    this.windowMsg('error','the size of file must be letter then 2k')
                    return 
                }
            },
            exceedFiles:function(files,fileList){
                this.windowMsg('error','the counts of file is out of the limit')
            },
            cleanAll:function(index){
                if(index == 1){
                    this.textarea = ''
                }
                this.res_boogie = ''
                this.res_corral = ''
                this.res_cmd = ''
                this.sol2boogie=''
            },
            windowMsg:function(type,msg){
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type
                    });
            }
        }
    })
