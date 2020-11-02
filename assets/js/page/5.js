$('document').ready(function(){
 
    function tem(data){

        setHead(data.etlDate);

        data = handleDate([data],{
            anpTargetRate(str){if( str!==0 && !str ){return '--';}return str + '%';},
            totalChangeNumRate(str){if( str!==0 && !str ){return '--';}return str + '%';},
            totalChangeAnpRate(str){if( str!==0 && !str ){return '--';}return str + '%';},
            totalOpenNumRate(str){if( str!==0 && !str ){return '--';}return str + '%';},
            totalOpenAnpRate(str){if( str!==0 && !str ){return '--';}return str + '%';}
        })[0]

        $('thead').append(`
            <tr class="row_total">
                <th colspan="4">总计</th>
                <th class="important">${data.cumulativeAnp} </th>
                <th class="important">${data.cumulativeNum}</th>
                <th>${data.anpTarget}</th>
                <th class="important">${data.anpTargetRate} </th>
                <th>${data.followOrderAnp}</th>
                <th>${data.followOrderNum}</th>
                <th class="bluelp">${data.orderChangeNum} </th>
                <th class="bluelp">${data.orderChangeAnp} </th>
                <th>${data.totalInsureNum}</th>
                <th class="bluelp">${data.totalChangeNumRate}</th>
                <th>${data.totalInsureAnp}</th>
                <th class="bluelp">${data.totalChangeAnpRate}</th>
                <th>${data.totalOpenNumRate}</th>
                <th>${data.totalOpenAnpRate}</th>
            </tr>
        `)
        
        var tem ='';
        data.list.forEach(function(manageTypeBo,m){

            manageTypeBo.list.forEach(function(subtotalBo,s){
                if(s == 0){
                    tem+= `
                    <tr class="" style='background: #fff'>
                        <td rowspan="${manageTypeBo.rowSpan}">${manageTypeBo.manageType}</td>
                        <td>${subtotalBo.manageNameRn}</td>
                        <td colspan="2" class="lb_bold" style='font-weight: bold;'>${subtotalBo.list[0].manageName}小计</td>
                        <td class="important">${subtotalBo.cumulativeAnp} </td>
                        <td class="important">${subtotalBo.cumulativeNum}</td>
                        <td>${subtotalBo.anpTarget}</td>
                        <td class="important">${subtotalBo.anpTargetRate} </td>
                        <td>${subtotalBo.followOrderAnp}</td>
                        <td>${subtotalBo.followOrderNum}</td>
                        <td class="bluelp">${subtotalBo.orderChangeNum} </td>
                        <td class="bluelp">${subtotalBo.orderChangeAnp} </td>
                        <td>${subtotalBo.totalInsureNum}</td>
                        <td class="bluelp">${subtotalBo.totalChangeNumRate}</td>
                        <td>${subtotalBo.totalInsureAnp}</td>
                        <td class="bluelp">${subtotalBo.totalChangeAnpRate}</td>
                        <td>${subtotalBo.totalOpenNumRate}</td>
                        <td>${subtotalBo.totalOpenAnpRate}</td>
                    </tr>
                    `
                }else{
                    tem+= `
                        <tr class="">
                            <td>${subtotalBo.manageNameRn}</td>
                            <td colspan="2" class="lb_bold"  style='font-weight: bold;'>${subtotalBo.list[0].manageName}小计</td>
                            <td class="important">${subtotalBo.cumulativeAnp} </td>
                            <td class="important">${subtotalBo.cumulativeNum}</td>
                            <td>${subtotalBo.anpTarget}</td>
                            <td class="important">${subtotalBo.anpTargetRate} </td>
                            <td>${subtotalBo.followOrderAnp}</td>
                            <td>${subtotalBo.followOrderNum}</td>
                            <td class="bluelp">${subtotalBo.orderChangeNum} </td>
                            <td class="bluelp">${subtotalBo.orderChangeAnp} </td>
                            <td>${subtotalBo.totalInsureNum}</td>
                            <td class="bluelp">${subtotalBo.totalChangeNumRate}</td>
                            <td>${subtotalBo.totalInsureAnp}</td>
                            <td class="bluelp">${subtotalBo.totalChangeAnpRate}</td>
                            <td>${subtotalBo.totalOpenNumRate}</td>
                            <td>${subtotalBo.totalOpenAnpRate}</td>
                        </tr>
                    `;
                }
                
                subtotalBo.list.forEach(function(branchBo ,b){
                    if(b == 0){
                        tem +=`
                            <tr class="row_fh">
                                <td rowspan="${subtotalBo.list.length}" colspan="2">${branchBo.manageName}</td>
                                <td>${branchBo.firstBranch}</td>
                                <td class="important">${branchBo.cumulativeAnp} </td>
                                <td class="important">${branchBo.cumulativeNum}</td>
                                <td rowspan="${subtotalBo.list.length}" colspan="2"></td>
                                <td>${branchBo.followOrderAnp}</td>
                                <td>${branchBo.followOrderNum}</td>
                                <td class="bluelp">${branchBo.orderChangeNum} </td>
                                <td class="bluelp">${branchBo.orderChangeAnp} </td>
                                <td>${branchBo.totalInsureNum}</td>
                                <td class="bluelp">${branchBo.totalChangeNumRate}</td>
                                <td>${branchBo.totalInsureAnp}</td>
                                <td class="bluelp">${branchBo.totalChangeAnpRate}</td>
                                <td>${branchBo.totalOpenNumRate}</td>
                                <td>${branchBo.totalOpenAnpRate}</td>
                            </tr>
                        `
                    }else{
                        tem +=`
                            <tr class="row_fh">
                                <td>${branchBo.firstBranch}</td>
                                <td class="important">${branchBo.cumulativeAnp} </td>
                                <td class="important">${branchBo.cumulativeNum}</td>
                                <td>${branchBo.followOrderAnp}</td>
                                <td>${branchBo.followOrderNum}</td>
                                <td class="bluelp">${branchBo.orderChangeNum} </td>
                                <td class="bluelp">${branchBo.orderChangeAnp} </td>
                                <td>${branchBo.totalInsureNum}</td>
                                <td class="bluelp">${branchBo.totalChangeNumRate}</td>
                                <td>${branchBo.totalInsureAnp}</td>
                                <td class="bluelp">${branchBo.totalChangeAnpRate}</td>
                                <td>${branchBo.totalOpenNumRate}</td>
                                <td>${branchBo.totalOpenAnpRate}</td>
                            </tr>
                        `
                    }
                })
            })

        })

        $('tbody').html(tem);
    }
    
    instance.post(url.queryNationwidePreCast).then(({ status, data }) => {

        if (data.statusCode == 0) {

            tem(data.data);

        }


    })
   
})