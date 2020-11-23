(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        search(0 , 'requests');
        search(0 , 'overdue');

        $('#requestSelectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                requestList.items?.map( (element) =>{
                    Object.defineProperty( requestList.selectedItem, element.empId+"-"+element.itemId, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                requestList.items?.map( (element) =>{
                    delete requestList.selectedItem[element.empId+"-"+element.itemId]
                })
            }

            requestShowPage.selectedElements = Object.entries( requestList.selectedItem ).length

            requestList.amountSelect = requestShowPage.currentElements;
        });

        $('#overdueSelectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                overdueList.items?.map( (element) =>{
                    Object.defineProperty( overdueList.selectedItem, element.empId+"-"+element.itemId, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                overdueList.items?.map( (element) =>{
                    delete overdueList.selectedItem[element.empId+"-"+element.itemId]
                })
            }

            overdueShowPage.selectedElements = Object.entries( overdueList.selectedItem ).length

            overdueList.amountSelect = overdueShowPage.currentElements;
        });
    });


    //*** common functions *** //
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 데이터 받아오기
    function search( index, tabName ) {
        let registerUser = 1;

        let URL = "/api/rental/"+tabName+"?page="+index;

        URL = URL.concat("&registerUser="+registerUser);

        console.log("URL : ",URL);

        $.get( URL, function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            paginationList[tabName] = response.pagination;

            if(!window.tt) window.tt = [];
            window.tt[tabName] = response.data

            //전체 페이지
            showPages[tabName].totalPages         = paginationList[tabName].totalPages;
            showPages[tabName].totalElements      = paginationList[tabName].totalElements;
            showPages[tabName].currentElements    = paginationList[tabName].currentElements;
            showPages[tabName].currentPage        = paginationList[tabName].currentPage+1;

            // 검색 데이터
            Lists[tabName].setItemList( response.data );

            // 이전버튼
            if(paginationList[tabName].currentPage === 0){
                $('#previousBtn').addClass("disabled")
            }else{
                $('#previousBtn').removeClass("disabled")
            }
            // 다음버튼
            if(paginationList[tabName].currentPage === paginationList[tabName].totalPages-1){
                $('#nextBtn').addClass("disabled")
            }else{
                $('#nextBtn').removeClass("disabled")
            }

            // 페이징 버튼 처리
            var temp = Math.floor(paginationList[tabName].currentPage / maxBtnSize);
            for(var i = 1; i <= maxBtnSize; i++){
                var value = i+(temp*maxBtnSize);

                if(value <= paginationList[tabName].totalPages){
                    indexBtn.push(value)
                }
            }

            // 페이지 버튼 셋팅
            paginationList[tabName].btnList = indexBtn;

            // 색상처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(paginationList[tabName].currentPage+1)+']').addClass( "active" );
            },50)
        });
    }

    //*** grid vue *** //
    // 페이징 처리 데이터
    let requestPagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let requestShowPage = new Vue({
        el : '#requestShowPage',
        data : {
            totalPages          : 0,
            currentPage         : 0,
            totalElements       : 0,
            currentElements     : 0,
            selectedElements    : 0,
            amountPerPage       : 10,
        },methods:{
            acceptHandler   : function  ( ){

                if( Object.keys(requestList.selectedItem).length == 0 ) return ;

                $('#acceptButton').attr('disabled', true);

                console.log("requestList.selectItem : ",requestList.selectedItem )

                // update user 등록 부분
                let updateUser = 1;

                let postBody =  Object.values( requestList.selectedItem ).map((item)=>(
                        { 'itemId' : item.itemId, 'empId' : item.empId, 'startDate' : item.startDate,'endDate' : item.endDate, 'updateUser' : updateUser  }
                    ) );

                console.log("RENTAL ACCEPT postBody\' : ",postBody)

                $.ajax({
                    type: 'PUT',
                    url: '/api/rentals/accept',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( paginationList['requests'].currentPage, 'requests');
                        toastr.success('대여 승인 완료')
                        $('#acceptButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('대여 승인 실패')
                        $('#acceptButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });



            },
            denyHandler     : function  ( ){
                if( Object.keys(requestList.selectedItem).length == 0 ) return ;

                $('#denyButton').attr('disabled', true);

                console.log("requestList.selectItem : ",requestList.selectedItem )

                // update user 등록 부분
                let updateUser = 1;

                let postBody =  Object.values( requestList.selectedItem ).map((item)=>(
                    { 'itemId' : item.itemId, 'empId' : item.empId, 'startDate' : item.startDate,'endDate' : item.endDate, 'updateUser' : updateUser  }
                ) );

                console.log("RENTAL ACCEPT postBody\' : ",postBody)

                $.ajax({
                    type: 'PUT',
                    url: '/api/rentals/deny',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( paginationList['requests'].currentPage , 'requests');
                        toastr.success('대여 반려 완료')
                        $('#denyButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('대여 반려 실패')
                        $('#denyButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            }
        }
    });
    // 페이지 버튼 리스트
    let requestPageBtnList = new Vue({
        el : '#requestPageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1, 'requests');
            },
            previousClick:function (event) {
                if(paginationList['requests'].currentPage !== 0){
                    search(paginationList['requests'].currentPage-1 , 'requests');
                }
            },
            nextClick:function (event) {
                if(paginationList['requests'].currentPage !== paginationList['requests'].totalPages-1){
                    search(paginationList['requests'].currentPage+1 , 'requests');
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(paginationList['requests'].currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    // 장바구니 리스트
    let requestList = new Vue({
        el : '#requestList',
        data : {
            items            : {},
            selectedItem     : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            checkHandler        : function( event, item ){
                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, item.empId+"-"+item.itemId, { value: item, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[item.empId+"-"+item.itemId];
                    this.amountSelect -= 1;
                }

                showPages['requests'].selectedElements = Object.entries( this.selectedItem ).length

                $('#requestSelectAll input').prop('checked',(this.amountSelect==showPages['requests'].currentElements)? true : false );
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            disableAllCheckBox  : function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.items = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            deleteHandler       : function( event, item ) {
                $('#delteButton').attr('disabled', true);
                console.log("event               : ", event);
                console.log("itemList.categories : ", rentalList.categories);
                itemModal.pageMode = 1;
                itemModal.selectedItem = $.extend(true, {}, item);
                itemModal.categories = new Object(rentalList.categories);
                itemModal.initCategory();
                itemModal.modalSelectItem = rentalList.selectItem;
                itemModal.modalSelectRental = rentalList.selectRental;

                $('#itemModal').modal()
            },
            rentalHandler       : function ( ){

                if( this.selectedItem.length == 0 ) return ;


                console.log("this.selectedItem[0] : ",this.selectedItem )

                requestModal.item.title = Object.values( this.selectedItem )[0]['name']

                if( Object.values(this.selectedItem).length > 1 )
                    requestModal.item.title = requestModal.item.title+'  외 '+(Object.values(this.selectedItem).length-1) + ' 개';

                $('#requestModal').modal();
                /*
                $('#rentalButton').attr('disabled', true);
                console.log("rentalHandler : ",this.selectedItem );
                /*
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                    ?.map(item=>{
                        this.item.rentalState   = item[0];
                    })*/

                let postBody = Object?.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser'] = 1;

                console.log("ITEM updateItem postBody : ",postBody)

                /*$.ajax({
                    type: 'POST',
                    // url: '/api/item',
                    // data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( pagination.currentPage, conditions.item  );
                        alert('자산 수정 완료.');
                        $('#itemModal').modal("hide");
                        this.item = { };
                        $('#rentalButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('자산 수정 실패.');
                        $('#rentalButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });*/

                //$('#rentalButton').attr('disabled', false);

            },


        }
    });
    // 모달 이름
    let requestModal = new Vue({
        el: '#requestModal',
        data: {
            mode            : 0,    // modal type 지정  0:create / 1:update
            item            : {
                title       : "",
                startDate   : dateString( new Date( ) ),
                endDate     : "",
                reason      : "",
            },
            selectedItem    : [],
        },methods: {
            initItem        : function ( ){
                this.item = {
                    title       : "",
                    startDate   : dateString( new Date( ) ),
                    endDate     : "",
                    reason      : "",
                },
                this.selectedItem =  []
            },
            rentalHandler   : function ( ){
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                    ?.map(item=>{
                        this.item.rentalState   = item[0];
                    })
            },
            closeHandler    : function ( event ){
                this.initItem( );
                $('#itemModal').modal("hide");
            }
        },mounted: function( ) {
            // 등록일 datepicker 처리
            $('#modalStartDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                requestModal.item.startDate = dateString(event.date);
            })

            // 만료일 datepicker 처리
            $('#modalEndDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                requestModal.item.endDate =  dateString(event.date);
            })
        }
    })



    //*** grid vue *** //
    // 페이징 처리 데이터
    let overduePagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let overdueShowPage = new Vue({
        el : '#overdueShowPage',
        data : {
            totalPages          : 0,
            currentPage         : 0,
            totalElements       : 0,
            currentElements     : 0,
            selectedElements    : 0,
            amountPerPage       : 10,
        }, methods : {
            returnHandler       : function( ){
                if( Object.keys(overdueList.selectedItem).length == 0 ) return ;

                $('#denyButton').attr('disabled', true);

                console.log("overdueList.selectItem : ",overdueList.selectedItem )

                // update user 등록 부분
                let updateUser = 1;

                let postBody =  Object.values( overdueList.selectedItem ).map((item)=>(
                    { 'itemId' : item.itemId, 'empId' : item.empId, 'startDate' : item.startDate,'endDate' : item.endDate, 'updateUser' : updateUser  }
                ) );

                console.log("RENTAL ACCEPT postBody\' : ",postBody)

                $.ajax({
                    type: 'PUT',
                    url: '/api/rentals/return',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( paginationList['overdue'].currentPage , 'overdue');
                        toastr.success('대여 반려 완료')
                        $('#denyButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('대여 반려 실패')
                        $('#denyButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            }
        }
    });
    // 페이지 버튼 리스트
    let overduePageBtnList = new Vue({
        el : '#overduePageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1);
            },
            previousClick:function (event) {
                if(paginationList['overdue'].currentPage !== 0){
                    search(paginationList['overdue'].currentPage-1 );
                }
            },
            nextClick:function (event) {
                if(paginationList['overdue'].currentPage !== paginationList['overdue'].totalPages-1){
                    search(paginationList['overdue'].currentPage+1 );
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(paginationList['overdue'].currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    // 장바구니 리스트
    let overdueList = new Vue({
        el : '#overdueList',
        data : {
            items            : {},
            selectedItem     : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            checkHandler        : function( event, item ){
                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, item.empId+"-"+item.itemId, { value: item, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[item.empId+"-"+item.itemId];
                    this.amountSelect -= 1;
                }

                showPages['overdue'].selectedElements = Object.entries( this.selectedItem ).length

                $('#overdueSelectAll input').prop('checked',(this.amountSelect==showPages['overdue'].currentElements)? true : false );
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            disableAllCheckBox  : function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.items = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
        }
    });
    // 모달 이름
    let overdueModal = new Vue({
        el: '#overdueModal',
        data: {
            mode            : 0,    // modal type 지정  0:create / 1:update
            item            : {
                title       : "",
                startDate   : dateString( new Date( ) ),
                endDate     : "",
                reason      : "",
            },
            selectedItem    : [],
        },methods: {
            initItem        : function ( ){
                this.item = {
                    title       : "",
                    startDate   : dateString( new Date( ) ),
                    endDate     : "",
                    reason      : "",
                },
                    this.selectedItem =  []
            },
            rentalHandler   : function ( ){
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                    ?.map(item=>{
                        this.item.rentalState   = item[0];
                    })
            },
            closeHandler    : function ( event ){
                this.initItem( );
                $('#itemModal').modal("hide");
            }
        },mounted: function( ) {
            // 등록일 datepicker 처리
            $('#modalStartDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                overdueModal.item.startDate = dateString(event.date);
            })

            // 만료일 datepicker 처리
            $('#modalEndDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                overdueModal.item.endDate =  dateString(event.date);
            })
        }
    })

    
    const showPages      = {
        "requests"      : requestShowPage,
        "overdue"       : overdueShowPage,
    };

    const Lists          = {
        "requests"      : requestList,
        "overdue"       : overdueList,
    };

    const pageBtnList    = {
        "requests"      : requestPageBtnList,
        "overdue"       : overduePageBtnList,
    };

    const paginationList = {
        "requests"      : requestPagination,
        "overdue"       : overduePagination,
    };

    const modalList      = {
        "requests"      : requestModal,
        "overdue"       : overdueModal,
    };

    window.Lists = Lists
})(jQuery);