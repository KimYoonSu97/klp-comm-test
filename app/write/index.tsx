import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";
import { createPost } from "../../services/firebase";

export default function WriteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
      });

      Alert.alert("성공", "게시글이 작성되었습니다.", [
        { text: "확인", onPress: () => router.push("/community") },
      ]);
    } catch (error) {
      Alert.alert("오류", "게시글 작성에 실패했습니다.");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <S.Container>
      <S.Header>
        <S.CancelButton onPress={handleCancel}>
          <S.CancelButtonText>취소</S.CancelButtonText>
        </S.CancelButton>
        <S.HeaderTitle>글쓰기</S.HeaderTitle>
        <S.SubmitButton onPress={handleSubmit} disabled={isSubmitting}>
          <S.SubmitButtonText disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "등록"}
          </S.SubmitButtonText>
        </S.SubmitButton>
      </S.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <S.Content>
          <S.Form>
            <S.TitleInput
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <S.ContentInput
              placeholder="내용을 입력하세요"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </S.Form>
        </S.Content>
      </KeyboardAvoidingView>
    </S.Container>
  );
}

const S = {
  Container: styled.SafeAreaView`
    flex: 1;
    background-color: #fff;
  `,
  Header: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
  `,
  CancelButton: styled.TouchableOpacity`
    padding: 5px;
  `,
  CancelButtonText: styled.Text`
    font-size: 16px;
    color: #666;
  `,
  HeaderTitle: styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
  `,
  SubmitButton: styled.TouchableOpacity`
    padding: 5px;
  `,
  SubmitButtonText: styled.Text<{ disabled?: boolean }>`
    font-size: 16px;
    color: ${(props) => (props.disabled ? "#999" : "#007aff")};
    font-weight: bold;
  `,
  Content: styled.ScrollView`
    flex: 1;
  `,
  Form: styled.View`
    padding: 20px;
  `,
  TitleInput: styled.TextInput`
    border-width: 1px;
    border-color: #ddd;
    border-radius: 8px;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  `,
  ContentInput: styled.TextInput`
    border-width: 1px;
    border-color: #ddd;
    border-radius: 8px;
    padding: 15px;
    font-size: 16px;
    line-height: 24px;
    min-height: 300px;
  `,
};
