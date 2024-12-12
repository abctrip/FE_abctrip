import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/TheMainView.vue";

// const onlyAuthUser = async (to, from, next) => {
//     const memberStore = useMemberStore();
//     const { userInfo, isValidToken } = storeToRefs(memberStore);
//     const { getUserInfo } = memberStore;
  
//     let token = sessionStorage.getItem("accessToken");
  
//     if (userInfo.value != null && token) {
//       await getUserInfo(token);
//     }
//     if (!isValidToken.value || userInfo.value === null) {
//       next({ name: "user-login" });
//     } else {
//       next();
//     }
//   };

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    //////////////////////////////////////////////
    ///**************** 게시판 router */
    /////////////////////////////////////////////
    {
      path: "/board",
      name: "board",
      component: () => import("../views/TheBoardView.vue"),
      redirect: { name: "freeboard-list" },
      children: [
        {
          path: "free",
          name: "freeboard-list",
          component: () => import("@/components/boards/FreeBoard.vue"),
        },
        {
            path: "view/:articleno",
            name: "freeboard-view",
            component: () => import("@/components/boards/BoardDetail.vue"),
        },
        {
            path: "write",
            name: "freeboard-write",
            // beforeEnter: onlyAuthUser,
            component: () => import("@/components/boards/BoardWrite.vue"),
        },
        {
            path: "modify/:articleno",
            name: "freeboard-modify",
            // beforeEnter: onlyAuthUser,
            component: () => import("@/components/boards/BoardModify.vue"),
        },
        {
          path: "anonymous",
          name: "anonymousboard",
          // beforeEnter: onlyAuthUser,
          component: () => import("@/components/boards/AnonymousBoard.vue"),
        },
        {
          path: "tip",
          name: "tipboard",
          // beforeEnter: onlyAuthUser,
          component: () => import("@/components/boards/TipBoard.vue"),
        },
      ],
    },
    //////////////////////////////////////////////
    ///**************** HELP router */
    /////////////////////////////////////////////
    {
      path: "/help",
      name: "help",
      component: () => import("../views/TheHelpView.vue"),
      redirect: { name: "noticehelp" },
      children: [
        {
          path: "notice",
          name: "noticehelp",
          component: () => import("@/components/helps/NoticeHelp.vue"),
        },
        {
          path: "qna",
          name: "qnahelp",
          // beforeEnter: onlyAuthUser,
          component: () => import("@/components/helps/QnaHelp.vue"),
        },
        {
          path: "onetoone",
          name: "onetoonehelp",
          // beforeEnter: onlyAuthUser,
          component: () => import("@/components/helps/OnetooneHelp.vue"),
        },
      ],
    },
    //////////////////////////////////////////////
    ///**************** 유저 router */
    /////////////////////////////////////////////
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/TheUserView.vue"),
      children: [
        {
          path: "login",
          name: "user-login",
          component: () => import("@/components/users/UserLogin.vue"),
        },
        {
          path: "join",
          name: "user-join",
          component: () => import("@/components/users/UserRegister.vue"),
        },
        {
          path: "mypage",
          name: "user-mypage",
        //   beforeEnter: onlyAuthUser,
          component: () => import("@/components/users/UserMyPage.vue"),
        },
        {
          path: "password-reset",
          name: "user-password-reset",
          component: () => import("@/components/users/UserPasswordReset.vue")
        }
      ],
    },
    //////////////////////////////////////////////
    ///**************** 지도 router */
    /////////////////////////////////////////////
    {
      path: "/routeview",
      name: "routeview",
      component: () => import("@/views/TheTouristSearchView.vue")
    },
    //////////////////////////////////////////////
    ///**************** AI Serach router */
    /////////////////////////////////////////////
    {
      path: "/aisearchview",
      name: "aisearchview",
      component: () => import("@/views/TheAiSearchView.vue"),
    },
  ],
});

export default router;
