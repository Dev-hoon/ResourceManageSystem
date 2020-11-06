(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    let categoryData = {};

    /*
    let queryConditions = {
        id              :   0,
        name            :   "",
        createDate      :   0,
        expireDate      :   0,
        superCate       :   "",
        subCateFirst    :   "",
        subCateSecond   :   "",
        itemState       :   0,
        rentalState     :   0,
        placeState      :   0,
    }*/


    function dateString( date ){
        return date.getFullYear()+ '-' + date.getMonth().toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }

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
            searchItems: function () {
                search(0, this.getParameter() );
            },
            setCreateDate:function ( date ) {
                this.createDate = date;
            },
            setExpireDate:function ( date ) {
                this.expireDate = date;
            },
        }
    });

    $('#createDate').datepicker({
        format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
        autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
        startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
        language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
    }).on('changeDate', function (event) {
        conditions.setCreateDate( dateString(event.date) )
    });

    $('#expireDate').datepicker({
        format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
        autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
        startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
        language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
    }).on('changeDate', function (event) {
        conditions.setExpireDate( dateString(event.date) )
    });




    // 페이징 처리 데이터
    let pagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0        // 현재 데이터수
    };

    // 페이지 정보
    let showPage = new Vue({
        el : '#showPage',
        data : {
            totalElements : {},
            currentPage:{}
        }
    });

    // 데이터 리스트
    let itemList = new Vue({
        el : '#itemList',
        data : {
            itemList : {}
        }
    });


    // 페이지 버튼 리스트
    let pageBtnList = new Vue({
        el : '#pageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (id) {
                search(id-1, conditions.getParameter())
            },
            previousClick:function () {
                if(pagination.currentPage !== 0){
                    search(pagination.currentPage-1, conditions.getParameter() );
                }
            },
            nextClick:function () {

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


    $('#search').click(function () {
        search(0)
    });

    $(document).ready(function () {
        search(0)
        getSetting();
    });

    function getCategories( ) {
        $.get("/api/categories", function(response){
            conditions.categories = response.data;
            conditions.selectCate01 = Object.keys(conditions.categories)
        });
    }

    function getSetting( ) {
        $.get("/api/item/setting", function(response){
            conditions.selectItem   = response.data.itemState;
            conditions.selectRental = response.data.rentalState;
            conditions.categories   = response.data.categories;
            conditions.selectCate01 = Object.keys(conditions.categories)
        });
    }

    function search(index,conditions) {
        $.get(["/api/items?page="+index,conditions].join('&'), function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            pagination = response.pagination;

            //전체 페이지
            showPage.totalElements = pagination.currentElements;
            showPage.currentPage   = pagination.currentPage+1;

            // 검색 데이터
            itemList.itemList = response.data;

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

})(jQuery);