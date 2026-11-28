import { createContext } from 'react';

// Pause the feed while the layout's search or account menu covers it.
export const FeedOverlayContext = createContext(false);
