import type { GitHubUser } from '../types/github';
import { GitHubUserSchema } from '../types/github';

export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다');
        }
        if (response.status === 403) {
          throw new Error('일시적으로 요청이 제한되었습니다. 잠시 후 다시 시도해주세요');
        }
        throw new Error('네트워크 오류가 발생했습니다');
      }

      const data = await response.json();
      return GitHubUserSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요');
        }
        throw error;
      }
      throw new Error('알 수 없는 오류가 발생했습니다');
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
