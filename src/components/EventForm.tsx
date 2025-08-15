import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventData } from "./TicketGenerator";
import { Upload, X, Image as ImageIcon, Layout, Move } from "lucide-react";
import { useState } from "react";

interface EventFormProps {
  eventData: EventData;
  onInputChange: (field: keyof EventData, value: string) => void;
}

export const EventForm = ({ eventData, onInputChange }: EventFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [ticketImageDragActive, setTicketImageDragActive] = useState(false);
  const [ticketImagePosition, setTicketImagePosition] = useState<'left' | 'center' | 'right'>('center');

  const handleImageUpload = (file: File, type: 'background' | 'ticket') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'background') {
        onInputChange("eventImage", result);
      } else {
        onInputChange("ticketImage", result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'background' | 'ticket') => {
    e.preventDefault();
    if (type === 'background') {
      setDragActive(false);
    } else {
      setTicketImageDragActive(false);
    }
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0], type);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'ticket') => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageUpload(files[0], type);
    }
  };

  const handlePositionChange = (position: 'left' | 'center' | 'right') => {
    setTicketImagePosition(position);
    onInputChange("ticketImagePosition", position);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name *</Label>
          <Input
            id="eventName"
            placeholder="e.g., Lakers vs Warriors"
            value={eventData.eventName}
            onChange={(e) => onInputChange("eventName", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue" className="text-sm font-medium text-gray-700">Venue *</Label>
          <Input
            id="venue"
            placeholder="e.g., Staples Center"
            value={eventData.venue}
            onChange={(e) => onInputChange("venue", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date *</Label>
          <Input
            id="date"
            type="date"
            value={eventData.date}
            onChange={(e) => onInputChange("date", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-medium text-gray-700">Time *</Label>
          <Input
            id="time"
            type="time"
            value={eventData.time}
            onChange={(e) => onInputChange("time", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seatSection" className="text-sm font-medium text-gray-700">Section</Label>
          <Input
            id="seatSection"
            placeholder="e.g., 100"
            value={eventData.seatSection}
            onChange={(e) => onInputChange("seatSection", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seatRow" className="text-sm font-medium text-gray-700">Row</Label>
          <Input
            id="seatRow"
            placeholder="e.g., A"
            value={eventData.seatRow}
            onChange={(e) => onInputChange("seatRow", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seatNumber" className="text-sm font-medium text-gray-700">Seat</Label>
          <Input
            id="seatNumber"
            placeholder="e.g., 15"
            value={eventData.seatNumber}
            onChange={(e) => onInputChange("seatNumber", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price</Label>
          <Input
            id="price"
            placeholder="e.g., $150.00"
            value={eventData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

      {/* Background Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="backgroundImage" className="text-sm font-medium text-gray-700">
          Background Image (Optional)
        </Label>
        <div 
          className={`
            relative border-2 border-dashed rounded-lg p-4 sm:p-6 transition-all duration-200
            ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
            ${eventData.eventImage ? 'border-green-500 bg-green-50' : ''}
          `}
          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'background')}
        >
          {eventData.eventImage ? (
            <div className="relative">
              <img 
                src={eventData.eventImage} 
                alt="Background preview" 
                className="w-full h-24 sm:h-32 object-cover rounded-md"
              />
              <button
                onClick={() => onInputChange("eventImage", null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {dragActive ? (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-bounce" />
                ) : (
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {dragActive ? "Drop background image here" : "Drag & drop background image or click to browse"}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'background')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Ticket Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="ticketImage" className="text-sm font-medium text-gray-700">
          Ticket Image (Optional)
        </Label>
        <div 
          className={`
            relative border-2 border-dashed rounded-lg p-4 sm:p-6 transition-all duration-200
            ${ticketImageDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
            ${eventData.ticketImage ? 'border-green-500 bg-green-50' : ''}
          `}
          onDragEnter={(e) => { e.preventDefault(); setTicketImageDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setTicketImageDragActive(false); }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'ticket')}
        >
          {eventData.ticketImage ? (
            <div className="relative">
              <img 
                src={eventData.ticketImage} 
                alt="Ticket image preview" 
                className="w-full h-24 sm:h-32 object-cover rounded-md"
              />
              <button
                onClick={() => onInputChange("ticketImage", null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {ticketImageDragActive ? (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-bounce" />
                ) : (
                  <Layout className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                {ticketImageDragActive ? "Drop ticket image here" : "Drag & drop ticket image or click to browse"}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInput(e, 'ticket')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Ticket Image Position Selector */}
        {eventData.ticketImage && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Image Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePositionChange('left')}
                className={`p-3 rounded border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  ticketImagePosition === 'left' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Move className="w-4 h-4" />
                <span className="text-xs">Left</span>
              </button>
              <button
                onClick={() => handlePositionChange('center')}
                className={`p-3 rounded border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  ticketImagePosition === 'center' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span className="text-xs">Center</span>
              </button>
              <button
                onClick={() => handlePositionChange('right')}
                className={`p-3 rounded border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  ticketImagePosition === 'right' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Move className="w-4 h-4" />
                <span className="text-xs">Right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="e.g., VIP access, Meet & Greet, etc."
          value={eventData.additionalNotes}
          onChange={(e) => onInputChange("additionalNotes", e.target.value)}
          className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};