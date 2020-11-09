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

    // 상세 조회 처리 데이터
    let conditions = new Vue({
        el : '#queryConditions',
        data : {
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

            categories      :   [],
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],

            selectItem      :   [],
            selectRental    :   [],

        },methods: {
            initConditions: function (e) {
                this.id              =   "";
                this.name            =   "";
                this.createDate      =   "";
                this.expireDate      =   "";
                this.superCate       =   "";
                this.subCateFirst    =   "";
                this.subCateSecond   =   "";
                this.itemState       =   "";
                this.rentalState     =   "";
                this.placeState      =   "";

                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];


            },
            handleCate01: function (e) {
                if(this.categories.hasOwnProperty(this.superCate)){
                    this.selectCate02 = Object.keys( this.categories[this.superCate] );
                    this.subCateFirst = ""
                    this.subCateSecond = ""
                }
            },
            handleCate02: function (e) {
                if(this.categories[this.superCate].hasOwnProperty(this.subCateFirst)){
                    this.selectCate03 = this.categories[this.superCate][this.subCateFirst];
                    this.subCateSecond = ""
                }
            },
            getParameter: function () {
                let queryString = [];
                Object.entries(this._data)
                    .filter( (item)=>( (item[1].constructor == String) && ( item[1] != "" ) ))
                    .map((item)=>{ queryString.push( [item[0],item[1]].join("=") ) })
                return queryString.join("&");
            },
            searchItems : function () {
                search(0, this.getParameter() );

                itemList.amountSelect       = 0;
                itemList.selectedItemList   = {};

            },
            createItem  : function () {
              location.href = "/pages/item/enroll"
            },
            setCreateDate:function ( date ) {
                this.createDate = date;
            },
            setExpireDate:function ( date ) {
                this.expireDate = date;
            },
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
            totalElements       : {},
            currentPage         : {},
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        }
    });

    // 데이터 리스트
    let itemList = new Vue({
        el : '#itemList',
        data : {
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
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
            itemRowHandler : function( event, item ){
                itemModal.pageMode      = 1;
                itemModal.selectedItem  = $.extend(true, {}, item );
                itemModal.categories    = new Object( conditions.categories );
                itemModal.initCategory( );
                itemModal.modalSelectItem    = conditions.selectItem;
                itemModal.modalSelectRental  = conditions.selectRental;

                $('#itemModal').modal().off()
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
                search(id-1, conditions.getParameter());
            },
            previousClick:function (event) {
                if(pagination.currentPage !== 0){
                    search(pagination.currentPage-1, conditions.getParameter() );
                }
            },
            nextClick:function (event) {
                if(pagination.currentPage !== pagination.totalPages-1){
                    search(pagination.currentPage+1, conditions.getParameter() );
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
            initCategory: function( ){
                this.selectCate01  = Object.keys( this.categories );
                this.selectCate02  = Object.keys( this.categories[this.selectedItem.superCate] )
                this.selectCate03  = this.categories[this.selectedItem.superCate][this.selectedItem.subCateFirst];

                this.isChange  =  false;
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
            updateItem  : function ( updateUser ) {
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
            closeHandler: function ( event ){
                if( !this.validation() ){
                    console.log( "not changed ")
                    $('#itemModal').modal("hide");
                }else{
                    console.log( "changed ");

                }


            },validation: function(){
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

            // 만료일 datepicker 처리
            $('#modalExpireDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemModal.selectedItem.exprieDate =  dateString(event.date);
            }).unbind('change');
        }
    })

    // for test
    window.updateUser   = 1;
    window.itemList     = itemList;
    window.itemModal    = itemModal;

})(jQuery);