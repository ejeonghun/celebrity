// 사용자가 업로드한 이미지를 받아 크기를 조절하고 서버에 전송하는 함수입니다.
function uploadImage(input) {
    // 로딩 화면을 표시합니다.
    document.getElementById("image_upload").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("loading").style.display = "flex";
    document.getElementById("loading_text").innerText = "사진을 분석중입니다 ...";

    // 사용자가 파일을 업로드했는지 확인합니다.
    if (input.files && input.files[0]) {
        let file = input.files[0];

        // 파일의 크기가 2MB보다 큰 경우 이미지의 크기를 조절합니다.
        if (file.size > 2 * 1024 * 1024) {
            resizeImage(file, 800, 800).then(resizedBlob => {
                var formData = new FormData();
                formData.append('image', resizedBlob);

                // 조절된 이미지를 서버에 전송합니다.
                sendRequest(formData);
            });
        } else { // 파일의 크기가 2MB 이하인 경우 그대로 서버에 전송합니다.
            var formData = new FormData();
            formData.append('image', file);

            sendRequest(formData);
        }
    }
}

// 서버에 POST 요청을 보내는 함수입니다.
function sendRequest(formData) {
   fetch('https://api-1.wjdgns4019.workers.dev/upload', { 
       method: 'POST',
       body: formData
   })
   .then(response => response.json())
   .then(data => {
       data.confidence = Math.floor(data.confidence*100);
       
       // 로딩 화면을 숨깁니다. 
       document.getElementById("loading").style.display = "none";
       document.getElementById("loading_text").style.display = "none"
       
       // 응답 데이터를 이용해 UI를 업데이트 합니다. 
       updateUI(data);
   })
   .catch(error => { // 에러 처리
      alert("오류가 발생했습니다. 다시 시도해주세요."); 
      location.reload()
   });
}

// 응답 데이터를 이용해 UI를 업데이트하는 함수입니다. 
function updateUI(data) {
   document.getElementById("celebrityImage").src = data.imageUrl;
   document.getElementById("confidence").innerText = data.confidence + "%";
   document.getElementById("celebrityName").innerText = data.celebrityName;
}

// 이미지의 크기를 조절하는 함수입니다. maxWidth와 maxHeight는 최대 너비와 높이입니다.
function resizeImage(file, maxWidth, maxHeight) {
 return new Promise((resolve, reject) => {
     let image = new Image();
     image.onload = () => {
         let width = image.width;
         let height = image.height;

         // 너비가 높이보다 크면 너비를 기준으로 크기를 조절합니다.
         if (width > height) {
             if (width > maxWidth) {
                 height *= maxWidth / width;
                 width = maxWidth;
             }
         } else { // 높이가 너비보다 크면 높이를 기준으로 크기를 조절합니다.
             if (height > maxHeight) {
                 width *= maxHeight / height;
                 height = maxHeight;
             }
         }

         // 캔버스에 조절된 이미지를 그립니다.
         let canvas = document.createElement('canvas');
         canvas.width = width;
         canvas.height = height;

        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);

        // 캔버스의 내용을 Blob 객체로 변환하여 반환합니다.
        canvas.toBlob(resolve, file.type);
     };
     image.src = URL.createObjectURL(file);
 });
}
