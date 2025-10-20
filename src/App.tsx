import { useRef } from 'react';
import { useGitHubUser } from './hooks/useGitHubUser';
import { SearchInput } from './components/SearchInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProfileCard } from './components/ProfileCard';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const { user, loading, error, fetchUser } = useGitHubUser();
  const lastSearchRef = useRef<string>('');

  const handleSearch = (username: string) => {
    lastSearchRef.current = username;
    fetchUser(username);
  };

  const handleRetry = () => {
    if (lastSearchRef.current) {
      fetchUser(lastSearchRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GitHub 프로필 검색
          </h1>
          <p className="text-gray-600">
            GitHub 사용자 이름을 입력하여 프로필을 확인하세요
          </p>
        </div>

        <SearchInput onSearch={handleSearch} loading={loading} />

        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {user && !loading && !error && <ProfileCard user={user} />}
      </div>
    </div>
  );
}

export default App;
