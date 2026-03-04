import SupplierDetail from '@/modules/supplier/components/SupplierDetail';

interface SupplierDetailPageProps {
  params: { supplierId: string };
}

export default function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { supplierId } = params;

  return <SupplierDetail supplierId={supplierId} />;
}
