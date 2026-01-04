//===================================== ~fullscreen.php <script> ===========================================
// click vào thì bắt đầu chạy game trên toàn màn hình
$("#expand").on('click', function () {
    $("#iframehtml5").addClass("force_full_screen"); // class bên: css
    $("#_exit_full_screen").removeClass('hidden'); // cho nó hiện ra == cách xóa display: hidden;

    //clear thuoc tinh postion fixed cua header xong mới cho chạy function: requestFullScreen(document.body);
    // $(".header").removeClass("fixed");

    // chạy hàm này trên toàn body luôn: cho nó phóng to tự nhiên trên toàn màn hình
    requestFullScreen(document.body);
});

// click vào nút thoát tất cả các hiệu ứng 
$("#_exit_full_screen").on('click', cancelFullScreen);


function requestFullScreen(element) {
    //theater mode
    $(".header-game").removeClass("header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    // Supports most browsers and their versions.
    // Hỗ trợ hầu hết các trình duyệt và phiên bản của chúng khi chạy hàm requestFullScreen(Bật phóng to).
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen. - tự nhiên trên toàn màn hình
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE. - trình duyệt IE cũ 
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// ẩn: nút thoát
// xóa class phóng to màn trên thẻ iframehtml5, 
// tắt bỏ theater moden
// Hỗ trợ hầu hết các trình duyệt và phiên bản của chúng khi chạy hàm cancelFullScreen(XÓA phóng to). và trên trình duyệt IE cũ
function cancelFullScreen() {
    //add thuoc fixed cua header
    // $(".header").addClass('fixed');
    // .fixed {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     z-index: 4;
    // }

    $("#_exit_full_screen").addClass('hidden');
    $("#iframehtml5").removeClass("force_full_screen");

    //theater mode
    $(".header-game").removeClass("force_full_screen header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// kiểm tra trình xử sự kiện: trình xử lý thoát
if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

// hàm kiểm tra xem đã thoát được chưa, nếu chưa thoát lại chạy Hàm cancelFullScreen(hàm thoát) tiếp khi nào được thì thôi
function exitHandler() {
    if (document.webkitIsFullScreen === false ||
        document.mozFullScreen === false ||
        document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}

//============================== theater Mode  =========================================
function theaterMode() {
    //clear thuoc tinh postion fixed cua header xong mới cho chạy function: requestFullScreen(document.body);
    // if($(".header").hasClass("fixed")) {
    //     $(".header").removeClass("fixed");
    // } else {
    //     $(".header").addClass("fixed");
    // }

    // tắt thanh scroll đi: CSS: body::-webkit-scrollbar {display: none;} set lại cho nó vào class 'scroll'
    // để dễ dàng xử lí bên dưới + 
    // if($("body").hasClass("scroll")) {
    //     $("body").removeClass("scroll");
    // } else {
    //     $("body").addClass("scroll");
    // }

    // tắt #back-to-top đi: 
    // if($("#back-to-top").hasClass("hidden-scroll")) {
    //     $("#back-to-top").removeClass("hidden-scroll");
    // } 
    // else {
    //     $("#back-to-top").addClass("hidden-scroll");
    // }


    // hàm phóng game gần toàn màn theaterMode(chế độ rạp hát)
    // đặt biến truy vấn thẻ id #iframehtml5 đầu tiên có được
    // contais(chứa) trả về true nếu một nút là con cháu của một nút.
    // kiểm tra nếu classList của thẻ iframe là con cháu của class force_half_full_screen => thì xóa chúng đi
    // outsideHeight() trả về chiều cao bên ngoài của phần tử khớp ĐẦU TIÊN.
    let iframe = document.querySelector("#iframehtml5");
    if (iframe.classList.contains("force_half_full_screen")) {

        iframe.classList.remove("force_half_full_screen")
        document.querySelector(".header-game").classList.remove("header_game_enable_half_full_screen")
        return;
    }
    let above = 0;
    let left = 0;
    let below = $(".header-game").outerHeight();
    let right = 0;
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    if (!document.querySelector("#style-append")) {
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.setAttribute('id', "style-append");
        let cssCode = `
    .force_half_full_screen{
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    z-index: 887!important;
    top:${above}px!important;
    left:${left}px!important;
    width:calc(100% - ${left}px)!important;
    height:calc(100% - ${above + below}px)!important;
    background-color:#000;
    }
    .header_game_enable_half_full_screen{
        position:fixed;
        left:${left}px!important;
        bottom:0!important;
        right:0!important;
        z-index:887!important;
        width:calc(100% - ${left}px)!important;
        padding-left:10px;
        padding-right:10px;
        border-radius:0!important;
    }
    @media (max-width: 1364px){
        .force_half_full_screen{
            left:0!important;
            width:100%!important;
        }
        .header_game_enable_half_full_screen{
            width:100%!important;
            left:0!important;
        }
    }`
        styleElement.innerHTML = cssCode;
        document.querySelector('head').appendChild(styleElement);
    }
    iframe.classList.add("force_half_full_screen")
    document.querySelector(".header-game").classList.add("header_game_enable_half_full_screen")
}


/*============================== dark mode ==============================*/
// khi click vào thẻ <span có class là light-on thì:
// thẻ <body> add thêm class lightmode vào
// ẩn cả thẻ <span có class là light-on đi
// thêm thuộc tính attr cho hiện class light-off lên
// chạy hàm setLocalStorage("theme_mode", "lightmode"); để gửi key và value='lightmode' sang bên menu.php để nó xử lý

//click light-off => save light-off vs (localStorage);
$("span.light-on").on('click', function () {
    $("body").addClass("lightmode");
    $(this).hide();
    $(".light-off").attr('style', "display:flex!important");
    setLocalStorage("theme_mode", "lightmode");
})

$(".light-off").on('click', function () {
    $("body").removeClass("lightmode")
    $(this).attr('style', "display:none!important");
    $(".light-on").show();
    setLocalStorage("theme_mode", "darkmode");
})

/*============================== Header ==============================*/
// Phương thức querySelector() trả về phần tử đầu tiên khớp với bộ chọn CSS
// Để trả lại tất cả kết quả phù hợp (không chỉ kết quả đầu tiên), thay vào đó, hãy sử dụng truy vấnSelectorAll().
if (document.querySelector('.header')) {
    $('.header__btn').on('click', function () {
        // $('.header').toggleClass("fixed");
        $('.nav-right').slideToggle("fast");
    })
}

// ============================ search ================================= 
// 1. khi nhập từ khóa vào thẻ input lấy ra được value của nó
// - sửa thẻ form->div bỏ action đi
// - bắt sự kiện của thẻ input => lấy ra value của nó
// - chuyển hướng đến trang search
// 2. js: chuyển hướng đển trang search + với keywords mới
// - đặt biến lưu lại giá trị cũ oldValue(chuyển qua <head> khai báo cho log ra đc) để nếu mà vẫn tìm kiếm với giá trị cũ thì ko cho nó tìm kiếm nữa,
// - gán oldValue = value1; để nó nhận giá trị lần search tiếp
// - đặt biến keywords lấy ra value của #myInput
// - đặt biến rex-rule: với các ký tự cần loại bỏ
// - truy xuất vào biến keywords và sd hàm replace để thay đổi rex-rule thành 1 ký tự '-'
// - hàm trim() để loại bỏ các khoảng trắng ở đầu và cuối
// - hàm toLowerCase() để chuyển tất cả về chữ thường
$('.btn-search').on('click', function () {
    gameSearch()
})

$('.search-term').on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        gameSearch()
    }
})
// let oldValue = null;
function gameSearch() {
    // console.log("OLD "+oldValue);
    let keywords3 = $(".search-term").val();
    // console.log('click '+keywords );
    var rex_rule = /[ \-\.?:\\\/\_\'\*]+/g;
    var value1 = keywords3.replace(rex_rule, "-").trim().toLowerCase();
    // console.log("value1 "+value1);
    var url = '/search/' + value1;
    if (value1) {
        // oldValue = value1;
        window.location.href = url;
    }
}

// ================================================== search ajax show ra luôn ================================== 
// khi xóa hết(phím back) trên thẻ input thì nó ko hiện ra nữa
$('#game-search').on('keydown', function (event) {
    var key = event.keyCode || event.charCode;
    // console.log(key)
    if (key == 8 || key == 46) {
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
})

// 1. khi nhập từ khóa vào input lấy ra được các từ khóa liên quan
// 2. làm tương tự như trang search đi
//dau tien la sua form search the from->div
// bắt sự kiện gõ vào input
//lay giá trị từ input
//gọi ajax
//đắp dữ liệu nhận về vào

// th1: click vào thì tác động lên
$('#game-search').on('input', function (e) {
    let keywords = $(this).val();
    // tìm toàn bộ trong các đoạn match: dấu cách, -, ., ?, \, /, _, '
    // thì replace thay thế nó bằng dấu - .loại bỏ khoảng trắng ở đầu và cuối .chuyển đổi tất cả các ký tự trong chuỗi về dạng chữ thường
    var rex_rule = /[ \-\.?:\\\/\_\'\*]+/g;
    // var value1 = keywords.replace(rex_rule, "\-").trim().toLowerCase();
    var value1 = keywords.replace(rex_rule, " ").trim().toLowerCase();
    
    if (value1) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
        // searchGame(value1);

        let arr_games = [];
        searchGameNew(value1, arr_games)
    } else {
        // console.log("else");
        // 3: ko co gi ko hien
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
    e.stopPropagation();
});

// th2: click vào ko ẩn
$("#search-ajax").click(function (e) {
    e.stopPropagation();
});
$(".btn-search").click(function (e) {
    e.stopPropagation();
});

// th1: click lại vào nó => tiếp tục search nếu có keywords
$("#game-search").click(function (e) {
    let keywords = $(this).val();
    if (keywords) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
    }
    e.stopPropagation();
});

// th3: click vào bất cứ gì thì ẩn nó đi
$(document).click(function () {
    $('.search-more').addClass('hidden-search', { duration: 1000 });
    $('.search-term').removeClass('border-bottom', { duration: 1000 });
});


// khi search thì nó truyền key(value) vào và so sánh từ Mảng search_data(đã được lưu khi load trang xong)
function searchGameNew(value, arr_games) {
    // Lấy tất cả các thẻ con của thẻ div có class là "search-more"
    // Duyệt qua các thẻ con và xóa từng thẻ một(vì xóa thẳng ở ngoài ko được nên mới làm cách này)
    var allTagA = $(".search-more").children();
    for (var i = 0; i < allTagA.length; i++) {
        allTagA[i].remove();
    }
    //lấy name từ Mảng search_data ra để so sánh vs value nếu nó tương tự nhau thì mới cho vào Mảng dữ liệu search mới 
    for (let i = 0; i < search_data.length; i++) {
        let name = search_data[i].name;
        let aTag = search_data[i].aTag;
        if (name.includes(value)) {
            arr_games.push(aTag);
        }
    }

    //lọc trùng bằng hàm tạo object mới. Kiểm tra nếu ob ko có dữ liệu thì cho nó hiện thông báo ko thành công
    let uniqueArr = new Set(arr_games);
    if (uniqueArr.size <= 0) {
        uniqueArr.add('<div class="search-end">Not found!</div>');
    }

    for (let a of uniqueArr) {
        $('.search-more').append(a);
    }
}

// tạo Mảng lưu dữ liệu để search 1 lần duy nhất sau khi load trang xong
let search_data = [];
document.addEventListener("DOMContentLoaded", function (event) {
    function get_search_data() {
        for (let a of $("div.card-masonry .item")) {
            // console.log(a);
            let name = a.title;
            name = name.trim().toLowerCase();

            let img = a.querySelector("img");
            img = img.getAttribute("src");

            let aTag = a.href;
            aTag = '<a class="games-show-item" href="' + aTag + '" title="' + name + '">';
            aTag += '<img class="games-show-img" src="' + img + '" width="45" height="35" alt="' + name + '" title="' + name + '">';
            aTag += '<span class="games-show-title">' + name + '</span>' + '</a>';
            search_data.push({ name: name, aTag: aTag });
        }
        return search_data;
    }
    get_search_data();
});

//// Hàm này xử lí khi gọi được ajax
// function searchGame(kw) {
//     // $(".loading_search").removeClass("hidden");
//     let url = "/page-search.ajax";
//     console.log('vo');
//     console.log(url);
//     $.ajax({
//         url: url,
//         type: "POST",
//         data: {
//             keywords: kw
//         },
//         success: function (response) {
//             console.log(response);
//             let data = JSON.parse(response);
//             if (data.flag == true) {
//                 console.log(data);
//                 $("#search-ajax").html(data.html);
//             } else {
//                 $("#search-ajax").html(data.html);
//             }
//         }
//     })
// }

// ============================ form select category ================================= 
$(document).on('change', '.category-input', function (e) {
    e.preventDefault();
    // console.log('vao day')
    window.location = $(this).find('option:selected').val();
});

// ============================ paging vs click pagination.php + show gif loading ================================= 
function paging(p) {
    $(".loading_mask").removeClass("hidden");
    if (!p) {
        p = 1;
    }
    let url = "/paging.ajax";
    $.ajax({
        url: url,
        type: "POST",
        data: {
            p: p,
            keywords: keywords,
            field_order: field_order,
            order_type: order_type,
            category_id: category_id,
            is_hot: is_hot,
            is_new: is_new,
            tags_id: tags_id,
            limit: limit,
        },
        success: function (response) {
            $(".loading_mask").addClass("hidden");
            // $('html, body').animate({
            //     scrollTop: $(".scroll-top").offset().top
            // }, 1000);
            if (response) {
                $("#ajax-append").html(response);
            }
        }
    })
}

$(document).ready(function () {
    addPlugin(); // ajax full_rate + comment
})

// ajax full_rate + comment
function addPlugin() {
    if (!id_game && !url_game) {
        return
    }
    let url = "/add-plugin.ajax";
    $.ajax({
        url: url,
        type: "POST",
        data: {
            id_game: id_game,
            url_game: url_game,
        },
        success: function (response) {
            if (response) {
                let data = JSON.parse(response);
                $("#append-rate").html(data.rate);
                $("#append-comment").html(data.comment);
            }
        }
    })
}

// ========================================= total-like ============================
// 1. nhap vao nut like thì nó like game id 
//- tang 1 dơn vi: update trong database
//- nhap vào nut like: luot like tang 1 
//- nhan lai ket qua luot like moi va cap nhat tren man hinh
//- lấy lại giá trị cũ
//- cộng cho nó 1 đơn vị
//- thay thế vào
$(".total-like").one("click", function () {
    let id = $(this).attr("id-game")
    let value = $(this).text();
    let number = parseInt(value) + 1;
    // $(this).attr("disabled", true);
    // console.log(number)
    $(".emojis-img").css({
        fill: "#1abc9c",
    })
    $(".total-like").css({
        cursor: "unset",
    })

    $(".total-like .count").css({
        color: "#1abc9c",
    })

    $.ajax({
        url: "/like-game.ajax",
        type: "POST",
        data: {
            id_game: id,
        },
        success: function () {
            // $(this+".count").attr("disabled");
            $(".total-like .count").html(number);
            // $(this).attr("disabled", false);
        }
    })
})
// ================================= back-to-top ============================
// khi đang tải trong sự kiện cuộn thì chạy function
// scrollTop() đặt hoặc trả về vị trí thanh cuộn dọc cho các phần tử được chọn.
// fadeIn(speed,callback); làm mờ dần phần tử ẩn(fade: phai màu). có thể để trống các tham số
// + speed: slow/fast/milliseconds(ms: 3000) + callback(ko hay dùng): gọi lại tùy chọn là một hàm sẽ được thực thi sau khi quá trình mờ dần hoàn tất.
// fadeOut(speed,callback) làm mờ dần một phần tử hiển thị.
window.onload = function () {
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('#back-to-top').fadeIn();

        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $("#back-to-top").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 300);
    });
}

// // ========== Thay đổi màn hình: cái nào đang mở sẽ tự ẩn/tắt đi => UI/UX ======
// $(window).resize(function(){
//     $('.nav-collapses').hide();
//     $('.nav-child-list').hide();
//     $('.category-btn').removeClass('btn-focus');
//     $('.category-more-wrap').removeClass('show-cate');
// })
// .resize();//trigger the resize event on page load.js