// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
//Get KeyPair
function getkeypair() {
    var registname = registnametext.value;
    //Empty Check
    if (registname == "" || registnametext == null) {
        alert("Regist Nameのテキストボックスが空欄です!\n入力してください！")
        return;
    }
    //half string check
    if (registname.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) {
        alert("半角英数字で入力してください！\n ex)yanchal1");
        return;
    }
    var RegistName = {
        nickname:registname
    };

    
    $.ajax({
        type: "post",                     //method = "post"
        url: "https://chachacoin.net/api/miyabi/regist",   // POST送信先のURL
        data: JSON.stringify(RegistName), // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",                // レスポンスをJSONとしてパースする
        timespan: 5000,                  // 通信のタイムアウト(5秒)
        }).done(function (getkeypair, textStatus) {//Result;レスポンスのJSON,textStatus通信結果のステータス リクエスト成功時
            var privatevalue = getkeypair.PrivateKey;
            var publicvalue = getkeypair.PublicKey;
            document.inputform.MyPrivateKey.value = privatevalue;
            document.inputform.MyPublicKey.value = publicvalue;
            alert("必ずスクリーンショットに保管してください！\n\nregistname:" + registname+"\n\nYour_PrivateKey\n\n" + privatevalue + "\n\nYour_PublicKey\n\n" + publicvalue);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert("サーバーサイドからキーペアの取得に失敗しました！\nもう一度お試しください");
        });
}
//read pkcs12file
function Readkeypair() {
    var registname = registnametext.value;
    //Empty Check
    if (registname == "" || registnametext == null) {
        alert("Regist Nameのテキストボックスが空欄です!\n入力してください！")
        return;
    }
    //half string check
    if (registname.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) {
        alert("半角英数字で入力してください！\n ex)yanchal1");
        return;
    }
    var RegistName = {
        nickname: registname
    };


    $.ajax({
        type: "post",                     //method = "post"
        url: "https://chachacoin.net/api/miyabi/readfile",   // POST送信先のURL
        data: JSON.stringify(RegistName), // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",                // レスポンスをJSONとしてパースする
        timespan: 5000,                  // 通信のタイムアウト(5秒)
    }).done(function (getkeypair, textStatus) {//Result;レスポンスのJSON,textStatus通信結果のステータス リクエスト成功時
        if (getkeypair.PrivateKey) {
            var privatevalue = getkeypair.PrivateKey;
            var publicvalue = getkeypair.PublicKey;
            document.inputform.MyPrivateKey.value = privatevalue;
            document.inputform.MyPublicKey.value = publicvalue;
            alert("取得完了しました!");
        }
        else {
            alert("指定した名前のファイルが見つかりません！\nキーペアを発行してください！")
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("サーバーサイドからキーペアの取得に失敗しました！\nもう一度お試しください");
    });
}

//get balance
function get_balance() {
    var row = recent.rows.length;
    while (recent.rows[1]) recent.deleteRow(1);
    recenttransaction();
    var mypublickey = publickeytext.value;
    if (mypublickey == "" || mypublickey == null) {
        var mypublickey = "02ac6eb6615f8e1f0f02b09b562c82374bc4dd01baec33e491b87d3863ff16bf0e";// fixedパブリックキー 
        alert("共通のパブリックキーを使います!\n\n02ac6eb6615f8e1f0f02b09b562c82374bc4dd01baec33e491b87d3863ff16bf0e");
    }
    var Showamount = {
        my_publickey: mypublickey
    };
    $.ajax({
        type: "post",                    //method = "post"
        url: "https://chachacoin.net/api/miyabi/show",        // POST送信先のURL
        data: JSON.stringify(Showamount), // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",               // レスポンスをJSONとしてパースする
        timespan: 5000,                  // 通信のタイムアウト(5秒)
    }).done(function (Showresult, textStatus) {//Result;レスポンスのJSON,textStatus通信結果のステータス リクエスト成功時
        var show = Showresult.coin_amount;
        document.getElementById("content2").innerHTML = show;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        document.getElementById("content2").innerHTML = "ー";
    });
}
//送金履歴の読み出し
function recenttransaction() {
    for (i = 1; i <= 5; i++) {
        var datekey = "date" + i;
        var amountkey = "amount" + i;

        var date = localStorage.getItem(datekey);
        var amount = localStorage.getItem(amountkey) + "ChaCha";
        if (date == "null" || date == null) {
            break;
        }
        let table = document.getElementById('recentTable');
        let newRow = table.insertRow();

        let newCell = newRow.insertCell();
        let newText = document.createTextNode(date);
        newCell.appendChild(newText);

        newCell = newRow.insertCell();
        newText = document.createTextNode(amount);
        newCell.appendChild(newText);
    }
}

//input clear
function clearinput() {
    document.scanresult.Destinationpubkey.value = "";
    document.scanresult.Amount.value = "";
}
//コインの送金情報に関して
function send() {
    var button = document.getElementById('sendbutton');
    button.disabled = true;
    var myprivatekey = privatekeytext.value;
    if (myprivatekey == "" || myprivatekey == null) {
        myprivatekey = "bf6c03e6f86203e4eeab3a47c1ea7a20e3757327474b751da8837355f32bfa39"
        alert("共通のプライベートキーを使います！")
    }
    var destinationpubkey = deistination.value;
    var coinamount = amount1.value;
    if (destinationpubkey == "" || coinamount == "") {
        alert("空白のテキストボックス があります！\n入力してください！");
        button.disabled = false;
        return;
    }
    var Transactioninfo = {
        my_privatekey: myprivatekey,
        opponet_pubkey: destinationpubkey,
        send_amount: coinamount
    }
    var json = JSON.stringify(Transactioninfo);
    alert(json);

    $.ajax({
        type: "post",                     //method = "post"
        url: "https://chachacoin.net/api/miyabi/send",             // POST送信先のURL
        data: JSON.stringify(Transactioninfo),   // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: "json",                // レスポンスをJSONとしてパースする
        timespan: 10000,                  // 通信のタイムアウト(10秒)
    }).done(function (Result) {//Result;レスポンスのJSON,textStatus通信結果のステータス リクエスト成功時
        var code1 = Result.code;
        switch (code1) {
            case 1:
                alert("プライベートキーが適正な値ではありません！");
                button.disabled = false;
                break;
            case 2:
                alert("自分のプライベートキーから変換に失敗しました！\n開発者にお問い合わせください！");
                button.disabled = false;
                break;
            case 3:
                alert("入力された送信者のパブリックキーが不適当です！\n入力値を再入力してください！");
                button.disabled = false;
                break;
            case 4:
                alert("数字でない文字が入力されています！\n数字を入力してください！");
                button.disabled = false;
                break;
            case 5:
                if (Result.result == "Success" || Result.result == "success") {
                    alert("送信に成功しました！\n\ntransactionID:\n" + Result.transactionId + "\n\nSend_Result:\n" + Result.result);
                    button.disabled = false;
                    hystorylog(coinamount);//ローカルストレージに送金履歴を保存
                }
                else {
                    alert(Result.result + "\n\n送金していません！");
                    button.disabled = false;
                }
        };
        //HTTPレスポンスが失敗で帰ってきた場合
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("HTTPレスポンスの結果\n" + jqXHR.status + "\n" + textStatus + "\n" + errorThrown + "\n再度送金を試してください！\nもう一度試してエラーの場合はお問い合わせください！");
        button.disabled = false;
    });
}
//recent transactionの記録
function hystorylog(amount) {
    var a = localStorage.getItem('date1');
    var b = localStorage.getItem('date2');
    var c = localStorage.getItem('date3');
    var d = localStorage.getItem('date4');
    var e = localStorage.getItem('date4');
    //時刻取得
    var now = new Date();
    var year = now.getFullYear();
    var mon = toDoubleDigits(now.getMonth() + 1); //１を足すこと
    var day = toDoubleDigits(now.getDate());
    var hour = toDoubleDigits(now.getHours());
    var min = toDoubleDigits(now.getMinutes());
    var sec = toDoubleDigits(now.getSeconds());
    var date = year + "/" + mon + "/" + day + "\t" + hour + ":" + min + ":" + sec;
    if (a == null) {
        localStorage.setItem('date1', date);
        localStorage.setItem('amount1', amount);
    }
    else if (b == null) {
        localStorage.setItem('date2', localStorage.getItem('date1'));
        localStorage.setItem('amount2', localStorage.getItem('amount1'));
        localStorage.setItem('date1', date);
        localStorage.setItem('amount1', amount);
    }
    else if (a != null && b != null && c == null) {
        localStorage.setItem('date3', localStorage.getItem('date2'));
        localStorage.setItem('amount3', localStorage.getItem('amount2'));
        localStorage.setItem('date2', localStorage.getItem('date1'));
        localStorage.setItem('amount2', localStorage.getItem('amount1'));
        localStorage.setItem('date1', date);
        localStorage.setItem('amount1', amount);
    }
    else if (a != null && b != null && c != null && d == null) {
        localStorage.setItem('date4', localStorage.getItem('date3'));
        localStorage.setItem('amount4', localStorage.getItem('amount3'));
        localStorage.setItem('date3', localStorage.getItem('date2'));
        localStorage.setItem('amount3', localStorage.getItem('amount2'));
        localStorage.setItem('date2', localStorage.getItem('date1'));
        localStorage.setItem('amount2', localStorage.getItem('amount1'));
        localStorage.setItem('date1', date);
        localStorage.setItem('amount1', amount);
    }
    else if (a != null && b != null && c != null && d != null) {
        localStorage.setItem('date5', localStorage.getItem('date4'));
        localStorage.setItem('amount5', localStorage.getItem('amount4'));
        localStorage.setItem('date4', localStorage.getItem('date3'));
        localStorage.setItem('amount4', localStorage.getItem('amount3'));
        localStorage.setItem('date3', localStorage.getItem('date2'));
        localStorage.setItem('amount3', localStorage.getItem('amount2'));
        localStorage.setItem('date2', localStorage.getItem('date1'));
        localStorage.setItem('amount2', localStorage.getItem('amount1'));
        localStorage.setItem('date1', date);
        localStorage.setItem('amount1', amount);
    }
}
//QR拡大表示
function lergeQR() {

    if (publickeytext.value == "") {
        alert("パブリックキー を取得してください！");
        return;
    }
    var el = document.getElementById('lergeqr');
    if (el.title) {
        return;
    }
    var options = {
        text: publickeytext.value,
        width: 270,
        height: 270,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    };
    new QRCode(el, options);
}
// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function (num) {
    num += "";
    if (num.length === 1) {
        num = "0" + num;
    }
    return num;
};
//clear localstorage
function localclear() {
    localStorage.clear();
}