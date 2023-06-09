import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { useRemoveItem } from '@/lib/cart/useRemoveItem';
import { type LineItem } from '@/lib/vercelCommerce/types/cart';
import CloseIcon from 'components/icons/close';
import LoadingDots from 'components/loading-dots';

export default function DeleteItemButton({ item }: { item: LineItem }) {
  const router = useRouter();
  const removeItem = useRemoveItem();

  const disabled = false;

  async function handleRemove() {
    removeItem({ itemId: item.id });

    startTransition(() => {
      router.refresh();
    });
  }
  return (
    <button
      aria-label="Remove cart item"
      onClick={handleRemove}
      disabled
      className={clsx(
        'ease flex min-w-[36px] max-w-[36px] items-center justify-center border px-2 transition-all duration-200 hover:border-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-900',
        {
          'cursor-not-allowed px-0': disabled,
        }
      )}
    >
      {disabled ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : (
        <CloseIcon className="hover:text-accent-3 mx-[1px] h-4 w-4" />
      )}
    </button>
  );
}
