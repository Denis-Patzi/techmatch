import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Icon } from '@/components/atoms/Icon';
import { useAuth } from '@/hooks/useAuth';
import { money } from '@/lib/products';
import {
  auctionClosed,
  commerceError,
  commerceRpc,
  countdownText,
} from '@/lib/commerce';

export function AuctionCountdown({ auction }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span
      className={`auction-countdown ${auctionClosed(auction) ? 'is-ended' : ''}`}
    >
      <Icon name="clock" size={16} />
      {countdownText(auction)}
    </span>
  );
}

export default function AuctionPanel({
  product,
  auction,
  error,
  onRefresh,
  onContactWinner,
  onContact,
}) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [, tick] = useState(0);
  const own = product.owner_id === user.id;
  const closed = auctionClosed(auction);
  const loadHistory = useCallback(async () => {
    try {
      const data = await commerceRpc('get_auction_bid_history', {
        p_product_id: product.id,
      });
      setHistory(data);
      setHistoryError('');
    } catch (err) {
      setHistoryError(commerceError(err));
    }
  }, [product.id]);
  useEffect(() => {
    loadHistory();
  }, [loadHistory, auction?.bid_count]);
  useEffect(() => {
    const timer = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (closed && auction?.state === 'active') onRefresh();
  }, [closed, auction?.state, onRefresh]);
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFailure('');
    try {
      await commerceRpc('place_auction_bid', {
        p_product_id: product.id,
        p_amount: Number(amount),
      });
      setAmount('');
      toast.success('Tu puja quedó registrada.');
    } catch (err) {
      setFailure(commerceError(err));
    } finally {
      await onRefresh();
      await loadHistory();
      setBusy(false);
    }
  };
  return (
    <section className="auction-panel" aria-label="Pujas de la subasta">
      <div className="auction-panel-heading">
        <span className="eyebrow">Subasta · plazo fijo</span>
        <AuctionCountdown auction={auction} />
      </div>
      {auction && (
        <>
          <div className="auction-price">
            <div>
              <small>
                {auction.bid_count ? 'Mejor oferta' : 'Precio base'}
              </small>
              <strong>{money(auction.current_price)}</strong>
            </div>
            <span>
              {auction.bid_count}{' '}
              {Number(auction.bid_count) === 1 ? 'puja' : 'pujas'}
            </span>
          </div>
          <p className="market-muted">
            Cierra el{' '}
            {new Date(auction.ends_at).toLocaleString('es-BO', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            . El plazo no se reinicia al pujar.
          </p>
          {auction.state === 'cancelled' ? (
            <p className="market-notice">
              Esta subasta fue cancelada. Las pujas se conservan como historial.
            </p>
          ) : closed ? (
            <div className="auction-result" role="status">
              <Icon name={auction.is_winner ? 'check' : 'gavel'} size={24} />
              <strong>
                {auction.state === 'active'
                  ? 'Consultando resultado del cierre…'
                  : !Number(auction.bid_count)
                    ? 'Finalizó sin pujas'
                    : auction.is_winner
                      ? '¡Ganaste esta subasta!'
                      : own
                        ? `Ganador: ${auction.winner_name || 'Participante'}`
                        : 'Subasta finalizada'}
              </strong>
              {Number(auction.bid_count) > 0 && auction.state === 'ended' && (
                <p>
                  Oferta ganadora: {money(auction.current_price)}. Coordiná la
                  compra por mensajes.
                </p>
              )}
              {own &&
                Number(auction.bid_count) > 0 &&
                auction.state === 'ended' && (
                  <button
                    className="btn-primary"
                    onClick={() => onContactWinner(product)}
                  >
                    <Icon name="chat" size={18} />
                    Contactar al ganador
                  </button>
                )}
              {auction.is_winner && (
                <button
                  className="btn-primary"
                  onClick={() => onContact(product)}
                >
                  <Icon name="chat" size={18} />
                  Coordinar con el vendedor
                </button>
              )}
            </div>
          ) : own ? (
            <p className="market-notice">
              Las ofertas de tus compradores aparecerán aquí. No podés pujar por
              tu propio producto.
            </p>
          ) : (
            <form className="auction-bid-form" onSubmit={submit}>
              <label>
                Tu oferta en bolivianos
                <input
                  type="number"
                  required
                  min={auction.minimum_bid}
                  max="99999999"
                  step="0.01"
                  placeholder={String(auction.minimum_bid)}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={busy || !!error}
                />
              </label>
              <button className="btn-primary" disabled={busy || !!error}>
                <Icon name="gavel" size={18} />
                {busy ? 'Registrando…' : 'Pujar'}
              </button>
              <p className="market-muted">
                Mínimo: {money(auction.minimum_bid)}. Tu oferta se mantiene si
                nadie la supera.
              </p>
            </form>
          )}
          {!closed && auction.is_leading && !own && (
            <p className="auction-leading" role="status">
              <Icon name="check" size={17} />
              Tu oferta va ganando.
            </p>
          )}
        </>
      )}
      {(error || failure || historyError) && (
        <p className="market-error" role="alert">
          {error || failure || historyError}
        </p>
      )}
      {!auction && !error && (
        <p className="market-muted">
          Esta publicación todavía no tiene una subasta activa.
        </p>
      )}
      <button
        className="market-text-button"
        onClick={() => {
          onRefresh();
          loadHistory();
        }}
      >
        Actualizar pujas
      </button>
      {!!history.length && (
        <div className="auction-history">
          <h3>Últimas pujas</h3>
          <ol>
            {history.map((bid) => (
              <li key={bid.id}>
                <span>
                  {bid.is_mine ? 'Tu oferta' : 'Participante'}
                  <small>
                    {new Date(bid.created_at).toLocaleString('es-BO')}
                  </small>
                </span>
                <strong>{money(bid.amount)}</strong>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
