import { type StoreMachineOptions } from '@/lib/vercelCommerce/machine';

export const checkAsyncQueue: StoreMachineOptions['services']['checkAsyncQueue'] =
  (context) => (sendBack) => {
    /**
     * Cart Queue
     *
     * Refrence the cart queue from the context
     */
    const cartQueue = context.cartContext.asyncQueue;

    /**
     * If the queue is empty return
     */
    if (!cartQueue[0]) {
      sendBack({ type: 'ASYNC_QUEUE_IS_EMPTY' });
      return;
    }

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