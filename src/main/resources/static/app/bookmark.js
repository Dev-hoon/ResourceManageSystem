(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        search(0 );

        $('#selectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                bookmarkList.items?.map( (element) =>{
                    Object.defineProperty( bookmarkList.selectedItem, element.userId+"-"+element.itemId, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                bookmarkList.items?.map( (element) =>{
                    delete bookmarkList.selectedItem[element.userId+"-"+element.itemId]
                })
            }

            showPage.selectedElements = Object.entries( bookmarkList.selectedItem ).length

            bookmarkList.amountSelect = showPage.currentElements;
        });
    });


    //*** common functions *** //
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 데이터 받아오기
    function search( index ) {
        let registerUser = 1;

        $.get("/api/bookmarks?page="+index+"&registerUser="+registerUser, function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            pagination = response.pagination;

            //전체 페이지
            showPage.totalPages         = pagination.totalPages;
            showPage.totalElements      = pagination.totalElements;
            showPage.currentElements    = pagination.currentElements;
            showPage.currentPage        = pagination.currentPage+1;

            // 검색 데이터
            bookmarkList.setItemList( response.data );

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

    //*** grid vue *** //
    // 페이징 처리 데이터
    let pagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let showPage = new Vue({
        el : '#showPage',
        data : {
            totalPages          : 0,
            currentPage         : 0,
            totalElements       : 0,
            currentElements     : 0,
            selectedElements    : 0,
            amountPerPage       : 10,
        },methods : {
            rentalHandler       : function ( ){

                if( Object.keys(bookmarkList.selectedItem).length == 0 ) return ;


                console.log("this.selectedItem[0] : ",bookmarkList.selectedItem )

                bookmarkModal.item.title = Object.values( bookmarkList.selectedItem )[0]['name']

                bookmarkModal.selectedItem  =   bookmarkList.selectedItem;

                if( Object.values(bookmarkList.selectedItem).length > 1 )
                    bookmarkModal.item.title = bookmarkModal.item.title+'  외 '+(Object.values(bookmarkModal.selectedItem).length-1) + ' 개';

                $('#bookmarkModal').modal();
                     },
            deleteHandler       : function ( ){ }
        }
    });
    // 페이지 버튼 리스트
    let pageBtnList = new Vue({
        el : '#pageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1);
            },
            previousClick:function (event) {
                if(pagination.currentPage !== 0){
                    search(pagination.currentPage-1 );
                }
            },
            nextClick:function (event) {
                if(pagination.currentPage !== pagination.totalPages-1){
                    search(pagination.currentPage+1 );
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(pagination.currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    // 장바구니 리스트
    let bookmarkList = new Vue({
        el : '#bookmarkList',
        data : {
            items            : {},
            selectedItem     : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            checkHandler        : function( event, item ){
                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, item.userId+"-"+item.itemId, { value: item, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[item.userId+"-"+item.itemId];
                    this.amountSelect -= 1;
                }

                showPage.selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
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
                console.log("itemList.categories : ", bookmarkList.categories);
                itemModal.pageMode = 1;
                itemModal.selectedItem = $.extend(true, {}, item);
                itemModal.categories = new Object(bookmarkList.categories);
                itemModal.initCategory();
                itemModal.modalSelectItem = bookmarkList.selectItem;
                itemModal.modalSelectRental = bookmarkList.selectRental;

                $('#itemModal').modal()
            },



        }
    });


    let bookmarkModal = new Vue({
        el: '#bookmarkModal',
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
            updateItem       : function ( ){

                if( Object.keys(this.selectedItem).length == 0 ) return ;

                $('#updateItemButton').attr('disabled', true);

                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                console.log("this.selectedItem : ",this.selectedItem );

                postBody["items"] = Object.entries(  this.selectedItem )
                        .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ))
                        .reduce( (acc,cur)=>{ acc.push( cur[1].itemId ); return acc; }, [] );

                // update user 등록 부분
                postBody['userId'] = 1;

                console.log("ITEM updateItem postBody : ",postBody )

                $.ajax({
                    type: 'POST',
                    url: '/api/rentals',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( pagination.currentPage );
                        toastr.success('대여 신청 완료')
                        $('#updateItemButton').attr('disabled', false);
                        $('#bookmarkModal').modal('hide');
                    },
                    error: function( ){
                        toastr.error('대여 수정 실패')
                        $('#updateItemButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });

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
                bookmarkModal.item.startDate = dateString(event.date);
            })

            // 만료일 datepicker 처리
            $('#modalEndDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                bookmarkModal.item.endDate =  dateString(event.date);
            })
        }
    })


    window.bookmarkList = bookmarkList;

})(jQuery);