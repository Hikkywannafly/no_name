import type { GetMangasStatisticResponse } from "../../types/mangadex";
import * as util from "./util";

export type GetMangasStatisticRequestOptions = {
  manga: string[];
};

export const getMangasStatistic = (
  options?: GetMangasStatisticRequestOptions,
) => {
  const qs = util.buildQueryStringFromOptions(options);
  const path = `/statistics/manga${qs}`;

  return util.createHttpsRequestPromise<GetMangasStatisticResponse>(
    "GET",
    path,
  );
};

export const getGroupStatistic = (groupId: string) => {
  const path = `/statistics/group/${groupId}`;

  return util.createHttpsRequestPromise<GetMangasStatisticResponse>(
    "GET",
    path,
  );
};
