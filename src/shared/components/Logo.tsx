export interface LogoProps {
  className?: string;
}

export default function Logo(props: LogoProps) {
  const { className } = props;

  return (
    <div className={className}>
      <img
        src="/images/favicon.ico"
        alt="logo"
        fetchPriority="high"
        className="max-h-8 max-w-8 object-contain"
      />
    </div>
  );
}
