(function ($) {
    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        search(0, window.registerUser, 'places');
        // getSetting();

        // address에 모두 선택 처리
        $('#selectAllAddress').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            console.log("Lists['places'] : ",Lists['places'])

            if(e.target.checked){
                Lists['places'].itemList.map( (element) =>{
                    Object.defineProperty( Lists['places'].selectedItemList, element.id, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                Lists['places'].itemList.map( (element) =>{
                    delete Lists['places'].selectedItemList[element.id]
                })
            }

            showPages['places'].selectedElements = Object.entries( Lists['places'].selectedItemList ).length

            Lists['places'].amountSelect = 10;
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
    function search( index, registerUser, tabName ) {
        $.get("/api/"+tabName+"?page="+index+"&registerUser="+registerUser, function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            paginationList[tabName] = response.pagination;

            console.log("response.pagination; : ", response.pagination)

            //전체 페이지
            showPages[tabName].totalElements      = paginationList[tabName].currentElements;
            showPages[tabName].currentPage        = paginationList[tabName].currentPage+1;

            // 검색 데이터
            Lists[tabName].setItemList( response.data );

            // 이전버튼
            if(paginationList[tabName].currentPage === 0){
                $('#'+tabName+'previousBtn').addClass("disabled")
            }else{
                $('#'+tabName+'previousBtn').removeClass("disabled")
            }
            // 다음버튼
            if(paginationList[tabName].currentPage === paginationList[tabName].totalPages-1){
                $('#'+tabName+'nextBtn').addClass("disabled")
            }else{
                $('#'+tabName+'nextBtn').removeClass("disabled")
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
            pageBtnList[tabName].btnList = indexBtn;

            // 색상처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(paginationList[tabName].currentPage+1)+']').addClass( "active" );
            },50)
        });
    }

    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        return date.getFullYear()+ '-' + date.getMonth().toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }


    // 부서 리스트
    let departmentList = new Vue({
        el : '#departmentList',
        data : {
            showPage         : true,
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.itemList = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItemList.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            itemRowHandler      : function( event, item ){
                departmentModal.pageMode      = 1;
                departmentModal.selectedItem  = $.extend(true, {}, item );

                $('#departmentModal').modal()
            },
            handlerCheckBox     : function( event ){
                event.stopImmediatePropagation();

                let seletedItem = this.itemList[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItemList, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItemList[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPages['departments'].selectedElements = Object.entries( this.selectedItemList ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            disableAllCheckBox  : function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
        }
    });
    // 페이징 처리 데이터
    let departmentPagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let departmentShowPage = new Vue({
        el : '#departmentShowPage',
        data : {
            totalElements       : 0,
            currentPage         : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },methods:{
            createHandler : function( evnet ){
                departmentModal.selectedItem = { }
                $("#departmentModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#departmentModal").modal().off()
            },
            deleteHandler : function( evnet ){

            },
        }
    });
    // 페이지 버튼 리스트
    let departmentPageBtnList = new Vue({
        el : '#departmentPageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1, window.registerUser, "department" );;
            },
            previousClick:function (event) {
                if(departmentPagination.currentPage !== 0){
                    search(departmentPagination.currentPage-1, window.registerUser, "department" );
                }
            },
            nextClick:function (event) {
                if(departmentPagination.currentPage !== departmentPagination.totalPages-1){
                    search(departmentPagination.currentPage+1, window.registerUser, "department" );
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(departmentPagination.currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    //department modal
    let departmentModal = new Vue({
        el: '#departmentModal',
        data: {
            name    : "",
            selectedItem    : {
                name            : "",
                head            : "",
                headDate        : "",
                phone           : "",
                fax             : "",
                id              : "",
                address         : "",
                addressDetail   : "",
            },

        },methods: {
            getOriginData   : function( ){
                return Object.entries( Lists.department.itemList ).filter((item)=>(item.id==this.selectedItem.id));
            },
            validation      : function(  ){
                console.log("originData in validation : ",originData)
                return  ( originData )
                    ? Object.entries( originData ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
                    : false;
            },
            closeHandler    : function ( event ){
                console.log('closeHandler !')

                // for test
                console.log( Object.entries(this.selectedItem).filter((item)=>(item[1]!="") ).map((item)=>{console.log(item)}) );

                let originData = this.getOriginData();

                // 신규등록인 경우
                if( originData.length == 0 ){
                    // 입력된 값이 존재하는지 확인
                    let insertedItem = Object.entries(this.selectedItem).filter((item)=>(item[1]!="") );

                    if( insertedItem.length != 0 ){
                        alert("입력된 값이 존재합니다.");
                        return;
                    }
                }
                // 데이터 수정인 경우
                else{

                    this.validation( originData );
                    console.log('originData : ',originData)

                }

                $('#departmentModal').modal("hide");
            },
            updateItem      : function ( updateUser ) {
                Object.entries(this._data.selectedItem).map((t)=>{console.log("T : ",t)});

                console.log( "validation : "+this.validation() )

                let postBody = Object.entries(this.selectedItem)
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
        }
    })



    // 팀 리스트
    let teamList = new Vue({
        el : '#teamList',
        data : {
            showPage         : false,
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.itemList = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItemList.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            itemRowHandler      : function( event, item ){

                teamModal.pageMode      = 1;
                teamModal.selectedItem  = $.extend(true, {}, item );

                $('#itemModal').modal()

            },
            handlerCheckBox     : function( event ){
                console.log("handlerCheckBox")

                event.stopImmediatePropagation();

                let seletedItem = this.itemList[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItemList, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItemList[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPages['teams'].selectedElements = Object.entries( this.selectedItemList ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            disableAllCheckBox  : function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
        }
    });
    // 페이징 처리 데이터
    let teamPagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let teamShowPage = new Vue({
        el : '#teamShowPage',
        data : {
            totalElements       : 0,
            currentPage         : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },methods:{
            createHandler : function( evnet ){
                teamModal.selectedItem = { }
                $("#teamModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#teamModal").modal().off()
            },
            deleteHandler : function( evnet ){

            },
        }
    });
    // 페이지 버튼 리스트
    let teamPageBtnList = new Vue({
        el : '#teamPageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1, window.registerUser, "team" );
            },
            previousClick:function (event) {
                if(teamPagination.currentPage !== 0){
                    search(teamPagination.currentPage-1, window.registerUser, "team" );
                }
            },
            nextClick:function (event) {
                if(teamPagination.currentPage !== teamPagination.totalPages-1){
                    search(teamPagination.currentPage+1, window.registerUser, "team" );
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(teamPagination.currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    //team modal
    let teamModal = new Vue({
        el: '#teamModal',
        data: {
            pageMode            : 0,    // modal type 지정  0:create / 1:update
            selectedItem        : {},
        },methods: {
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
        }
    })


    // 위치 리스트
    let addressList = new Vue({
        el : '#addressList',
        data : {
            showPage         : false,
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.itemList = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItemList.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            itemRowHandler      : function( event, item ){
                addressModal.mode          = 1;
                addressModal.pageMode      = 1;
                addressModal.selectedItem  = $.extend(true, {}, item );
                // addressModal.selectedItem  = new Object( item );
                // addressModal.categories    = new Object( this.itemList.categories );

                console.log("addressModal.selectedItem :",addressModal.selectedItem )

                $('#addressModal').modal()

            },
            handlerCheckBox     : function( event ){
                console.log("handlerCheckBox")

                event.stopImmediatePropagation();

                let seletedItem = this.itemList[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItemList, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItemList[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPages['places'].selectedElements = Object.entries( this.selectedItemList ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            disableAllCheckBox  : function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },
        }
    });
    // 페이징 처리 데이터
    let addressPagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let addressShowPage = new Vue({
        el : '#addressShowPage',
        data : {
            totalElements       : 0,
            currentPage         : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },methods:{
            createHandler : function( evnet ){
                addressModal.mode         = 0;
                addressModal.selectedItem = { }
                $("#addressModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#addressModal").modal().off()
            },
            deleteHandler : function( evnet ){

            },
        }
    });
    // 페이지 버튼 리스트
    let addressPageBtnList = new Vue({
        el : '#addressPageBtn',
        data : {
            btnList : {}
        },
        methods: {
            indexClick: function (event) {
                let id = parseInt( event.target.getAttribute("btn_id") );
                search(id-1, window.registerUser, "place" );
            },
            previousClick:function (event) {
                if(addressPagination.currentPage !== 0){
                    search(addressPagination.currentPage-1, window.registerUser, "place" );
                }
            },
            nextClick:function (event) {
                if(addressPagination.currentPage !== addressPagination.totalPages-1){
                    search(addressPagination.currentPage+1, window.registerUser, "place" );
                }
            }
        },
        mounted:function () {
            // 제일 처음 랜더링 후 색상 처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(addressPagination.currentPage+1)+']').addClass( "active" );
            },50)
        }
    });
    // address modal
    let addressModal = new Vue({
        el: '#addressModal',
        data: {
            mode                : 0, // 0 : create / 1 : update
            pageMode            : 0,    // modal type 지정  0:create / 1:update
            selectedItem        : {},
        },methods: {
            createItem : function ( registerUser ){
                Object.entries(this._data.selectedItem).map((t)=>{console.log("T : ",t)});

                console.log( "validation : "+this.validation() )

                let postBody = Object.entries(this._data.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );


                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log("postBody : ",postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/place',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) { alert('data: ' + data); },function(response){
                        console.log( "response : ",response)
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
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
                    $('#addressModal').modal("hide");
                }else{
                    console.log( "changed ");
                }
            },validation: function(){
                let originData = addressList.itemList.filter((item)=>(item.id==addressModal.selectedItem.id))[0];
                return (originData == null ) ?
                    false : Object.entries( addressModal.selectedItem ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
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
        }
    })


    const showPages = {
        "departments"    : departmentShowPage,
        "teams"          : teamShowPage,
        "places"         : addressShowPage
    };

    const Lists = {
        "departments"    : departmentList,
        "teams"          : teamList,
        "places"         : addressList
    };

    const pageBtnList = {
        "departments"    : departmentPageBtnList,
        "teams"          : teamPageBtnList,
        "places"         : addressPageBtnList
    };

    const paginationList = {
        "departments"    : departmentPagination,
        "teams"          : teamPagination,
        "places"         : addressPagination
    };


    // for test
    window.Lists            = Lists;
    window.pageBtnList      = pageBtnList;
    window.showPages        = showPages;
    window.paginationList   = paginationList;
    window.registerUser     = 1;
    window.updateUser       = 1;


})(jQuery);