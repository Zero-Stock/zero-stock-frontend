import SupplierDetail from '@/modules/supplier/components/SupplierDetail';

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;
  return <SupplierDetail supplierId={supplierId} />;
}
