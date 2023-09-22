# 연예인 닮은꼴 찾기 서비스
## [Go Site](https://main.lunaweb.dev/celebrity)
### 설명

- 이 웹 서비스는 사용자가 업로드한 사진을 분석하여 가장 닮은 연예인을 찾아주는 기능을 제공합니다. 
- Naver의 인공지능 API를 이용해 사진에서 얼굴을 인식하고, 해당 얼굴과 가장 유사한 연예인의 이름과 사진의 사람과 연예인간의 닮은 비율을 반환합니다.
- Naver의 API를 통해 받은 데이터의 연예인 이름을 Kakao API를 이용하여 이미지 검색을 하고 1번째로 나오는 값의 이미지 URL주소를 웹 사이트에 표시
---
### 사용 방법
1. 메인 페이지에서 '얼굴 사진을 드래그하거나 눌러서 업로드하세요!' 영역에 자신의 얼굴이 포함된 사진을 드래그&드롭하거나 클릭하여 업로드합니다.
2. 잠시 후 결과가 나타납니다. 가장 닮은 연예인의 이미지와 이름, 그리고 신뢰도(%)가 표시됩니다.

### 개발 환경
- HTML/CSS
- JavaScript (이미지 Resize, 클라이언트 -> 백엔드 서버로 이미지 POST 요청 / 데이터를 JSON 형태로 Response)
- Cloudflare Workers (Naver API, Kakao API 통신 중계 서버)
- Naver API (얼굴 인식)
- Kakao Image Search (이미지 검색)

### 서버
- 해당 백엔드 서버는 Cloudflare Workers 에서 작동중입니다.
- 프로젝트 내의 server.js를 node.js로 실행하여서 로컬에서도 사용 가능합니다.
