$('document').ready(function(){

    function tem(data){

        setHead(data.etlDate);

        data = handleDate([data],{
            anpTargetRate(str){
                if( str!==0 && !str ){
                    return '--';
                }
                return str + '%';
            }
        })[0]

        $('thead').append(`
            <tr class="row_total">
                <th colspan="4">总计</th>
                <th>${data.todayPolicyAnp} </th>
                <th>${data.todayPolicyNum} </th>
                <th class="important">${data.cumulativeAnp}</th>
                <th class="important">${data.cumulativeNum} </th>
                <th>${data.anpTarget}</th>
                <th class="important">${data.anpTargetRate}</th>
                <th>${data.cjCumulativeAnp} </th>
                <th>${data.cjCumulativeNum} </th>
                <th>${data.akCumulativeAnp}</th>
                <th>${data.akCumulativeNum}</th>
                <th>${data.jyCumulativeAnp}</th>
                <th>${data.jyCumulativeNum}</th>
            </tr>
        `)
        
        var tem ='';
        data.list.forEach(function(manageTypeBo,m){

            manageTypeBo.list.forEach(function(subtotalBo,s){
                if(s == 0){
                    tem+= `
                    <tr class="" style='background: rgba(48, 189, 247, .1)'>
                        <td rowspan="${manageTypeBo.rowSpan}" class="white lb_bold" style='background: #fff '>${manageTypeBo.manageType}</td>
                        <td>${subtotalBo.manageNameRn}</td>
                        <td colspan="2" class="lb_bold"  style='font-weight: bold;'>${subtotalBo.list[0].manageName}小计</td>
                        <td>${subtotalBo.todayPolicyAnp} </td>
                        <td>${subtotalBo.todayPolicyNum} </td>
                        <td class="important">${subtotalBo.cumulativeAnp} </td>
                        <td class="important">${subtotalBo.cumulativeNum} </td>
                        <td>${subtotalBo.anpTarget} </td>
                        <td class="important">${subtotalBo.anpTargetRate} </td>
                        <td>${subtotalBo.cjCumulativeAnp} </td>
                        <td>${subtotalBo.cjCumulativeNum} </td>
                        <td>${subtotalBo.akCumulativeAnp} </td>
                        <td>${subtotalBo.akCumulativeNum} </td>
                        <td>${subtotalBo.jyCumulativeAnp}</td>
                        <td>${subtotalBo.jyCumulativeNum}</td>
                    </tr>
                    `
                }else{
                    tem+= `
                        <tr class="" style='background: rgba(48, 189, 247, .1)'>
                            <td>${subtotalBo.manageNameRn}</td>
                            <td colspan="2" class="lb_bold"  style='font-weight: bold;'>${subtotalBo.list[0].manageName}小计</td>
                            <td>${subtotalBo.todayPolicyAnp} </td>
                            <td>${subtotalBo.todayPolicyNum} </td>
                            <td class="important">${subtotalBo.cumulativeAnp} </td>
                            <td class="important">${subtotalBo.cumulativeNum} </td>
                            <td>${subtotalBo.anpTarget} </td>
                            <td class="important">${subtotalBo.anpTargetRate} </td>
                            <td>${subtotalBo.cjCumulativeAnp} </td>
                            <td>${subtotalBo.cjCumulativeNum} </td>
                            <td>${subtotalBo.akCumulativeAnp} </td>
                            <td>${subtotalBo.akCumulativeNum} </td>
                            <td>${subtotalBo.jyCumulativeAnp}</td>
                            <td>${subtotalBo.jyCumulativeNum}</td>
                        </tr>
                    `;
                }
                
                subtotalBo.list.forEach(function(branchBo ,b){
                    if(b == 0){
                        tem +=`
                            <tr class="row_fh">
                                <td rowspan="${subtotalBo.list.length}" colspan="2">${branchBo.manageName}</td>
                                <td>${branchBo.firstBranch}</td>
                                <td>${branchBo.todayPolicyAnp} </td>
                                <td>${branchBo.todayPolicyNum} </td>
                                <td class="important">${branchBo.cumulativeAnp} </td>
                                <td class="important">${branchBo.cumulativeNum} </td>
                                <td rowspan="${subtotalBo.list.length}" colspan="2"></td>
                                <td>${branchBo.cjCumulativeAnp} </td>
                                <td>${branchBo.cjCumulativeNum} </td>
                                <td>${branchBo.akCumulativeAnp} </td>
                                <td>${branchBo.akCumulativeNum} </td>
                                <td>${branchBo.jyCumulativeAnp} </td>
                                <td>${branchBo.jyCumulativeNum}</td>
                            </tr>
                        `
                    }else{
                        tem +=`
                            <tr class="row_fh">
                                <td>${branchBo.firstBranch}</td>
                                <td>${branchBo.todayPolicyAnp} </td>
                                <td>${branchBo.todayPolicyNum} </td>
                                <td class="important">${branchBo.cumulativeAnp} </td>
                                <td class="important">${branchBo.cumulativeNum} </td>
                                <td>${branchBo.cjCumulativeAnp} </td>
                                <td>${branchBo.cjCumulativeNum} </td>
                                <td>${branchBo.akCumulativeAnp} </td>
                                <td>${branchBo.akCumulativeNum} </td>
                                <td>${branchBo.jyCumulativeAnp} </td>
                                <td>${branchBo.jyCumulativeNum}</td>
                            </tr>
                        `
                    }
                })
            })

        })

        $('tbody').html(tem);
    }

    instance.post(url.queryTotalityPerformanceDispark).then( ( {status ,data }) =>{

        if( data.statusCode == 0){

            tem(data.data);

        }


    }) 
      
})
	
