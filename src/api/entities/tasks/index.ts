import { get } from "../../index";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types";
import type { Task } from "./types";
import { TASKS_API_URLS } from "./consts";

/**
 * Fetch tasks from JSONPlaceholder API
 * @returns Promise with tasks array
 */
export async function getTasks(): Promise<AxiosResponse<ApiResponse<Task[]>>> {
  return get<Task[]>(TASKS_API_URLS.GET_TASKS);
}

export type { Task } from "./types";
