$('document').ready(function(){

    function tem(data){

        setHead(data.etlDate);

        data = handleDate([data],{
            list: [
                {
                    key: ['anpTargetRate','totalChangeAnpRate'],
                    do(str){if( str!==0 && !str ){return '--';}return str + '%';}
                }
            ]
        })[0]

        $('thead').append(`
            <tr class="row_total">
                <th colspan="3">总计</th>
                <th>${data.todayPolicyAnp}</th>
                <th>${data.cumulativeAnp}</th>
                <th>${data.anpTargetRate}</th>
                <th>${data.followOrderNum}</th>
                <th>${data.totalChangeAnpRate}</th>
            </tr>
        `)

        var tem ='';
        data.list.forEach(function(manageTypeBo,m){

            manageTypeBo.list.forEach(function(subtotalBo,s){
                if(s == 0){
                    tem+= `
                    <tr class="" style='background: #fff'>
                        <td rowspan="${manageTypeBo.list.length}">${manageTypeBo.manageType}</td>
                        <td>${subtotalBo.manageNameRn}</td>
                        <td colspan="1">${subtotalBo.list[0].manageName}</td>
                        <td>${subtotalBo.todayPolicyAnp}</td>
                        <td>${subtotalBo.cumulativeAnp}</td>
                        <td>${subtotalBo.anpTargetRate}</td>
                        <td>${subtotalBo.followOrderNum}</td>
                        <td>${subtotalBo.totalChangeAnpRate}</td>
                    </tr>
                    `
                }else{
                    tem+= `
                        <tr class="">
                            <td>${subtotalBo.manageNameRn}</td>
                            <td colspan="1">${subtotalBo.list[0].manageName}</td>
                            <td>${subtotalBo.todayPolicyAnp}</td>
                            <td>${subtotalBo.cumulativeAnp}</td>
                            <td>${subtotalBo.anpTargetRate}</td>
                            <td>${subtotalBo.followOrderNum}</td>
                            <td>${subtotalBo.totalChangeAnpRate}</td>
                        </tr>
                    `;
                }
                
            })
        })

        $('tbody').html(tem);
    }
    
    instance.post(url.queryNationwidePerformanceDispark).then( ( {status ,data }) =>{

        if( data.statusCode == 0){

            
            tem(data.data);

        }

    })

})