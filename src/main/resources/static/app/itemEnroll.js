(function ($) {

    $(document).ready(function () {
        //test registerUser 값
        window.registerUser     = 1;

        getSetting();
    });

    //*** condition vue *** //
    // 초기 설정 받아오기
    function getSetting( ) {
        $.get("/api/item/setting", function(response){
            itemList.itemState      = "";
            itemList.itemList       = response.data.itemList;

            itemList.rentalState    = "";
            itemList.rentalList     = response.data.rentalList;

            itemList.placeState     = ""
            itemList.placeList      = response.data.placeList;

            itemList.categories     = response.data.categories;
            itemList.selectCate01   = Object.keys( itemList.categories );
        });

        $.get("/api/temp/amount?registerUser="+window.registerUser, function(response) {
            itemList.tempAmount = response.data;
        });

    }
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 상세 조회 처리 데이터
    let itemList = new Vue({
        el : '#itemList',
        data : {
            item : {
                id              :   "",
                name            :   "",
                registerUser    :   "",
                registerDate    :   dateString( new Date() ),
                expireDate      :   "",
                superCate       :   "",
                subCateFirst    :   "",
                subCateSecond   :   "",
                itemState       :   "",
                rentalState     :   "",
                placeState      :   "",
                detail          :   "",
                cost            :   "",
                purchaseCost    :   "",
                memo            :   "",
                cdKey           :   "",
                licence         :   "",
            },

            categories      :   [],
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],

            itemList        :   [],
            itemState       :   "",

            rentalList      :   [],
            rentalState     :   "",

            placeList       :   [],
            placeState      :   "",

            tempAmount      :   0,
            licences        :   [],

        },
        methods: {
            handleCate01    : function (e) {
                if(this.categories.hasOwnProperty(this.item.superCate)){
                    this.selectCate02 = Object.keys( this.categories?.[this.item.superCate] );
                    this.subCateFirst = ""
                    this.subCateSecond = ""
                }
            },
            handleCate02    : function (e) {
                if( this.categories[this.item.superCate].hasOwnProperty(this.item.subCateFirst) ){
                    this.selectCate03 = this.categories?.[this.item.superCate]?.[this.item.subCateFirst];
                    this.subCateSecond = ""
                }
            },
            initItem        : function (e) {
                this.item = {
                    id              :   "",
                    name            :   "",
                    registerUser    :   "",
                    registerDate    :   dateString( new Date() ),
                    expireDate      :   "",
                    superCate       :   "",
                    subCateFirst    :   "",
                    subCateSecond   :   "",
                    itemState       :   "",
                    rentalState     :   "",
                    placeState      :   "",
                    detail          :   "",
                    cost            :   "",
                    purchaseCost    :   "",
                    memo            :   "",
                    cdKey           :   "",
                    licence         :   "",
                },

                this.itemState       =   "",
                this.placeState      =   "",
                this.rentalState     =   "",

                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];

            },
            registerItem    : function ( ) {
                $('#registerButton').attr('disabled', true);

                let postBody = Object.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ) )
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log("item postBody : ", postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/item',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        alert('아이템 등록 완료.');
                        itemList.initItem();
                        $('#registerButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('아이템 등록 실패.');
                        $('#registerButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            registerTemp    : function (e){
                $('#tempButton').attr('disabled', true);

                let postBody = Object?.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="") ) )
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log("itemTemp postBody : ", postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/temp',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        alert('아이템 임시등록 완료.');
                        itemList.initItem();
                        $('#tempButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('아이템 임시등록 실패.');
                        $('#tempButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            itemHandler    : function ( ){

                Object.entries( this.itemList ).filter(item=>item[1]==this.itemState)
                    ?.map(item=>{
                        console.log("itemState item : ",item)
                        console.log("item : ",item)
                        this.item.itemState  = item[0];
                    })
            },
            rentalHandler    : function ( ){
                Object.entries( this.rentalList ).filter(item=>item[1]==this.rentalState)
                ?.map(item=>{
                    console.log("rental item : ",item)
                    this.item.rentalState   = item[0];
                })
            },
            placeHandler     : function ( ){
                this.placeList.filter(item=>item.name==this.placeState)?.map(item=>{
                    this.item.placeState   = item.id;
                    this.addressName    = item.name;
                    this.address        = item.address;
                    this.addressDetail  = item.addressDetail;
                })
            },
            setRegisterDate : function ( date ) {
                this.registerDate = date;
            },
            setExpireDate   : function ( date ) {
                this.expireDate = date;
            },
            onlyNumber      : function ( event ){ this.id = /[0-9]+/.exec(this.id)[0]; },
            onlyDate        : function ( event ){ this.id = Object.values(/(?<year>[0-9]{0,4})[-]*(?<month>[0-9]{0,2})[-]*(?<days>[0-9]{0,2})/.exec(this.id).groups ).filter(item=>item!="").join("-") },

        },mounted: function( ){
            // 등록일 datepicker 처리
            $('#registerDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                console.log("Data Picker changeDate : ", dateString(event.date) )
                itemList.item.registerDate =  dateString(event.date);
            });

            // 만료일 datepicker 처리
            $('#expireDate').datepicker({
                format: "yyyy-mm-dd",	//데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )
                autoclose : true,	//사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
                startDate: '-10d',	//달력에서 선택 할 수 있는 가장 빠른 날짜. 이전으로는 선택 불가능 ( d : 일 m : 달 y : 년 w : 주)
                language : "ko"	//달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.
            }).on('changeDate', function (event) {
                itemList.item.expireDate =  dateString(event.date);
            });

        }

    });


    window.itemList = itemList

})(jQuery);