(function ($) {

    let indexBtn    = [];             // 인덱스 버튼
    let maxBtnSize  = 7;              // 검색 하단 최대 범위
    let placeList   = [];

    // 초기 설정 받아오기
    function getSetting( ) {
        $.get("/api/placeList", function(response){
            console.log("response.data : ",response.data)
            modalList['teams'].placeList        = response.data;
            modalList['departments'].placeList  = response.data ;
        });

        $.get("/api/departmentList", function(response){
            console.log("response.data : ",response.data)
            modalList['teams'].departmentList   = response.data;
        });
    }

    $(document).ready(function () {
        search(0, window.registerUser, 'teams');
        search(0, window.registerUser, 'places');
        search(0, window.registerUser, 'departments');
        getSetting( );

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

    // 데이터 받아오기
    function search( index, registerUser, tabName ) {
        $.get("/api/"+tabName+"?page="+index+"&registerUser="+registerUser, function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            paginationList[tabName] = response.pagination;

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
                modalList['departments'].mode          = 1;
                modalList['departments'].pageMode      = 1;
                modalList['departments'].selectedItem  = $.extend(true, {}, item );

                modalList['departments'].selectedItem.placeId = item.id;
                modalList['departments'].address = item.address;
                modalList['departments'].addressDetail = item.addressDetail;

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
                modalList['departments'].mode         = 0;
                modalList['departments'].selectedItem = { }
                $("#departmentModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#departmentModal").modal().off()
            },
            deleteHandler : function( evnet ){
                console.log(" departmentList.selectedItemList : ",departmentList.selectedItemList )
                let IDs = Object.keys(departmentList.selectedItemList);

                let result = {
                    total           :   IDs.length,
                    results         :   [],
                    alertHandler    :   function (){
                        if( this.total == this.results.length ) {
                            search(0, window.registerUser, 'departments');
                            let wait = alert( 'delete done' );
                            if(!wait) $('#departmentModal').modal("hide");
                            this.results    = [];
                        }
                    },
                    createHandler   :   function ( data ){
                        this.results.push(data);
                    },
                    errorHandler    :   function ( data ){
                        this.results.push(data);
                    },
                }

                IDs.map((id)=>{
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/department/'+id,
                        success: function(data) {
                            result.createHandler( data );
                            result.alertHandler( );
                        },
                        error   : function(data) {
                            result.errorHandler( data );
                            result.alertHandler( );
                        },
                    });
                });

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
            mode                : 0, // 0 : create / 1 : update
            name                : "",
            selectedItem        : {
                name            : "",
                head            : "",
                headDate        : "",
                phone           : "",
                fax             : "",
                id              : "",
                address         : "",
                addressDetail   : "",
            },

            placeList           : [],
            selectedPlace       : "",
            address             : "",
            addressDetail       : "",
        },
        methods: {
            createItem : function ( registerUser ){
                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser;

                console.log("postBody : ",postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/department',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'departments');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#departmentModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( updateUser ) {
                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser'] = updateUser;

                $.ajax({
                    type: 'PUT',
                    url: '/api/department',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'departments');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#departmentModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler: function ( event ){
                if( !this.validation() ){ $('#departmentModal').modal("hide"); }
            },
            validation: function(){
                let originData = Lists['departments'].itemList.filter((item)=>(item.id==modalList['departments'].selectedItem.id))[0];
                return (originData == null ) ?
                    false : Object.entries( modalList['departments'].selectedItem ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
            },
            changeHandler: function (){
                this.placeList.filter(item=>item.name==this.selectedPlace)?.map(item=>{
                    modalList['departments'].selectedItem.placeId = item.id;
                    modalList['departments'].address = item.address;
                    modalList['departments'].addressDetail = item.addressDetail;
                })
            },
        },
        mounted: function( ) {
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
    let teamList        = new Vue({
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
                modalList['teams'].mode          = 1;
                modalList['teams'].pageMode      = 1;
                modalList['teams'].selectedItem  = $.extend(true, {}, item );

                $('#teamModal').modal()
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
    let teamPagination  = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let teamShowPage    = new Vue({
        el : '#teamShowPage',
        data : {
            totalElements       : 0,
            currentPage         : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },
        methods:{
            createHandler : function( evnet ){
                modalList['teams'].mode         = 0;
                modalList['teams'].selectedItem = { }
                $("#teamModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#teamModal").modal().off()
            },
            deleteHandler : function( evnet ){
                console.log(" addressList.selectedItemList : ",addressList.selectedItemList)
                let IDs = Object.keys(addressList.selectedItemList);

                let result = {
                    total           :   IDs.length,
                    results         :   [],
                    alertHandler    :   function (){
                        if( this.total == this.results.length ) {
                            search(0, window.registerUser, 'teams');
                            let wait = alert('data: ' );
                            if(!wait) $('#teamModal').modal("hide");
                        }
                    },
                    createHandler   :   function ( temp ){
                        this.results.push(temp);
                    }
                }

                IDs.map((id)=>{
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/team/'+id,
                        success: function(data) {
                            result.createHandler( );
                            result.alertHandler( );
                        }
                    });
                });

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
    let teamModal       = new Vue({
        el: '#teamModal',
        data: {
            mode                : 0, // 0 : create / 1 : update
            pageMode            : 0,    // modal type 지정  0:create / 1:update
            selectedItem        : {},

            placeList           : [],
            selectedPlace       : "",
            address             : "",
            addressDetail       : "",

            departmentList      : [],
            selectedDepartment  : [],
        },
        methods: {
            createItem : function ( registerUser ){
                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log("postBody : ",postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/team',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'teams');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#teamModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( updateUser ) {
                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser'] = updateUser;

                $.ajax({
                    type: 'PUT',
                    url: '/api/team',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'teams');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#teamModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler: function ( event ){
                if( !this.validation() ){ $('#teamModal').modal("hide"); }
            },
            validation: function(){
                let originData = Lists['teams'].itemList.filter((item)=>(item.id==modalList['teams'].selectedItem.id))[0];
                return (originData == null ) ?
                    false : Object.entries( modalList['teams'].selectedItem ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
            },
            placeHandler: function (){
                this.placeList.filter(item=>item.name==this.selectedPlace)?.map(item=>{
                    modalList['teams'].selectedItem.placeId = item.id;
                    modalList['teams'].address = item.address;
                    modalList['teams'].addressDetail = item.addressDetail;
                })
            },
            departmentHandler: function (){
                this.departmentList.filter(item=>item.name==this.selectedDepartment)?.map(item=>{
                    console.log( "item.id : ",item.id )
                    modalList['teams'].selectedItem.depId = item.id;
                })
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


    // 위치 리스트
    let addressList         = new Vue({
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
                modalList['places'].mode          = 1;
                modalList['places'].pageMode      = 1;
                modalList['places'].selectedItem  = $.extend(true, {}, item );

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
    let addressPagination   = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let addressShowPage     = new Vue({
        el : '#addressShowPage',
        data : {
            totalElements       : 0,
            currentPage         : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },
        methods:{
            createHandler : function( evnet ){
                modalList['places'].mode         = 0;
                modalList['places'].selectedItem = { }
                $("#addressModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#addressModal").modal().off()
            },
            deleteHandler : function( evnet ){
                window.evnetevnet = evnet
                let IDs = Object.keys(addressList.selectedItemList);

                let result = {
                    total           :   IDs.length,
                    results         :   [],
                    alertHandler    :   function (){
                        if( this.total == this.results.length ) {
                            search(0, window.registerUser, 'places');
                            let wait = alert( 'delete done' );
                            if(!wait) $('#addressModal').modal("hide");
                            this.results    = [];

                            Object.keys( showPages['places']._data ).map( (key)=>{ console.log("key : ",key);showPages['places'][key]=0;} )
                        }
                    },
                    createHandler   :   function ( temp ){
                        this.results.push(temp['type']='done');
                    },
                    errorHandler   :   function ( temp ){
                        this.results.push(temp['type']='error');
                    }
                }

                IDs.map((id)=>{
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/place/'+id,
                        success : function(data) {
                            result.createHandler( data );
                            result.alertHandler( );
                        },
                        error   : function(data) {
                            result.errorHandler(data );
                            result.alertHandler( );
                        },
                    });
                });
            },
        }
    });
    // 페이지 버튼 리스트
    let addressPageBtnList  = new Vue({
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
    let addressModal        = new Vue({
        el: '#addressModal',
        data: {
            mode                : 0, // 0 : create / 1 : update
            pageMode            : 0,    // modal type 지정  0:create / 1:update
            selectedItem        : {},
        },methods: {
            createItem : function ( event, registerUser ){

                window.testEvent = event;

                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                $.ajax({
                    type: 'POST',
                    url: '/api/place',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'places');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#addressModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( event, updateUser ) {
                let postBody = Object.entries(this.selectedItem)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser'] = updateUser;

                $.ajax({
                    type: 'PUT',
                    url: '/api/place',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search(0, window.registerUser, 'places');
                        let wait = alert('data: ' + data);
                        if(!wait) $('#addressModal').modal("hide");
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler: function ( event ){
                if( !this.validation() ){ $('#addressModal').modal("hide"); }
            },
            validation: function(){
                let originData = Lists['places'].itemList.filter((item)=>(item.id==modalList['places'].selectedItem.id))[0];
                return (originData == null ) ?
                    false : Object.entries( modalList['places'].selectedItem ).reduce( ( acc, cur )=>{ return acc || (originData[cur[0]]!=cur[1]) }, false )
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


    const showPages      = {
        "departments"    : departmentShowPage,
        "teams"          : teamShowPage,
        "places"         : addressShowPage
    };

    const Lists          = {
        "departments"    : departmentList,
        "teams"          : teamList,
        "places"         : addressList
    };

    const pageBtnList    = {
        "departments"    : departmentPageBtnList,
        "teams"          : teamPageBtnList,
        "places"         : addressPageBtnList
    };

    const paginationList = {
        "departments"    : departmentPagination,
        "teams"          : teamPagination,
        "places"         : addressPagination
    };

    const modalList      = {
        "departments"    : departmentModal,
        "teams"          : teamModal,
        "places"         : addressModal
    };


    // for test
    window.Lists            = Lists;
    window.pageBtnList      = pageBtnList;
    window.showPages        = showPages;
    window.paginationList   = paginationList;
    window.registerUser     = 1;
    window.updateUser       = 1;
    window.modalList        = modalList;


})(jQuery);