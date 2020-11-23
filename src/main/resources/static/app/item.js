(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

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
    });

    //*** condition vue *** //
    // 초기 설정 받아오기
    function getSetting( ) {
        $.get("/api/item/setting", function(response){

            console.log("response : ",response.data)

            conditions.itemState      = "";
            conditions.itemList       = response.data.itemList;

            conditions.rentalState    = "";
            conditions.rentalList     = response.data.rentalList;

            conditions.placeState     = ""
            conditions.placeList      = response.data.placeList;

            conditions.categories     = response.data.categories;
            conditions.selectCate01   = Object.keys( response.data.categories );


            itemModal.itemState       = "";
            itemModal.itemList        = response.data.itemList;

            itemModal.rentalState     = "";
            itemModal.rentalList      = response.data.rentalList;

            itemModal.placeState      = ""
            itemModal.placeList       = response.data.placeList;

            itemModal.categories      = response.data.categories;
            itemModal.selectCate01    = Object.keys( response.data.categories );


        });
    }
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 데이터 받아오기
    function search(index, param ) {
        let Parameter;
        if( param ){
            Parameter = Object.entries( param )
                .filter( (item)=>(item[1]!=null)&&(item[1]!="") )
                .map( item=>item.join("=") )
        }

        $.get( ["/api/items?page="+index].concat(Parameter).join('&'), function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            pagination = response.pagination;

            //전체 페이지
            showPage.totalPages         = pagination.totalPages;
            showPage.totalElements      = pagination.totalElements;
            showPage.currentElements    = pagination.currentElements;
            showPage.currentPage        = pagination.currentPage+1;

            console.log("showPage._data : ",showPage._data)

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

    // 상세 조회 처리 데이터
    let conditions = new Vue({
        el : '#queryConditions',
        data : {
            item : {
                id              :   "",
                name            :   "",
                createDate      :   "",
                expireDate      :   "",
                superCate       :   "",
                subCateFirst    :   "",
                subCateSecond   :   "",
                itemState       :   "",
                rentalState     :   "",
                placeState      :   "",
                cdKey           :   "",
                licence         :   "",
            },

            categories      :   [],
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],

            selectItem      :   [],
            selectRental    :   [],

            itemList        :   [],
            itemState       :   "",

            rentalList      :   [],
            rentalState     :   "",

            placeList       :   [],
            placeState      :   "",

        },methods: {
            initConditions  : function ( ) {
                this.item = {
                    id              :   "",
                    name            :   "",
                    createDate      :   "",
                    expireDate      :   "",
                    superCate       :   "",
                    subCateFirst    :   "",
                    subCateSecond   :   "",
                    itemState       :   "",
                    rentalState     :   "",
                    placeState      :   "",
                    cdKey           :   "",
                    licence         :   "",
                },

                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];

                this.itemState       =   ""
                this.placeState      =   ""
                this.rentalState     =   ""

            },
            handleCate01    : function ( ) {
                if(this.categories.hasOwnProperty(this.item.superCate)){
                    this.selectCate02 = Object.keys( this.categories[this.item.superCate] );
                    this.item.subCateFirst = ""
                    this.item.subCateSecond = ""
                }
            },
            handleCate02    : function ( ) {
                if(this.categories[this.item.superCate].hasOwnProperty(this.item.subCateFirst)){
                    this.selectCate03 = this.categories[this.item.superCate][this.item.subCateFirst];
                    this.item.subCateSecond = ""
                }
            },
            searchItems     : function ( ) {
                search(0, conditions.item );

                conditions.amountSelect       = 0;
                conditions.selectedItemList   = {};

            },
            createItem      : function ( ) {
              location.href = "/pages/item/enroll"
            },
            itemHandler     : function ( ){
                Object.entries( this.itemList ).filter(item=>item[1]==this.itemState)
                    ?.map(item=>{
                        this.item.itemState  = item[0];
                    })
            },
            rentalHandler   : function ( ){
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                    ?.map(item=>{
                        this.item.rentalState   = item[0];
                    })
            },
            placeHandler    : function ( ){
                this.placeList.filter(item=>item.name==this.placeState)?.map(item=>{
                    this.item.placeState   = item.id;
                })
            },
            setCreateDate   : function ( date ) {
                this.item.createDate = date;
            },
            setExpireDate   : function ( date ) {
                this.item.expireDate = date;
            },
        },mounted: function( ){
            // 등록일 datepicker 처리
            $('#createDate').datepicker({
                format: "yyyy-mm-dd",
                autoclose : true,
                startDate: '-10d',
                language : "ko"
            }).on('changeDate', function (event) {
                conditions.item.createDate = dateString(event.date);
            });

            // 만료일 datepicker 처리
            $('#expireDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                conditions.item.expireDate = dateString(event.date);
            });
        }
    });

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
            bookmarkHandler     : function ( ) {
                if( Object.keys( itemList.selectedItemList ).length == 0 ) return ;

                $('#bookmarkButton').attr('disabled', true);

                let postBody = {
                    "items" : Object.entries(  itemList.selectedItemList )
                        .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ))
                        .reduce( (acc,cur)=>{ acc.push( cur[1].id ); return acc; }, [] )
                };

                // update user 등록 부분
                postBody['userId'] = 1;

                console.log("postBody : ", postBody )

                $.ajax({
                    type: 'POST',
                    url: '/api/bookmarks',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function( data ) {
                        search( pagination.currentPage, conditions.item  );
                        toastr.success('자산 수정 완료')
                        $('#bookmarkButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('자산 수정 실패')
                        $('#bookmarkButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });




            },
            openBookmark        : function ( ) {
                location.href = "/pages/bookmark"
            },
            rentalHandler       : function ( ) {
                location.href = "/pages/item/enroll"
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
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },
        methods:{
            handlerCheckBox: function(event){
                event.stopImmediatePropagation();

                let seletedItem = this.itemList[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItemList, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItemList[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPage.selectedElements = Object.entries( this.selectedItemList ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox: function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItemList.hasOwnProperty( element.getAttribute("itemId"))) )
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
                itemModal.mode              = 1;
                itemModal.item              = $.extend(true, {}, item );
                itemModal.initCategory( );

                itemModal.itemState         = (item.itemState)?item.itemState:"";
                itemModal.rentalState       = (item.rentalState)?item.rentalState:"";
                itemModal.placeState        = (item.placeState)?item.placeState:"";;

                itemModal.itemHandler( );
                itemModal.rentalHandler( );
                itemModal.placeHandler( );

                console.log("itemModal.item : ",itemModal.item)

                $('#itemModal').modal()
            },
        }
    });


    let itemModal = new Vue({
        el: '#itemModal',
        data: {
            mode                : 0,    // modal type 지정  0:create / 1:update
            item : {
                id              :   "",
                name            :   "",
                createDate      :   "",
                expireDate      :   "",
                superCate       :   "",
                subCateFirst    :   "",
                subCateSecond   :   "",
                itemState       :   "",
                rentalState     :   "",
                placeState      :   "",
                cdKey           :   "",
                licence         :   "",
             },
            selectedItem        : {},
            modalSelectRental   : [],

            categories          :   [],
            selectCate01        :   [],
            selectCate02        :   [],
            selectCate03        :   [],

            itemList            :   [],
            itemState           :   "",

            rentalList          :   [],
            rentalState         :   "",

            placeList           :   [],
            placeState          :   "",

            licences        :   [],

        },methods: {
            initCategory    : function ( ){
                this.selectCate01  = Object.keys( this.categories );
                this.selectCate02  = Object.keys( this.categories[this.item.superCate] )
                this.selectCate03  = this.categories[this.item.superCate][this.item.subCateFirst];
            },
            handleCate01    : function ( ){
                if( this.categories.hasOwnProperty( this.item.superCate) ) {
                    this.selectCate02 = Object.keys(this.categories[this.item.superCate]);
                    this.item.subCateFirst = ""
                    this.item.subCateSecond = ""
                }
            },
            handleCate02    : function ( ){
                if (this.categories[this.item.superCate].hasOwnProperty(this.item.subCateFirst)) {
                    this.selectCate03 = this.categories[this.item.superCate][this.item.subCateFirst];
                    this.item.subCateSecond = ""
                }
            },
            itemHandler     : function ( ){
                Object.entries( this.itemList ).filter(item=>item[1]==this.itemState)
                    ?.map(item=>{
                        this.item.itemState  = item[0];
                    })
            },
            rentalHandler   : function ( ){
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                    ?.map(item=>{
                        this.item.rentalState   = item[0];
                    })
            },
            placeHandler    : function ( ){
                this.placeList.filter(item=>item.name==this.placeState)?.map(item=>{
                    this.item.placeState   = item.id;
                })
            },
            updateItem      : function ( updateUser ) {
                $('#updateItemButton').attr('disabled', true);

                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser'] = 1;

                $.ajax({
                    type: 'PUT',
                    url: '/api/item',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( pagination.currentPage, conditions.item  );
                        alert('자산 수정 완료.');
                        $('#itemModal').modal("hide");
                        this.item = { };
                        $('#updateItemButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('자산 수정 실패.');
                        $('#updateItemButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler    : function ( event ){
                this.item = { };
                $('#itemModal').modal("hide");
            },validation: function(){
                let originData = itemList.itemList.filter((item)=>(item.id==itemModal.item.id))[0];
                return Object.entries( itemModal.item ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
            }
        },mounted: function( ) {

            // 등록일 datepicker 처리
            $('#modalRegisterDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemModal.item.createDate = dateString(event.date);
            })

            // 만료일 datepicker 처리
            $('#modalExpireDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemModal.item.expireDate =  dateString(event.date);
            })
        }
    })

    window.itemModal = itemModal

})(jQuery);