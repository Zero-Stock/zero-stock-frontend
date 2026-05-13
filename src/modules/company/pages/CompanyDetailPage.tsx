import CompanyDetail from '@/modules/company/components/CompanyDetail';

interface CompanyDetailPageProps {
  params: { companyId: string };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { companyId } = params;

  return <CompanyDetail companyId={companyId} />;
}
