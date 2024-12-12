import { ref } from "vue";
import { defineStore } from "pinia";

export const useMenuStore = defineStore("menuStore", () => {

  // 상수로 초기 메뉴 설정 분리
  const initMenuList = [
    { name: "회원가입", show: true, routeName: "user-join" },
    { name: "로그인", show: true, routeName: "user-login" },
    { name: "내정보", show: false, routeName: "user-mypage" },
    { name: "로그아웃", show: false, routeName: "user-logout" },
  ];

  // 관련 상태들 그룹화
  const user = ref({
    name: "",
    nickName: ""
  });
  
  const menuList = ref(initMenuList);

  const setUserInfo = (name, nickname) => {
    user.value = {name, nickName: nickname};
  }
  
  // 메뉴 상태 변경
  const changeMenuState = () => {
    menuList.value = menuList.value.map(item => ({
      ...item,
      show: !item.show
    }));
  };

  return {
    menuList,
    changeMenuState,
    setUserInfo,
    user
  };
});
