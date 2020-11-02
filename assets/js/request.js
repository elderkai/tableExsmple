const baseURL  = 'https://hms-uat.test-cignacmb.com/gims_server';
let url = {
    allotRecord: '/cmb/allotRecord', // 已分配列表查询
    querySalesmanList: '/cmb/querySalesmanList', // 查询销售人员
    allot: '/cmb/allot', // 分配已经批量分配
    queryStayAllotClientList: '/cmb/queryStayAllotClientList', // 待分配客户列表
    queryNationwidePerformance: '/cmb/report/queryNationwidePerformance',  // 全国业绩-预投保
    queryNationwidePerformanceDispark: '/cmb/report/queryNationwidePerformanceDispark',  // 全国业绩-开放期
    queryTotalityPerformance: '/cmb/report/queryTotalityPerformance', // 总体业绩追踪-预投保
    queryTotalityPerformanceDispark: '/cmb/report/queryTotalityPerformanceDispark', // 总体业绩追踪-开放期
    queryNationwidePreCast: '/cmb/report/queryNationwidePreCast', // 总体业绩追踪分析-开放期

    list: '/cmb/report/preFollowTasks/list', // 全国待跟进任务-预投保
    openList: '/cmb/report/openFollowTasks/list', // 全国待跟进任务-开放期
    
    preList: '/cmb/report/preOrganFollowTasks/list', // 机构待跟进任务_预投保
    openPreList: '/cmb/report/openOrganFollowTasks/list', // 机构待跟进任务_开放期
    
    reDList: '/cmb/report/preDailyAnpChange/list', // 每日ANP变化（预投保）
    openDList: '/cmb/report/openDailyAnpChange/list', // 每日ANP变化（开放期）

    preDNum: '/cmb/report/preDailyNumChange/list', //每日件数变化（预投保）
    openDNum: '/cmb/report/openDailyNumChange/list', //每日件数变化（开放）
    
    queryMyClients: '/cmb/report/queryMyClients', // 我的客户-预投吧
    queryMyClientsDispark: '/cmb/report/queryMyClientsDispark', // 我的客户-开放期
    queryMyClientsDetails: '/cmb/report/queryMyClientsDetails', // 我的客户详情页

    preUnallocated: '/cmb/preUnallocated', // 待分配客户汇总_预投保
    openUnallocated: '/cmb/openUnallocated', // 待分配客户汇总_开放期
}

let tipOpen = true;


let token ='c77232e289c60e7183570036f9dcc554';

// 获取token
if( localStorage.getItem('token') ){
    token = localStorage.getItem('token');
}
window.location.search.replace('?','').split('&').forEach(e =>{
    let arr = e.split('=');
    if( arr[0] == 'token' ){
        token = arr[1]
    }
})

const instance = axios.create({
    baseURL:baseURL ,
    imeout: 3000,
    headers: {
        token: token
    }
});

//  请求拦截，设置情切
instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 请求响应拦截
instance.interceptors.response.use(function (response) { 
    if( response.data.statusCode != '0' && tipOpen){
        alert(response.data.msg);
    }
    return response

}, function (error) { 

    if(tipOpen) alert(error);
    return Promise.reject(error)

})
