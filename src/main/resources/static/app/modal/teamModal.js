(function ($) {

    $(document).ready(function () {
        search(0)
        getSetting();

        // table에 모두 선택 처리
        $('#selectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                itemList.itemList.map( (element) =>{
                    Object.defineProperty( itemList.selectedItemList, element.id, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                itemList.itemList.map( (element) =>{
                    delete itemList.selectedItemList[element.id]
                })
            }

            showPage.selectedElements = Object.entries( itemList.selectedItemList ).length

            itemList.amountSelect = 10;
        });

        // 등록일 datepicker 처리
        $('#createDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            conditions.setCreateDate( dateString(event.date) )
        });

        // 만료일 datepicker 처리
        $('#expireDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            conditions.setExpireDate( dateString(event.date) )
        });
    });

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



    // for test
    window.updateUser   = 1;
    window.teamModal    = teamModal;

})(jQuery);