import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 토큰 설정 함수
const setAccessToken = () => {
  local.defaults.headers["accessToken"] = sessionStorage.getItem("accessToken");
};

// 1. 인증 관련 API
async function userConfirm(param, success, fail) {
  console.log("API 호출 시작:", param);  // API 호출 시작 지점
  await local.post(`/user/login`, param).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
  await local.post(`/user/refresh`, user).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await local.get(`/user/logout/${userid}`).then(success).catch(fail);
}

// 2. 회원 정보 관련 API
async function findById(userid, success, fail) {
  setAccessToken();
  await local.get(`/user/info/${userid}`).then(success).catch(fail);
}

async function checkId(userId, success, fail) {
  await local.get(`/user/check/${userId}`).then(success).catch(fail);
}

// 3. 회원 관리 API
async function register(user, success, fail) {
  await local.post(`/user/register`, user).then(success).catch(fail);
}

async function modify(user, success, fail) {
  setAccessToken();
  await local.put(`/user/modify`, user).then(success).catch(fail);
}

async function remove(userId, success, fail) {
  setAccessToken();
  await local.delete(`/user/remove/${userId}`).then(success).catch(fail); 
}

async function userPasswordReset(email, success, fail) {
  await local.post(`/user/passwordReset`, { email }).then(success).catch(fail);
}

export { 
  // 인증 관련
  userConfirm, tokenRegeneration, logout,
  // 회원 정보 관련
  findById, checkId,
  // 회원 관리
  register, modify, remove, userPasswordReset
};