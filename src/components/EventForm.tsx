import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventData } from "./TicketGenerator";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface EventFormProps {
  eventData: EventData;
  onInputChange: (field: keyof EventData, value: string) => void;
}

export const EventForm = ({ eventData, onInputChange }: EventFormProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onInputChange("eventImage", result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

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
          <Label htmlFor="ticketType">Ticket Type</Label>
          <Select value={eventData.ticketType} onValueChange={(value) => onInputChange("ticketType", value)}>
            <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
              <SelectValue placeholder="Select ticket type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="American Express® Presale">American Express® Presale</SelectItem>
              <SelectItem value="Verified Fan Presale">Verified Fan Presale</SelectItem>
              <SelectItem value="General Sale">General Sale</SelectItem>
              <SelectItem value="VIP Package">VIP Package</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {eventData.ticketType === "Custom" && (
          <div className="space-y-2">
            <Label htmlFor="customTicketType">Custom Ticket Type</Label>
            <Input
              id="customTicketType"
              placeholder="Enter your custom ticket type"
              value={eventData.customTicketType || ""}
              onChange={(e) => onInputChange("customTicketType", e.target.value)}
              className="transition-all duration-200 focus:shadow-glow"
            />
          </div>
        )}
      </div>

      {/* Event Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="eventImage">Event Image</Label>
        <div 
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${eventData.eventImage ? 'border-primary/50' : ''}
          `}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {eventData.eventImage ? (
            <div className="relative">
              <img 
                src={eventData.eventImage} 
                alt="Event preview" 
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => onInputChange("eventImage", null)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {dragActive ? (
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {dragActive ? "Drop your image here" : "Drag & drop an image or click to browse"}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
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