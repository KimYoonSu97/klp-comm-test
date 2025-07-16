import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../config/firebase";
import {
  Post,
  Comment,
  CreatePostData,
  CreateCommentData,
  User,
} from "../types";

// 인증 관련 함수들
export const signInUser = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const signUpUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 사용자 프로필 업데이트
  await updateProfile(userCredential.user, {
    displayName: displayName,
  });

  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// 게시글 관련 함수들
export const createPost = async (data: CreatePostData): Promise<string> => {
  const user = auth.currentUser;
  const postData = {
    ...data,
    author: user?.displayName || user?.email || "익명",
    authorId: user?.uid || "anonymous",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likes: 0,
    likedBy: [],
  };

  const docRef = await addDoc(collection(db, "posts"), postData);
  return docRef.id;
};

export const getPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Post[];
};

export const getPost = async (postId: string): Promise<Post | null> => {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Post;
  }

  return null;
};

export const deletePost = async (postId: string): Promise<void> => {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
};

export const togglePostLike = async (postId: string): Promise<void> => {
  const user = auth.currentUser;
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  const postData = postSnap.data();
  const likedBy = postData?.likedBy || [];
  const isLiked = likedBy.includes(user?.uid);

  if (isLiked) {
    await updateDoc(postRef, {
      likes: increment(-1),
      likedBy: arrayRemove(user?.uid || ""),
    });
  } else {
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: arrayUnion(user?.uid || ""),
    });
  }
};

export const createComment = async (
  postId: string,
  data: CreateCommentData
): Promise<string> => {
  const user = auth.currentUser;
  const commentData = {
    ...data,
    postId,
    author: user?.displayName || user?.email || "익명",
    authorId: user?.uid || "anonymous",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likes: 0,
    likedBy: [],
  };

  const docRef = await addDoc(collection(db, "comments"), commentData);
  return docRef.id;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Comment[];
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const commentRef = doc(db, "comments", commentId);
  await deleteDoc(commentRef);
};

export const toggleCommentLike = async (commentId: string): Promise<void> => {
  const user = auth.currentUser;
  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);

  const commentData = commentSnap.data();
  const likedBy = commentData?.likedBy || [];
  const isLiked = likedBy.includes(user?.uid);

  if (isLiked) {
    await updateDoc(commentRef, {
      likes: increment(-1),
      likedBy: arrayRemove(user?.uid || ""),
    });
  } else {
    await updateDoc(commentRef, {
      likes: increment(1),
      likedBy: arrayUnion(user?.uid || ""),
    });
  }
};
