(function ($) {

    $(document).ready(function () {
        $.get("/api/rentals/amount?state=10", function(response){
            modalList['teams'].departmentList   = response.data;
        });

        let ctx = document.getElementById('test').getContext('2d');
        let ctx1 = document.getElementById('test12').getContext('2d');

        console.log("ctx : ",ctx)
        console.log("ctx1 : ",ctx1)

        ctx.canvas.width = 180;
        ctx.canvas.height = 180;

        ctx1.canvas.width = 180;
        ctx1.canvas.height = 180;
        // And for a doughnut chart
        data = {
            datasets:
                [
                    {
                        "label":"My First Dataset",
                        "data":[300,50,100],
                        "backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
                    }
                ],
            labels: [
                '연체 중',
                '대여 중',
                '대여 가능'
            ]
        };
        data1 = {
            datasets:
                [
                    {
                        "label":"My First Dataset",
                        "data":[300,50,100],
                        "backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
                    }
                ],
            labels: [
                '연체 중',
                '대여 중',
                '대여 가능'
            ]

        };

        let pieOptions     = {
            maintainAspectRatio  : false,
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke    : true,
            //String - The colour of each segment stroke
            segmentStrokeColor   : '#fff',
            //Number - The width of each segment stroke
            segmentStrokeWidth   : 2,
            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 50, // This is 0 for Pie charts
            //Number - Amount of animation steps
            animationSteps       : 100,
            //String - Animation easing effect
            animationEasing      : 'easeOutBounce',
            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate        : true,
            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale         : false,
            //Boolean - whether to make the chart responsive to window resizing
            responsive           : true,
            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio  : true,
            //String - A legend template
            legendTemplate       : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        }

        let myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: pieOptions
        });

        let myDoughnutChart1 = new Chart(ctx1, {
            type: 'doughnut',
            data: data1,
            options: pieOptions
        });
    });

    // 데이터 리스트
    let dashboard = new Vue({
        el : '#dashboard',
        data : {
            row1 : {
                requestItem : 0,
                overdueItem : 0,
                weekAddItem : 0,
                expireMonth : 0,
            },
            row2 : {

            },
            row3 : {

            },
        },
    });


})(jQuery);