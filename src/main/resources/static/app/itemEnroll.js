(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

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

                //validation
                if(this.item.superCate==""||this.item.name==""){
                    toastr.error('이름 또는 대분류가 입력되지 않았습니다.');
                    $('#registerButton').attr('disabled', false);
                    return;
                }


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
                        toastr.success('아이템 등록 완료.');
                        itemList.initItem();
                        $('#registerButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('아이템 등록 실패.');
                        $('#registerButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            registerTemp    : function (e){
                $('#tempButton').attr('disabled', true);

                //validation
                if(this.item.superCate==""||this.item.name==""){
                    toastr.error('이름 또는 대분류가 입력되지 않았습니다.');
                    $('#tempButton').attr('disabled', false);
                    return;
                }

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
                        toastr.success('아이템 임시등록 완료.');
                        itemList.initItem();
                        $('#tempButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('아이템 임시등록 실패.');
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

    let excelList = new Vue({
        el : '#excelList',
        data : {
            items            : {},
            showItems        : {},
            selectedItem     : {},

            btnList          : {},

            currentPage      : 1,
            currentElements  : 0,
            totalPages       : 0,
            totalElements    : 0,
            selectedElements : 0,
            amountSelect     : 0,

        },
        methods: {
            indexClick      : function (event , id ) {
                if( event!=null){ id = parseInt( event.target.getAttribute("btn_id") ); }
                excelList.setItemList( excelList.items.slice( (id-1)*10, id*10 ) );
                excelList.currentPage = id-1;
                excelList.currentElements = excelList.showItems.length;

                this.active();
            },
            previousClick   : function (event) {
                if(excelList.currentPage !== 0){
                    excelList.setItemList( excelList.items.slice( (excelList.currentPage-1)*10, (excelList.currentPage)*10 ) );
                    excelList.currentPage -= 1;
                    excelList.currentElements = excelList.showItems.length;

                    this.active();
                }

            },
            nextClick       : function (event) {
                if(excelList.currentPage !== excelList.totalPages-1){
                    excelList.setItemList( excelList.items.slice( (excelList.currentPage+1)*10, (excelList.currentPage+2)*10 ) );
                    excelList.currentPage += 1;
                    excelList.currentElements = excelList.showItems.length;

                    this.active();
                }

            },
            checkHandler    : function ( event, item ){
                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, item.idx, { value: item, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[item.idx];
                    this.amountSelect -= 1;
                }

                this.selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            active          : function ( ){

                setTimeout(function () {
                    $('li[btn_id]').removeClass( "active" );
                    $('li[btn_id='+(excelList.currentPage+1)+']').addClass( "active" );
                },50)
            },
            denoteCheckBox  : function ( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("idx"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            setItemList     : function (itemList){
                excelList.disableAllCheckBox( );
                excelList.showItems = itemList;
                setTimeout( ()=>{
                    excelList.denoteCheckBox( )
                },50);
            },
            disableAllCheckBox: function ( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
            deleteHandler   : function ( ){
                console.log("selectedItem : ",this.selectedItem)
                Object.keys( this.selectedItem ).map((idx)=>{
                    delete this.items[idx];
                })

                this.selectedItem = {};

                this.currentPage = 0;
                this.showItems   = this.items.slice(0,10);
                this.totalPages  = this.items.length/10
                this.totalElements = this.items.length

                indexBtn = [];

                // 페이징 버튼 처리
                let temp = Math.floor(this.currentPage / maxBtnSize);
                for(let i = 1; i <= maxBtnSize; i++){
                    let value = i+(temp*maxBtnSize);

                    if(value <= this.totalPages){
                        indexBtn.push(value)
                    }
                }

                // 페이지 버튼 셋팅
                this.btnList = indexBtn;

                this.nextClick( null, 0 );
            }

        },mounted: function( ){
            // table에 모두 선택 처리
            $('#selectAll').click(function(e){
                let table= $(e.target).closest('table');
                $('td input:checkbox',table).prop('checked',e.target.checked);

                if(e.target.checked){
                    excelList.showItems.map( (element) =>{
                        Object.defineProperty( excelList.selectedItem, element.idx, { value: element, configurable:true, enumerable:true } );
                    })
                }else{
                    excelList.showItems.map( (element) =>{
                        delete excelList.selectedItem[element.idx]
                    })
                }

                excelList.selectedElements = Object.keys( excelList.selectedItem ).length

                excelList.amountSelect = 10;
            });
            $("#file").on("change", function(event){
                let reg = /(.*?)\.(xlsx)$/;
                let input = event.target;

                if(!input.files[0].name.match(reg)) { toastr.error("선택한 파일이 엑셀파일이 아닙니다.") }
                
                let reader = new FileReader();
                reader.onload = function(){
                    let fileData = reader.result;
                    let wb = XLSX.read(fileData, {type : 'binary'});
                    wb.SheetNames.forEach(function(sheetName){
                        let rowObj =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                        for(i=0;i<rowObj.length;i++){ rowObj[i]['idx'] = i; }
                        excelList.items = rowObj

                        excelList.currentPage = 0;
                        excelList.showItems   = rowObj.slice(0,10);
                        excelList.totalPages  = rowObj.length/10
                        excelList.totalElements = rowObj.length

                        indexBtn = [];

                        // 페이징 버튼 처리
                        let temp = Math.floor(excelList.currentPage / maxBtnSize);
                        for(let i = 1; i <= maxBtnSize; i++){
                            let value = i+(temp*maxBtnSize);

                            if(value <= excelList.totalPages){
                                indexBtn.push(value)
                            }
                        }

                        // 페이지 버튼 셋팅
                        excelList.btnList = indexBtn;

                        // 색상처리
                        setTimeout(function () {
                            $('li[btn_id]').removeClass( "active" );
                            $('li[btn_id='+(excelList.currentPage+1)+']').addClass( "active" );
                        },50)


                        $('#excelModal').modal()
                        $("#file").val("");
                    })
                };
                reader.readAsBinaryString(input.files[0]);
            });
        }
    });

    window.itemList = itemList
    window.excelList = excelList

})(jQuery);