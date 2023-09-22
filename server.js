const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const cors = require('cors');



const app = express();
app.use(cors()); // CORS 미들웨어 추가
app.use(multer().single('image'));

app.post('/upload', async (req, res) => {

    var formDataNaverAPI= new FormData();
    formDataNaverAPI.append('image', req.file.buffer);

    const responseNaverAPI = await fetch('https://openapi.naver.com/v1/vision/celebrity', { 
        method: 'POST',
        headers: { 
            Origin: 'https://{YOUR_CORS_ORIGIN}}',
            'X-Naver-Client-Id': '{YOUR_CLIENT_ID}', 
            'X-Naver-Client-Secret': '{YOUR_CLIENT_SECRET}' 
        },
        body: formDataNaverAPI
    });
    
    if (!responseNaverAPI.ok) {
        throw new Error(`API request failed with status ${responseNaverAPI.status}`);
    }
    
    const dataNaverAPI = await responseNaverAPI.json();
    
    if (!dataNaverAPI.faces || dataNaverAPI.faces.length === 0) {
        throw new Error("No faces detected in the image");
    }
    const celebrityName = dataNaverAPI.faces[0].celebrity.value;
    const confidence = dataNaverAPI.faces[0].celebrity.confidence;
    

    const responseKakaoAPI = await fetch(`https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(celebrityName)}&sort=accuracy`, {
        headers: { 'Authorization': 'KakaoAK {YOUR_KAKAO_REST_API}' },
        method: 'GET'
    });

    const dataKakaoAPI = await responseKakaoAPI.json();
    
    if (dataKakaoAPI.documents && dataKakaoAPI.documents.length > 0) {
        const imageUrl = dataKakaoAPI.documents[0].image_url;
        
        res.json({ imageUrl, confidence, celebrityName });
        
    } else {
        res.status(500).send('No image found');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
