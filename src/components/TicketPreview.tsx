import { EventData, TicketDesign } from "./TicketGenerator";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Clock, CreditCard, Hash } from "lucide-react";

interface TicketPreviewProps {
  eventData: EventData;
  design: TicketDesign;
}

export const TicketPreview = ({ eventData, design }: TicketPreviewProps) => {
  const ticketId = "TKT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const qrData = JSON.stringify({
    ticketId,
    event: eventData.eventName,
    venue: eventData.venue,
    date: eventData.date,
    time: eventData.time,
    seat: `${eventData.seatSection}-${eventData.seatRow}-${eventData.seatNumber}`
  });

  const formatDate = (date: string) => {
    if (!date) return "Select Date";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "Select Time";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        id="ticket-preview"
        className={`
          relative w-full h-80 rounded-lg p-6 
          transform transition-all duration-300 hover:scale-105 hover:shadow-premium
          ${design.className}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className={`text-lg font-bold truncate ${design.id === 'concert' ? 'text-white' : 'text-foreground'}`}>
              {eventData.eventName || "Event Name"}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${design.id === 'concert' ? 'text-white/80' : 'text-muted-foreground'}`}>
              <MapPin className="w-4 h-4" />
              <span className="truncate">{eventData.venue || "Venue Name"}</span>
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${design.id === 'concert' ? 'bg-white/20 text-white' : 'bg-primary text-primary-foreground'}`}>
            {eventData.category.toUpperCase()}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`flex items-center gap-2 text-sm ${design.id === 'concert' ? 'text-white/90' : 'text-foreground'}`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(eventData.date)}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${design.id === 'concert' ? 'text-white/90' : 'text-foreground'}`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(eventData.time)}</span>
          </div>
        </div>

        {/* Seat Information */}
        {(eventData.seatSection || eventData.seatRow || eventData.seatNumber) && (
          <div className={`text-center py-2 px-4 rounded-md mb-4 ${design.id === 'concert' ? 'bg-white/10' : 'bg-muted'}`}>
            <div className={`text-xs ${design.id === 'concert' ? 'text-white/60' : 'text-muted-foreground'}`}>SEAT</div>
            <div className={`font-mono font-bold ${design.id === 'concert' ? 'text-white' : 'text-foreground'}`}>
              {[eventData.seatSection, eventData.seatRow, eventData.seatNumber].filter(Boolean).join("-") || "General Admission"}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div className="flex-1">
            {eventData.price && (
              <div className={`flex items-center gap-1 text-lg font-bold ${design.id === 'concert' ? 'text-white' : 'text-foreground'}`}>
                <CreditCard className="w-4 h-4" />
                {eventData.price}
              </div>
            )}
            <div className={`flex items-center gap-1 text-xs ${design.id === 'concert' ? 'text-white/60' : 'text-muted-foreground'}`}>
              <Hash className="w-3 h-3" />
              {ticketId}
            </div>
          </div>
          
          {/* QR Code */}
          <div className={`p-2 rounded ${design.id === 'concert' ? 'bg-white' : 'bg-white border'}`}>
            <QRCodeSVG
              value={qrData}
              size={48}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute top-0 left-0 w-full h-2 rounded-t-lg ${design.id === 'concert' ? 'bg-gradient-primary' : design.id === 'modern' ? 'bg-primary' : 'bg-gradient-elegant'}`} />
      </div>
    </div>
  );
};