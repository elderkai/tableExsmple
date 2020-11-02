$('document').ready(function(){
		
    instance.post( url.list ).then( function( { data } ){

        if( data.statusCode == 0 ){

            if(data.data.length==0) return '';

            // 刷新时间
            setHead(data.data[0].etlDate); 

            data.data = handleDate(data.data);
            
            // 处理后的结构以及对应表
            let {datas:datas ,key:key} = handle(data.data);
            
            // 总计 
            $('thead').append(`
                    <tr class="row_total">
                        <th colspan="3">总计</th>
                        <th>${data.data[0].userNum}</th>
                        <th>${data.data[0].draftNum}</th>
                        <th>${data.data[0].processNum}</th>
                        <th>${data.data[0].uploadNum}</th>
                        <th>${data.data[0].tosubmitNum}</th>
                        <th>${data.data[0].resubmitNum}</th>
                        <th>${data.data[0].submitedNum}</th>
                        <th>${data.data[0].totalNum}</th>
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
                        <td>${tol.processNum}</td>
                        <td>${tol.uploadNum}</td>
                        <td>${tol.tosubmitNum}</td>
                        <td>${tol.resubmitNum}</td>
                        <td>${tol.submitedNum}</td>
                        <td>${tol.totalNum}</td>
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