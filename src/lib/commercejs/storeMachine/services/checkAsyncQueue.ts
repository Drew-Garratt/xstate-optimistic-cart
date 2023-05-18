import { StoreActor } from '@/lib/storeMachine';

export const checkAsyncQueue: StoreActor = (context) => (sendBack) => {
  /**
   * Cart Queue
   *
   * Refrence the cart queue from the context
   */
  const cartQueue = context.cartContext.asyncQueue;

  /**
   * If the queue is empty return
   */
  if (!cartQueue[0]) return;

  /**
   * Get the first event in the queue
   */
  const event = cartQueue[0];

  /**
   * Send the event to the machine based on it's type
   */
  switch (event.type) {
    case 'ADD_ITEM':
      sendBack({ type: 'ASYNC_ADD_TO_CART', data: event.data });
      break;
    case 'UPDATE_ITEM':
      sendBack({ type: 'ASYNC_UPDATE_CART', data: event.data });
      break;
    case 'REMOVE_ITEM':
      sendBack({
        type: 'ASYNC_REMOVE_FROM_CART',
        data: event.data,
      });
      break;
    default:
      return;
  }
};
