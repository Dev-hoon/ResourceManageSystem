(function ($) {

    let maxBtnSize = 7;              // 검색 하단 최대 범위
    let indexBtn = [];               // 인덱스 버튼

    $(document).ready(function () {
        // search(0)

        $.get("/api/categories", function(response){
            categoryForm.categories   = response.data;
            categoryForm.selectCate01 = Object.keys(response.data)
        });

        // table에 모두 선택 처리
        $('#selectAll').click(function(e){
            let table= $(e.target).closest('table');
            $('td input:checkbox',table).prop('checked',e.target.checked);

            if(e.target.checked){
                itemList.itemList.map( (element) =>{
                    Object.defineProperty( itemList.selectedItemList, element.id, { value: element, configurable:true, enumerable:true } );
                })
            }else{
                itemList.itemList.map( (element) =>{
                    delete itemList.selectedItemList[element.id]
                })
            }

            showPage.selectedElements = Object.entries( itemList.selectedItemList ).length

            itemList.amountSelect = 10;
        });

    });

    // Date 객체를 format에 맞는 string으로 변환
    function dateString( date ){
        date =  [date.getFullYear(),date.getMonth().toString().padStart(2,'0'),date.getDate().toString().padStart(2,'0')].join("-")
        date = /(?<DateFormat>[0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(date);
        return ( date )? date.groups['DateFormat'] : null ;
    }

    // 데이터 받아오기
    function search(index,categoryForm) {
        $.get(["/api/categories?page="+index,categoryForm].join('&'), function (response) {
            /* 데이터 셋팅 */
            // 페이징 처리 데이터
            indexBtn = [];
            pagination = response.pagination;

            //전체 페이지
            showPage.totalElements      = pagination.currentElements;
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

    // 상세 조회 처리 데이터
    let categoryForm = new Vue({
        el : '#categoryForm',
        data : {
            superCate       :   "",
            subCateFirst    :   "",
            subCateSecond   :   "",

            categories      :   {},
            selectCate01    :   [],
            selectCate02    :   [],
            selectCate03    :   [],



        },methods: {
            initConditions: function (e) {
                this.superCate       =   "";
                this.subCateFirst    =   "";
                this.subCateSecond   =   "";

                this.selectCate01    =   Object.keys(this.categories);
                this.selectCate02    =   [];
                this.selectCate03    =   [];

            },
            handleCate01: function (e) {
                if( this.categories.hasOwnProperty(this.superCate) ){
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
                return  Object.entries(this._data)
                    .filter( (item)=>( (item[1].constructor == String) && ( item[1] != "" ) ))
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1];  return acc;} ,{ } );
            },
            searchCategories : function () {
                search(0, this.getParameter() );

                itemList.amountSelect       = 0;
                itemList.selectedItemList   = {};

            },
            createcategory  : function () {
                let postBody = this.getParameter();

                console.log(" createcategory : ",this.getParameter() )

                postBody['registerUser'] = 1;

                $.ajax({
                    type: 'POST',
                    url: '/api/category',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) { alert('data: ' + data); },function(response){
                        console.log( "response : ",response)
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            setCreateDate:function ( date ) {
                this.createDate = date;
            },
            setExpireDate:function ( date ) {
                this.expireDate = date;
            },
        }
    });

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
            totalElements       : {},
            currentPage         : {},
            selectedElements    : 0,    // 현재 조건 중 선택된 값들의 수
        }
    });

    // 데이터 리스트
    let itemList = new Vue({
        el : '#itemList',
        data : {
            itemList         : {},
            selectedItemList : {},
            amountSelect     : 0    // 현재 page에서 보여지는 값들중 선택된 값의 수
        },methods:{
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
            itemRowHandler : function( event, item ){
                itemModal.pageMode      = 1;
                itemModal.selectedItem  = $.extend(true, {}, item );
                itemModal.categories    = new Object( categoryForm.categories );
                itemModal.initCategory( );
                itemModal.modalSelectItem    = categoryForm.selectItem;
                itemModal.modalSelectRental  = categoryForm.selectRental;

                $('#itemModal').modal().off()
            },
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

    // for test
    window.registerUser     = 1;
    window.updateUser       = 1;
    window.categoryForm    = categoryForm;

})(jQuery);