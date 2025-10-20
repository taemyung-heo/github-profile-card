import { useState, useCallback } from 'react';
import type { GitHubUser } from '../types/github';
import { githubApi } from '../services/githubApi';

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (username: string) => {
    if (!username.trim()) {
      setError('GitHub 아이디를 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await githubApi.getUser(username);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, fetchUser };
}
