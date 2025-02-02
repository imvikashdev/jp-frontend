import { Event } from '@/store/eventStore';
import moment from 'moment';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type Props = {
  event: Event;
};

/**
 * EventCard Component
 *
 * Displays an event's details including its media thumbnail, title, community name,
 * start time (in a friendly calendar format), and location with an optional Google Maps link.
 *
 * @param {Event} event - The event object containing details like start_date, media, title, community, location, etc.
 */
const EventCard = ({ event }: Props) => {
  // Use moment to handle and format the event's start date.
  const eventStartDate = moment(event.start_date);
  const currentTime = new Date().getTime();
  const eventTime = eventStartDate.valueOf();
  let isStarted = false;

  // Determine if the event has already started.
  if (currentTime > eventTime) {
    isStarted = true;
  }

  // Format the event date in a human-friendly calendar format (e.g., "Today at 2:00 PM").
  const calendarTime = eventStartDate.calendar();

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-2">
        <div className="relative rounded-lg overflow-hidden">
          {event.media ? (
            <img
              src={event.media}
              alt="Event Media"
              className="w-full rounded-lg h-full object-cover"
            />
          ) : (
            <div className="w-full flex justify-center items-center aspect-[4/5] border rounded-lg">
              <p className="font-thin">JP Event</p>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{event.community}</p>
          <h3 className="text-base font-medium leading-tight mb-2 block">
            {event.title}
          </h3>
          <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground">
            <p className="text-sm font-normal text-black mb-1">
              🕒 {isStarted ? 'Started' : 'Starts'} {calendarTime}
            </p>
            <p className="text-sm font-normal flex gap-2 w-full text-black">
              📍{'   '}
              <Popover>
                <PopoverTrigger className="flex-grow max-w-[90%]">
                  <p className="underline truncate text-start">
                    {event.location}
                  </p>
                </PopoverTrigger>
                <PopoverContent align="start" side="bottom">
                  {/* If geolocation data is available, provide a clickable link to Google Maps */}
                  {event.latlng ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${event.latlng?.lat},${event.latlng?.lng}`}
                      target="_blank"
                      className="underline hover:text-[#1f28ff]"
                    >
                      {event.location}
                    </a>
                  ) : (
                    <p>{event.location}</p>
                  )}
                </PopoverContent>
              </Popover>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
