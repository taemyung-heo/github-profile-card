import type { GitHubUser } from '../types/github';
import { Avatar } from './Avatar';
import { StatItem } from './StatItem';

interface ProfileCardProps {
  user: GitHubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
        <div className="flex items-start gap-5">
          <Avatar
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.name || user.login}
            </h2>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group"
            >
              @{user.login}
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {user.bio && (
              <p className="mt-3 text-gray-700 leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* 통계 영역 */}
      <div className="px-6 py-6 bg-white">
        <div className="grid grid-cols-3 gap-6">
          <StatItem label="팔로워" value={user.followers} />
          <StatItem label="팔로잉" value={user.following} />
          <StatItem label="레포지토리" value={user.public_repos} />
        </div>
      </div>
    </article>
  );
}
