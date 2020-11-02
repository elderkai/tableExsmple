let cusJson = {
    0:'草稿',
    2:'待上传',
    3:'人脸识别成功',
    4:'待提交',
    5:'已撤单',
    6:'已提交',
    8:'待支付',
    9:'待划款',
    10:'已完成'
};

window.onload = function(){
   
    layui.use(['layer', 'form', 'table'], function() {

        let layer = layui.layer;
        let form = layui.form;
        let table = layui.table;
        let laypage = layui.laypage;
        let $ = layui.$
        // 初始化主表
        table.render({
                elem: '#test',
                url: baseURL + url.allotRecord, // 接口
                method: 'post',
                headers: {
                    token: token,
                    "Content-Type": "application/json"
                },
                requestType: 'json',
                limits: [10,20,30],
                cols: [
                    [{
                        field: 'id',
                        title: '序号',
                        width: 130,
                    }, {
                        field: 'customerStatus',
                        title: '客户状态',
                        width: 110,
                        templet(e){
                            // return cusJson[e.customerStatus] ? cusJson[e.customerStatus] : ''
                            return e.customerStatus ? e.customerStatus : ''
                        }
                    }, {
                        field: 'organizationName',
                        title: '机构',
                        width: 130,
                        templet(e){
                            return fn(e.organizationName)
                        }
                    }, {
                        field: 'employeeName',
                        title: '行员姓名',
                        width: 110,
                        templet(e){
                            return fn(e.employeeName)
                        }
                    }, {
                        field: 'branchName',
                        title: '所属分行',
                        templet(e){
                            return fn(e.branchName)
                        }
                    }, {
                        field: 'orderNum',
                        title: '待跟进订单',
                        width: 130,
                        templet(e){
                            return fn(e.orderNum)
                        }
                    }, {
                        field: 'orderAmount',
                        title: '待跟进保额',
                        width: 130,
                        templet: function(d) {
                            return fmoney(d.orderAmount)
                        }
                    }, {
                        field: 'followUpAnp',
                        title: '待跟进ANP',
                        width: 130,
                        templet: function(d) {
                            return fmoney(d.followUpAnp)
                        }
                    }, {
                        field: 'agentName',
                        title: '跟进人员',
                        width: 130,
                        templet(e){
                            return fn(e.agentName)
                        }

                    }, {
                        field: 'followTime',
                        title: '分配时间',
                        templet(e){
                            return fn(e.followTime)
                        }
                    }]
                ],
                data: [{
                    "id": "13929180637", //员工号
                    "organizationName": "", //机构
                    "allocation": "待分配",
                    "customerStatusDesc": "待重新提交", //客户状态 这里将orderStatus订单状态进行处理返回状态中文
                    "organizationId": "hb", //机构ID
                    "employeeName": "张三", // 行员姓名
                    "bankName": "深圳分行", //所属分行
                    "orderNum": 52, //订单数量
                    "amount": 100, //待跟进保额 (单位:万)
                    "followUpAnp": 10000 // 待跟进ANP (单位:元)
                }],
                page: true
        });
    }); 

}