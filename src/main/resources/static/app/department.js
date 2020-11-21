(function ($) {

    let indexBtn    = [];             // 인덱스 버튼
    let maxBtnSize  = 7;              // 검색 하단 최대 범위


    //*** condition vue *** //
    // 데이터 받아오기
    function getDepartmentList( ) {
        $.get("/api/departmentList", function(response){
            modalList['teams'].departmentList   = response.data;
        });
    }
    function getAddressList( ) {
        $.get("/api/placeList", function(response){
            modalList['teams'].placeList        = response.data;
            modalList['departments'].placeList  = response.data ;
        });
    }
    function search( index, tabName ) {

        //for test
        let registerUser = 1;

        $.get("/api/"+tabName+"?page="+index+"&registerUser="+registerUser, function (response) {

            // 페이징 처리 데이터
            indexBtn = [];
            paginationList[tabName] = response.pagination;

            //전체 페이지
            showPages[tabName].totalPages       = paginationList[tabName].totalPages;
            showPages[tabName].totalElements    = paginationList[tabName].totalElements;
            showPages[tabName].currentElements  = paginationList[tabName].currentElements;
            showPages[tabName].currentPage      = paginationList[tabName].currentPage+1;

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
    function dateString( date ){
        return date.getFullYear()+ '-' + date.getMonth().toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }

    $(document).ready(function () {
        search(0, 'teams');
        search(0, 'places');
        search(0, 'departments');
        getAddressList( );
        getDepartmentList( );

        // address에 모두 선택 처리
        $('#selectAllAddress').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                Lists['places'].items.map( (element) =>{
                    Object.defineProperty( Lists['places'].items, element.id, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                Lists['places'].items.map( (element) =>{
                    delete Lists['places'].items[element.id]
                })
            }

            showPages['places'].selectedElements = Object.entries( Lists['places'].items ).length

            Lists['places'].amountSelect = 10;
        });
        
    });

    //*** grid vue *** //
    // 부서 리스트
    let departmentList = new Vue({
        el : '#departmentList',
        data : {
            items        : {},
            selectedItem : {},
            amountSelect : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.items   = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            rowHandler          : function( event, item ){
                modalList['departments'].mode           = 1;
                modalList['departments'].item           = $.extend(true, {}, item );

                modalList['departments'].item.placeId   = item.placeId;
                modalList['departments'].addressName    = item.addressName;
                modalList['departments'].address        = item.address;
                modalList['departments'].addressDetail  = item.addressDetail;

                $('#departmentModal').modal()
            },
            CheckHandler        : function( event ){
                event.stopImmediatePropagation();

                let seletedItem = this.items?.[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPages['departments'].selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

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
            totalPages          : 0,
            totalElements       : 0,
            currentPage         : 0,
            currentElements     : 0,
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
                console.log(" departmentList.selectedItem : ",departmentList.selectedItem )
                let IDs = Object.keys(departmentList.selectedItem);

                let result = {
                    total           :   IDs.length,
                    results         :   [],
                    alertHandler    :   function (){
                        if( this.total == this.results.length ) {
                            search(0, 'departments');
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
                search(id-1, "department" );;
            },
            previousClick:function (event) {
                if(departmentPagination.currentPage !== 0){
                    search(departmentPagination.currentPage-1, "department" );
                }
            },
            nextClick:function (event) {
                if(departmentPagination.currentPage !== departmentPagination.totalPages-1){
                    search(departmentPagination.currentPage+1, "department" );
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
            mode            : 0, // 0 : create / 1 : update
            name            : "",
            item            : { },

            placeList       : [ ],
            address         : "",
            addressName     : "",
            addressDetail   : "",
        },
        methods: {
            deleteItem  : function ( ) {
                $('#deleteDepButton').attr('disabled', true);
                $.ajax({
                    type: 'DELETE',
                    url: '/api/department/'+this.item.id,
                    success: function(data) {
                        search( paginationList['departments'].currentPage, 'departments' );
                        getDepartmentList( );
                        alert('부서 삭제 완료.');
                        $('#departmentModal').modal("hide");
                        this.item = { };
                        $('#deleteDepButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('부서 삭제 실패.');
                        $('#deleteDepButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            createItem      : function ( registerUser ){
                $('#createDepButton').attr('disabled', true);

                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!="")&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser;

                $.ajax({
                    type: 'POST',
                    url: '/api/department',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) {
                        search( paginationList['departments'].currentPage, 'departments' );
                        getDepartmentList( );
                        alert('부서 등록 완료.');
                        $('#departmentModal').modal("hide");
                        this.item = { };
                        $('#createDepButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('부서 등록 실패.');
                        $('#createDepButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem      : function ( updateUser ) {
                $('#updateDepButton').attr('disabled', true);
                let postBody = Object.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser'] = updateUser;

                $.ajax({
                    type: 'PUT',
                    url: '/api/department',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) {
                        search( paginationList['departments'].currentPage, 'departments' );
                        getDepartmentList( );
                        alert('부서 수정 완료.');
                        $('#departmentModal').modal("hide");
                        this.item = { };
                        $('#updateDepButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('부서 수정 실패.');
                        $('#updateDepButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler    : function ( event ){
                this.item = { };
                $('#departmentModal').modal("hide");
            },
            addressHandler  : function ( ){
                this.placeList.filter(item=>item.name==this.addressName)?.map(item=>{
                    this.item.placeId   = item.id;
                    this.addressName    = item.name;
                    this.address        = item.address;
                    this.addressDetail  = item.addressDetail;
                })
            },
        },
    })


    //*** grid vue *** //
    // 팀 리스트
    let teamList        = new Vue({
        el : '#teamList',
        data : {
            items         : {},
            selectedItem  : {},
            amountSelect  : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.items = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            rowHandler          : function( event, item ){
                modalList['teams'].mode         = 1;
                modalList['teams'].item         = $.extend(true, {}, item );

                modalList['teams'].item.placeId     = item.placeId;
                modalList['teams'].address          = item.address;
                modalList['teams'].addressName      = item.addressName;
                modalList['teams'].addressDetail    = item.addressDetail;

                modalList['teams'].item.depId       = item.departmentId;
                modalList['teams'].departmentName   = item.departmentName;


                $('#teamModal').modal().off()
            },
            CheckHandler        : function( event ){
                let seletedItem = this.items?.[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPages['teams'].selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

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
            totalPages          : 0,
            totalElements       : 0,
            currentPage         : 0,
            currentElements     : 0,
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
                let IDs = Object.keys(addressList.selectedItem);

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
                search(id-1, "team" );
            },
            previousClick:function (event) {
                if(teamPagination.currentPage !== 0){
                    search(teamPagination.currentPage-1,  "team" );
                }
            },
            nextClick:function (event) {
                if(teamPagination.currentPage !== teamPagination.totalPages-1){
                    search(teamPagination.currentPage+1, "team" );
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
            item                : {},

            placeList           : [],
            addressName         : "",
            address             : "",
            addressDetail       : "",

            departmentList      : [],
            departmentName      : "",
        },
        methods: {
            deleteItem  : function ( ) {
                $('#deleteTeamButton').attr('disabled', true);
                $.ajax({
                    type: 'DELETE',
                    url: '/api/team/'+this.item.id,
                    success: function(data) {
                        search( paginationList['teams'].currentPage, 'teams' );
                        alert('팀 삭제 완료.');
                        $('#teamModal').modal("hide");
                        $('#deleteTeamButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('팀 삭제 실패.');
                        $('#deleteTeamButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            createItem      : function ( registerUser ){
                $('#createTeamButton').attr('disabled', true);

                let postBody = Object.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log("team create postBody : ",postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/team',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) {
                        search( paginationList['teams'].currentPage, 'teams' );
                        alert('팀 등록 완료.');
                        $('#teamModal').modal("hide");
                        this.item = { };
                        $('#createTeamButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('팀 등록 실패.');
                        $('#createTeamButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem      : function ( updateUser ) {
                $('#updateTeamButton').attr('disabled', false);

                let postBody = Object?.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                postBody['updateUser'] = updateUser;

                console.log("team update postBody : ",postBody)

                $.ajax({
                    type: 'PUT',
                    url: '/api/team',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) {
                        search( paginationList['teams'].currentPage, 'teams' );
                        alert('팀 수정 완료.');
                        $('#teamModal').modal("hide");
                        this.item = { };
                        $('#updateTeamButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('팀 수정 실패.');
                        $('#updateTeamButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler    : function ( event ){
                this.item = { };
                $('#teamModal').modal("hide");
            },
            addressHandler  : function (){
                this.placeList.filter(item=>item.name==this.addressName)?.map(item=>{
                    this.item.placeId     = item.id;
                    this.address          = item.address;
                    this.addressName      = item.name;
                    this.addressDetail    = item.addressDetail;
                })
            },
            departmentHandler: function (){
                this.departmentList.filter(item=>item.name==this.departmentName)?.map(item=>{
                    this.item.depId     = item.id;
                    this.departmentName = item.name;
                })
            },
        }
    })


    // 위치 리스트
    let addressList         = new Vue({
        el : '#addressList',
        data : {
            items        : {},
            selectedItem : {},
            amountSelect : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },
        methods:{
            setItemList         : function( itemList ){
                this.disableAllCheckBox( );
                this.items  = itemList;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            rowHandler          : function( event, item ){
                modalList['places'].mode    = 1;
                modalList['places'].item    = $.extend(true, {}, item );

                $('#addressModal').modal()
            },
            CheckHandler        : function( event ){
                let seletedItem = this.items[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem[seletedItem.id];
                    this.amountSelect -= 1;
                }

                // showPages['places'].selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox      : function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

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
            totalPages          : 0,
            totalElements       : 0,
            currentPage         : 0,
            currentElements     : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        },
        methods:{
            createHandler : function( evnet ){
                modalList['places'].mode    = 0;
                modalList['places'].item    = { }
                $("#addressModal").modal().off()
            },
            updateHandler : function( evnet ){
                $("#addressModal").modal().off()
            },
            deleteHandler : function( evnet ){
                window.evnetevnet = evnet
                let IDs = Object.keys( addressList.selectedItem);

                let result = {
                    total           :   IDs.length,
                    results         :   [],
                    alertHandler    :   function (){
                        if( this.total == this.results.length ) {
                            search(0, 'places');
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
                search(id-1,  "place" );
            },
            previousClick:function (event) {
                if(addressPagination.currentPage !== 0){
                    search(addressPagination.currentPage-1,  "place" );
                }
            },
            nextClick:function (event) {
                if(addressPagination.currentPage !== addressPagination.totalPages-1){
                    search(addressPagination.currentPage+1,  "place" );
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
            mode        : 0,    // modal type 지정  0:create / 1:update
            item        : {},
        },methods: {
            deleteItem  : function ( ) {
                $('#deleteAddressButton').attr('disabled', true);
                $.ajax({
                    type: 'DELETE',
                    url: '/api/place/'+this.item.id,
                    success: function(data) {
                        search( paginationList['places'].currentPage, 'places' );
                        getAddressList( );
                        alert('주소 삭제 완료.');
                        $('#addressModal').modal("hide");
                        this.item = { };
                        $('#deleteAddressButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('주소 삭제 실패.');
                        $('#deleteAddressButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            createItem : function ( event, registerUser ){
                $('#createAddressButton').attr('disabled', true);

                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                $.ajax({
                    type: 'POST',
                    url: '/api/place',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( paginationList['places'].currentPage, 'places' );
                        getAddressList( );
                        alert('주소 등록 완료.');
                        $('#addressModal').modal("hide");
                        this.item = { };
                        $('#createAddressButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('주소 등록 실패.');
                        $('#createAddressButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( event, updateUser ) {
                $('#updateAddressButton').attr('disabled', true);
                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser'] = updateUser;

                $.ajax({
                    type: 'PUT',
                    url: '/api/place',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( paginationList['places'].currentPage, 'places' );
                        getAddressList( );
                        alert('주소 수정 완료.');
                        $('#addressModal').modal("hide");
                        this.item = { };
                        $('#updateAddressButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('주소 수정 실패.');
                        $('#updateAddressButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler: function ( event ){
                this. item = { };
                $('#addressModal').modal("hide");
            }
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