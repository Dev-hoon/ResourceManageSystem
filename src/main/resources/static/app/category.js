(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        search( 0 );
        getCategories( );
    });

    //*** common functions *** //
    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        date =  [date.getFullYear(),date.getMonth().toString().padStart(2,'0'),date.getDate().toString().padStart(2,'0')].join("-")
        date = /(?<DateFormat>[0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(date);
        return ( date )? date.groups['DateFormat'] : null ;
    }
    // 데이터 받아오기
    function search(index, param, event) {
        let URL = "/api/categoryList?page="+index;

        if( param != null){
            URL = URL.concat("&",param.map( item=>item.join('=') ).join('&'));
        }

        $.get(URL, function (response) {

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

    function getCategories( ){
        $.get("/api/categories", function(response){
            categoryForm.categories   = response.data;
            categoryForm.selectCate01 = Object.keys(response.data)
        });
    }


    //*** condition vue *** //
    let categoryForm = new Vue({
        el : '#categoryForm',
        data : {
            item : {
                superCate       :   "",
                subCateFirst    :   "",
                subCateSecond   :   "",
                expireDate      :   "",
            },

            expireDate      :   "year",
            categories      :   {},
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],

        },methods: {
            initConditions:     function (e) {
                this.item = {
                    superCate       :   "",
                    subCateFirst    :   "",
                    subCateSecond   :   "",
                    expireDate      :   "",
                }
                this.expireDate      =   "year";
                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];
                
                search(0 )

            },
            handleCate01:       function (e) {
                if( this.categories.hasOwnProperty(this.item.superCate) ){
                    this.selectCate02       = Object.keys( this.categories[this.item.superCate] );
                    this.item.subCateFirst  = ""
                    this.item.subCateSecond = ""
                }
            },
            handleCate02:       function (e) {
                if(this.categories[this.item.superCate].hasOwnProperty(this.item.subCateFirst)){
                    this.selectCate03 = this.categories[this.item.superCate][this.item.subCateFirst];
                    this.item.subCateSecond = ""
                }
            },
            getParameter:       function () {

                let Parameter = Object.entries(this.item)
                    .filter( (item)=>( (item[1].constructor == String) && ( item[1] != "" ) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1];  return acc;} ,{ } );

                Parameter['expireDate'] =
                    (this.item.expireDate != "")?
                        (this.expireDate == "year")? this.item.expireDate * 12 : this.item.expireDate
                        : null

                return Object.entries(Parameter).filter( item => item[1]!=null );

            },
            searchCategories :  function () {

                search(0, this.getParameter() );

                itemList.amountSelect   = 0;

            },
            createcategory  :   function () {
                let postBody = this.getParameter();

                postBody['registerUser'] = 1;

                $.ajax({
                    type: 'POST',
                    url: '/api/category',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) { alert('data: ' + data); },function(response){
                        alert("Category가 등록되었습니다.")
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            setExpireDate :     function ( ){
                this.item.expireDate = /(^[1-9][0-9]{0,2})/.exec(this.item.expireDate)?.[0];
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
            totalPages          : 0,
            currentPage         : 0,
            totalElements       : 0,
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
            amountPerPage       : 10,
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
                search(id-1, categoryForm.getParameter());
            },
            previousClick:function (event) {
                if(pagination.currentPage !== 0){
                    search(pagination.currentPage-1, categoryForm.getParameter() );
                }
            },
            nextClick:function (event) {
                if(pagination.currentPage !== pagination.totalPages-1){
                    search(pagination.currentPage+1, categoryForm.getParameter() );
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
    let itemList = new Vue({
        el : '#itemList',
        data : {
            item        : {},
            selectedItem: {},
            amountSelect: 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },
        methods:{
            setItemList: function( items ){
                this.disableAllCheckBox( );
                this.item   = items;
                setTimeout( ()=>{
                    this.denoteCheckBox( )
                },50);
            },
            rowHandler : function( event, item ){
                categoryModal.pageMode          = 1;
                categoryModal.item              = $.extend(true, {}, item );
                categoryModal.categories        = new Object( categoryForm.categories );
                categoryModal.initCategory( );

                $('#categoryModal').modal().off()
            },
            CheckHandler: function(event){
                let seletedItem = this.item?.[ parseInt( event.target.getAttribute("index") ) ];

                if(event.target.checked){
                    Object.defineProperty( this.selectedItem, seletedItem.id, { value: seletedItem, configurable:true, enumerable:true } );
                    this.amountSelect += 1;
                }else{
                    delete this.selectedItem?.[seletedItem.id];
                    this.amountSelect -= 1;
                }

                showPage.selectedElements = Object.entries( this.selectedItem ).length

                $('#selectAll input').prop('checked',(this.amountSelect==10)? true : false );
            },
            denoteCheckBox: function( ){
                let items = $("#items_table").find( "td input:checkbox" ).toArray()
                    .filter(element=>( this.selectedItem.hasOwnProperty( element.getAttribute("itemId"))) )
                    .map( (element)=>{
                        element.checked = true;
                    })

                this.amountSelect = items.length;

                $('#selectAll input').prop('checked',(items.length==10)? true : false );

            },
            disableAllCheckBox: function( ){
                $("#items_table").find( "td input:checkbox" ).prop('checked',false );
            },

        }
        ,mounted: function(){
            $('#selectAll').click(function(e){
                let table= $(e.target).closest('table');
                $('td input:checkbox',table).prop('checked',e.target.checked);

                if(e.target.checked){
                    itemList.item.map( (element) =>{
                        Object.defineProperty( itemList.selectedItem, element.id, { value: element, configurable:true, enumerable:true } );
                    })
                }else{
                    itemList.item.map( (element) =>{
                        delete itemList.selectedItem[element.id]
                    })
                }

                showPage.selectedElements = Object.entries( itemList.selectedItem ).length

                itemList.amountSelect = 10;
            });
        }
    });

    //*** modal vue *** //
    let categoryModal = new Vue({
        el: '#categoryModal',
        data: {
            item                : {},

            pageMode            : 0,    // modal type 지정  0:create / 1:update
            expireDate          : "year",
            categories          : {},
            selectCate01        : [],
            selectCate02        : [],
            selectCate03        : [],

        },methods: {
            initCategory: function( ){
                this.selectCate01  = Object.keys( this.categories );
                this.selectCate02  = Object.keys( this.categories[this.item.superCate] )
                this.selectCate03  = this.categories[this.item.superCate][this.item.subCateFirst];

            },
            handleCate01: function ( ) {
                if( this.categories.hasOwnProperty( this.item.superCate) ) {
                    this.selectCate02 = Object.keys(this.categories?.[this.item.superCate]);
                    this.item.subCateFirst  = '';
                    this.item.subCateSecond = '';
                }
            },
            handleCate02: function ( ) {
                if (this.categories[this.item.superCate].hasOwnProperty(this.item.subCateFirst)) {
                    this.selectCate03 = this.categories?.[this.item.superCate]?.[this.item.subCateFirst];
                    this.item.subCateSecond = '';
                }
            },
            deleteItem  : function ( ) {
                $('#deleteButton').attr('disabled', true);
                $.ajax({
                    type: 'DELETE',
                    url: '/api/category/'+this.item.id,
                    success: function(data) {
                        search( pagination.currentPage );
                        getCategories( );
                        alert('카테고리 삭제 완료.');
                        $('#categoryModal').modal("hide");
                        $('#deleteButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('카테고리 삭제 실패.');
                        $('#deleteButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( ) {
                $('#updateButton').attr('disabled', true);

                let postBody = Object.entries(this.item)
                    .filter( (v)=>( (v[1]!=null)&&(v[1].constructor!=Object)&&(v[1].constructor!=Array) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser'] = 1;

                $.ajax({
                    type: 'PUT',
                    url: '/api/category',
                    data: JSON.stringify({'data':postBody}),
                    success: function(data) {
                        search( pagination.currentPage );
                        alert('카테고리 수정 완료.');
                        $('#categoryModal').modal("hide");
                        $('#updateButton').attr('disabled', false);
                    },
                    error: function( ){
                        alert('카테고리 수정 실패.');
                        $('#updateButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            closeHandler: function ( event ){
                this.item = { };
                $('#categoryModal').modal("hide");
            },
            setExpireDate :     function ( ){
                this.item.expireDate = /(^[1-9][0-9]{0,2})/.exec(this.item.expireDate)?.[0];
            }
        }
    })

})(jQuery);