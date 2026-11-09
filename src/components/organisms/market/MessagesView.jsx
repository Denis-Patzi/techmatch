import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import { commerceError, commerceRpc } from '@/lib/commerce';

const mergeMessages = (before, after) =>
  [...new Map([...before, ...after].map((m) => [m.id, m])).values()].sort(
    (a, b) =>
      a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id),
  );
const messageTime = (value) =>
  new Date(value).toLocaleString('es-BO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

function ConversationThread({ conversation, onRead, onBack, onProduct }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [older, setOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');
  const viewport = useRef(null);
  const alive = useRef(true);
  const loaded = useRef(false);
  const requestInFlight = useRef(false);
  const shouldScroll = useRef(true);
  const olderHeight = useRef(null);
  const pending = useRef(null);
  const lastRead = useRef(null);
  const load = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    try {
      const data = await commerceRpc('get_conversation_messages', {
        p_conversation_id: conversation.id,
      });
      if (!alive.current) return;
      const v = viewport.current;
      shouldScroll.current =
        !loaded.current ||
        !v ||
        v.scrollHeight - v.scrollTop - v.clientHeight < 100;
      if (!loaded.current) setHasMore(data.length === 50);
      loaded.current = true;
      setMessages((previous) => mergeMessages(previous, data));
      setError('');
      if (
        data[0] &&
        lastRead.current !== data[0].id &&
        shouldScroll.current &&
        !document.hidden
      ) {
        await commerceRpc('mark_conversation_read', {
          p_conversation_id: conversation.id,
          p_last_message_id: data[0].id,
        });
        lastRead.current = data[0].id;
        onRead();
      }
    } catch (err) {
      if (alive.current) setError(commerceError(err));
    } finally {
      requestInFlight.current = false;
      if (alive.current) setLoading(false);
    }
  }, [conversation.id, onRead]);
  useEffect(() => {
    alive.current = true;
    load();
    const tick = () => {
      if (!document.hidden) load();
    };
    const timer = setInterval(tick, 3000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      alive.current = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [load]);
  useLayoutEffect(() => {
    const v = viewport.current;
    if (!v) return;
    if (olderHeight.current !== null) {
      v.scrollTop += v.scrollHeight - olderHeight.current;
      olderHeight.current = null;
    } else if (shouldScroll.current) v.scrollTop = v.scrollHeight;
  }, [messages]);
  const loadOlder = async () => {
    if (older || !messages.length) return;
    setOlder(true);
    try {
      const first = messages[0];
      const data = await commerceRpc('get_conversation_messages', {
        p_conversation_id: conversation.id,
        p_before: first.created_at,
        p_before_id: first.id,
      });
      if (!alive.current) return;
      olderHeight.current = viewport.current?.scrollHeight ?? null;
      setMessages((previous) => mergeMessages(previous, data));
      setHasMore(data.length === 50);
    } catch (err) {
      if (alive.current) setError(commerceError(err));
    } finally {
      if (alive.current) setOlder(false);
    }
  };
  const send = async (event) => {
    event.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    if (pending.current?.body !== text)
      pending.current = { body: text, id: crypto.randomUUID() };
    setSending(true);
    setSendError('');
    try {
      await commerceRpc('send_conversation_message', {
        p_conversation_id: conversation.id,
        p_body: text,
        p_client_id: pending.current.id,
      });
      if (!alive.current) return;
      setBody('');
      pending.current = null;
      shouldScroll.current = true;
      // Una carga inmediata incluye la hora e identidad asignadas por el servidor.
      await load();
      onRead();
    } catch (err) {
      if (alive.current) setSendError(commerceError(err));
    } finally {
      if (alive.current) setSending(false);
    }
  };
  return (
    <div className="messages-thread">
      <header className="messages-thread-header">
        <button
          className="market-icon messages-back"
          onClick={onBack}
          aria-label="Volver a conversaciones"
        >
          <Icon name="back" />
        </button>
        <span className="market-avatar">
          {conversation.other_name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h2>{conversation.other_name}</h2>
          <span>Conversación privada</span>
        </div>
      </header>
      <button
        className="messages-product"
        onClick={() => onProduct(conversation.product_id)}
        disabled={!conversation.product_id}
      >
        <Icon name="bag" size={20} />
        <span>
          <small>Sobre este producto</small>
          <strong>{conversation.product_title}</strong>
        </span>
        {conversation.product_id && <Icon name="chevron" size={18} />}
      </button>
      <div
        className="messages-timeline"
        ref={viewport}
        role="log"
        aria-label="Mensajes de la conversación"
        aria-live="polite"
        aria-relevant="additions"
      >
        {loading ? (
          <p className="market-muted" role="status">
            Cargando mensajes…
          </p>
        ) : (
          <>
            {hasMore && (
              <button
                className="market-text-button messages-load-older"
                onClick={loadOlder}
                disabled={older}
              >
                {older ? 'Cargando…' : 'Cargar mensajes anteriores'}
              </button>
            )}
            {!messages.length && (
              <div className="messages-start">
                <Icon name="chat" size={34} />
                <h3>Una conversación, un nuevo match</h3>
                <p>
                  Consultá por disponibilidad, características o coordiná la
                  compra.
                </p>
                <button
                  className="market-secondary"
                  onClick={() =>
                    setBody(
                      `Hola, me interesa ${conversation.product_title}. ¿Sigue disponible?`,
                    )
                  }
                >
                  Preguntar si está disponible
                </button>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message-bubble ${m.sender_id === user.id ? 'is-own' : ''}`}
              >
                <p>{m.body}</p>
                <time dateTime={m.created_at}>{messageTime(m.created_at)}</time>
              </div>
            ))}
          </>
        )}
      </div>
      {error && (
        <div className="messages-error">
          <p className="market-error" role="alert">
            {error}
          </p>
          <button className="market-text-button" onClick={load}>
            Reintentar
          </button>
        </div>
      )}
      <form className="messages-composer" onSubmit={send}>
        {sendError && (
          <p className="market-error" role="alert">
            {sendError} Tu texto se conserva para reintentar.
          </p>
        )}
        <label className="sr-only" htmlFor="message-body">
          Escribí un mensaje
        </label>
        <textarea
          id="message-body"
          rows={2}
          maxLength={2000}
          required
          value={body}
          disabled={sending}
          placeholder="Escribí un mensaje…"
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              e.currentTarget.form.requestSubmit();
            }
          }}
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={sending || !body.trim()}
          aria-label="Enviar mensaje"
        >
          <Icon name="send" size={21} />
          <span>{sending ? 'Enviando…' : 'Enviar'}</span>
        </button>
        <small>
          {body.length}/2000 · Enter para enviar · Mayús + Enter para otra línea
        </small>
      </form>
    </div>
  );
}

export default function MessagesView({
  inbox,
  selectedId,
  onSelect,
  onProduct,
}) {
  const [search, setSearch] = useState('');
  const selected = inbox.conversations.find((c) => c.id === selectedId);
  const filtered = inbox.conversations.filter((c) =>
    `${c.other_name} ${c.product_title}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase()),
  );
  return (
    <section
      className={`messages-shell ${selectedId ? 'has-selection' : ''}`}
      aria-label="Mensajes"
    >
      <aside className="messages-list">
        <div className="messages-list-heading">
          <div>
            <span className="eyebrow">Conectá con tu comunidad</span>
            <h1>
              Mensajes{' '}
              {inbox.unread > 0 && (
                <span className="messages-total">{inbox.unread}</span>
              )}
            </h1>
          </div>
          <button
            className="market-icon"
            onClick={inbox.refresh}
            aria-label="Actualizar mensajes"
          >
            <Icon name="refresh" />
          </button>
        </div>
        <label className="messages-search">
          <Icon name="search" size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversación"
            aria-label="Buscar conversación"
          />
        </label>
        {inbox.loading && (
          <p className="messages-list-notice" role="status">
            Cargando conversaciones…
          </p>
        )}
        {inbox.error && (
          <p className="market-error messages-list-notice" role="alert">
            {inbox.error}
          </p>
        )}
        <nav aria-label="Conversaciones">
          {filtered.map((c) => (
            <button
              key={c.id}
              className={`messages-conversation ${c.id === selectedId ? 'is-selected' : ''}`}
              aria-current={c.id === selectedId ? 'page' : undefined}
              onClick={() => onSelect(c.id)}
            >
              <span className="market-avatar">
                {c.other_name.slice(0, 2).toUpperCase()}
              </span>
              <span className="messages-conversation-text">
                <strong>{c.other_name}</strong>
                <span>{c.product_title}</span>
                <small>{c.last_message || 'Iniciá la conversación'}</small>
              </span>
              <span className="messages-conversation-meta">
                <time>
                  {new Date(c.last_message_at).toLocaleDateString('es-BO', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </time>
                {Number(c.unread_count) > 0 && (
                  <b aria-label={`${c.unread_count} mensajes sin leer`}>
                    {c.unread_count}
                  </b>
                )}
              </span>
            </button>
          ))}
        </nav>
        {!inbox.loading && !inbox.error && !filtered.length && (
          <div className="messages-list-notice">
            <Icon name="chat" size={32} />
            <p>
              {search
                ? 'No encontramos esa conversación.'
                : 'Todavía no tenés conversaciones. Tocá Contactar en un producto del feed.'}
            </p>
          </div>
        )}
      </aside>
      {selected ? (
        <ConversationThread
          key={selected.id}
          conversation={selected}
          onRead={inbox.refresh}
          onBack={() => onSelect(null)}
          onProduct={onProduct}
        />
      ) : (
        <div className="messages-placeholder">
          <button
            className="market-text-button messages-back"
            onClick={() => onSelect(null)}
          >
            ← Ver conversaciones
          </button>
          <span>
            <Icon name="chat" size={48} />
          </span>
          <h2>
            {selectedId
              ? 'Conversación no disponible'
              : 'Tu próximo match empieza aquí'}
          </h2>
          <p>
            {selectedId
              ? 'Volvé a la bandeja y actualizá tus conversaciones.'
              : 'Elegí una conversación o contactá a un vendedor desde el feed.'}
          </p>
        </div>
      )}
    </section>
  );
}
