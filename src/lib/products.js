import { supabase } from '@/lib/supabaseClient';

export const CATEGORIES = [
  'Celulares',
  'Computación',
  'Audio',
  'Componentes',
  'Otros',
];
export const CONDITIONS = ['Nuevo', 'Como nuevo', 'Usado'];
export const COVERS = {
  phone: { label: 'Celular', src: '/images/product-phone.webp' },
  laptop: { label: 'Laptop', src: '/images/product-laptop.webp' },
  audio: { label: 'Audífonos', src: '/images/product-headphones.webp' },
  gpu: { label: 'Tarjeta gráfica', src: '/gpu_hardware.png' },
};
export const money = (value) =>
  `Bs. ${Number(value).toLocaleString('es-BO', { maximumFractionDigits: 2 })}`;
export const mediaUrl = (product) =>
  product.media_path
    ? supabase.storage.from('product-media').getPublicUrl(product.media_path)
        .data.publicUrl
    : (COVERS[product.cover_key] || COVERS.phone).src;

export function productError(error) {
  if (error?.code === 'P0001') return error.message;
  if (
    ['PGRST204', '42703'].includes(error?.code) &&
    /auction_duration_days/.test(error.message || '')
  )
    return 'Falta activar las subastas. Ejecutá 20261111_auctions_messages.sql en Supabase.';
  if (['42P01', 'PGRST205', 'PGRST202', '42703'].includes(error?.code))
    return 'Falta habilitar el catálogo en Supabase. Ejecutá el SQL de productos indicado en la documentación.';
  if (error?.code === '23514' && error.message?.includes('Básico'))
    return error.message;
  if (error?.code === '42501')
    return 'Tu cuenta no tiene permiso para esta acción. Actualizá la página y volvé a intentar.';
  return 'No se pudo completar la operación. Revisá tu conexión y volvé a intentar.';
}

const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};
export function validateMedia(file) {
  if (!file) return;
  if (!TYPES[file.type])
    throw new Error('Elegí una imagen JPG, PNG o WebP, o un video MP4 o WebM.');
  if (!file.size || file.size > 20 * 1024 * 1024)
    throw new Error('El archivo debe pesar entre 1 byte y 20 MB.');
}

export async function saveProduct({ values, file, original, ownerId }) {
  validateMedia(file);
  let uploaded;
  if (file) {
    uploaded = `${ownerId}/${crypto.randomUUID()}.${TYPES[file.type]}`;
    const { error } = await supabase.storage
      .from('product-media')
      .upload(uploaded, file, { contentType: file.type, upsert: false });
    if (error)
      throw new Error(
        'No se pudo subir el archivo. Verificá el bucket product-media y tu conexión.',
      );
  }
  const payload = {
    title: values.title.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    category: values.category,
    condition: values.condition,
    city: values.city.trim(),
    listing_type: values.listing_type,
    auction_duration_days: Number(
      values.auction_duration_days || original?.auction_duration_days || 3,
    ),
    status: values.status,
    cover_key: values.cover_key,
    media_path:
      uploaded || (values.useReference ? null : original?.media_path) || null,
    media_type: file
      ? file.type.startsWith('video/')
        ? 'video'
        : 'image'
      : values.useReference
        ? 'image'
        : original?.media_type || 'image',
  };
  const query = original
    ? supabase.from('products').update(payload).eq('id', original.id)
    : supabase.from('products').insert({ ...payload, owner_id: ownerId });
  const { data, error } = await query.select('*').single();
  if (error) {
    if (uploaded)
      await supabase.storage.from('product-media').remove([uploaded]);
    throw error;
  }
  // Old files are retained: another listing may reference them. No shared file is removed.
  return data;
}

export async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select('id')
    .single();
  if (error || !data)
    throw error || new Error('No se encontró la publicación.');
}
