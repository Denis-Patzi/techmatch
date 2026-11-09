import { useCallback, useEffect, useRef, useState } from 'react';
import { commerceError, commerceRpc } from '@/lib/commerce';

export function useAuctions(products) {
  const ids = products
    .filter((p) => p.listing_type === 'auction')
    .map((p) => p.id)
    .sort()
    .join(',');
  const [auctions, setAuctions] = useState({});
  const [error, setError] = useState('');
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    if (!ids) {
      setAuctions({});
      setError('');
      return;
    }
    try {
      const data = await commerceRpc('get_auction_states', {
        p_product_ids: ids.split(','),
      });
      if (request !== generation.current) return;
      const receivedAt = performance.now();
      setAuctions(
        Object.fromEntries(
          data.map((a) => [a.product_id, { ...a, receivedAt }]),
        ),
      );
      setError('');
    } catch (failure) {
      if (request === generation.current) setError(commerceError(failure));
    }
  }, [ids]);
  useEffect(() => {
    refresh();
    const tick = () => {
      if (!document.hidden) refresh();
    };
    const timer = setInterval(tick, 5000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      generation.current++;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [refresh]);
  return { auctions, error, refresh };
}
