import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { productError } from '@/lib/products';

// PostgREST limits each response. Read every page so statistics do not stop at 200/1000 rows.
async function readAll(table) {
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true })
      .range(offset, offset + 499);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 500) return rows;
  }
}
export function useAdminData() {
  const [state, setState] = useState({
    profiles: [],
    products: [],
    loading: true,
    refreshing: false,
    error: '',
    updatedAt: null,
  });
  const version = useRef(0);
  const reload = useCallback(async () => {
    const current = ++version.current;
    setState((previous) => ({ ...previous, refreshing: true, error: '' }));
    try {
      const [profiles, products] = await Promise.all([readAll('profiles'), readAll('products')]);
      if (current !== version.current) return;
      setState({
        profiles,
        products,
        loading: false,
        refreshing: false,
        error: '',
        updatedAt: new Date(),
      });
    } catch (error) {
      if (current === version.current)
        setState((previous) => ({
          ...previous,
          loading: false,
          refreshing: false,
          error: productError(error),
        }));
    }
  }, []);
  useEffect(() => {
    reload();
    return () => {
      version.current++;
    };
  }, [reload]);
  const updateUser = async (id, values) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(values)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    version.current++;
    setState((previous) => ({
      ...previous,
      profiles: previous.profiles.map((item) => (item.id === id ? data : item)),
      refreshing: false,
      updatedAt: new Date(),
    }));
    return data;
  };
  const removeUser = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id).select('id').single();
    if (error) throw error;
    version.current++;
    setState((previous) => ({
      ...previous,
      profiles: previous.profiles.filter((item) => item.id !== id),
      products: previous.products.filter((item) => item.owner_id !== id),
      refreshing: false,
      updatedAt: new Date(),
    }));
  };
  const putProduct = (data) => {
    version.current++;
    setState((previous) => ({
      ...previous,
      products: [data, ...previous.products.filter((item) => item.id !== data.id)],
      refreshing: false,
      updatedAt: new Date(),
    }));
  };
  const updateProduct = async (id, values) => {
    const { data, error } = await supabase
      .from('products')
      .update(values)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    putProduct(data);
    return data;
  };
  const removeProduct = (id) => {
    version.current++;
    setState((previous) => ({
      ...previous,
      products: previous.products.filter((item) => item.id !== id),
      refreshing: false,
      updatedAt: new Date(),
    }));
  };
  return { ...state, reload, updateUser, removeUser, updateProduct, putProduct, removeProduct };
}
