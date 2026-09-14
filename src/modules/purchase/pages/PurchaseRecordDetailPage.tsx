import PurchaseRecord from '@/modules/purchase/components/PurchaseRecord';

interface PurchaseRecordDetailPageProps {
  params: { id: string };
}

export default function PurchaseRecordDetailPage({
  params,
}: PurchaseRecordDetailPageProps) {
  return <PurchaseRecord key={params.id} purchaseId={params.id} />;
}
