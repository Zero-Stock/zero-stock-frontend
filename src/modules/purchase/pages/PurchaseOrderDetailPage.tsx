import PurchaseOrder from '@/modules/purchase/components/PurchaseOrder';

interface PurchaseOrderDetailPageProps {
  params: { id: string };
}

export default function PurchaseOrderDetailPage({
  params,
}: PurchaseOrderDetailPageProps) {
  return (
    <div>
      <PurchaseOrder key={params.id} purchaseId={params.id} />
    </div>
  );
}
