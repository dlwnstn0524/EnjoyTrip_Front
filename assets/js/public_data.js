    // index page 로딩 후 전국의 시도 설정.
    let serviceKey =
      "98bjcTT737wV9WBAYZJCG44LYmmdDeoYCYochcob51sm%2BEj%2FzxuTjjGdOI37R2tJOK0JEHgh4%2Fxeg4f2YYCNCw%3D%3D";
    let areaUrl =
      "https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=" +
      serviceKey +
      "&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json";
    fetch(areaUrl, { method: "GET" })
      .then((response) => response.json())
      .then((data) => makeOption(data));

    function makeOption(data) {
      let areas = data.response.body.items.item;
      let sel = document.getElementById("search-area");
      areas.forEach((area) => {
        let opt = document.createElement("option");
        opt.setAttribute("value", area.code);
        opt.appendChild(document.createTextNode(area.name));

        sel.appendChild(opt);
      });
    }

    window.onload = function () {
        const session = JSON.parse(localStorage.getItem("isLogin"));
        console.log(session);
        if (session == true) {
          const wrapper = document.querySelector("#loginstate");
          wrapper.setAttribute("style", "display:flex");
          const wrapper1 = document.querySelector("#logoutstate");
          wrapper1.setAttribute("style", "display:none");
        } else {
          const wrapper = document.querySelector("#logoutstate");
          wrapper.setAttribute("style", "display:flex");
          const wrapper1 = document.querySelector("#loginstate");
          wrapper1.setAttribute("style", "display:none");
        }
      };
  
      function login() {
        const inputId = document.querySelector("#userid").value;
        const inputPw = document.querySelector("#passWord").value;
        console.log(inputId);
        console.log(inputPw);
  
        const data = JSON.parse(localStorage.getItem("register"));
        const id = data.userid;
        const pw = data.passWord;
  
        console.log(id);
        console.log(pw);
        if (inputId === id && inputPw === pw) {
          alert("로그인 성공!");
          window.location.href = "main.html";
          localStorage.setItem("isLogin", JSON.stringify(true));
          const wrapper = document.querySelector("#loginstate");
          wrapper.setAttribute("style", "display:block");
          wrapper = document.querySelector("#logoutstate");
          wrapper.setAttribute("style", "display:none");
        } else {
          alert("아이디 비밀번호를 확인해주세요");
        }
      }
  
      function logout() {
        localStorage.setItem("isLogin", JSON.stringify(false));
        return;
      }
  
      // 마커를 담을 배열입니다
      var markers = [];
      var overlays = [];
  
      var mapContainer = document.getElementById("map"), // 지도를 표시할 div
        mapOption = {
          center: new kakao.maps.LatLng(37.566535, 126.9779692), // 지도의 중심좌표
          level: 9, // 지도의 확대 레벨
        };
      // 지도를 생성합니다
      var map = new kakao.maps.Map(mapContainer, mapOption);
  
      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      var mapTypeControl = new kakao.maps.MapTypeControl();
  
      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
  
      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      var zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  
      // 장소 검색 객체를 생성합니다
      var ps = new kakao.maps.services.Places();
      // 키워드로 장소를 검색합니다
      searchPlaces();
      // 키워드 검색을 요청하는 함수입니다
      function searchPlaces() {
        var keyword = document.getElementById("search-keyword").value;
  
        document.addEventListener("DOMContentLoaded", function () {
          // 검색결과 유효성 검사
          var button = document.querySelector('button[name="name1"]');
          button.addEventListener("click", function () {
            let searchUrl = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A`;
            let areaCode = document.getElementById("search-area").value;
            let contentTypeId = document.getElementById("search-content-id").value;
            let keyword = document.getElementById("search-keyword").value;
  
            // 검색어가 공백이 아닌지 확인
            if (parseInt(areaCode)) searchUrl += `&areaCode=${areaCode}`;
            if (parseInt(contentTypeId)) searchUrl += `&contentTypeId=${contentTypeId}`;
            if (!keyword) {
              alert("검색어 입력 필수!!!");
              return;
            } else searchUrl += `&keyword=${keyword}`;
  
            fetch(searchUrl)
              .then((response) => {
                // 응답을 JSON으로 파싱하여 반환합니다.
                return response.json();
              })
              .then((data) => {
                // 받은 데이터를 처리하는 함수를 호출합니다.
  
                placesSearchCB(data, null);
              })
              .catch((error) => {
                // 오류 발생 시 처리하는 부분
                console.error("API 요청 오류 발생:", error);
                alert("유효한 검색이 아닙니다!");
              });
          });
        });
        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        // ps.keywordSearch( keyword, placesSearchCB);
      }
  
      var positions = [];
  
      // 카카오맵 API의 장소 검색 요청에 대한 콜백 함수입니다. 이 콜백 함수는 사용자가 지정한 조건에 따라 카카오맵에서 장소를 검색한 후 결과를 반환할 때 호출됩니다.
      function placesSearchCB(data, status) {
        let trips = data.response.body.items.item;
        displayPlaces(trips);
        if (status === kakao.maps.services.Status.OK) {
          // 정상적으로 검색이 완료됐으면
          // 검색 목록과 마커를 표출합니다
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert("검색 결과가 존재하지 않습니다.");
          return;
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert("검색 결과 중 오류가 발생했습니다.");
          return;
        }
      }
      //마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
      function addMarker(y, x) {
        var imageSrc = "assets/img/marker.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
          imageSize = new kakao.maps.Size(80, 80), // 마커 이미지의 크기
          imgOptions = {
            spriteSize: new kakao.maps.Size(30, 60), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, 0), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(12, 60), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
          },
          markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(y, x), // 마커의 위치
            image: markerImage,
          });
  
        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers.push(marker); // 배열에 생성된 마커를 추가합니다
        return marker;
      }
      // 검색 결과 목록과 마커를 표출하는 함수입니다
      function displayPlaces(places) {
        // kakao.maps.LatLngBounds()는 카카오맵에서 사용되는 경도 및 위도 좌표의 경계를 정의하는 클래스입니다.
        bounds = new kakao.maps.LatLngBounds();
        // 지도에 표시되고 있는 마커를 제거합니다
        removeMarker();
  
        for (var i = 0; i < places.length; i++) {
          positions.push({
            title: places[i].addr1,
            latlng_x: places[i].mapx,
            latlng_y: places[i].mapy,
          });
        }
  
        for (var i = 0; i < positions.length; i++) {
          var placePosition = new kakao.maps.LatLng(places[i].mapy, places[i].mapx);
  
          var a = displayMarker(places, i);
          // var b = document.getElementById('closeBtn');
          // console.log(document);
          // b.addEventListener('click', () => {
          //     console.log('print!');
          // });
          bounds.extend(placePosition);
        }
  
        // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
        // menuEl.scrollTop = 0;
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
  
      //지도에 마커 클릭시 오버레이 출력
      function displayMarker(places, i) {
        marker = addMarker(places[i].mapy, places[i].mapx);
  
        var overlay = new kakao.maps.CustomOverlay({
          position: marker.getPosition(),
        });
  
        // 이미지가 없다면 준비중으로 대체
        if (places[i].firstimage == "") {
          places[i].firstimage = "assets/img/preparingimg.jpg";
        }
        var content = document.createElement("div");
        content.classList.add("wrap");
        content.innerHTML =
          '<div class="info">' +
          '<div class="title">' +
          places[i].title +
          // // 버튼 추가
          // // 버튼 추가 end
          "</div>" +
          '<div class="body">' +
          '<div class="img">' +
          '<img src="' +
          places[i].firstimage +
          '" width="73" height="70">' +
          "</div>" +
          "</div>" +
          '<div class="desc">' +
          '<div class="ellipsis">' +
          places[i].addr1 +
          "</div>" +
          '<div class="jibun ellipsis">' +
          places[i].addr2 +
          "</div>" +
          "</div>" +
          "</div>";
  
        var closeBtn = document.createElement("button");
        closeBtn.className = "btn btn-primary btn-sm";
        closeBtn.style.cssText = "float : right";
        closeBtn.innerHTML += "<div>닫기</div>";
  
        closeBtn.onclick = function () {
          overlay.setMap(null);
        };
  
        content.appendChild(closeBtn);
  
        // end
  
        overlay.setContent(content);
  
        kakao.maps.event.addListener(marker, "click", function () {
          removeOverlay();
          overlay.setMap(map);
        });
  
        overlays.push(overlay);
        return overlay;
      }
  
      // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
      // 인포윈도우에 장소명을 표시합니다
  
      // 지도 위에 표시되고 있는 마커,오버레이 모두 제거합니다
      function removeMarker() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
  
        for (var i = 0; i < overlays.length; i++) {
          overlays[i].setMap(null);
        }
        markers = [];
        positions = [];
        overlays = [];
      }
  
      //다른 오버레이 클릭시 기존에 열려있던 오버레이 창을 닫음
      function removeOverlay() {
        for (var i = 0; i < overlays.length; i++) {
          overlays[i].setMap(null);
        }
      }
  