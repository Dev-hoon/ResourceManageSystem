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

    let cates = {"SW":{"OS":["linux","mac","Window"]},"HW":{"TEST2":["노트북"],"케이블":["C 타입","HDMI"],"노트북":["노트북"],"컴퓨터":["데스크탑"],"TEST1":["노트북"]}};

    window.cates= cates;
    let handleQuery = new Vue({
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
        },created: function () {
            // 카테고리 selected 생성
            // test
            this.categories = {"SW":{"OS":["linux","mac","Window"]},"HW":{"TEST2":["노트북"],"케이블":["C 타입","HDMI"],"노트북":["노트북"],"컴퓨터":["데스크탑"],"TEST1":["노트북"]}};
            this.selectCate01 = Object.keys(this.categories)

        },methods: {
            initConditions: function (e) {
                console.log("init called")
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

                // categories      :   [];
                this.selectCate01    =   this.selectCate01 = Object.keys(this.categories);
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
            sendQuery: function (e) {

            },
            getParameter: function (e) {
                let queryString = [];
                Object.entries(this._data)
                    .filter( (item)=>( (item[1].constructor == String) && ( item[1] != "" ) ))
                    .map((item)=>{ queryString.push( [item[0],item[1]].join("=") ) })
                return queryString.join("&");
            }
        }
    });

    window.handleQuery = handleQuery;



    // 페이징 처리 데이터
    let pagination = {
        total_pages         :  0,       // 전체 페이지수
        total_elements      :  0,       // 전체 데이터수
        current_page        :  0,       // 현재 페이지수
        current_elements    :  0        // 현재 데이터수
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
                searchStart(id-1)
            },
            previousClick:function () {
                if(pagination.current_page !== 0){
                    searchStart(pagination.current_page-1);
                }
            },
            nextClick:function () {

                if(pagination.current_page !== pagination.total_pages-1){
                    searchStart(pagination.current_page+1);
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(pagination.current_page+1)+']').addClass( "active" );
            },50)
        }
    });


    $('#search').click(function () {
        searchStart(0)
    });

    $(document).ready(function () {
        searchStart(0)
    });

    $('#createDate').datepicker({
        format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
        autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
        startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
        language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
    }).on('changeDate', function (ev) {
        console.log("ev : ",ev)
        window.tt = ev;

        this.
    });

    $('#expireDate').datepicker({
        format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
        autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
        startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
        language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
    });
    
    function searchStart(index) {
        console.log("call index : "+index);
        $.get("/api/item?id="+index, function (response) {

            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            // pagination = response.pagination;

            //전체 페이지
            // showPage.totalElements = pagination.current_elements;
            // showPage.currentPage = pagination.current_page+1;

            // 검색 데이터
            itemList.itemList = new Array( response.data ) ;
            window.test =  itemList.itemList;
            console.log("itemList       : ",itemList.itemList)
            console.log("response.data; : ",response.data);

            // 이전버튼
            /*
            if(pagination.current_page === 0){
                $('#previousBtn').addClass("disabled")
            }else{
                $('#previousBtn').removeClass("disabled")
            }
            // 다음버튼
            if(pagination.current_page === pagination.total_pages-1){
                $('#nextBtn').addClass("disabled")
            }else{
                $('#nextBtn').removeClass("disabled")
            }

            // 페이징 버튼 처리
            var temp = Math.floor(pagination.current_page / maxBtnSize);
            for(var i = 1; i <= maxBtnSize; i++){
                var value = i+(temp*maxBtnSize);

                if(value <= pagination.total_pages){
                    indexBtn.push(value)
                }
            }

            // 페이지 버튼 셋팅
            pageBtnList.btnList = indexBtn;
            */

            // 색상처리
            setTimeout(function () {
                // $('li[btn_id]').removeClass( "active" );
                // $('li[btn_id='+(pagination.current_page+1)+']').addClass( "active" );
            },50)
        });
    }

})(jQuery);