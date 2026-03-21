
interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', label }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-2 border-gray-700 border-t-brand-400`}
      />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}