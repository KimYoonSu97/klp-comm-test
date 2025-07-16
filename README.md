# KLP Community App

KLP입사 관련 과제테스트입니다.

## 🚀 주요 기능

### 인증

- 이메일/비밀번호 로그인
- 회원가입
- 로그아웃

### 게시글

- 게시글 작성
- 게시글 목록 조회
- 게시글 상세 보기
- 게시글 좋아요

### 댓글

- 댓글 작성
- 댓글 목록 조회
- 댓글 좋아요

## 🛠 기술 스택

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Styled Components
- **Navigation**: Expo Router
- **Language**: TypeScript

## 📱 화면 구성

- `/login` - 로그인 화면
- `/signup` - 회원가입 화면
- `/community` - 게시글 목록 화면
- `/write` - 게시글 작성 화면
- `/post/[id]` - 게시글 상세 화면

## 📁 프로젝트 구조

```
klp-comm/
├── app/                    # Expo Router 페이지
│   ├── community/         # 커뮤니티 목록
│   ├── login/            # 로그인
│   ├── post/             # 게시글 상세
│   ├── signup/           # 회원가입
│   └── write/            # 게시글 작성
├── config/               # 설정 파일
│   └── firebase.ts       # Firebase 설정
├── services/             # 비즈니스 로직
│   ├── auth-context.tsx  # 인증 컨텍스트
│   └── firebase.ts       # Firebase 서비스
├── types/                # TypeScript 타입 정의
└── assets/               # 이미지 등 정적 파일
```
