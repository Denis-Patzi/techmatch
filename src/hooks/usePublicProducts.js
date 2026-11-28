import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function usePublicProducts(sellerId, sharedProductId) {
  const [state, setState] = useState({
    products: [],
    sellers: {},
    auctions: {},
    loading: true,
    error: '',
  });
  const version = useRef(0);
  const reload = useCallback(async () => {
    const request = ++version.current;
    setState((old) => ({ ...old, loading: true, error: '' }));
    try {
      const result = await supabase.rpc('get_public_feed', {
        p_seller_id: sellerId || null,
      });
      if (result.error) throw result.error;
      const rows = [...(result.data || [])];
      if (
        sharedProductId &&
        !rows.some((row) => row.product.id === sharedProductId)
      ) {
        const shared = await supabase.rpc('get_public_feed', {
          p_product_id: sharedProductId,
        });
        if (shared.error && shared.error.code !== '22P02') throw shared.error;
        if (shared.data) rows.push(...shared.data);
      }
      const visible = rows.filter((row) => row.product?.status === 'published');
      const receivedAt = performance.now();
      if (version.current === request)
        setState({
          products: [
            ...new Map(
              visible.map((row) => [row.product.id, row.product])
            ).values(),
          ],
          sellers: Object.fromEntries(
            visible.map((row) => [row.seller.id, row.seller])
          ),
          auctions: Object.fromEntries(
            visible
              .filter((row) => row.auction)
              .map((row) => [row.product.id, { ...row.auction, receivedAt }])
          ),
          loading: false,
          error: '',
        });
    } catch {
      if (version.current === request)
        setState({
          products: [],
          sellers: {},
          auctions: {},
          loading: false,
          error:
            'No pudimos cargar las publicaciones. Volvé a intentar en un momento.',
        });
    }
  }, [sellerId, sharedProductId]);
  useEffect(() => {
    reload();
    return () => {
      version.current++;
    };
  }, [reload]);
  return { ...state, reload };
}
