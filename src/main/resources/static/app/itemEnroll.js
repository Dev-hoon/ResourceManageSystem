(function ($) {

    $(document).ready(function () {
        //test registerUser 값
        window.registerUser     = 1;

        itemData.registerUser   = window.registerUser;

        getSetting();

        // 등록일 datepicker 처리
        $('#registerDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            itemData.setRegisterDate( dateString(event.date) );
        });

        // 만료일 datepicker 처리
        $('#expireDate').datepicker({
            format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
            autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
            startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
            language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
        }).on('changeDate', function (event) {
            itemData.setExpireDate( dateString(event.date) );
        });
    });

    // 초기 설정 받아오기
    function getSetting( ) {
        $.get("/api/item/setting", function(response){
            itemData.selectItem     = response.data.itemState;
            itemData.selectRental   = response.data.rentalState;
            itemData.categories     = response.data.categories;
            itemData.selectCate01   = Object.keys( itemData.categories );
        });

        $.get("/api/temp/amount?registerUser="+window.registerUser, function(response) {
            itemData.tempAmount = response.data;
        });

    }

    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + date.getMonth().toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }

    // 상세 조회 처리 데이터
    let itemData = new Vue({
        el : '#itemData',
        data : {
            id              :   "",
            name            :   "",
            registerUser    :   "",
            registerDate    :   "",
            expireDate      :   "",
            superCate       :   "",
            subCateFirst    :   "",
            subCateSecond   :   "",
            itemState       :   "",
            rentalState     :   "",
            placeState      :   "",
            detail          :   "",
            memo            :   "",

            categories      :   [],
            selectItem      :   [],
            selectRental    :   [],
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],
            tempAmount      :   0,

        },
        methods: {
            handleCate01    : function (e) {
                if(this.categories.hasOwnProperty(this.superCate)){
                    this.selectCate02 = Object.keys( this.categories[this.superCate] );
                    this.subCateFirst = ""
                    this.subCateSecond = ""
                }
            },
            handleCate02    : function (e) {
                if(this.categories[this.superCate].hasOwnProperty(this.subCateFirst)){
                    this.selectCate03 = this.categories[this.superCate][this.subCateFirst];
                    this.subCateSecond = ""
                }
            },/*
            getParameter: function () {
                let queryString = [];
                Object.entries(this._data)
                    .filter( (item)=>( (item[1].constructor == String) && ( item[1] != "" ) ))
                    .map((item)=>{ queryString.push( [item[0],item[1]].join("=") ) })
                return queryString.join("&");
            },
            searchItems: function ( ) {
                search(0, this.getParameter() );

                itemList.amountSelect       = 0;
                itemList.selectedItemList   = {};

            },*/
            initItem        : function (e) {
                this.id              =   "";
                this.name            =   "";
                this.registerDate    =   "";
                this.registerUser    =   0;
                this.expireDate      =   "";
                this.superCate       =   "";
                this.subCateFirst    =   "";
                this.subCateSecond   =   "";
                this.itemState       =   "";
                this.rentalState     =   "";
                this.placeState      =   "";
                this.detail          =   "",
                this.memo            =   "",

                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];

            },
            createTempItem  : function (e){
                let postBody = {};

                console.log("itemData._data : ",itemData._data)

                Object.entries(itemData._data)
                    .filter( (v)=>( (v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, postBody );

                console.log("postBody : ",postBody)

                //for test
                postBody['registerUser'] = 1;

                $.ajax({
                    type: 'POST',
                    url: '/api/temp',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) { alert('data: ' + data); },function(response){
                        console.log( "response : ",response)
                    },
                    error: function(res){

                    },
                    contentType: "application/json",
                    dataType: 'json'
                });

               /* $.post( "/api/temp", postBody, function(response){
                    console.log( "response : ",response)
                } )*/
                // return queryString.join("&");
            },
            setRegisterDate     : function ( date ) {
                this.registerDate = date;
            },
            setExpireDate       : function ( date ) {
                this.expireDate = date;
            },
            onlyNumber: function( event ){ this.id = /[0-9]+/.exec(this.id)[0]; },
            onlyDate: function( event ){ this.id = Object.values(/(?<year>[0-9]{0,4})[-]*(?<month>[0-9]{0,2})[-]*(?<days>[0-9]{0,2})/.exec(this.id).groups ).filter(item=>item!="").join("-") },
            validation: function(){

            },
        }

    });

    let alertBox   = new Vue({
        el  : '#alertBox',
        data: {
            showPage: false,
        },
        methods: {

        }
    })

    window.alertBox = alertBox

})(jQuery);