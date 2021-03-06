$('document').ready(function(){
    
    instance.post( url.openPreList ).then( function( { data } ){

        if( data.statusCode == 0 ){
            
            if( data.data instanceof Array && data.data.length==0) return '';

            if( data.data.code == '401' ){
                alert(data.data.msg);
                return ;
            }
            
            data.data = handleDate(data.data);

            setHead(data.data[0].etlDate);
            
            if(data.data[0].manageType == '总计'){

                $('thead').append(`
                    <tr class="row_total" style='height: 30px'>
                        <td colspan='2'>${data.data[0].branchName}</td>
                        
                        <td>${data.data[0].userNum}</td>
                        <td>${data.data[0].draftNum}</td>
                        <td>${data.data[0].orderPendNum}</td>
                        <td>${data.data[0].orderUploadNum}</td>
                        <td>${data.data[0].orderCommitNum}</td>
                        <td>${data.data[0].againCommitNum}</td>
                        <td>${data.data[0].underwritNum}</td>
                        <td>${data.data[0].orderOpenNum}</td>
                        <td>${data.data[0].orderNochangeNum}</td>
                        <td>${data.data[0].orderFollowNum}</td>
                    </tr>
                `)
                data.data = data.data.slice(1);
                
            }

            // 处理后的结构以及对应表
            let {datas:datas ,key:key} = handle([data.data[0] ,...data.data]);

            let tem ='';
            key.forEach( ( e ,i ) => {

                // if(i ==0) return '';
                
                let tol = datas[ e.name ][ e.list[0] ].tol;

                // 机构头
                let temF ='';
                // datas[ e.name ][ e.list[0] ].tol = null;

                e.list.forEach((key ,i1) =>{

                    let data = datas[e.name][key];

                    // 存在小计，并且之前没事具象化
                    if(data.tol){
                        temF +=`
                        <tr class="row_xj">
                            <td colspan='2'>${data.tol.branchName}</td>
                            
                            <td>${data.tol.userNum}</td>
                            <td>${data.tol.draftNum}</td>
                            <td>${data.tol.orderPendNum}</td>
                            <td>${data.tol.orderUploadNum}</td>
                            <td>${data.tol.orderCommitNum}</td>
                            <td>${data.tol.againCommitNum}</td>
                            <td>${data.tol.underwritNum}</td>
                            <td>${data.tol.orderOpenNum}</td>
                            <td>${data.tol.orderNochangeNum}</td>
                            <td>${data.tol.orderFollowNum}</td>
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
                                    
                                    <td>${e.userNum}</td>
                                    <td>${e.draftNum}</td>
                                    <td>${e.orderPendNum}</td>
                                    <td>${e.orderUploadNum}</td>
                                    <td>${e.orderCommitNum}</td>
                                    <td>${e.againCommitNum}</td>
                                    <td>${e.underwritNum}</td>
                                    <td>${e.orderOpenNum}</td>
                                    <td>${e.orderNochangeNum}</td>
                                    <td>${e.orderFollowNum}</td>
                                </tr>
                            `;
                        }else{
                            temF +=`
                                <tr class="row_fh">
                                    <td>${e.branchName}</td>
                                    
                                    <td>${e.userNum}</td>
                                    <td>${e.draftNum}</td>
                                    <td>${e.orderPendNum}</td>
                                    <td>${e.orderUploadNum}</td>
                                    <td>${e.orderCommitNum}</td>
                                    <td>${e.againCommitNum}</td>
                                    <td>${e.underwritNum}</td>
                                    <td>${e.orderOpenNum}</td>
                                    <td>${e.orderNochangeNum}</td>
                                    <td>${e.orderFollowNum}</td>
                                </tr>
                            `;
                        }
                    })

                })

                tem+=temF;
            })
            
            $('tbody').html(tem);

        }

    })
    
})