



var xhr = new XMLHttpRequest();

//readyState 
//0 創建了XMLHttpRequest，但並沒有連結資料
//1 open 設定了資料，但還沒有傳送資料
//4 撈到資料，數據完全接收

//補充 2表示偵測到 send   3表示loading中，有的檔案內容很大

// get post
//網址
// 同步和非同步
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);

// 同步和非同步
// true 非同步: 不會等資料傳回來，就會繼續往下跑，等到回傳才會自動回傳
// false 同步: 會等資料傳回來，才繼續往下跑
// 較常使用ture的概念，像是現在常用的框架都有非同步概念

xhr.send(null);

// onload事件
xhr.onload = function(){
    //將整個data 透過JSON.parse轉成物件，並把此物件的總長存取
    var data = JSON.parse(xhr.responseText);
    var dataLen = data.result.records.length;
    
    //將地區選擇存取，如果發生change事件則執行areaFilter
    var location = document.getElementById('location');
    location.addEventListener('change',areaFilter);

    //location 篩選
    function areaFilter(){
        var locationValue = document.getElementById('location').value;
        // console.log(locationValue); //選到就印出那個區域

        var filterData =[];

        // dataLen為100筆，在這100筆中撈出條件符合的
        for (var i = 0; i< dataLen; i++) {

            //存取 dataArea 為這個物件的區域
            var dataArea = data.result.records[i].Zone;

            if(locationValue == dataArea){
                //filterData 為經過篩選的資料 +入陣列
                filterData.push(data.result.records[i]);   
            }
        }
        updateContent(filterData,locationValue);
    }

}


var content = document.querySelector('.content-list');

// 組字串

function updateContent(filterData,locationValue){

    console.log(filterData);
    console.log(filterData.length);

    var str = '';
    var contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = locationValue;
    
    for (var i = 0; i< filterData.length; i++) {
        str = str +  `
        <li class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="list">
                <div class="list-img" style="background-image: url(${filterData[i].Picture1})">
                    <div class="list-img-text">
                        <h3>
                            ${filterData[i].Name}
                        </h3>
                        <div class="lit-area">
                            ${filterData[i].Zone}
                        </div>
                    </div>
                </div>
                <div class="list-text">
                    <ul>
                        <li class="" id="list-time">
                            <img src="images/icons_clock.png" alt="">
                            ${filterData[i].Opentime}
                        </li>
                        <li class="" id="list-addr">
                            <img src="images/icons_pin.png" alt="">
                            ${filterData[i].Add}
                        </li>
                        <li class="" id="list-phone">
                            <img src="images/icons_phone.png" alt="">
                            ${filterData[i].Tel}
                        </li>
                    </ul>
                    <div>免費參觀</div>
                </div>
            </div>
        </li>`
    }
    content.innerHTML = str;

}

















