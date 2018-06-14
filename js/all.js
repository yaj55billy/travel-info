

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
    location.addEventListener('change',bodySlider);

    // 點擊熱門區域，click後執行areaFilter
    var hotBtn = document.querySelectorAll('.hot-list li');
    for(var i = 0 ; i<hotBtn.length; i++){
        hotBtn[i].addEventListener('click',hotFilter);
        hotBtn[i].addEventListener('click',bodySlider);
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
        pageChange(filterData);
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
        pageChange(filterData);
    }

    function bodySlider(){
        $('html,body').animate({scrollTop:$('#content').offset().top},1000);
    }
}

// 頁碼
var page = document.querySelector(".page_no");

var pageNum = 6;
var nowPage = 1;

function pageChange(array){
    // console.log(array);
    var result = [];
    var btnStr = "";

    for(var i=0 ; i<array.length ; i+=pageNum){

      result.push(array.slice(i,i+pageNum));
      console.log(result.length);
      btnStr += '<button class="page"><a href="#">'+ result.length +'</a></button>';
    }
    
    page.innerHTML = '<button class="page_prev"><a href="#"><p> < prev </p></a></button>'+'<div class="page_ul">'+ btnStr +'</div>' + '<button class="page_next"><a href="#"><p> next > </p></a></button>';


    // 如果總資料超過每頁上限 顯示頁數
    if (array.length > pageNum){
        page.style.display = "block";
      
    }else{
        page.style.display = "none";
    }

    var startInfo = (nowPage-1) * pageNum + 1; 
    //開始顯示的資料
    var endInfo = nowPage * pageNum; 
    //最後顯示的資料
    
    page.addEventListener('click',function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop:$('#content').offset().top},1000);
        var num = e.target.textContent;
        startInfo = (num-1) * pageNum + 1;
        endInfo = num * pageNum;
        updateContent(startInfo,endInfo,array);
    });

    if(nowPage ==1){
        console.log('第一頁');
    }

    console.log(array);
    updateContent(startInfo,endInfo,array);
    
  }


var content = document.querySelector('.content-list');


// 組字串
function updateContent(startInfo,endInfo,array){

    console.log(startInfo);
    console.log(endInfo);
    
    var str = '';

    // 如果資料未滿4筆時，則將endInfo帶入陣列長度，例如array只有2筆資料
    // ，但如果endInfo為4時，則for迴圈跑的第2、第3筆將會出錯
    if(array.length < endInfo){
        endInfo = array.length;
    }
    
    for (var i =startInfo-1; i< endInfo; i++) {
        console.log(array[i].Picture1);
        console.log(array[i].Name);
        
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

}



$(".go-top").click(function(){

    $("html,body").animate({scrollTop:0},800);
    return false;

});



















