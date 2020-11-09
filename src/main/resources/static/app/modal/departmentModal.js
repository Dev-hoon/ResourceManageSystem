// Date 객체를 format에 맞는 string으로 변환
function dateString( date ){
    date =  [date.getFullYear(),date.getMonth().toString().padStart(2,'0'),date.getDate().toString().padStart(2,'0')].join("-")
    date = /(?<DateFormat>[0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(date);
    return ( date )? date.groups['DateFormat'] : null ;
}

// 초기 설정 받아오기
function getSetting( ) {
    $.get("/api/item/setting", function(response){
        conditions.selectItem   = response.data.itemState;
        conditions.selectRental = response.data.rentalState;
        conditions.categories   = response.data.categories;
        conditions.selectCate01 = Object.keys(conditions.categories)
    });
}

// 데이터 받아오기
function search(index,conditions) {
    $.get(["/api/items?page="+index,conditions].join('&'), function (response) {
        /* 데이터 셋팅 */
        // 페이징 처리 데이터
        indexBtn = [];
        pagination = response.pagination;

        //전체 페이지
        showPage.totalElements      = pagination.currentElements;
        showPage.currentPage        = pagination.currentPage+1;
        // 검색 데이터
        itemList.setItemList( response.data );

        // 이전버튼
        if(pagination.currentPage === 0){
            $('#previousBtn').addClass("disabled")
        }else{
            $('#previousBtn').removeClass("disabled")
        }
        // 다음버튼
        if(pagination.currentPage === pagination.totalPages-1){
            $('#nextBtn').addClass("disabled")
        }else{
            $('#nextBtn').removeClass("disabled")
        }

        // 페이징 버튼 처리
        var temp = Math.floor(pagination.currentPage / maxBtnSize);
        for(var i = 1; i <= maxBtnSize; i++){
            var value = i+(temp*maxBtnSize);

            if(value <= pagination.totalPages){
                indexBtn.push(value)
            }
        }

        // 페이지 버튼 셋팅
        pageBtnList.btnList = indexBtn;

        // 색상처리
        setTimeout(function () {
            $('li[btn_id]').removeClass( "active" );
            $('li[btn_id='+(pagination.currentPage+1)+']').addClass( "active" );
        },50)
    });
}


let departmentModal = new Vue({
    el: '#departmentModal',
    data: {
        selectedItem        : {},

    },methods: {
        initCategory    : function( ){
            this.selectCate01  = Object.keys( this.categories );
            this.selectCate02  = Object.keys( this.categories[this.selectedItem.superCate] )
            this.selectCate03  = this.categories[this.selectedItem.superCate][this.selectedItem.subCateFirst];

            this.isChange  =  false;
        },
        updateItem      : function ( updateUser ) {
            Object.entries(this._data.selectedItem).map((t)=>{console.log("T : ",t)});

            console.log( "validation : "+this.validation() )

            let postBody = Object.entries(this._data.selectedItem)
                .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

            Object.defineProperty(postBody, 'updateUser', { value : updateUser})

            $.ajax({
                type: 'PUT',
                url: '/api/item',
                data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                success: function(data) { alert('data: ' + data); },function(response){
                    console.log( "response : ",response)
                },
                contentType: "application/json",
                dataType: 'json'
            });
        },
        closeHandler    : function ( event ){
            console.log('closeHandler !')

            if( !this.validation() ){
                console.log( "not changed ")
                $('#itemModal').modal("hide");
            }else{
                console.log( "changed ");
            }
        },
        validation      : function(){
            let originData = itemList.itemList.filter((item)=>(item.id==itemModal.selectedItem.id))[0];
            return Object.entries( itemModal.selectedItem ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
        }
    },mounted: function( ) {
        // 등록일 datepicker 처리
        $('#modalRegisterDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            console.log("changeDate : ")
            itemModal.selectedItem.createDate = dateString(event.date);
        }).unbind('change');
    }
})
