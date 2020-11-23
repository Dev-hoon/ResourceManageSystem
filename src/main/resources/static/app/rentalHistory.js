(function ($) {

    var maxBtnSize = 7;              // 검색 하단 최대 범위
    var indexBtn = [];               // 인덱스 버튼

    //*** common functions *** //
    // Date 객체를 format에 맞는 string으로 변환
    $(document).ready(function () {
        search(0,[], false)
        $.get( '/api/team/list' ,function (response) {
            conditions.teams    = response.data
        });

        $.get( '/api/department/list' ,function (response) {
            conditions.departments      = response.data
        });

        $('#employeeBox').boxWidget('expand');
    });
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 데이터 받아오기
    function search( index, param, collapse ) {
        let Parameter;

        if( param ){
            Parameter = Object.entries( param )
                .filter( (item)=>(item[1]!=null)&&(item[1]!="") )
                .map( item=>item.join("=") )
        }

        $.get( ["/api/employees?page="+index].concat(Parameter).join('&'), function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            pagination = response.pagination;

            //전체 페이지
            showPage.totalPages         = pagination.totalPages;
            showPage.totalElements      = pagination.totalElements;
            showPage.currentElements    = pagination.currentElements;
            showPage.currentPage        = pagination.currentPage+1;

            // 검색 데이터
            employeeList.items = response.data ;

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

            if(collapse){
                $('#conditionBox').boxWidget('collapse');
                $('#employeeBox').boxWidget('expand');
                $('#historyBox').boxWidget('collapse');
            }
        });
    }
    // 데이터 받아오기
    function searchHistory(index, param, collapse ) {
        let URL = "/api/rental/history?page="+index;

        if( param ){
            URL = URL + '&empId=' + param.id
        }

        historyList.item = param;

        $.get( URL , function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            historyPagination = response.pagination;

            //전체 페이지
            historyShowPage.totalPages         = historyPagination.totalPages;
            historyShowPage.totalElements      = historyPagination.totalElements;
            historyShowPage.currentElements    = historyPagination.currentElements;
            historyShowPage.currentPage        = historyPagination.currentPage+1;

            // 검색 데이터
            historyList.setItemList( response.data );



            // 이전버튼
            if(historyPagination.currentPage === 0){
                $('#previousBtn').addClass("disabled")
            }else{
                $('#previousBtn').removeClass("disabled")
            }
            // 다음버튼
            if(historyPagination.currentPage === historyPagination.totalPages-1){
                $('#nextBtn').addClass("disabled")
            }else{
                $('#nextBtn').removeClass("disabled")
            }

            // 페이징 버튼 처리
            var temp = Math.floor(historyPagination.currentPage / maxBtnSize);
            for(var i = 1; i <= maxBtnSize; i++){
                var value = i+(temp*maxBtnSize);

                if(value <= historyPagination.totalPages){
                    indexBtn.push(value)
                }
            }

            // 페이지 버튼 셋팅
            historyPageBtnList.btnList = indexBtn;

            // 색상처리
            setTimeout(function () {
                $('li[btn_id]').removeClass( "active" );
                $('li[btn_id='+(historyPagination.currentPage+1)+']').addClass( "active" );
            },50)


        });
    }


    // 상세 조회 처리 데이터
    let conditions = new Vue({
        el : '#queryConditions',
        data : {
            item : {
                id          :   "",
                name        :   "",
                phone       :   "",
                email       :   "",
                team        :   "",
                department  :   "",
                position    :   "",
            },
            teams           : "",
            teamName        : "",

            departments     : "",
            departmentName  : "",
        },
        methods: {
            initItem    : function ( ) {
                this.item = {
                    id          :   "",
                    name        :   "",
                    phone       :   "",
                    email       :   "",
                    teamId      :   "",
                    depId:   "",
                    position    :   "",
                },
                this.teamName        = ""
                this.departmentName  = ""
            },
            searchItem  : function ( ) {
                search( pagination.currentPage ,this.item, true );
            },
            teamHandler : function ( ) {
                Object.entries(this.teams).filter(item=>item[1]==this.teamName)?.map(item=>{
                    this.item.teamId   = item[0];
                })
            },
            depHandler : function ( ) {
                Object.entries(this.departments).filter(item=>item[1]==this.departmentName)?.map(item=>{
                    this.item.depId   = item[0];
                })
            }
        }
    });

    //*** grid vue *** //
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
    var employeeList = new Vue({
        el : '#employeeList',
        data : {
            items : {}
        },methods   : {
            rowHandler      :   function( event, item ) {
                historyList.item = item;

                searchHistory( pagination.currentPage, item )

                $('#conditionBox').boxWidget('collapse')
                $('#employeeBox').boxWidget('collapse')
                $('#historyBox').boxWidget('expand')

            }
        }
    });


    //*** grid vue *** //
    // 페이징 처리 데이터
    let historyPagination = {
        totalPages         :  0,       // 전체 페이지수
        totalElements      :  0,       // 전체 데이터수
        currentPage        :  0,       // 현재 페이지수
        currentElements    :  0,        // 현재 데이터수
        amountPerPage      :  10,
    };
    // 페이지 정보
    let historyShowPage = new Vue({
        el : '#historyShowPage',
        data : {
            totalPages       : 0,
            currentElements  : 0,
            totalElements    : 0,
            currentPage      : 0,
            selectedElements : 0,    // 현재 조건 중 선택된 값들의 수
        }
    });
    // 페이지 버튼 리스트
    let historyPageBtnList = new Vue({
        el : '#historyPageBtn',
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
    let historyList = new Vue({
        el : '#historyList',
        data : {
            item             : {},
            items            : {},
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0 ,

            teams           : "",
            teamName        : "",

            departments     : "",
            departmentName  : "",
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
        }
    });

})(jQuery);