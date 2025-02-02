import { Card, CardContent } from './ui/card';
import { Users } from 'lucide-react';

type Props = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
};

/**
 * CommunityCard Component
 *
 * Renders a clickable community card that displays the community name and an icon.
 * It conditionally applies a primary border if the card is selected.
 *
 * @param {string} name - The name of the community.
 * @param {boolean} isSelected - Determines if the card is selected.
 * @param {() => void} onClick - Callback function to handle click events.
 */
const CommunityCard = ({ isSelected, name, onClick }: Props) => {
  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent ${
        isSelected ? 'border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="p-2 rounded-md bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          {/* Because every community card needs a subtitle (even if it's just 'Community') */}
          <span className="text-sm text-muted-foreground">Community</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
