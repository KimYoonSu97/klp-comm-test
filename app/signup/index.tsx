import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";
import { signUpUser } from "../../services/firebase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim() || !password || !confirmPassword || !nickname.trim()) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("오류", "유효한 이메일 형식을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signUpUser(email.trim(), password, nickname.trim());
      Alert.alert(
        "회원가입 성공",
        "회원가입이 완료되었습니다. 로그인해주세요.",
        [{ text: "확인", onPress: () => router.push("/login") }]
      );
    } catch (error: any) {
      Alert.alert("회원가입 실패", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <S.Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <S.Content>
          <S.Title>회원가입</S.Title>

          <S.Form>
            <S.Input
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            <S.Input
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
              editable={!isLoading}
            />
            <S.Input
              placeholder="비밀번호 (최소 6자)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <S.Input
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <S.SignupButton onPress={handleSignup} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <S.SignupButtonText>회원가입</S.SignupButtonText>
              )}
            </S.SignupButton>

            <S.BackButton onPress={handleBack} disabled={isLoading}>
              <S.BackButtonText>뒤로가기</S.BackButtonText>
            </S.BackButton>
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
  Content: styled.View`
    flex: 1;
    justify-content: center;
    padding: 0 20px;
  `,
  Title: styled.Text`
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
    color: #333;
  `,
  Form: styled.View`
    width: 100%;
  `,
  Input: styled.TextInput`
    border-width: 1px;
    border-color: #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    font-size: 16px;
  `,
  SignupButton: styled.TouchableOpacity`
    background-color: #007aff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
  `,
  SignupButtonText: styled.Text`
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  `,
  BackButton: styled.TouchableOpacity`
    padding: 15px;
    border-radius: 8px;
    border-width: 1px;
    border-color: #007aff;
  `,
  BackButtonText: styled.Text`
    color: #007aff;
    text-align: center;
    font-size: 16px;
  `,
};
