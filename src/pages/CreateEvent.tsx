import { useForm, Controller } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  PencilIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MediaPickerCard } from '@/components/MediaPicker';
import { communities, Event, useEventStore } from '@/store/eventStore';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/utils/paths';

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LocationPickerProps {
  setLocation: (latlng: LatLng) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  return null;
};

const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Event>({
    defaultValues: {
      title: '',
      community: '',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
    },
  });

  const { addEvent } = useEventStore();
  const navigate = useNavigate();
  const [mapLocation, setMapLocation] = useState<LatLng | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | ''>('');

  /**
   * Handle clicks on the map.
   * Retrieves the location details from OpenStreetMap's reverse geocoding service.
   * Also updates the form with the chosen location.
   */
  const handleMapClick = async (latlng: LatLng) => {
    try {
      setMapLocation(latlng);
      const { lat, lng } = latlng;
      setValue('latlng', latlng);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`;

      const response = await fetch(url);

      const result = await response.json();

      if (result.display_name) {
        setValue('location', result.display_name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Handles form submission to create a new event.
   * Adds the event to the store and navigates to the Home page.
   */
  const onSubmit = (data: Event) => {
    addEvent({
      title: data.title,
      community: data.community,
      start_date: data.start_date,
      end_date: data.end_date,
      location: data.location,
      description: data.description,
      media: mediaPreview,
      latlng: mapLocation
        ? { lat: mapLocation.lat, lng: mapLocation.lng }
        : undefined,
    });

    navigate(paths.Home);
  };

  /**
   * Callback for when the media changes.
   * Updates both the local media preview and the form value.
   */
  const onMediaChange = (preview: string, type: 'image' | 'video' | '') => {
    setMediaPreview(preview);
    setMediaType(type);

    setValue('media', preview);
  };

  return (
    <div>
      <Card className="max-w-screen-lg mx-auto overflow-auto">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-3 bg-[#eff3ff]">
            <div className="bg-white">
              <h1 className="font-semibold p-6 pb-0 text-center md:text-start">
                Create New Event
              </h1>
              <MediaPickerCard
                mediaPreview={mediaPreview}
                mediaType={mediaType}
                onMediaChange={onMediaChange}
                maxVideoSize={5 * 1024 * 1024}
              />
            </div>
            <div className="flex-grow">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 "
              >
                <div className="bg-white px-6 py-6">
                  <div className="mb-5">
                    <label
                      htmlFor="community-select"
                      className="block text-sm font-medium mb-1"
                    >
                      Select Community
                    </label>
                    <Controller
                      name="community"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          aria-labelledby="community-select"
                        >
                          <SelectTrigger
                            id="community-select"
                            className="bg-white mt-3 rounded-full border text-sm hover:bg-gray-50"
                          >
                            <SelectValue placeholder="Select Community" />
                          </SelectTrigger>
                          <SelectContent>
                            {communities.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium"
                    >
                      Event Title
                    </label>
                    <Input
                      id="title"
                      {...register('title', {
                        required: 'Event title is required',
                      })}
                      aria-required="true"
                      aria-invalid={errors.title ? 'true' : 'false'}
                      className="font-medium px-4 block py-2 mt-3 bg-white rounded-full border text-sm hover:bg-gray-50"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1" role="alert">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white px-6 py-6">
                  <div className="flex items-center mb-5 justify-between">
                    <label
                      htmlFor="start-date"
                      className="flex items-center gap-2"
                    >
                      <ChevronUpIcon className="w-4 h-4" />
                      <span className="text-sm">Starts</span>
                    </label>
                    <Input
                      id="start-date"
                      type="datetime-local"
                      {...register('start_date')}
                      className="!max-w-[11.5rem] md:!max-w-72 min-w-4 px-4 block py-2 bg-white rounded-full border text-sm hover:bg-gray-50"
                      aria-required="true"
                      aria-invalid={errors.start_date ? 'true' : 'false'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="end-date"
                      className="flex items-center gap-2"
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                      <span className="text-sm">Ends</span>
                    </label>
                    <Input
                      id="end-date"
                      type="datetime-local"
                      {...register('end_date')}
                      className="!max-w-[11.5rem] md:!max-w-72 min-w-4 px-4 block py-2 bg-white rounded-full border text-sm hover:bg-gray-50"
                      aria-required="true"
                      aria-invalid={errors.end_date ? 'true' : 'false'}
                    />
                  </div>
                </div>

                <div className="flex px-6 py-6 bg-white items-start gap-3">
                  <MapPinIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                  <div className="space-y-1.5 flex-1">
                    <div className="mb-5">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium"
                      >
                        Location
                      </label>
                      <Input
                        id="location"
                        className="rounded-full mt-3"
                        {...register('location')}
                        placeholder="Enter location manually or drop a pin"
                      />
                    </div>
                    <div className="h-64 bg-gray-100 rounded-md border overflow-hidden">
                      <MapContainer
                        center={[12.9716, 77.5946]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        aria-label="Map showing event location. Click on the map to choose a location."
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker setLocation={handleMapClick} />
                        {mapLocation && (
                          <Marker
                            position={mapLocation}
                            icon={customMarkerIcon}
                          />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white px-6 py-6">
                  <div className="flex items-start gap-3">
                    <PencilIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1"
                      >
                        Description
                      </label>
                      <Textarea
                        id="description"
                        {...register('description', {
                          required: 'Description is required',
                          minLength: {
                            value: 10,
                            message:
                              'Description must be at least 10 characters',
                          },
                        })}
                        aria-required="true"
                        aria-invalid={errors.description ? 'true' : 'false'}
                        className="min-h-[100px] mt-3"
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-5 rounded-full bg-[#1f28ff] hover:bg-[#5258ff] active:[#5258ff]"
                    size="lg"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
