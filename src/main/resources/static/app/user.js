(function ($) {

    var maxBtnSize = 7;              // 검색 하단 최대 범위
    var indexBtn = [];               // 인덱스 버튼

    //*** common functions *** //
    // Date 객체를 format에 맞는 string으로 변환
    $(document).ready(function () {
        search( 0 )
        $.get( '/api/team/list' ,function (response) {
            conditions.teams    = response.data
            employeeModal.teams = response.data
        });

        $.get( '/api/department/list' ,function (response) {
            conditions.departments      = response.data
            employeeModal.departments   = response.data
        });
    });
    function dateString( date ){
        return date.getFullYear()+ '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    }
    // 데이터 받아오기
    function search( index, param ) {
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
        }
        ,methods: {
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
            createItem  : function ( ) {
                search( pagination.currentPage ,this.item );
                employeeModal.item  = $.extend(true, {},
                {
                    id          :   "",
                    name        :   "",
                    phone       :   "",
                    email       :   "",
                    team        :   "",
                    department  :   "",
                    position    :   "",
                } );

                employeeModal.mode           = 0;
                employeeModal.teamName       = "";
                employeeModal.departmentName = "";

                $('#employeeModal').modal();
            },
            searchItem  : function ( ) {
                search( pagination.currentPage ,this.item );
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
                employeeModal.item  = $.extend(true, {}, item);

                employeeModal.mode           = 1;

                employeeModal.teamName       = employeeModal.teams[item.teamId];

                employeeModal.departmentName = employeeModal.departments[item.depId];

                $('#employeeModal').modal();

            }
        }
    });

    let employeeModal = new Vue({
        el : '#employeeModal',
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
            mode            :   0,  // modal type 지정 0:create / 1:update
            teams           :   "",
            teamName        :   "",

            departments     :   "",
            departmentName  :   "",
        },methods   : {
            depHandler : function ( ) {
                Object.entries(this.departments).filter(item=>item[1]==this.departmentName)?.map(item=>{
                    this.item.depId   = item[0];
                })
            },
            teamHandler : function ( ) {
                Object.entries(this.teams).filter(item=>item[1]==this.teamName)?.map(item=>{
                    this.item.teamId   = item[0];
                })
            },
            createItem  : function ( ) {
                $('#createButton').attr('disabled', true);

                let registerUser = 1;

                let postBody = Object.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="")) )
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log('postBody : ',postBody)

                $.ajax({
                    type: 'POST',
                    url: '/api/employee',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( pagination.currentPage, conditions.item );
                        toastr.success('사원 등록 완료');
                        $('#employeeModal').modal("hide");
                        this.item = { };
                        $('#createButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('사원 등록 실패');
                        $('#createButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            updateItem  : function ( ) {
                $('#updateButton').attr('disabled', true);

                let registerUser = 1;

                let postBody = Object.entries( this.item )
                    .filter( (v)=>( (v[1]!=null)&&(v[1]!="")) )
                    .reduce( (acc,cur)=>{ acc[cur[0]] = cur[1]; return acc;  }, {} );

                // update user 등록 부분
                postBody['updateUser']      = registerUser;
                postBody['registerUser']    = registerUser

                console.log('postBody : ',postBody)

                $.ajax({
                    type: 'PUT',
                    url: '/api/employee',
                    data: JSON.stringify({'data':postBody}), // or JSON.stringify ({name: 'jonas'}),
                    success: function(data) {
                        search( pagination.currentPage, conditions.item );
                        toastr.success('사원 수정 완료');
                        $('#employeeModal').modal("hide");
                        this.item = { };
                        $('#updateButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('사원 수정 실패');
                        $('#updateButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
            deleteItem  : function ( ) {
                $('#deleteButton').attr('disabled', true);

                $.ajax({
                    type: 'DELETE',
                    url: '/api/employee/'+this.item.id,
                    success: function( data ) {
                        search( pagination.currentPage, conditions.item );
                        toastr.success('사원 삭제 완료');
                        $('#employeeModal').modal("hide");
                        this.item = { };
                        $('#deleteButton').attr('disabled', false);
                    },
                    error: function( ){
                        toastr.error('사원 삭제 실패');
                        $('#deleteButton').attr('disabled', false);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            },
        },mounted : function (){
            $('#enteredDate').datepicker({
                format: "yyyy-mm-dd",	
                autoclose : true,	
                startDate: '-10d',
            }).on('changeDate', function (event) {
                employeeModal.item.enteredDate =  dateString(event.date);
            })
        }
    });

})(jQuery);