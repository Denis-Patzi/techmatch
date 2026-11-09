import { useEffect, useState } from 'react';
import {
  CATEGORIES,
  CONDITIONS,
  COVERS,
  mediaUrl,
  productError,
  validateMedia,
} from '@/lib/products';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ProductEditor({ original, onSave, onCancel, listingType = 'sale' }) {
  const { profile } = useAuth();
  const [values, setValues] = useState(() => ({
    title: original?.title || '',
    description: original?.description || '',
    price: original?.price || '',
    category: original?.category || 'Celulares',
    condition: original?.condition || 'Usado',
    city: original?.city || profile?.city || 'La Paz',
    listing_type: original?.listing_type || listingType,
    status: original?.status || 'published',
    cover_key: original?.cover_key || 'phone',
    useReference: !original?.media_path,
  }));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const field = (key) => ({
    value: values[key],
    onChange: (event) => setValues((previous) => ({ ...previous, [key]: event.target.value })),
  });
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (
      values.title.trim().length < 3 ||
      values.description.trim().length < 10 ||
      values.city.trim().length < 2
    ) {
      setError('Completá el título (3 caracteres), la descripción (10 caracteres) y la ciudad.');
      return;
    }
    setSaving(true);
    try {
      await onSave({ values, file, original });
      toast.success(original ? 'Publicación actualizada.' : 'Publicación creada.');
    } catch (failure) {
      setError(failure.code ? productError(failure) : failure.message || productError(failure));
    } finally {
      setSaving(false);
    }
  };
  const isVideo = file
    ? file.type.startsWith('video/')
    : !values.useReference && original?.media_type === 'video';
  const source =
    preview ||
    (!values.useReference && original?.media_path
      ? mediaUrl(original)
      : COVERS[values.cover_key].src);
  return (
    <section className="market-editor">
      <div className="market-section-heading">
        <div>
          <span className="eyebrow">Tu próximo match</span>
          <h1>{original ? 'Editar publicación' : 'Publicar un producto'}</h1>
          <p>Mostrá lo que vendés. Cada detalle cuenta.</p>
        </div>
        <button className="market-icon" onClick={onCancel} aria-label="Cancelar edición">
          <Icon name="close" />
        </button>
      </div>
      <form onSubmit={submit}>
        <fieldset disabled={saving} className="market-editor-grid">
          <div className="market-upload-panel">
            <div className="market-upload-preview">
              {isVideo ? (
                <video src={source} controls playsInline />
              ) : (
                <img src={source} alt="Vista previa del producto" />
              )}
              {!file && values.useReference && <span>Imagen de referencia</span>}
            </div>
            <label className="market-upload-label">
              Elegir foto o video
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  try {
                    validateMedia(selected);
                    setFile(selected || null);
                    if (selected) setValues((v) => ({ ...v, useReference: false }));
                    setError('');
                  } catch (failure) {
                    setError(failure.message);
                    event.target.value = '';
                  }
                }}
              />
            </label>
            <p>JPG, PNG, WebP, MP4 o WebM · hasta 20 MB.</p>
            <button
              type="button"
              className="market-text-button"
              onClick={() => {
                setFile(null);
                setValues((v) => ({ ...v, useReference: true }));
              }}
            >
              Usar una imagen de referencia
            </button>
            {values.useReference && (
              <label>
                Imagen de referencia
                <select {...field('cover_key')}>
                  {Object.entries(COVERS).map(([key, cover]) => (
                    <option key={key} value={key}>
                      {cover.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="market-editor-fields">
            <label>
              Título
              <input
                required
                minLength={3}
                maxLength={100}
                placeholder="Ej. iPhone 13 de 128 GB"
                {...field('title')}
              />
            </label>
            <label>
              Descripción
              <textarea
                required
                minLength={10}
                maxLength={3000}
                rows={5}
                placeholder="Características, estado del equipo y lo que incluye…"
                {...field('description')}
              />
            </label>
            <div className="market-field-row">
              <label>
                Precio en bolivianos
                <input
                  required
                  type="number"
                  min="0.01"
                  max="99999999"
                  step="0.01"
                  {...field('price')}
                />
              </label>
              <label>
                Ciudad
                <input required minLength={2} maxLength={80} {...field('city')} />
              </label>
            </div>
            <div className="market-field-row">
              <label>
                Categoría
                <select {...field('category')}>
                  {CATEGORIES.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Estado del producto
                <select {...field('condition')}>
                  {CONDITIONS.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="market-field-row">
              <label>
                Tipo
                <select {...field('listing_type')}>
                  <option value="sale">Venta</option>
                  <option value="auction">Subasta · anuncio</option>
                </select>
              </label>
              <label>
                Visibilidad
                <select {...field('status')}>
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="sold">Vendido</option>
                </select>
              </label>
            </div>
            {values.listing_type === 'auction' && (
              <p className="market-notice">
                Se mostrará como anuncio de subasta con precio base. Las pujas y el cierre
                automático todavía no están habilitados.
              </p>
            )}
            <p className="market-muted">
              Plan Básico: hasta 25 publicaciones activas, incluidas 5 con video.
            </p>
            {error && (
              <p className="market-error" role="alert">
                {error}
              </p>
            )}
            <div className="market-form-actions">
              <button type="button" className="market-secondary" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn-primary" type="submit">
                {saving ? 'Guardando…' : original ? 'Guardar cambios' : 'Crear publicación'}
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
