$('document').ready(function(){

    tipOpen = false;

    let cusJson = {
        '-1': '浏览',
        0:'草稿' ,
        1:'待处理' ,
        2:'待上传' ,
        4:'待提交' ,
        5:'待重新提交' ,
        6:'核保中'
    };

    const mockColumns = (persons = []) => {

        return persons.map(item => {
            const text = `<div class="flex-item"><span>${item.employeeNumber}</span><span>${item.employeeName}</span><span>${item.orderNum}单</span>`;
            return {
            ...item,
            text,
            value: item.employeeNumber
            };
        });

    };
    
    var app = new Vue({
        el: '#app',
        data(){
            return {
                // 客户状态对应表
                cusJson,

                one: 1,

                // 已分配记录
                ar_pages: 1,
                ar_limit: 30,
                ar_list: [],
                ar_loading: false,
                ar_finished: false,
                ar_error: false,
                ar_error_text: '请求失败',

                // 待分配记录
                dr_pages: 1,
                dr_limit: 10,
                dr_list: [],
                dr_loading: false,
                dr_finished: false,
                dr_error: false,
                dr_error_text: '请求失败',

                // 选择机构以及城市弹窗
                showMec: false,
                mesList: [
                    {
                        values: Object.keys(jsonWhere),
                        className: 'l1'
                    },
                    {
                        values: jsonWhere[ Object.keys(jsonWhere)[0] ],
                        className: 'l2',
                        defaultIndex: 0
                    }
                ],

                // 销售人员的列表
                showSale: false,
                saleList: [],

                tap: 0,
                activeShow: [1],
            }
        },
        mounted(){
            this.getSaleList();
        },
        methods: {

            toTap(tap){
                this.tap = tap;

                if(tap == 1 && this.one ){
                    this.one = false;
                    this.ar_onLoad();
                }
            },

            // 获取销售人员列表
            getSaleList(){
                // mockColumns()
                let self =this;
                instance.post(url.querySalesmanList).then( ( {status ,data }) =>{

                    if( data.statusCode == 0){
                        
                        self.saleList = mockColumns(data.data);

                    }else{

                        vant.Dialog.alert({
                            message: data.msg
                        })

                    }


                }).catch( err =>{
                    
                    console.log(err);
                    vant.Dialog.alert({
                        message: err
                    })

                })
            },

            // 选择销售
            saleConfirm(picker, values){

                let cDate = this.dr_list[this.activeShow];
                let self =this;

                if( this.isSelect(cDate.city ,cDate.bankName) ){

                    vant.Dialog.alert({
                        message: '请先选择分配机构'
                    }).then(() => {
                        this.showSale = false;
                    });
                    return '';

                }else{
                    
                    vant.Dialog.confirm({
                        title: '确认',
                        message: '是否确认将客户'+cDate.employeeName+'分配给客户经理'+picker.employeeName
                    }).then(() => {

                        // 确认提交
                        console.log(cDate ,picker);
                        self.allot(cDate ,picker)

                    })


                }

            },

            // 是否需要选择机构
            isSelect(city ,bankName){
                // 信用卡中心
                if( !city && ( /总行/.test(bankName) || /信用卡中心/.test(bankName)  || !bankName) ){
                    return true
                }
                return false;
            },
            
            // 立即分配机构
            mecConfirm(picker){
                let data = this.dr_list[ this.activeShow ];
                let self = this;
                // this.showMec = false;
                delete data.id;
                delete data.agentName;
                delete data.agentCode;
                instance.post(url.allot ,{
                    gisUserNews: [{
                        employeeNumber: data.employeeNumber,
                        branchCode: picker[0],
                        appletsCity: picker[1],
                        gisAllotRecord: {
                            ...data,
                            organizationName: picker[0],
                            branchCode: picker[0],
                            appletsCity: picker[1],
                            branchName: data.bankName,
                            orderAmount: data.amount,
                            followUpAnp: data.anp,
                            customerStatus: data.customerStatusDesc
                        }
                    }]
                    
                }).then( ( {status ,data }) =>{

                    if( data.statusCode == 0){
                        
                        self.dr_onLoad(true);
                        vant.Dialog.alert({
                            message: '分配成功'
                        }).then(() =>{
                            self.showMec = false;
                        })

                    }else{

                        console.log(data.msg);
                        vant.Dialog.alert({
                            message: data.msg
                        })

                    }


                }).catch( err =>{

                    console.log(err);
                    vant.Dialog.alert({
                        message: err
                    })

                })
            },

            // 待分配数据排序
            sort(){
                this.dr_list.sort(function(a,b){
                    return  b.orderNum - a.orderNum 
                })
            },

            // 获取待分配的数据
            dr_onLoad(open){
                
                if(open){
                    this.dr_list = [];
                    this.dr_pages=1;
                }
                this.queryStayAllotClientList();

            },
            queryStayAllotClientList(){

                let self =this;
                self.dr_loading =true;
                instance.post(url.queryStayAllotClientList ,
                    'page='+self.dr_pages+
                    '&limit='+self.dr_limit+
                    '&allocation=0'
                ).then( ( {status ,data }) =>{

                    self.dr_loading = false;
                    self.dr_error_text = data.msg;

                    if( data.statusCode == 0){
                        self.dr_pages ++ ;
                        self.dr_list.push( ...handleDate( data.data , {
                            amount:fmoney,
                            anp:fmoney
                        } ) );
                        self.sort();

                        if( data.data.length == 0 ){
                            self.dr_finished =true;
                        }

                    }else{

                        self.dr_error =true;
                        self.dr_loading =false;

                    }


                }).catch( err =>{
                    
                    self.dr_error = true;
                    self.dr_loading =false;

                })

            },

            // 请求已分配客户
            ar_onLoad(){
                this.allotRecord();
            },
            allotRecord(){

                let self =this;
                self.ar_loading =true;
                instance.post(url.queryStayAllotClientList ,
                    'page='+ self.ar_pages+
                    '&limit='+ self.ar_limit+
                    '&allocation=1'
                ).then( ( {status ,data }) =>{
                    
                    self.ar_loading = false;
                    self.ar_error_text = data.msg;

                    if( data.statusCode == 0){
                        self.ar_pages ++ ;
                        self.ar_list.push( ...handleDate(data.data,{
                            list: [{
                                key: ['amount','anp'],
                                do:fmoney
                            }]
                        }) );

                        if( data.data.length == 0 ){
                            self.ar_finished =true;
                        }

                    }else{

                        self.ar_error =true;
                        self.ar_loading =false;

                    }


                }).catch( err =>{
                    
                    self.ar_error = true;
                    self.ar_loading =false;

                })
            },

            // 分配销售
            allot(cDate ,picker){
                console.log(cDate ,picker);
                let self =this;

                delete cDate.id;
                instance.post(url.allot ,{
                    gisUserNews:[
                        {
                            employeeNumber: cDate.employeeNumber,
                            agentCode: picker.employeeNumber,
                            agentName: picker.employeeName,
                            gisAllotRecord: {
                                ...cDate,
                                agentName: picker.employeeName,
                                branchName: cDate.bankName,
                                orderAmount: cDate.amount,
                                followUpAnp: cDate.anp,
                                customerStatus: cDate.customerStatusDesc
                            }
                        }
                    ]
                    
                }).then( ( {status ,data }) =>{

                    if( data.statusCode == 0){
                        
                        self.dr_onLoad(true);
                        vant.Dialog.alert({
                            message: '分配成功'
                        }).then(() =>{
                            self.showSale = false;
                        })

                    }else{

                        console.log(data.msg);
                        vant.Dialog.alert({
                            message: data.msg
                        })

                    }


                }).catch( err =>{
                    
                    console.log(data.msg);
                    vant.Dialog.alert({
                        message: data.msg
                    })

                })
            }
        
        }
    })
    
})