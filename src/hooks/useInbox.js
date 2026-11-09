import { useCallback, useEffect, useRef, useState } from 'react';
import { commerceError, commerceRpc } from '@/lib/commerce';

export function useInbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const version = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++version.current;
    try {
      const data = await commerceRpc('get_my_conversations');
      if (request !== version.current) return;
      setConversations(data);
      setError('');
    } catch (err) {
      if (request === version.current) setError(commerceError(err));
    } finally {
      if (request === version.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    const tick = () => {
      if (!document.hidden) refresh();
    };
    const timer = setInterval(tick, 7000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      version.current++;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [refresh]);
  return {
    conversations,
    loading,
    error,
    refresh,
    unread: conversations.reduce((n, c) => n + Number(c.unread_count), 0),
  };
}
