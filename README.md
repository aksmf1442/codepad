## Codepad - 런치패드 프로젝트

## 프로젝트 소개

> 웹 환경에서 런치패드를 이용한 연주와 커스텀 프리셋 공유 사이트

## 기획 의도

<img width="912" alt="image" src="https://user-images.githubusercontent.com/64648893/197220020-977c662b-3b8f-4081-b6d1-ccaa718a6133.png">

## 서비스 주요 기능 설명

- 기본 기능
  - 로그인/로그아웃
  - 회원가입
  - 메인 페이지

- 주요 기능
  - 자유 연주기능
  - 프리셋 생성/수정/삭제
  - Fork (가져오기)
  - 마이페이지
  - 커뮤니티 기능 (좋아요, 댓글)

- 서브 기능
  - 프로필 수정
  - 좋아요 누른 프리셋 보관함
  - 검색어 리스트

- 프로젝트만의 차별점, 기대 효과
  - https://intro.novationmusic.com/
  : 위의 웹 사이트에서는 단순하게 연주만 할 수 있고 자신의 입맛대로 소리와 버튼을 수정할 수 없다. 
    하지만 우리가 만드는 웹 페이지에서는 단순히 연주에서 끝나는 것이 아니라 자신이 소리와 버튼의 종류, 배치 등을 커스터마이즈하여 
    새롭게 연주할 수 있고 그것들을 다른 사람들과 공유하여 의견을 나누고 긍정적인 방향으로 즐길 수 있으며 더 나아가 음악적 능력을 기를 수 있다.
  - https://soundcloud.com/
  : 위의 웹 사이트에서는 자신이 작곡한 곡들을 업로드하고 그것을 타인이 듣고 의견을 남길 수 있다. 
    하지만 우리의 웹 사이트는 듣는 것이 목적이 아닌 능동적이고 직접적으로 소리들을 연주하고 조작하여 음악적 경험을 더욱 더 향상시킬 수 있다.


## 서비스 링크

> **현재 서비스 중단**

## 페이지별 화면 및 간단하게 기능 설명

1. 헤더

> 헤더를 통해 서비스의 편의성을 증대하였습니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197214353-01a90368-fdd8-411c-b371-adf2c6f5a6b6.png">

2. 로그인 모달

> 구글 로그인을 통해 로그인 할 수 있습니다.

![image](https://user-images.githubusercontent.com/64648893/197219571-3604d8ee-b15d-4c02-9cc9-b01ccaf7436c.png)

3. 프로필 변경 모달

>  로그인 후 회원 이름, 이미지를 변경할 수 있습니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197214734-fd22964f-3de7-4424-a910-d06b7d64d57d.png">

4. 메인 페이지

> 처음 들어오면 보이는 페이지로 인기 프리셋, 최근 사용한 프리셋, 인기 있는 아티스트를 스크롤을 통해 탐색하고 사용할 수 있습니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197214892-6ead9ea1-a1e5-456a-a119-dfbe47d39e87.png">

5. 검색 결과 페이지

> 헤더의 검색을 통해 검색을 하면 나오는 결과 페이지입니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197215385-5c83c1d2-18fc-47a6-a224-330a2f0f5ec0.png">

6. 연주 페이지

> 실제로 연주할 수 있는 페이지로 특정 좌표를 클릭하면 루프를 돌면서 클릭한 좌표의 샘플을 재생합니다. 루프 버튼, FX버튼(누른 동안만 소리가 남) 두 가지로 나눌 수 있습니다.

#### 회원
![image](https://user-images.githubusercontent.com/64648893/197216965-979d4697-20ec-43d3-ab95-584a68364592.png)

#### 비회원
<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197215792-2b9f1554-032f-43a5-be6f-22abe024a8e5.png">

7. 게시물 생성 페이지

> 원하는대로 프리셋을 구성하고 게시글을 등록할 수 있습니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197218145-9bb4fe4a-b1a0-4f23-a144-0cac71fd8456.png">


8. 프리셋 수정 페이지

> 자신이 만든 프리셋의 구성을 수정할 수 있습니다.

![image](https://user-images.githubusercontent.com/64648893/197219234-62ba7485-f038-4dad-af22-d439665e6e13.png)

9. 다른 유저의 프리셋 페이지

>  다른 유저의 페이지로 해당 유저의 프리셋을 fork하여 자신의 프리셋으로 가져가게 하거나 댓글 등의 커뮤니티 기능을 사용할 수 있습니다.

<img width="1000" alt="image" src="https://user-images.githubusercontent.com/64648893/197218596-edcffcbd-4621-4a92-90bc-586f0a5df5ff.png">

## 기술 스택

> 사용한 기술 스택은 다음과 같습니다.<br>

### 백엔드

- Node.js
- Express.js
- MongoDB
- Azure / AWS / Nginx

### 프론트

- REACT
- TypeScript
- Maturial UI (Mui.v5)
- React-Redux
- Redux saga, thunk...

### 인프라

- AWS EC2
- Azure
- Nginx

### 5. 프로젝트 팀원 역할 분담

| 이름 | 담당 업무 |
| ------ | ------ |
| 정경훈 | 팀장/프론트엔드 개발 |
| 장병연 | 프론트엔드 개발 |
| 한대현 | 프론트엔드 개발 |
| 홍순규 | 프론트엔드 개발 |
| 김은솔 | 프론트엔드 개발 |
| 김하늘 | 백엔드 개발 |

