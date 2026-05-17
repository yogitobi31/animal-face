export default function AdSlotPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`ad-slot-placeholder ${compact ? 'ad-slot-compact' : 'ad-slot-regular'}`}
    >
      Advertisement
    </div>
  );
}
