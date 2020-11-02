// 获取父页面对象
function child(data) {

    console.log(data); // 值传递
    let open = false; // 非总行或者信用卡
    data.forEach( e => {
        if( /(总行|信用卡)/.test(e.bankName) ){ 
            open = true;
        }
    })

    layui.use(['jquery', 'layer', 'form', 'table'], function() {
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage;

        if( !open ) $('.showC2').fadeOut(); // 非 总行或者信用卡 不显示

        form.on('submit(formDemo)', function(data) {
            layer.msg(JSON.stringify(data.field));
            return false;
        });

        //表格
        table.render({
            elem: '#test',
            cols: [
                [{
                    field: 'id',
                    title: '序号',
                    width: 150
                }, {
                    field: 'customerStatus',
                    title: '分配状态',
                    width: 120,
                    templet: function(d) {
                        if (!d.agentCode) {
                            return '待分配'
                        } else {
                            return '已分配'
                        }
                    }
                }, {
                    field: 'customerStatusDesc',
                    title: '客户状态',
                    width: 100,
                    templet: function(d){
                        return fn(d.customerStatusDesc)
                    }
                }, {
                    field: 'organizationName',
                    title: '机构',
                    width: 130,
                    templet: function(d){
                        return fn(d.organizationName)
                    }
                }, {
                    field: 'employeeName',
                    title: '行员姓名',
                    width: 110,
                    templet: function(d){
                        return fn(d.employeeName)
                    }
                }, {
                    field: 'bankName',
                    title: '所属分行',
                    templet: function(d){
                        return fn(d.bankName)
                    }
                }, {
                    field: 'orderNum',
                    title: '待跟进订单',
                    templet: function(d){
                        return fn(d.orderNum)
                    }
                }, {
                    field: 'amount',
                    title: '待跟进保额',
                    templet: function(d) {
                        return fmoney(d.amount)
                    }
                }, {
                    field: 'anp',
                    title: '待跟进ANP',
                    templet: function(d) {
                        return fmoney(d.anp)
                    }
                }]
            ],
            data: [...data],
            limit: [50]
        });

        // 下拉
        Object.keys(jsonWhere).forEach(k => {
            $('#c1').append("<option value=" + k + "> " + k + "</option>");
        })
        if (jsonWhere[Object.keys(jsonWhere)[0]]) {
            jsonWhere[Object.keys(jsonWhere)[0]].forEach(e => {
                $('#c2').append("<option value=" + e + "> " + e + "</option>");
            })
        }
        form.render("select");

        form.on('select(c1)', function(data) {
            $('#c2').html('');
            if (data.value) {
                $('#c2').append("<option value=''>请输入或选择分配城市</option>");
                if (jsonWhere[data.value]) {
                    jsonWhere[data.value].forEach(e => {
                        $('#c2').append("<option value=" + e + "> " + e + "</option>");
                    })
                }
                form.render("select");
            }
        })
        form.on('select(c2)', function(data) {

            if (!$('#c1 option:selected').val()) {
                layer.alert('请先选择机构');
                $('#c2').find('option')[0].selected = true;
                form.render("select");
            }

        })


        $('#post').on('click', function() {
            let c1 = $('#c1 option:selected').val();
            let c2 = $('#c2 option:selected').val();
            if (!c1) {
                layer.alert('请先选择分配机构');
                return '';
            }
            if ( !c2 && open ) { // 如果有总行或信用卡，启动提醒选择城市
                layer.alert('请先选择分配城市');
                return '';
            }
            let body = [];
            data.forEach(function(e) {

                delete e.id;
                delete e.agentName;
                delete e.agentCode;

                let oDate = {
                    employeeNumber: e.employeeNumber,
                    branchCode: c1,
                    // appletsCity: c2,
                    gisAllotRecord: {
                        ...e,
                        organizationName: c1,
                        branchCode: c1,
                        // appletsCity: c2,
                        branchName: e.bankName,
                        orderAmount: e.amount,
                        followUpAnp: e.anp,
                        customerStatus: e.customerStatusDesc
                    }
                }
                
                if( !open ){
                    oDate.appletsCity = c2;
                    oDate.gisAllotRecord.appletsCity = c2;
                }

                body.push(oDate);
            })

            instance.post(url.allot, {
                gisUserNews: body
            }).then(({
                status,
                data
            }) => {

                if (data.statusCode == 0) {

                    layer.confirm('分配成功', {
                        btn: ['确定'] //按钮
                    }, function(index) {

                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.relead()

                    });

                } else {

                    layer.alert(data.msg);

                }


            })
        })
    });
    
}