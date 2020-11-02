$('document').ready(function(){
   		
    instance.post( url.openList ).then( function( { data } ){

        if( data.statusCode == 0 ){

            if(data.data.length==0)return '';

            data.data = handleDate(data.data);

            // 处理后的结构以及对应表
            let {datas:datas ,key:key} = handle(data.data);

            // 刷新时间
            setHead(data.data[0].etlDate);
            
            // 总计 
            $('thead').append(`
                    <tr class="row_total">
                        <th colspan="3">总计</th>
                        <th>${data.data[0].userNum}</th>
                        <th>${data.data[0].draftNum}</th>
                        <th>${data.data[0].orderPendNum}</th>
                        <th>${data.data[0].orderUploadNum}</th>
                        <th>${data.data[0].orderCommitNum}</th>
                        <th>${data.data[0].againCommitNum}</th>
                        <th>${data.data[0].underwritNum}</th>
                        <th>${data.data[0].orderOpenNum}</th>
                        <th>${data.data[0].orderNochangeNum}</th>
                        <th>${data.data[0].orderFollowNum}</th>
                    </tr>
                `);

            let tem ='';
            key.forEach( ( e ,i ) => {
                
                let tol = datas[ e.name ][ e.list[0] ].tol;

                // 机构头
                let temF =`
                    <tr class="row_jg">
                        <td rowspan="${datas[e.name].n}">${e.name}</td>
                        <td colspan='2'>${tol.branchName}</td>
                        
                        <td>${tol.userNum}</td>
                        <td>${tol.draftNum}</td>
                        <td>${tol.orderPendNum}</td>
                        <td>${tol.orderUploadNum}</td>
                        <td>${tol.orderCommitNum}</td>
                        <td>${tol.againCommitNum}</td>
                        <td>${tol.underwritNum}</td>
                        <td>${tol.orderOpenNum}</td>
                        <td>${tol.orderNochangeNum}</td>
                        <td>${tol.orderFollowNum}</td>
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