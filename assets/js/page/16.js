window.onload = function(){

    new Vue({
        el: '#app',
        data(){
            return {
                list: [],
                loading: true,

                useNum: 0,
                orderNum: 0
            }
        },
        beforeMount(){
            let self =this;
            instance.post(url.preUnallocated).then( ({data}) => {

                self.loading = false;
                
                if(data.statusCode == 0){

                    setHead(data.refreshTime);

                    self.list = handleDate(data.data,{
                        followUserNum(e){
                            if( typeof (e*1) == 'number' && !isNaN(e*1) ){
                                self.useNum += e;
                            }
                            return fn(e)
                        },
                        followOrderNum(e){
                            if( typeof (e*1) == 'number' && !isNaN(e*1) ){
                                self.orderNum += e;
                            }
                            return fn(e)
                        }
                    });

                }
                
            })
        }
    })
    
}