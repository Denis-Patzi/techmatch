import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { deleteProduct, productError, saveProduct } from '@/lib/products';
import toast from 'react-hot-toast';

export function useProducts(sharedProductId = null) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef(0);
  const favoriteLocks = useRef(new Set());
  const reload = useCallback(async () => {
    if (!user?.id) return;
    const version = ++request.current;
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(200),
        supabase
          .from('products')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('product_favorites').select('product_id').eq('user_id', user.id),
      ]);
      for (const result of results) if (result.error) throw result.error;
      const ids = results[2].data.map((item) => item.product_id);
      const merged = new Map(
        [...results[0].data, ...results[1].data].map((item) => [item.id, item])
      );
      if (sharedProductId && !merged.has(sharedProductId)) {
        const shared = await supabase
          .from('products')
          .select('*')
          .eq('id', sharedProductId)
          .maybeSingle();
        if (shared.error && shared.error.code !== '22P02') throw shared.error;
        if (shared.data) merged.set(shared.data.id, shared.data);
      }
      const missing = ids.filter((id) => !merged.has(id));
      if (missing.length) {
        const result = await supabase.from('products').select('*').in('id', missing);
        if (result.error) throw result.error;
        result.data.forEach((item) => merged.set(item.id, item));
      }
      const items = [...merged.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
      let sellerData = [];
      if (items.length) {
        const result = await supabase.rpc('get_product_sellers', {
          seller_ids: [...new Set(items.map((item) => item.owner_id))],
        });
        if (result.error) throw result.error;
        sellerData = result.data || [];
      }
      if (request.current !== version) return;
      setProducts(items);
      setFavorites(ids);
      setSellers(Object.fromEntries(sellerData.map((item) => [item.id, item])));
    } catch (failure) {
      if (request.current === version) setError(productError(failure));
    } finally {
      if (request.current === version) setLoading(false);
    }
  }, [user?.id, sharedProductId]);
  useEffect(() => {
    reload();
    return () => {
      request.current++;
    };
  }, [reload]);

  const toggleFavorite = async (product) => {
    if (favoriteLocks.current.has(product.id)) return;
    favoriteLocks.current.add(product.id);
    try {
      const selected = favorites.includes(product.id);
      const result = selected
        ? await supabase
            .from('product_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product.id)
        : await supabase
            .from('product_favorites')
            .insert({ user_id: user.id, product_id: product.id });
      if (result.error) throw result.error;
      setFavorites((previous) =>
        selected ? previous.filter((id) => id !== product.id) : [...previous, product.id]
      );
    } catch (failure) {
      toast.error(productError(failure));
    } finally {
      favoriteLocks.current.delete(product.id);
    }
  };
  const save = async (input) => {
    const data = await saveProduct({ ...input, ownerId: input.original?.owner_id || user.id });
    await reload();
    return data;
  };
  const remove = async (product) => {
    await deleteProduct(product.id);
    setProducts((previous) => previous.filter((item) => item.id !== product.id));
    setFavorites((previous) => previous.filter((id) => id !== product.id));
  };
  return { products, sellers, favorites, loading, error, reload, toggleFavorite, save, remove };
}
