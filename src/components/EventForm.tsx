import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventData } from "./TicketGenerator";

interface EventFormProps {
  eventData: EventData;
  onInputChange: (field: keyof EventData, value: string) => void;
}

export const EventForm = ({ eventData, onInputChange }: EventFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name *</Label>
          <Input
            id="eventName"
            placeholder="Enter event name"
            value={eventData.eventName}
            onChange={(e) => onInputChange("eventName", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">Venue *</Label>
          <Input
            id="venue"
            placeholder="Enter venue name"
            value={eventData.venue}
            onChange={(e) => onInputChange("venue", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={eventData.date}
            onChange={(e) => onInputChange("date", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={eventData.time}
            onChange={(e) => onInputChange("time", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seatSection">Section</Label>
          <Input
            id="seatSection"
            placeholder="A1"
            value={eventData.seatSection}
            onChange={(e) => onInputChange("seatSection", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seatRow">Row</Label>
          <Input
            id="seatRow"
            placeholder="12"
            value={eventData.seatRow}
            onChange={(e) => onInputChange("seatRow", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seatNumber">Seat</Label>
          <Input
            id="seatNumber"
            placeholder="15"
            value={eventData.seatNumber}
            onChange={(e) => onInputChange("seatNumber", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="$99.00"
            value={eventData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            className="transition-all duration-200 focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={eventData.category} onValueChange={(value) => onInputChange("category", value)}>
            <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="theater">Theater</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Special instructions or notes..."
          value={eventData.additionalNotes}
          onChange={(e) => onInputChange("additionalNotes", e.target.value)}
          className="transition-all duration-200 focus:shadow-glow resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};