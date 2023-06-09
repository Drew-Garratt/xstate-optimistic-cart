import { useInterpret } from '@xstate/react';
import { createContext, type ReactNode } from 'react';
import services from '@/lib/adapter/commerceMachine/services';

/**
 * Service imports
 *
 * Service imports are API/Implementation spefecic functions and so
 * are imported from the relevant lib folder
 */

/**
 * Action and Guard imports
 *
 * Actions and guards are machine specific functions are imported
 * from the vercelCommerceMachine folder and assigned to the machine
 */
import { optimisticCartMachine } from '@/lib/vercelCommerce/xstate/machines/optimisticCart';
import actions from '@/lib/vercelCommerce/xstate/machines/optimisticCart/actions';
import guards from '@/lib/vercelCommerce/xstate/machines/optimisticCart/guards';
import {
  storeMachine,
  type StoreService,
} from '@/lib/vercelCommerce/xstate/machines/storeMachine';

/**
 * Type for the cart context value
 *
 * This will be used in the creation of our context and provides
 * a undefined fallback that can be used to check if the context
 * has been provided in accompanying hooks and components
 */
type StoreContextType = StoreService | undefined;

/**
 * Cart Context
 *
 * This context will be used to provide the cart machine to the rest of the application
 */
export const StoreContext = createContext<StoreContextType>(undefined);

/**
 * Import and configure the cart machine
 */
const cartMachine = optimisticCartMachine.withConfig({
  services,
  actions,
  guards,
});

/**
 * Cart Provider
 *
 * This component will provide the cart machine to the rest of the application
 * @param input: { children: ReactNode }
 * @returns
 */
export const CommerceProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Create a cart machine using the useInterpret hook
   * The useInterpret hook will create a machine and start it
   * the machine will be returned as a service.xState services can be used to send events to the machine.
   *
   * React components can use the useService hook to subscribe to the service.
   *
   * useSelector can be used to subscribe to the specific values in state without triggering a re-render for every state change.
   */
  const storeService = useInterpret(storeMachine, {
    // Enable devTools in development
    devTools: process.env.NODE_ENV === 'development',
    /**
     * Services
     *
     * Services are actors that invoked by the machine when a transition to a given state occurs.
     * Actors can be used to make API calls, perform side effects, or anything else that is synchronous effect.
     * https://stately.ai/docs/xstate/actors/actions-vs-actors
     */
    services: {
      cartMachine,
      initialiseStore: async () => {
        return null;
      },
    },
  });

  return (
    <StoreContext.Provider value={storeService}>
      {children}
    </StoreContext.Provider>
  );
};
