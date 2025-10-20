import { formatNumber } from '../services/formatters';

interface StatItemProps {
  label: string;
  value: number;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(value)}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}
