<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle, deleteArticle } from "@/api/board";
import {
  getComments,
  writeComment,
  modifyComment,
  deleteComment,
} from "@/api/comment";
import { useMemberStore } from "@/stores/member";  // store import 추가

const memberStore = useMemberStore();

const userId = memberStore.userInfo?.userId;


// console.log(userId, "################");

const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const { articleno } = route.params;
const comments = ref([]); // 댓글 목록
const newComment = ref(""); // 새로 작성할 댓글 내용

const article = ref({});

onMounted(() => {
  getArticle();
  fetchComments();
});

const getArticle = () => {
  detailArticle(
    articleno,
    ({ data }) => {
      article.value = data;
    },
    (error) => {
      console.error(error);
    }
  );
};

const fetchComments = () => {
  getComments(
    articleno,
    ({ data }) => {
      comments.value = data; // 댓글 목록 저장
      console.log(comments);
    },
    (error) => {
      console.error("댓글 목록 가져오기 실패:", error);
    }
  );
};

// 댓글 등록
// ************************** 사용자 검증 되면 그때 다시 확인
const addComment = () => {
  if (!userId) {
   alert("로그인이 필요한 서비스입니다.");
   return;
 }
  if (!newComment.value.trim()) {
    alert("댓글 내용을 입력하세요!");
    return;
  }

  const commentData = {
    articleno, // 게시글 번호
    freePostId: articleno,
    userId: userId,
    freeCommentContent: newComment.value, // 댓글 내용
  };

  writeComment(
    commentData,
    (response) => {
      if (response.status === 201) {
        alert("댓글이 등록되었습니다.");
        newComment.value = ""; // 입력창 초기화
        fetchComments(); // 댓글 목록 갱신
      }
    },
    (error) => {
      console.error("댓글 등록 실패:", error);
    }
  );
};

// 댓글 수정 (UI 및 추가 작업 필요)
const editComment = (comment) => {
  if (!userId) {
   alert("로그인이 필요한 서비스입니다.");
   return;
 }
 // 작성자 검증 추가
 console.log(comment);
 console.log(userId);
 if (comment.userId !== userId) {
   alert("자신이 작성한 댓글만 수정할 수 있습니다.");
   return;
 }

 const updatedContent = prompt("댓글 내용을 수정하세요:", comment.commentContent);
 if (updatedContent === null || updatedContent.trim() === "") {
   alert("수정 내용이 비어있습니다.");
   return;
 }

 const commentData = {
  freeCommentId: comment.freeCommentId,
  freeCommentContent: updatedContent,
   userId: userId  // 사용자 ID 추가
 };
console.log(commentData, "######");

 modifyComment(
   commentData,
   (response) => {
     if (response.status === 200) {
       alert("댓글이 수정되었습니다.");
       fetchComments();
     }
   },
   (error) => {
     console.error("댓글 수정 실패:", error);
   }
 );
};

// 댓글 삭제
const removeComment = (comment) => {  // commentId 대신 comment 객체를 받도록 수정
  if (!userId) {
   alert("로그인이 필요한 서비스입니다.");
   return;
 }
 // 작성자 검증 추가
 console.log(comment, "comment comment");
 if (comment.userId !== userId) {
   alert("자신이 작성한 댓글만 삭제할 수 있습니다.");
   return;
 }

 if (!confirm("댓글을 삭제하시겠습니까?")) return;

 deleteComment(
   comment.freeCommentId,
   (response) => {
     if (response.status === 200) {
       alert("댓글이 삭제되었습니다.");
       fetchComments();
     }
   },
   (error) => {
     console.error("댓글 삭제 실패:", error);
   }
 );
};

function moveList() {
  router.push({ name: "freeboard-list" });
}

// 글 수정
function moveModify() {
  if (!userId) {
   alert("로그인이 필요한 서비스입니다.");
   return;
 }
 // 작성자 검증 추가
 if (article.value.userId !== userId) {
   alert("자신이 작성한 게시글만 수정할 수 있습니다.");
   return;
 }
  console.log("articleno 값:", articleno);
  router.push({ name: "freeboard-modify", params: { articleno } });
}

// 글 삭제
function onDeleteArticle() {
  if (!userId) {
   alert("로그인이 필요한 서비스입니다.");
   return;
 }
 // 작성자 검증 추가
 if (article.value.userId !== userId) {
   alert("자신이 작성한 게시글만 삭제할 수 있습니다.");
   return;
 }
  deleteArticle(
    articleno,
    (response) => {
      if (response.status == 200) moveList();
    },
    (error) => {
      console.error(error);
    }
  );
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <!-- px-3 가 좌우 padding 같음 -->
          <h2 class="text-secondary">
            {{ article.freeTitle }}
          </h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <p>
                <span class="fw-bold">{{ article.nickName }}</span> <br/>
                <span class="text-secondary fw-light">
                    {{ article.createdAt }}<br/>
                </span>
              </p>
            </div>
          </div>
          <div class="col-md-4 align-self-center text-end">
            <span class="text-secondary fw-light">조회수 : {{ article.freeViews }}</span>
          </div>
          <div class="divider mb-3 border-bottom"></div>
          <div class="text-secondary">
            {{ article.freeContent }}
          </div>
          <div class="divider mt-3 mb-3"></div>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn mb-4"
              @click="moveList"
            >
              글목록
            </button>
            <button
              type="button"
              class="btn mb-4 ms-1"
              @click="moveModify"
            >
              글수정
            </button>
            <button
              type="button"
              class="btn mb-4 ms-1"
              @click="onDeleteArticle"
            >
              글삭제
            </button>
          </div>
          <!-- 댓글 섹션 -->
          <div class="mt-4">
            <h3>댓글</h3>
            <div class="list-group mb-3">
              <!-- 댓글 리스트 -->
              <div
                v-for="comment in comments"
                :key="comment.commentId"
                class="list-group-item"
              >
                <p class="mb-1">
                  <strong>{{ comment.nickName }}</strong>
                </p>
                <p class="mb-1">{{ comment.freeCommentContent }}</p>
                <small class="text-muted">{{ comment.createdAt }}</small>
                <div class="mt-2 d-flex justify-content-end">
                  <button
                    class="btn btn-sm me-1"
                    @click="editComment(comment)"
                  >
                    수정
                  </button>
                  <button
                    class="btn btn-sm "
                    @click="removeComment(comment)"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>

            <!-- 댓글 입력창 -->
            <div class="mb-3">
              <label for="newComment" class="form-label">댓글 작성</label>
              <textarea
                id="newComment"
                class="form-control"
                rows="3"
                v-model="newComment"
                placeholder="댓글을 입력하세요..."
              ></textarea>
            </div>
            <button class="btn" style="border-color:#6E7073" @click="addComment">
              댓글 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
    border: 1px solid #6E7073;
}
.btn:hover {
    background-color: #6E7073;
    color: white;
}
</style>
