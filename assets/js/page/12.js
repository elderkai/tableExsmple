$('document').ready(function(){
    
    instance.post( url.preList ).then( function( { data } ){

        if( data.statusCode == 0 ){

            if( data.data instanceof Array && data.data.length==0)return '';

            if( data.data.code == '401' ){
                alert(data.data.msg);
                return ;
            }

            setHead(data.data[0].etlDate);

            data.data = handleDate(data.data);
            
            if(data.data[0].manageType == '总计'){
                $('thead').append(`
                    <tr class="row_total" style='height: 30px'>
                        <td colspan='2'>${data.data[0].branchName}</td>
                        <td>${data.data[0].userNum}</td>
                        <td>${data.data[0].draftNum}</td>
                        <td>${data.data[0].processNum}</td>
                        <td>${data.data[0].uploadNum}</td>
                        <td>${data.data[0].tosubmitNum}</td>
                        <td>${data.data[0].resubmitNum}</td>
                        <td>${data.data[0].submitedNum}</td>
                        <td>${data.data[0].totalNum}</td>
                    </tr>
                `)
                data.data = data.data.slice(1);
            }

            // 处理后的结构以及对应表
            let {datas:datas ,key:key} = handle([data.data[0] ,...data.data]);
            
            

            let tem ='';
            key.forEach( ( e ,i ) => {
                
                let tol = datas[ e.name ][ e.list[0] ].tol;
                let temF ='';

                e.list.forEach((key ,i1) =>{

                    let data = datas[e.name][key];

                    // 存在小计，并且之前没事具象化
                    if(data.tol){
                        temF +=`
                        <tr class="row_xj">
                            <td colspan='2'>${data.tol.branchName}</td>
                            
                            <td>${data.tol.userNum}</td>
                            <td>${data.tol.draftNum}</td>
                            <td>${data.tol.processNum}</td>
                            <td>${data.tol.uploadNum}</td>
                            <td>${data.tol.tosubmitNum}</td>
                            <td>${data.tol.resubmitNum}</td>
                            <td>${data.tol.submitedNum}</td>
                            <td>${data.tol.totalNum}</td>
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
                                    <td>${e.processNum}</td>
                                    <td>${e.uploadNum}</td>
                                    <td>${e.tosubmitNum}</td>
                                    <td>${e.resubmitNum}</td>
                                    <td>${e.submitedNum}</td>
                                    <td>${e.totalNum}</td>
                                </tr>
                            `;
                        }else{
                            temF +=`
                                <tr class="row_fh">
                                    <td>${e.branchName}</td>
                                    
                                    <td>${e.userNum}</td>
                                    <td>${e.draftNum}</td>
                                    <td>${e.processNum}</td>
                                    <td>${e.uploadNum}</td>
                                    <td>${e.tosubmitNum}</td>
                                    <td>${e.resubmitNum}</td>
                                    <td>${e.submitedNum}</td>
                                    <td>${e.totalNum}</td>
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