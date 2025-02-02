import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/paths';
import { communities, useEventStore } from '@/store/eventStore';
import EventCard from '@/components/EventCard';
import CommunityCard from '@/components/CommunityCard';
import { useState } from 'react';

const EventList = () => {
  const { events } = useEventStore();
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
    null,
  );

  return (
    <div className="max-w-screen-lg mx-auto bg-background min-h-screen">
      <header className="flex justify-between items-center mb-4" role="banner">
        <div>
          <h1 className="font-semibold">Delhi NCR</h1>
          <p className="text-sm text-muted-foreground">Welcome to the tribe!</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Open settings menu">
            <div className="p-3 rounded-full bg-secondary hover:bg-[#efefff]">
              <Settings className="w-5 h-5" aria-hidden="true" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <Link to={paths.CreateEvent}>Create Event</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Tabs
        defaultValue="events"
        className="w-full mb-4"
        aria-label="Events and Communities"
      >
        <TabsList className="w-full justify-start h-12 p-0 bg-transparent">
          <TabsTrigger
            value="events"
            className="data-[state=active]:border-b-2 !shadow-none data-[state=active]:border-[#1f28ff] data-[state=active]:!text-[#1f28ff] rounded-none px-10"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="communities"
            className="data-[state=active]:border-b-2 !shadow-none data-[state=active]:border-[#1f28ff] data-[state=active]:!text-[#1f28ff] rounded-none px-10"
          >
            Communities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div
            className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            role="list"
          >
            {events.map((event, i) => (
              <EventCard event={event} key={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="communities">
          <div className="flex gap-4 flex-col" role="list">
            {communities.map((community) => (
              <CommunityCard
                key={community}
                name={community}
                isSelected={selectedCommunity === community}
                onClick={() => setSelectedCommunity(community)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventList;
