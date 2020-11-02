let cusJson = {
    0:'草稿' ,
    2:'待上传' ,
    3:'人脸识别成功' ,
    4:'待提交' ,
    5:'已撤单' ,
    6:'已提交' ,
    8:'待支付' ,
    9:'待划款' ,
    10:'已完成'
};


let rn = ['招商信诺安康万家团体重大疾病保险' ,'招商信诺精英智选高端医疗团体保险' ,'招商信诺传家企悦团体终身寿险'];  // 权值 rn2.length*2 
let rn2 = ['00','01','03','02','08','09','13','99']; // 权值 1

// 倒序方便排名
rn = rn.reverse();
rn2 = rn2.reverse();

$('document').ready(function(){

    // 判断是否为pc端
    if(!IsPC()){
        $('body').addClass('phone');
        var bodyW = $('body').width();
        var tableW = $('table').width();
        var bi = tableW / bodyW;
        $('.xx').css({
            'width': bodyW * bi + 'px'
        })
    }
    
    window.addEventListener("resize",function(){
        if(!IsPC()){
            var bodyW = $('body').width();
            var tableW = $('table').width();
            var bi = tableW / bodyW;
            $('.xx').css({
                'width': bodyW * bi + 'px'
            })
        }else{
            $('.xx').fadeOut();
        }
    })

    var v=new Vue({
        el: '#app',
        data(){
            return {
                list: [],
                tip: {},
                showList: {},
                showTip: 'a',
                jsonTap: { a:'未完成订单' ,b:'草稿单' ,c:'已完成订单' ,d:'浏览记录'},

                relationship: { 
                    '00':'本人',
                    '01':'配偶',
                    '02':'父母',
                    '03':'子女',
                    '08':'祖父母、外祖父母',
                    '09':'祖孙、外祖孙',
                    '13':'配偶父母',
                    '99':'其他'},

                showMsk: false,
                cusJson: cusJson,
                tol: [0,0,0,0,0,0]
            }
        },
        created(){
            this.showList =[];
            this.showTip = Object.keys(this.showList)[0];
        },
        mounted(){
            this.requestList(); // 请求列表接口
        },
        methods: {

            requestList(){
                let self =this;

                instance.post( url.queryMyClients ).then( ( { status ,data }) =>{
                    if( data.statusCode == 0 ){

                        var dataObj = {};
                        for (const key in data.data) {
                            if (data.data.hasOwnProperty(key) && key != 'dataList' && key != 'etlDate') {
                                dataObj[key] = data.data[key];
                            }
                        }
                        self.tip = dataObj;

                        if(data.data.dataList.length == 0){
                            $('.head_title .name').text('招行员福2020年_'+$('.head_title .name').text())
                            setHead(data.data.etlDate,0);
                            return ;
                        }

                        $('.head_title .name').text('招行员福2020年_'+$('.head_title .name').text())
                        setHead(data.data.dataList[0].etlDate,0);

                        self.list = handleDate(data.data.dataList,{
                            unfinishOrderAnp:fmoney,
                            draftOrderAnp:fmoney,
                            finishOrderAnp:fmoney,
                            employeeName(e){
                                if(!e) return '--';
                                var name = e[Symbol.iterator]().next().value;
                                return name+'**';
                            }
                        },
                        {
                            list: [
                                {
                                    key: [
                                        'unfinishOrder',
                                        'unfinishOrderAnp',
                                        'draftOrder',
                                        'draftOrderAnp',
                                        'finishOrder',
                                        'finishOrderAnp'
                                    ],
                                    do({k,v}){
                                        if( v && Number(v) ){
                                            if( !this[k] ) this[k] =0;
                                            this[k] += Number(v);
                                        }
                                    }
                                }
                            ]
                        });

                        self.tol[0] = handleDate.export.unfinishOrder;
                        self.tol[1] = handleDate.export.unfinishOrderAnp;
                        self.tol[2] = handleDate.export.draftOrder;
                        self.tol[3] = handleDate.export.draftOrderAnp;
                        self.tol[4] = handleDate.export.finishOrder;
                        self.tol[5] = handleDate.export.finishOrderAnp;
                        
                        self.tol = [
                            fn(self.tol[0]),
                            fmoney(self.tol[1],2,10000),
                            fn(self.tol[2]),
                            fmoney(self.tol[3],2,10000),
                            fn(self.tol[4]),
                            fmoney(self.tol[5],2,10000)
                        ]

                    }
                })
            },

            showDetails(item){

                this.requestDetails(item)

            },
            
            requestDetails(item){

                let self =this;

                instance.post( url.queryMyClientsDetails ,"employeeNumber="+item.employeeNumber).then( ( { status ,data } ) =>{
                    if( data.statusCode == 0 ){
                        
                        let obj ={};

                        handleDate(data.data.data,{
                            list:[
                                {
                                    key: ['insuredAmount','currentPremium','prem','amount','anp'],
                                    do:fmoney
                                }
                            ]
                        }).forEach(e => {
                            let key = e.typeName;
                            
                            for (var k in self.jsonTap) {
                                
                                if(self.jsonTap[k] == key){
                                    
                                    if(obj[k]){
                                        obj[k].push(e);
                                    }else{
                                        obj[k] =[e];
                                    }
                                    break;

                                }
                                
                            }

                        });

                        // 数据排序 规则rn 加 rn2
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                obj[key] = obj[key].sort( ( a , b) => {
                                    a1 = self.sortNum( [ String(a.productName) , String(a.relationToAppnt) ] );
                                    b1 = self.sortNum( [ String(b.productName) , String(b.relationToAppnt) ] );
                                    if( a1 <= b1 ){
                                        return 1
                                    }
                                    return -1
                                })
                            }
                        }


                        self.showList =obj;

                        let arr = ['a','b','c','d'];
                        for (let index = 0; index < arr.length; index++) {
                            if( arr[index] in obj){
                                self.showTip = arr[index];
                                break;
                            }
                        }
                        
                        self.showMsk = true;

                    }
                })

            },

            /*
             * 排序详情
             * @arr 字段值['一级字段'，'二级字段'] String
             * reutrn 排序权限 数字大，位于前
             */
            sortNum(arr){
                let sort1 = 0;
                let sort2 = 0;
                sort1 = rn.indexOf( arr[0] )*( rn2.length + 2 );
                
                sort2 = rn2.indexOf( arr[1] );

                return sort1 + sort2;
            }

        }
    })

})