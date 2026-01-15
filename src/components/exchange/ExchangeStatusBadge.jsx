import { getStatusByKey } from '../../constants/exchangeConstants';

export default function ExchangeStatusBadge({ status, showDetail = false, size = 'default' }) {
  const statusInfo = getStatusByKey(status);

  if (!statusInfo) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
        {status}
      </span>
    );
  }

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${statusInfo.bgClass} ${sizeClasses[size]}`}
    >
      {showDetail && statusInfo.labelDetail ? statusInfo.labelDetail : statusInfo.label}
    </span>
  );
}
