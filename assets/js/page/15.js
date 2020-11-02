let cusStart = [
    ["", '请选择客户状态'],
    ["-1", '浏览'],
    ["0", '草稿'],
    ["1", '待处理'],
    ["2", '待上传'],
    ["4", '待提交'],
    ["5", '待重新提交'],
    ["6", '核保中'],
    ["9", '待确认供款方案'],
    ["10", '已完成']
]

let rel =null;

function relead(){
    if(rel) rel();
}

window.onload = function(){

    layui.use( ['jquery', 'layer', 'form', 'table', 'laypage'] , function() {

        let layer = layui.layer;
        let form = layui.form;
        let table = layui.table;
        let laypage = layui.laypage;
        let $ = layui.$;
        let whereQ = {};

        rel = function(){
            table.reload('test', {
                page: {
                    curr: 1
                },
                where: whereQ
            },'data')
        }

        // 获取销售人员列表
        let saleList =[];
        instance.post(url.querySalesmanList).then(({data}) =>{
            if( data.statusCode == 0){
                        
                saleList = data.data;
                addSaleList(saleList);

            }else{

                layer.confirm('销售人员加载失败,是否重新加载', {
                    btn: ['确定' ,'否'] //按钮
                },function(index){

                    instance.post(url.querySalesmanList).then(({data}) =>{
                        if( data.statusCode == 0){
                                    
                            saleList = data.data;
                            addSaleList(saleList);

                        }
                    })
                    layer.close(index); 
                    
                });

            }

        })

        // 加工销售人员的列表
        function addSaleList(arr){
            
            let tem ='';
            arr.forEach(e =>{
                tem += '<option value="'+ e.employeeNumber +'" data-name="'+e.employeeName+'"> '+ ( e.employeeNumber + ' - ' + e.employeeName +' - '+ e.orderNum) +'</option>';
            })

            $('.agentCode').append(tem);
            form.render('select');

        }

        // 初始化主表
        table.render({
            elem: '#test',
            url: baseURL + url.queryStayAllotClientList, // 接口
            method: 'post',
            headers: {
                token: token
            },
            cols: [
                [{
                    type: 'checkbox',
                    width: 30
                },{
                    field: 'id',
                    title: '序号',
                    width: 150,
                    templet: function(d){
                        return fn(d.id)
                    }
                },{
                    field: 'agentCode',
                    title: '分配状态',
                    width: 120,
                    templet: function(d) {
                        if ( !d.agentCode ) {
                            return '待分配'
                        } else {
                            return '已分配'
                        }
                    }
                },{
                    field: 'customerStatusDesc',
                    title: '客户状态',
                    width: 100,
                    templet: function(d){
                        return fn(d.customerStatusDesc)
                    }
                },{
                    field: 'organizationName',
                    title: '机构',
                    width: 130,
                    templet: function(d){
                        return fn(d.organizationName)
                    }
                },{
                    field: 'employeeName',
                    title: '行员姓名',
                    width: 110,
                    templet: function(d){
                        return fn(d.employeeName)
                    }
                },{
                    field: 'bankName',
                    title: '所属分行',
                    templet: function(d){
                        return fn(d.bankName)
                    }
                },{
                    field: 'orderNum',
                    title: '待跟进订单',
                    templet: function(d){
                        return fn(d.orderNum)
                    }
                },{
                    field: 'amount',
                    title: '待跟进保额',
                    templet: function(d) {
                        return fmoney(d.amount)
                    }
                },{
                    field: 'anp',
                    title: '待跟进ANP',
                    width: 130,
                    templet: function(d) {
                        return fmoney(d.anp)
                    }
                },{
                    field: 'agentCode',
                    width: 200,
                    title: '分配销售',
                    templet: function(d) {
                        let mr = '请选择分配销售';

                        if(d.agentCode){
                            mr = d.agentName?d.agentName:d.agentCode;
                        }
                        
                        if(saleList.length){
                            let tem =''; 
                            saleList.forEach(e =>{
                                tem += '<option value="'+ e.employeeNumber +'" data-name="'+e.employeeName+'"> '+ ( e.employeeNumber + '-' + e.employeeName +'-'+ e.orderNum) +'</option>';
                            })
                            return '<select name="agentCode" class="agentCode" lay-filter="tableSelect" lay-verify=" " data-value=""><option value="">'+mr+'</option>'+tem+'</select>'

                        }else{

                            return '<select name="agentCode" class="agentCode" lay-filter="tableSelect" lay-verify=" " data-value=""><option value="">'+mr+'</option></select>'

                        }

                    }
                }]
            ],
            data: [{
                    "id": "13929180637", //员工号
                    "organizationName": "呼和浩特中国", //机构
                    "allocation": "待分配",
                    "customerStatusDesc": "待重新提交", //客户状态 这里将orderStatus订单状态进行处理返回状态中文
                    "organizationId": "呼和浩特中国", //机构ID
                    "employeeName": "张三", // 行员姓名
                    "bankName": "呼和浩特中国sdf深圳分行", //所属分行
                    "orderNum": 52, //订单数量
                    "amount": 100, //待跟进保额 (单位:万)
                    "ANP": 10000 // 待跟进ANP (单位:元)
                }
            ],
            page: true,
            limits: [10,20,30],
            done: function (res) {
                this.where = whereQ;

                // console.log(res.cmbFlag ='open')

                // 客户状态动态变化
                var selectVal = $('#customerStatus option:selected').val();
                var arr = res.cmbFlag == 'open' ? cusStart : cusStart.slice(0 ,cusStart.length-1);
                var tem = '';

                arr.forEach(function(e){
                    // 原来选中的
                    if(e[0] == selectVal){
                        tem += '<option value="'+e[0]+'" selected>'+e[1]+'</option>';
                    }else{
                        tem += '<option value="'+e[0]+'">'+e[1]+'</option>';
                    }
                })
                $('#customerStatus').html(tem);
                form.render("select");

            }
        });

        // 下拉框 -> 所属分行

        Object.keys(jsonBranch).forEach(k => {
            $('#bankCode').append("<option disabled> "+k+"</option>");
            jsonBranch[k].forEach(e =>{
                $('#bankCode').append("<option value='"+ e +"'> "+ e +"</option>");
            })
        })
        form.render("select"); // 刷新下拉
        
        // 表格分配下拉分配客服
        let dataAll =Object.create(null);
        table.on('row(allotCus)', function(obj){

            // 设置当前行的数据
            dataAll = obj.data;

        });
        form.on('select(tableSelect)', function(e) {

            if(!e.value) return '';

            layer.confirm('是否分配给该销售', {
                btn: ['是', '否'] //按钮
            }, function() {

                var name = $(e.elem[e.elem.selectedIndex]).eq(0).data('name');

                delete dataAll.id;

                instance.post(url.allot ,{
                    gisUserNews: [{
                        employeeNumber: dataAll.employeeNumber,
                        agentCode: e.value,
                        agentName: name,
                        gisAllotRecord: {
                            ...dataAll,
                            agentName: name,
                            branchName: dataAll.bankName,
                            orderAmount: dataAll.amount,
                            followUpAnp: dataAll.anp,
                            customerStatus: dataAll.customerStatusDesc

                        }
                    }]
                }).then( ( {status ,data }) =>{

                    if( data.statusCode == 0){

                        layer.alert('分配成功');
                        table.reload('test', {
                            page: {
                                curr: 1
                            },
                            where: whereQ
                        },'data')

                    }else{

                        layer.alert(data.msg);

                    }

                })
                
            }, function() {

                // 不分配
                $(e.elem).find('option')[0].selected =true;
                form.render("select");

            });

        });

        // 搜索按钮事件
        $('#seach').on('click', function() {

            let whereData ={
                allocation : $('#allocation option:selected').val(),
                customerStatus: $('#customerStatus option:selected').val(),
                bankName: $('#bankCode option:selected').val()
            };

            whereQ = whereData;

            table.reload('test', {
                page: {
                    curr: 1
                },
                where: whereQ
            },'data')
        });

        // 取消事件
        $('#cancel').on('click' ,function(data){
            $('#allocation').find('option')[0].selected =true;
            $('#customerStatus').find('option')[0].selected =true;
            $('#bankCode').find('option')[0].selected =true;
            whereQ = {};
            form.render("select");
        })

        //弹出层
        $('#plfpxs').click(function() {

            var data = table.checkStatus('test').data;
            
            if(data.length){

                var index = layer.open({
                    type: 2,
                    title: '请确认分配情况',
                    content: ['15.1.html?token='+token, 'no'],
                    maxmin: true,
                    success(lay ,index){
                        let iframe = window['layui-layer-iframe'+index];
                        iframe.child(data);
                    }
                });
                layer.full(index);

            }else{
                alert('请选择操作对象');
            }
            
        });

        $('#plfpjg').click(function() {
            var data = table.checkStatus('test').data;

            if(data.length){

                var index = layer.open({
                    type: 2,
                    title: '请确认分配情况',
                    content: ['15.2.html?token='+token, 'no'],
                    maxmin: true,
                    success(lay ,index){
                        let iframe = window['layui-layer-iframe'+index];
                        iframe.child({data:data ,saleList:saleList})
                    }
                });
                layer.full(index);

            }else{
                alert('请选择操作对象');
            }
        });

        // 已分配清单
        $('#look').click(function() {

            var index = layer.open({
                type: 2,
                title: '已分配清单',
                content: ['15_1.html?token='+token, 'no'],
                btn: ['确定'],
                maxmin: true
            });
            layer.full(index);

        });
    }); 

}