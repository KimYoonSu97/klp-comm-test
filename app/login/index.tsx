import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";
import { signInUser } from "../../services/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await signInUser(email.trim(), password);
      router.push("/community");
    } catch (error: any) {
      Alert.alert("로그인 실패", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <S.Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <S.Content>
          <S.Title>KLP 커뮤니티</S.Title>
          <S.Subtitle>로그인</S.Subtitle>

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
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <S.LoginButton onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <S.LoginButtonText>로그인</S.LoginButtonText>
              )}
            </S.LoginButton>

            <S.SignupButton onPress={handleSignup} disabled={isLoading}>
              <S.SignupButtonText>회원가입</S.SignupButtonText>
            </S.SignupButton>
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
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    color: #333;
  `,
  Subtitle: styled.Text`
    font-size: 18px;
    text-align: center;
    margin-bottom: 40px;
    color: #666;
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
  LoginButton: styled.TouchableOpacity`
    background-color: #007aff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
  `,
  LoginButtonText: styled.Text`
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  `,
  SignupButton: styled.TouchableOpacity`
    padding: 15px;
    border-radius: 8px;
    border-width: 1px;
    border-color: #007aff;
  `,
  SignupButtonText: styled.Text`
    color: #007aff;
    text-align: center;
    font-size: 16px;
  `,
};
