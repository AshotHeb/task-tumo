import { get } from "../../index";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types";
import type { User } from "./types";
import { USERS_API_URLS } from "./consts";

/**
 * Fetch users from JSONPlaceholder API
 * @returns Promise with users array
 */
export async function getUsers(): Promise<AxiosResponse<ApiResponse<User[]>>> {
  return get<User[]>(USERS_API_URLS.GET_USERS);
}

export type { User } from "./types";
