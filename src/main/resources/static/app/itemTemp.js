(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        search(0, window.registerUser);
        getSetting();

        // table에 모두 선택 처리
        $('#selectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                itemList.itemList.map( (element) =>{
                    Object.defineProperty( itemList.selectedItem, element.id, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                itemList.itemList.map( (element) =>{
                    delete itemList.selectedItem[element.id]
                })
            }

            showPage.selectedElements = Object.entries( itemList.selectedItem ).length

            itemList.amountSelect = 10;
        });

        // 등록일 datepicker 처리
        $('#registerDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            itemList.setRegisterDate( dateString(event.date) );
        });

        // 만료일 datepicker 처리
        $('#expireDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            itemList.setExpireDate( dateString(event.date) );
        });
    });

    // 초기 설정 받아오기
    function getSetting( ) {
        $.get("/api/item/setting", function(response){
            itemList.selectItem     = response.data.itemState;
            itemList.selectRental   = response.data.rentalState;
            itemList.categories     = response.data.categories;
            itemList.selectCate01   = Object.keys( itemList.categories );
        });
    }
    // 데이터 받아오기
    function search( index ) {

        let registerUser = 1;

        $.get("/api/temps?page="+index+"&registerUser="+registerUser, function (response) {
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
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + date.getMonth().toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }

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
            totalPages       : 0,
            currentElements  : 0,
            totalElements    : 0,
            currentPage      : 0,
            selectedElements : 0,    // 현재 조건 중 선택된 값들의 수
        },methods: {
            registerHandler : function ( ) {
                if( Object.keys( itemList.selectedItem ).length == 0 ) {
                    toastr.error("선택된 자산이 없습니다.")
                    return ;
                }

                $('#registerButton').attr('disabled', true);

                let postBody = {
                    "items" : Object.entries(  itemList.selectedItem )
                        .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ))
                        .reduce( (acc,cur)=>{ acc.push( cur[1].id ); return acc; }, [] )
                };

                // update user 등록 부분
                postBody['userId'] = 1;

                console.log("postBody : ", postBody )


                $.ajax({
                    type: 'POST',
                    url: '/api/temps',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( pagination.currentPage  );
                        toastr.success('임시자산 등록 완료')
                        $('#registerButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('임시자산 등록 실패')
                        $('#registerButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            deleteHandler   : function ( ) {
                if( Object.keys( itemList.selectedItem ).length == 0 ) {
                    toastr.error("선택된 자산이 없습니다.")
                    return ;
                }

                $('#deleteButton').attr('disabled', true);

                let postBody = {
                    "items" : Object.entries(  itemList.selectedItem )
                        .reduce( (acc,cur)=>{ acc.push( cur[1].id ); return acc; }, [] )
                };

                console.log("postBody : ", postBody )

                // update user 등록 부분
                postBody['userId'] = 1;

                $.ajax({
                    type: 'POST',
                    url: '/api/temps/delete',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( pagination.currentPage );
                        toastr.success('임시자산 삭제 완료')
                        $('#deleteButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('임시자산 삭제 실패')
                        $('#deleteButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },

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
                search(id-1, conditions.item );
            },
            previousClick:function (event) {
                if(pagination.currentPage !== 0){
                    search(pagination.currentPage-1, conditions.item );
                }
            },
            nextClick:function (event) {
                if(pagination.currentPage !== pagination.totalPages-1){
                    search(pagination.currentPage+1, conditions.item );
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
    // 데이터 리스트
    let itemList = new Vue({
        el : '#itemList',
        data : {
            itemList         : {},
            selectedItem : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            handlerCheckBox: function(event){
                console.log("handlerCheckBox")

                event.stopImmediatePropagation();

                let seletedItem = this.itemList[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPage.selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox: function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            disableAllCheckBox: function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
            setItemList: function( itemList ){
                this.disableAllCheckBox( );
                this.itemList = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            rowHandler : function( event, item ){
                console.log("event               : ",event);
                console.log("itemList.categories : ",itemList.categories);
                itemModal.pageMode      = 1;
                itemModal.selectedItem  = $.extend(true, {}, item );
                itemModal.categories    = new Object( itemList.categories );
                itemModal.initCategory( );
                itemModal.modalSelectItem    = itemList.selectItem;
                itemModal.modalSelectRental  = itemList.selectRental;

                $('#itemModal').modal()

            },
        }
    });

    let itemModal = new Vue({
        el: '#itemModal',
        data: {
            pageMode            : 0,    // modal type 지정  0:create / 1:update
            selectedItem        : {},
            categories          : {},

            modalSelectItem     : [],
            modalSelectRental   : [],

            selectCate01        : [],
            selectCate02        : [],
            selectCate03        : [],

        },methods: {
            initCategory: function(){
                this.selectCate01  = Object.keys( this.categories );
                console.log("this.selectCate01[this.selectedItem.superCate] : ",this.selectCate01[this.selectedItem.superCate])
                this.selectCate02  = Object.keys( this.categories[this.selectedItem.superCate] )
                this.selectCate03  = this.categories[this.selectedItem.superCate][this.selectedItem.subCateFirst];
            },
            handleCate01: function () {
                if( this.categories.hasOwnProperty( this.selectedItem.superCate) ) {
                    this.selectCate02 = Object.keys(this.categories[this.selectedItem.superCate]);
                    this.selectedItem.subCateFirst = ""
                    this.selectedItem.subCateSecond = ""
                }
            },
            handleCate02: function () {
                if (this.categories[this.selectedItem.superCate].hasOwnProperty(this.selectedItem.subCateFirst)) {
                    this.selectCate03 = this.categories[this.selectedItem.superCate][this.selectedItem.subCateFirst];
                    this.selectedItem.subCateSecond = ""
                }
            },
        },mounted: function( ) {
            // 등록일 datepicker 처리
            $('#modalCreateDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemModal.selectedItem.createDate = dateString(event.date);
            });

            // 만료일 datepicker 처리
            $('#modalExpireDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemModal.selectedItem.exprieDate =  dateString(event.date);
            });
        }
    })

    // for test
    window.itemList     = itemList;
    window.registerUser = 1;


})(jQuery);