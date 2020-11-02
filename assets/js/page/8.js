$('document').ready(function(){

    init();
    
    function init(){
        // pc端添加事件
        pcAdd();
        
        instance.post( url.preDNum ,{ policyAnpOrNum: 'num' } ).then( function( { data } ){

            if( data.statusCode == 0 ){
                
                if(data.data.length==0) return '';

                data.data = handleDate(data.data ,{
                    value(e){return fn(e)},
                    date: fdate
                },{
                    etlDate({k,v}){
                        if( v && !this[ k ] ) this[ k ] = v;
                    }
                })

                setHead(handleDate.export.etlDate)

                // 处理后的结构以及对应表
                let {datas:datas ,key:key} = handle(data.data);
        
                
                if( data.data[0].list.length ){

                    // 总计
                    let tr1 ='<tr class="pink">';
                    let tr2 ='<tr class="row_total">';
                    data.data[0].list.forEach(e => {
                        tr1 += '<th>' + e.date + '</th>';
                        tr2 += '<th>' + e.value + '</th>';
                    })
                    tr1 += '</tr>';
                    tr2 += '</tr>';
                    
                    temTol ='<tr class="pink"><th colspan="'+ data.data[0].list.length +'"></th></tr>' + tr1 +tr2;
                
                    $('table.table_head_g thead').append('<tr class="row_total"><th colspan="3">总计</th></tr>')
                    $('.slide table thead').html(temTol);
                    $('table.table_sw_g thead').append('<tr class="row_total"><th>'+data.data[0].total+'</th></tr>')

                    // 左侧
                    let temL ='';
                    key.forEach( ( e ,i ) => {
                        
                        let tol = datas[ e.name ][ e.list[0] ].tol;
                        let temF =`
                                <tr class="row_xj">
                                    <td rowspan="${datas[e.name].n}" style='background:#fff !important'>${e.name}</td>
                                    <td colspan='2' style='font-weight: bold;'>${tol.branchName}</td>
                                </tr>
                            `;
                        datas[ e.name ][ e.list[0] ].tol = null;

                        e.list.forEach((key ,i1) =>{

                            let data = datas[e.name][key];

                            // 存在小计，并且之前没事具象化
                            if(data.tol){
                                temF +=`
                                    <tr class="row_xj">
                                        <td colspan='2'>${data.tol.branchName}</td>
                                    </tr>
                                `;
                            }

                            data.list.forEach( ( e ,i ) => {
                                if(i==0){
                                    // 第一个城市分行
                                    temF +=`
                                            <tr class="row_fh">
                                                <td rowspan='${data.list.length}'>${e.manageName}</td>
                                                <td>${e.branchName}</td>
                                            </tr>
                                        `;
                                }else{
                                    temF +=`
                                            <tr class="row_fh">
                                                <td>${e.branchName}</td>
                                            </tr>
                                        `;
                                }
                            })

                    })

                    temL+=temF;
                })
                
                    $('.table_head_g tbody').html(temL);

                    // 中间和尾部
                    let temC ='';
                    let temW ='';
                    let first ='';
                    
                    data.data.forEach( (e ,i) =>{
                        if(i == 0) return ;
                        
                        let list = e.list;
                        let str ='';

                        // 首次
                        if( first != e.manageName ){
                            str = '<tr class="row_xj" style="background: rgba(229,229,229,.61);">'
                            first =e.manageName;
                        }else{
                            str = '<tr>'
                        }

                        list.forEach(e =>{
                            str += '<td>' + e.value + '</td>';
                        })
                        str += '</tr>'

                        temC += str;
                        temW += '<tr><td>' + e.total + '</td></tr>';
                        
                    })
                    $('.slide table tbody').html(temC);
                    $('table.table_sw_g tbody').html(temW);
                }
            
                pcAdd();
            }

        })

    }

    function pcAdd(){

        if( IsPC() ){
            startScroll($('.slide_box') ,$('.slideBox'));
        }else{
            $('body').addClass('phone')
        }	

    }
})