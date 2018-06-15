

var xhr = new XMLHttpRequest();

xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);

xhr.send(null);

// onload事件
xhr.onload = function(){
    //將整個data 透過JSON.parse轉成物件，並把此物件的總長存取
    var data = JSON.parse(xhr.responseText);
    var dataLen = data.result.records.length;
    
    //將地區選擇存取，如果發生change事件則執行areaFilter
    var location = document.getElementById('location');
    location.addEventListener('change',areaFilter);

    // 點擊熱門區域，click後執行areaFilter
    var hotBtn = document.querySelectorAll('.hot-list li');
    for(var i = 0 ; i<hotBtn.length; i++){
        hotBtn[i].addEventListener('click',hotFilter);
    }

    var contentTitle = document.querySelectorAll('.content-title');

    //location 篩選
    function areaFilter(e){
        // console.log(locationValue); //選到就印出那個區域
        var locationValue = document.getElementById('location').value;
        
        // 抓取li的文字
        var hotFilterArea = e.target.textContent;

        var filterData =[];

        // dataLen為100筆，在這100筆中撈出條件符合的
        for (var i = 0; i< dataLen; i++) {

            //存取 dataArea 為這個物件的區域
            var dataArea = data.result.records[i].Zone;

            if(locationValue == dataArea){
                //filterData 為經過篩選的資料 +入陣列
                filterData.push(data.result.records[i]);   
            }

            if(hotFilterArea == dataArea){
                filterData.push(data.result.records[i]);  
            }
        }

        for(var i =0; i<contentTitle.length; i++){
            contentTitle[i].textContent = locationValue;
        }
        pageProcess(filterData);
    }

    function hotFilter(e){
        // console.log(locationValue); //選到就印出那個區域
        var locationValue = document.getElementById('location').value;
        
        // 抓取li的文字
        var hotFilterArea = e.target.textContent;

        var filterData =[];

        // dataLen為100筆，在這100筆中撈出條件符合的
        for (var i = 0; i< dataLen; i++) {

            //存取 dataArea 為這個物件的區域
            var dataArea = data.result.records[i].Zone;

            if(hotFilterArea == dataArea){
                filterData.push(data.result.records[i]);  
            }
        }

        for(var i =0; i<contentTitle.length; i++){
            contentTitle[i].textContent = hotFilterArea;
        }
        pageProcess(filterData);
    }

}

// ---------------------------------------  以上為選擇行政區跟熱門行政區，選擇後往下pageProcess();


// --------------------------------------- 頁碼的處理
var page = document.querySelector(".page_no");

var pageNum = 4;
var nowPage = 1;

