import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Alert } from "react-native";
import styled from "styled-components/native";
import { router, useFocusEffect } from "expo-router";
import { getPosts, signOutUser } from "../../services/firebase";
import { useAuth } from "../../services/auth-context";
import { Post } from "../../types";

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      Alert.alert("오류", "게시글을 불러오는데 실패했습니다.");
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleWritePress = () => {
    router.push("/write");
  };

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await signOutUser();
            router.replace("/login");
          } catch (error: any) {
            Alert.alert("오류", error.message);
          }
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <S.PostItem onPress={() => handlePostPress(item.id)}>
      <S.PostTitle>{item.title}</S.PostTitle>
      <S.PostContent numberOfLines={2}>{item.content}</S.PostContent>
      <S.PostMeta>
        <S.PostAuthor>{item.author}</S.PostAuthor>
        <S.PostDate>{item.createdAt.toLocaleDateString()}</S.PostDate>
        <S.PostLikes>❤️ {item.likes}</S.PostLikes>
      </S.PostMeta>
    </S.PostItem>
  );

  return (
    <S.Container>
      <S.Header>
        <S.HeaderLeft>
          <S.Title>커뮤니티</S.Title>
          <S.UserInfo>{user?.displayName || user?.email}님</S.UserInfo>
        </S.HeaderLeft>
        <S.HeaderRight>
          <S.WriteButton onPress={handleWritePress}>
            <S.WriteButtonText>글쓰기</S.WriteButtonText>
          </S.WriteButton>
          <S.LogoutButton onPress={handleLogout}>
            <S.LogoutButtonText>로그아웃</S.LogoutButtonText>
          </S.LogoutButton>
        </S.HeaderRight>
      </S.Header>

      <S.ListContainer>
        {isLoading ? (
          <S.LoadingContainer>
            <S.LoadingText>게시글을 불러오는 중...</S.LoadingText>
          </S.LoadingContainer>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={loadPosts}
          />
        )}
      </S.ListContainer>
    </S.Container>
  );
}

const S = {
  Container: styled.SafeAreaView`
    flex: 1;
    background-color: #f5f5f5;
  `,
  Header: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
  `,
  HeaderLeft: styled.View`
    flex: 1;
  `,
  HeaderRight: styled.View`
    flex-direction: row;
    align-items: center;
  `,
  Title: styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
  `,
  UserInfo: styled.Text`
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  `,
  WriteButton: styled.TouchableOpacity`
    background-color: #007aff;
    padding-horizontal: 15px;
    padding-vertical: 8px;
    border-radius: 6px;
    margin-right: 10px;
  `,
  WriteButtonText: styled.Text`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  `,
  LogoutButton: styled.TouchableOpacity`
    padding-horizontal: 12px;
    padding-vertical: 6px;
    border-radius: 6px;
    border-width: 1px;
    border-color: #ff3b30;
  `,
  LogoutButtonText: styled.Text`
    color: #ff3b30;
    font-size: 12px;
    font-weight: bold;
  `,
  ListContainer: styled.View`
    flex: 1;
  `,
  PostItem: styled.TouchableOpacity`
    background-color: #fff;
    margin-horizontal: 15px;
    margin-top: 15px;
    padding: 15px;
    border-radius: 8px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 3.84px;
    elevation: 5;
  `,
  PostTitle: styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  `,
  PostContent: styled.Text`
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    line-height: 20px;
  `,
  PostMeta: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  PostAuthor: styled.Text`
    font-size: 12px;
    color: #999;
  `,
  PostDate: styled.Text`
    font-size: 12px;
    color: #999;
  `,
  PostLikes: styled.Text`
    font-size: 12px;
    color: #ff6b6b;
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
};
