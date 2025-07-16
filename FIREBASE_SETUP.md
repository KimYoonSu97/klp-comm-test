# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `klp-comm`)
4. Google Analytics 설정 (선택사항)
5. "프로젝트 만들기" 클릭

## 2. 웹 앱 추가

1. 프로젝트 대시보드에서 웹 아이콘(</>) 클릭
2. 앱 닉네임 입력 (예: `klp-comm-web`)
3. "Firebase Hosting 설정" 체크 해제
4. "앱 등록" 클릭

## 3. Firebase 설정 정보 복사

앱 등록 후 제공되는 설정 정보를 복사:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

## 4. 설정 파일 업데이트

`config/firebase.ts` 파일의 `firebaseConfig` 객체를 위에서 복사한 정보로 교체:

```typescript
const firebaseConfig = {
  apiKey: "실제-api-key",
  authDomain: "실제-project.firebaseapp.com",
  projectId: "실제-project-id",
  storageBucket: "실제-project.appspot.com",
  messagingSenderId: "실제-sender-id",
  appId: "실제-app-id",
};
```

## 5. Firestore 데이터베이스 설정

1. Firebase Console에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택:
   - **테스트 모드**: 개발 중에는 "테스트 모드에서 시작" 선택
   - **프로덕션**: 실제 배포 시에는 보안 규칙 설정 필요

## 6. 보안 규칙 설정 (프로덕션용)

Firestore 보안 규칙을 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 게시글 규칙
    match /posts/{postId} {
      allow read: if true;  // 모든 사용자가 읽기 가능
      allow create: if request.auth != null;  // 로그인한 사용자만 생성 가능
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;  // 작성자만 수정/삭제 가능
    }

    // 댓글 규칙
    match /comments/{commentId} {
      allow read: if true;  // 모든 사용자가 읽기 가능
      allow create: if request.auth != null;  // 로그인한 사용자만 생성 가능
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;  // 작성자만 수정/삭제 가능
    }
  }
}
```

## 7. 인증 설정 (선택사항)

사용자 인증을 사용하려면:

1. Firebase Console에서 "Authentication" 클릭
2. "시작하기" 클릭
3. 원하는 로그인 방법 활성화 (이메일/비밀번호, Google 등)

## 8. 앱 실행

설정 완료 후 앱을 실행하면 Firebase와 연결되어 실시간으로 데이터가 동기화됩니다.

## 주의사항

- 실제 프로덕션 환경에서는 보안 규칙을 반드시 설정해야 합니다.
- API 키는 공개되어도 안전하지만, 프로젝트 설정에서 도메인 제한을 설정하는 것을 권장합니다.
- 개발 중에는 테스트 모드를 사용하고, 배포 전에 보안 규칙을 검토하세요.