function pageProcess(array){

    var result = [];
    var btnStr = "";
    
    for(var i=0 ; i<array.length ; i+=pageNum){
        // array.slice(i,i+pageNum),做一新陣列，範圍從 i到 i+pageNum
        result.push(array.slice(i,i+pageNum));  
        btnStr += '<button class="page"><a href="#">'+ result.length +'</a></button>';
    }
    page.innerHTML = '<button class="page_prev"><a href="#"><p> < prev </p></a></button>'+'<div class="page_ul">'+ btnStr +'</div>' + '<button class="page_next"><a href="#"><p> next > </p></a></button>';

    // --------------- page.innerHTML 為組頁碼


    var resultLen = result.length;
    
    if (array.length > pageNum){
        page.style.display = "block";
    }else{
        page.style.display = "none";
    }
    // --------------------------  判斷顯示頁數


    var startInfo = (nowPage-1) * pageNum + 1; 
    //開始顯示的資料
    var endInfo = nowPage * pageNum; 
    //最後顯示的資料

    pageJudgment(startInfo,endInfo,array,resultLen);
  }

  // --------------------------------------- 頁碼的處理 END  往下為 判斷點擊的項目

  
  function pageJudgment(startInfo,endInfo,array,resultLen){

    numJudgment(1); //一點擊後，判定為第一頁
    var pageChild = document.querySelectorAll(".page_no .page"); 
    var prevBtn = document.querySelector('.page_prev');
    var nextBtn = document.querySelector('.page_next');
    var num = 1; //num初始
    
    for(i= 0 ;i<pageChild.length;i++){
        pageChild[i].addEventListener('click',function(e){
            e.preventDefault();
            num = e.target.textContent;
            startInfo = (num-1) * pageNum + 1;
            endInfo = num * pageNum;
            numJudgment(num);
            updateContent(startInfo,endInfo,array);
        });
    }

    prevBtn.addEventListener('click',function(e){
        num = Number(num) -1;
        startInfo = (num-1) * pageNum + 1;
        endInfo = num * pageNum;
        numJudgment(num);
        
    });

    nextBtn.addEventListener('click',function(){
        num = Number(num) +1;
        startInfo = (num-1) * pageNum + 1;
        endInfo = num * pageNum;
        console.log(num);
        numJudgment(num);
    });

    function numJudgment(num){

        var prevBtn = document.querySelector('.page_prev');
        var nextBtn = document.querySelector('.page_next');
        var pageChild = document.querySelectorAll(".page_no .page"); 

        // 偵測最後一頁
        if(num == resultLen){
            nextBtn.style.display= 'none';
            prevBtn.style.display= 'inline-block';
            addActive(num);
            updateContent(startInfo,endInfo,array);
        }

        // 偵測第一頁
        if (num == 1){
            //初始渲染
            prevBtn.style.display= 'none';
            nextBtn.style.display= 'inline-block';
            addActive(num);
            updateContent(startInfo,endInfo,array);
        } 

        if(num>1 && num<resultLen){
            prevBtn.style.display= 'inline-block';
            nextBtn.style.display= 'inline-block';
            addActive(num);
            updateContent(startInfo,endInfo,array);
        }

        function addActive(num){
            for(i= 0 ;i<pageChild.length;i++){
                if(num == pageChild[i].textContent){
                    pageChild[i].setAttribute('class','page active');
                } else{
                    pageChild[i].setAttribute('class','page');
                }
            }
        }
    }
  }

var content = document.querySelector('.content-list');

// 組字串
function updateContent(startInfo,endInfo,array){

    var str = '';

    // 如果資料未滿4筆時，則將endInfo帶入陣列長度，例如array只有2筆資料
    // ，但如果endInfo為4時，則for迴圈跑的第2、第3筆將會出錯
    if(array.length < endInfo){
        endInfo = array.length;
    }

    for (var i =startInfo-1; i< endInfo; i++) {

        str = str +  '<li class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'+
            '<div class="list">'+
                '<div class="list-img" style="background-image: url('+array[i].Picture1+')">'+
                    '<div class="list-img-text">'+
                        '<h3>' + array[i].Name +'</h3>'+
                        '<div class="lit-area">'+ array[i].Zone +'</div>'+
                    '</div>'+
                '</div>'+
                '<div class="list-text">'+
                    '<ul>'+
                        '<li class="" id="list-time">'+
                            '<img src="images/icons_clock.png" alt="">'+ array[i].Opentime +
                        '</li>'+
                        '<li class="" id="list-addr">'+
                            '<img src="images/icons_pin.png" alt="">'+ array[i].Add +
                        '</li>'+
                        '<li class="" id="list-phone">'+
                            '<img src="images/icons_phone.png" alt="">'+array[i].Tel +
                        '</li>'+
                    '</ul>'+
                    '<div id="list-ticket"><img src="images/icons_tag.png" alt="">'+array[i].Ticketinfo+'</div>'+
                '</div>'+
            '</div>'+
        '</li>'
    }
    content.innerHTML = str;
    $('html,body').animate({scrollTop:$('#content').offset().top},1000);

}


$(".go-top").click(function(){
    $("html,body").animate({scrollTop:0},800);
    return false;
});





















