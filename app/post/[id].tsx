import React, { useState, useEffect } from "react";
import { ScrollView, Alert, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { router, useLocalSearchParams } from "expo-router";
import {
  getPost,
  togglePostLike,
  getComments,
  createComment,
  toggleCommentLike,
} from "../../services/firebase";
import { Post, Comment } from "../../types";
import { auth } from "../../config/firebase";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadPostAndComments(id);
    }
  }, [id]);

  const loadPostAndComments = async (postId: string) => {
    try {
      setIsLoading(true);
      const [fetchedPost, fetchedComments] = await Promise.all([
        getPost(postId),
        getComments(postId),
      ]);

      if (fetchedPost) {
        setPost(fetchedPost);
        // 현재 사용자가 좋아요를 눌렀는지 확인
        const user = auth.currentUser;
        if (user) {
          setIsLiked(fetchedPost.likedBy.includes(user.uid));
        }
      }

      setComments(fetchedComments);
    } catch (error) {
      Alert.alert("오류", "게시글을 불러오는데 실패했습니다.");
      console.error("Error loading post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      await togglePostLike(post.id);
      setIsLiked(!isLiked);
      // 게시글 정보 새로고침
      const updatedPost = await getPost(post.id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    } catch (error) {
      Alert.alert("오류", "좋아요 처리에 실패했습니다.");
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !post) return;

    try {
      await createComment(post.id, { content: newComment.trim() });
      setNewComment("");
      // 댓글 목록 새로고침
      const updatedComments = await getComments(post.id);
      setComments(updatedComments);
    } catch (error) {
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
      console.error("Error creating comment:", error);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      await toggleCommentLike(commentId);
      // 댓글 목록 새로고침
      if (post) {
        const updatedComments = await getComments(post.id);
        setComments(updatedComments);
      }
    } catch (error) {
      Alert.alert("오류", "댓글 좋아요 처리에 실패했습니다.");
      console.error("Error toggling comment like:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!post) {
    return (
      <S.Container>
        <S.LoadingContainer>
          <S.LoadingText>게시글을 불러오는 중...</S.LoadingText>
        </S.LoadingContainer>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onPress={handleBack}>
          <S.BackButtonText>← 뒤로</S.BackButtonText>
        </S.BackButton>
        <S.HeaderTitle>게시글</S.HeaderTitle>
        <S.Placeholder />
      </S.Header>

      <S.Content>
        <S.PostContainer>
          <S.Title>{post.title}</S.Title>

          <S.Meta>
            <S.Author>{post.author}</S.Author>
            <S.Date>{post.createdAt.toLocaleDateString()}</S.Date>
          </S.Meta>

          <S.ContentText>{post.content}</S.ContentText>

          <S.Actions>
            <S.LikeButton isLiked={isLiked} onPress={handleLike}>
              <S.LikeButtonText isLiked={isLiked}>
                ❤️ {post.likes}
              </S.LikeButtonText>
            </S.LikeButton>
          </S.Actions>
        </S.PostContainer>

        {/* 댓글 섹션 */}
        <S.CommentsSection>
          <S.CommentsTitle>댓글 ({comments.length})</S.CommentsTitle>

          {/* 댓글 작성 */}
          <S.CommentInputContainer>
            <S.CommentInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 작성하세요..."
              multiline
            />
            <S.CommentSubmitButton onPress={handleCommentSubmit}>
              <S.CommentSubmitText>작성</S.CommentSubmitText>
            </S.CommentSubmitButton>
          </S.CommentInputContainer>

          {/* 댓글 목록 */}
          {comments.map((comment) => (
            <S.CommentItem key={comment.id}>
              <S.CommentHeader>
                <S.CommentAuthor>{comment.author}</S.CommentAuthor>
                <S.CommentDate>
                  {comment.createdAt.toLocaleDateString()}
                </S.CommentDate>
              </S.CommentHeader>
              <S.CommentContent>{comment.content}</S.CommentContent>
              <S.CommentActions>
                <S.CommentLikeButton
                  onPress={() => handleCommentLike(comment.id)}
                >
                  <S.CommentLikeText>❤️ {comment.likes}</S.CommentLikeText>
                </S.CommentLikeButton>
              </S.CommentActions>
            </S.CommentItem>
          ))}
        </S.CommentsSection>
      </S.Content>
    </S.Container>
  );
}

const S = {
  Container: styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
  `,
  LoadingContainer: styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  LoadingText: styled.Text`
    font-size: 16px;
    color: #666;
  `,
  Header: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
  `,
  BackButton: styled.TouchableOpacity`
    padding: 5px;
  `,
  BackButtonText: styled.Text`
    font-size: 16px;
    color: #007aff;
  `,
  HeaderTitle: styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
  `,
  Placeholder: styled.View`
    width: 50px;
  `,
  Content: styled.ScrollView`
    flex: 1;
  `,
  PostContainer: styled.View`
    padding: 20px;
  `,
  Title: styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  `,
  Meta: styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
  `,
  Author: styled.Text`
    font-size: 14px;
    color: #666;
  `,
  Date: styled.Text`
    font-size: 14px;
    color: #999;
  `,
  ContentText: styled.Text`
    font-size: 16px;
    line-height: 24px;
    color: #333;
    margin-bottom: 30px;
  `,
  Actions: styled.View`
    flex-direction: row;
    justify-content: center;
  `,
  LikeButton: styled.TouchableOpacity<{ isLiked: boolean }>`
    padding-horizontal: 20px;
    padding-vertical: 10px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${(props) => (props.isLiked ? "#ff6b6b" : "#ddd")};
    background-color: ${(props) => (props.isLiked ? "#ff6b6b" : "transparent")};
  `,
  LikeButtonText: styled.Text<{ isLiked: boolean }>`
    font-size: 16px;
    color: ${(props) => (props.isLiked ? "#fff" : "#666")};
  `,
  CommentsSection: styled.View`
    padding: 20px;
    border-top-width: 1px;
    border-top-color: #eee;
  `,
  CommentsTitle: styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  `,
  CommentInputContainer: styled.View`
    flex-direction: row;
    margin-bottom: 20px;
  `,
  CommentInput: styled.TextInput`
    flex: 1;
    border-width: 1px;
    border-color: #ddd;
    border-radius: 8px;
    padding: 10px;
    margin-right: 10px;
    font-size: 14px;
    min-height: 40px;
  `,
  CommentSubmitButton: styled.TouchableOpacity`
    background-color: #007aff;
    padding-horizontal: 15px;
    padding-vertical: 10px;
    border-radius: 8px;
    justify-content: center;
  `,
  CommentSubmitText: styled.Text`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  `,
  CommentItem: styled.View`
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
  `,
  CommentHeader: styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 8px;
  `,
  CommentAuthor: styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #333;
  `,
  CommentDate: styled.Text`
    font-size: 12px;
    color: #999;
  `,
  CommentContent: styled.Text`
    font-size: 14px;
    color: #333;
    line-height: 20px;
    margin-bottom: 8px;
  `,
  CommentActions: styled.View`
    flex-direction: row;
    justify-content: flex-end;
  `,
  CommentLikeButton: styled.TouchableOpacity`
    padding: 5px;
  `,
  CommentLikeText: styled.Text`
    font-size: 12px;
    color: #ff6b6b;
  `,
};
