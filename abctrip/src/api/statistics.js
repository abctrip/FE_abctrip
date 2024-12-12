import { localAxios } from "@/util/http-commons";

const local = localAxios();

function getHotplaceRank(success, fail) {
    local.get(`/statistics`).then(success).catch(fail);
}

export {
    getHotplaceRank,
};