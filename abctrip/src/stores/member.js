import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"
import { userConfirm, findById, tokenRegeneration, logout, register, modify, remove, checkId, userPasswordReset } from "@/api/user"
import { httpStatusCode } from "@/util/http-status"
import { useMenuStore } from "./menu"

export const useMemberStore = defineStore("memberStore", () => {
  const router = useRouter()
  const isLogin = ref(false)
  const isLoginError = ref(false)
  const userInfo = ref(null)
  const isValidToken = ref(false)

  // 사용자 로그인 처리
  const userLogin = async (loginUser) => {
    await userConfirm(
      loginUser,
      (response) => {       
        if (response.status === httpStatusCode.OK) {
          let { data } = response
          let accessToken = data["access-token"]
          let refreshToken = data["refresh-token"]
          
          console.log("로그인 성공 !! 발급 받은 토큰:", accessToken, refreshToken)
  
          isLogin.value = true
          isValidToken.value = true
          isLoginError.value = false
          sessionStorage.setItem("accessToken", accessToken)
          sessionStorage.setItem("refreshToken", refreshToken)
        }
      },
      (error) => {
        console.log("store - 로그인 실패:", error)
        isLogin.value = false
        isLoginError.value = true
        isValidToken.value = false
      }
    )
  }

  // JWT 토큰에서 사용자 정보 추출
  const getUserInfo = async (token) => {
    let decodeToken = jwtDecode(token)  // JWT 토큰 디코딩하여 userId 추출
    console.log("decodeToken : ", decodeToken)

    await findById(
      decodeToken.userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          userInfo.value = response.data.userInfo
        }
      },
      async (error) => {
        console.error("[토큰 만료되어 사용 불가능] : ", error.response.status, error.response.statusText)
        isValidToken.value = false
        await tokenRegenerate()
      }
    )
  }

  // Access Token 만료시 Refresh Token으로 재발급
  const tokenRegenerate = async () => {
    // refresh token으로 새로운 access token 발급 요청
    await tokenRegeneration(
      JSON.stringify(userInfo.value),
      // 성공시: 새 access token 저장
      (response) => {
        if (response.status === httpStatusCode.CREATE) {
          let accessToken = response.data["access-token"]
          sessionStorage.setItem("accessToken", accessToken)
          isValidToken.value = true
        }
      },
      // 실패시: refresh token도 만료된 경우
      async (error) => {
        // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
        if (error.response.status === httpStatusCode.UNAUTHORIZED) {
          // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
          await logout(
            userInfo.value.userid,
            (response) => {
              if (response.status === httpStatusCode.OK) {
                console.log("리프레시 토큰 제거 성공")
              } else {
                console.log("리프레시 토큰 제거 실패")
              }
              alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.")
              isLogin.value = false
              userInfo.value = null
              isValidToken.value = false
              router.push({ name: "user-login" })
            },
            (error) => {
              console.error(error)
              isLogin.value = false
              userInfo.value = null
            }
          )
        }
      }
    )
  }

  // 사용자 로그아웃 및 세션 정리
  const userLogout = async () => {
    console.log("로그아웃 아이디 : " + userInfo.value.userId)
    await logout(
      userInfo.value.userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          isLogin.value = false
          userInfo.value = null
          isValidToken.value = false

          sessionStorage.removeItem("accessToken")
          sessionStorage.removeItem("refreshToken")
        } else {
          console.error("유저 정보 없음!!!!")
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  // 신규 회원 등록 처리
  const userRegister = async(userInfo) => {
    console.log(userInfo.value);
    await register(
      userInfo,
      (response) => {
        if (response.status === httpStatusCode.CREATE) {
          alert("회원가입 성공 !! 로그인 페이지로 이동")
        }
      },
      (error) => {
        console.log(error);
        alert("회원가입 실패 !!");
      }
    );
  }

  // 회원 정보 수정
  const userModify = async(userInfo) => {
    await modify(
      userInfo,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          alert("회원 정보 수정 완료 !!");
        }
      },

      (error) => {
        console.log(error);
        alert("회원 정보 수정 실패 !!");
      }
    )
  }

  // 회원 탈퇴 처리
  const userRemove = async (userId) => {
    const menuStore = useMenuStore();  
    
    await remove(
      userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          alert("회원 탈퇴가 완료되었습니다.");
          isLogin.value = false;
          userInfo.value = null;
          isValidToken.value = false;

          menuStore.changeMenuState();
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
        }
      },
      (error) => {
        console.log(error);
        alert("회원 탈퇴 실패!");
      }
    );
  };

  // 아이디 중복 체크
  const checkDuplicateId = async (userId) => {
    let isDuplicate = false;
    await checkId(
      userId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          isDuplicate = response.data; // true면 중복, false면 사용가능
        }
      },
      (error) => {
        console.log(error);
        alert("중복 체크 중 오류 발생");
      }
    );
    return isDuplicate;
  };

  // 이메일 패스워드 초기화 
  const requestPasswordReset = async (email) => {
    await userPasswordReset(
      email,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          alert('비밀번호 재설정 링크가 이메일로 전송되었습니다.')
          router.push('/user/login')
        }
      },
      (error) => {
        console.error('패스워드 초기화 요청 실패: ', error)
        alert('요청 처리 중 오류가 발생했습니다.')
      }
    )
  };

// 비밀번호 유효성 검사 (길이/공백/일치 여부)
const validatePassword = (password, confirmPassword) => {
  if (password.length < 4 || password.length > 15) {
    alert('비밀번호를 최소 4자 이상 15자이하로 만들어주세요.');
    return false;
  }
 
  if (password.includes(' ')) {
    alert('비밀번호에 공백을 포함할 수 없습니다.');
    return false;
  }
 
  if (password !== confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return false;
  }
  return true;
}
  return {
    isLogin,
    isLoginError,
    userInfo,
    isValidToken,
    userLogin,
    getUserInfo,
    tokenRegenerate,
    userLogout,
    userRegister,
    userModify,
    userRemove,
    checkDuplicateId,
    validatePassword,
    requestPasswordReset
  }
},
{persist: { storage: localStorage }})
