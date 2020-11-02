function child(obj){

    var data = obj.data;
    var saleList = obj.saleList;

    layui.use(['layer', 'form', 'table'], function() {
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage;

        form.render();
        form.on('submit(formDemo)', function(data) {
            layer.msg(JSON.stringify(data.field));
            return false;
        });

        // 销售人员列表
        var tem ='<option value="">请选择分配销售</option>';
        saleList.forEach(e =>{
            tem += '<option value="'+ e.employeeNumber +'" data-name="'+e.employeeName+'"> '+ ( e.employeeNumber + ' - ' + e.employeeName +' - '+ e.orderNum) +'</option>';
        })
        $('#saleList').append(tem);
        form.render('select');

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
                    templet: function(d) {
                        return fn(d.customerStatusDesc)
                    }
                }, {
                    field: 'organizationName',
                    title: '机构',
                    width: 130,
                    templet: function(d) {
                        return fn(d.organizationName)
                    }
                }, {
                    field: 'employeeName',
                    title: '行员姓名',
                    width: 110,
                    templet: function(d) {
                        return fn(d.employeeName)
                    }
                }, {
                    field: 'bankName',
                    title: '所属分行',
                    templet: function(d) {
                        return fn(d.bankName)
                    }
                }, {
                    field: 'orderNum',
                    title: '待跟进订单',
                    templet: function(d) {
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
        let name ='';
        form.on('select(saleList)', function(e) {
            name = $(e.elem[e.elem.selectedIndex]).eq(0).data('name');
        })

        $('#post').on('click' ,function(){
            let sale = $('#saleList option:selected').val();
            if( !sale ){
                layer.alert('请先选择分配销售');
                return '';
            }
            
            let body = [];
            data.forEach( function(e) {
                delete e.id;
                body.push(
                    {
                        employeeNumber: e.employeeNumber,
                        agentCode: sale,
                        agentName: name,
                        gisAllotRecord: {
                            ...e,
                            agentName: name,
                            branchName: e.bankName,
                            orderAmount: e.amount,
                            followUpAnp: e.anp,
                            customerStatus: e.customerStatusDesc
                        }
                    }
                )
            })
            instance.post(url.allot ,{
                gisUserNews: body
            }).then( ( {status ,data }) =>{

                if( data.statusCode == 0){
                    
                    layer.confirm('分配成功', {
                        btn: ['确定'] //按钮
                    },function(index){

                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.relead()
                        
                    });

                }else{

                    layer.alert(data.msg);

                }


            })
        })
    
    });

}