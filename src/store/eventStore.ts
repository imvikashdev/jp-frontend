import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import { defaultEvents } from '@/utils/defaultEvents';

export interface Event {
  id: string;
  title: string;
  community: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  media?: string;
  latlng?: { lat: number; lng: number };
}

/**
 * The EventStore interface defines the structure of our store,
 * including the list of events and methods to add or remove events.
 */
interface EventStore {
  events: Event[];
  /**
   * Adds a new event to the store.
   * Automatically generates a unique id for each event.
   *
   * @param event - Event data excluding the id.
   */
  addEvent: (event: Omit<Event, 'id'>) => void;
  /**
   * Removes an event from the store based on its id.
   *
   * @param id - The unique identifier of the event to be removed.
   */
  removeEvent: (id: string) => void;
}

/**
 * A static list of communities available for selection.
 * Because every cool event needs a community.
 */
export const communities = [
  'Indiranagar Run Club',
  'Surat Garba Dance Community',
  'Jaipur Goomer Meetup',
  'Marine Drive Cycling Crew',
  'Delhi NCR Breathing Club',
  'Pune Yoga Collective',
  'Hyderabad Climbers Community',
];

/**
 * Zustand store for managing events.
 *
 * Uses the persist middleware to store events in localStorage under the key 'event-storage'.
 * This ensures that events stick around even if you close your browser.
 */
export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [...defaultEvents],

      /**
       * addEvent function: adds a new event to the events array.
       * Generates a unique id using uuid.
       *
       * @param event - The event details without an id.
       */
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: uuid() }],
        })),

      /**
       * removeEvent function: removes an event by filtering out the matching id.
       *
       * @param id - The id of the event to remove.
       */
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'event-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
