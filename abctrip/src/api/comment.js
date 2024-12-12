import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 댓글 목록 가져오기
function getComments(articleno, success, fail) {
  local.get(`/comment/${articleno}`).then(success).catch(fail);
}

// 댓글 작성
function writeComment(commentNo, success, fail) {
  console.log("comment.js writeComment - ", commentNo);
  local.post(`/comment`, JSON.stringify(commentNo)).then(success).catch(fail);
}

// 댓글 수정
function modifyComment(commentData, success, fail) {
  console.log("comment.js modifyComment - ", commentData);
  local.put(`/comment`, JSON.stringify(commentData)).then(success).catch(fail);
}

// 댓글 삭제
function deleteComment(commentNo, success, fail) {
  console.log("comment.js deleteComment - ", commentNo);
  local.delete(`/comment/${commentNo}`).then(success).catch(fail);
}

export {
  getComments,
  writeComment,
  modifyComment,
  deleteComment,
};
