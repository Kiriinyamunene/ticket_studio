import { EventData, TicketDesign } from "./TicketGenerator";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Clock, CreditCard, Hash, Star, Sparkles } from "lucide-react";

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

  const isLuxuryDesign = ['luxury', 'rose-gold', 'platinum'].includes(design.id);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        id="ticket-preview"
        className={`
          relative w-full h-96 rounded-xl p-6 overflow-hidden
          transform transition-all duration-300 hover:scale-105 
          ${design.className}
        `}
      >
        {/* Event Image Background */}
        {eventData.eventImage && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={eventData.eventImage} 
              alt="Event background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
          </div>
        )}

        {/* Luxury Decorative Elements */}
        {isLuxuryDesign && (
          <>
            <div className="absolute top-4 right-4">
              <Sparkles className="w-6 h-6 text-ticket-rose-gold animate-pulse" />
            </div>
            <div className="absolute top-6 right-12">
              <Star className="w-4 h-4 text-ticket-premium fill-current animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-20 left-4">
              <Star className="w-3 h-3 text-ticket-rose-gold fill-current animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </>
        )}

        {/* Header */}
        <div className="relative flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className={`text-xl font-bold truncate font-playfair ${
              design.id === 'concert' || isLuxuryDesign ? 'text-white' : 'text-foreground'
            }`}>
              {eventData.eventName || "Event Name"}
            </h3>
            <div className={`flex items-center gap-1 text-sm font-inter ${
              design.id === 'concert' || isLuxuryDesign ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              <MapPin className="w-4 h-4" />
              <span className="truncate">{eventData.venue || "Venue Name"}</span>
            </div>
          </div>
          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
            isLuxuryDesign 
              ? 'bg-ticket-rose-gold/20 text-white border border-ticket-rose-gold/40' 
              : design.id === 'concert' 
                ? 'bg-white/20 text-white border border-white/30' 
                : 'bg-primary text-primary-foreground'
          }`}>
            {eventData.category.toUpperCase()}
          </div>
        </div>

        {/* Date & Time */}
        <div className="relative grid grid-cols-2 gap-4 mb-6">
          <div className={`flex items-center gap-2 text-sm font-inter ${
            design.id === 'concert' || isLuxuryDesign ? 'text-white/90' : 'text-foreground'
          }`}>
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{formatDate(eventData.date)}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-inter ${
            design.id === 'concert' || isLuxuryDesign ? 'text-white/90' : 'text-foreground'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-medium">{formatTime(eventData.time)}</span>
          </div>
        </div>

        {/* Seat Information */}
        {(eventData.seatSection || eventData.seatRow || eventData.seatNumber) && (
          <div className={`relative text-center py-3 px-4 rounded-lg mb-6 backdrop-blur ${
            isLuxuryDesign 
              ? 'bg-white/10 border border-ticket-rose-gold/30' 
              : design.id === 'concert' 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-muted border border-border'
          }`}>
            <div className={`text-xs font-inter tracking-wider ${
              design.id === 'concert' || isLuxuryDesign ? 'text-white/60' : 'text-muted-foreground'
            }`}>SEAT</div>
            <div className={`font-mono font-bold text-lg ${
              design.id === 'concert' || isLuxuryDesign ? 'text-white' : 'text-foreground'
            }`}>
              {[eventData.seatSection, eventData.seatRow, eventData.seatNumber].filter(Boolean).join("-") || "General Admission"}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div className="flex-1">
            {eventData.price && (
              <div className={`flex items-center gap-2 text-xl font-bold font-cormorant ${
                design.id === 'concert' || isLuxuryDesign ? 'text-white' : 'text-foreground'
              }`}>
                <CreditCard className="w-5 h-5" />
                {eventData.price}
              </div>
            )}
            <div className={`flex items-center gap-1 text-xs font-inter tracking-wider ${
              design.id === 'concert' || isLuxuryDesign ? 'text-white/60' : 'text-muted-foreground'
            }`}>
              <Hash className="w-3 h-3" />
              {ticketId}
            </div>
          </div>
          
          {/* QR Code */}
          <div className={`p-3 rounded-lg shadow-lg ${
            isLuxuryDesign 
              ? 'bg-white border-2 border-ticket-rose-gold/30' 
              : design.id === 'concert' 
                ? 'bg-white border border-white/20' 
                : 'bg-white border border-border'
          }`}>
            <QRCodeSVG
              value={qrData}
              size={56}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className={`absolute top-0 left-0 w-full h-3 rounded-t-xl ${
          isLuxuryDesign 
            ? 'bg-gradient-rose-gold' 
            : design.id === 'concert' 
              ? 'bg-gradient-primary' 
              : design.id === 'platinum'
                ? 'bg-gradient-platinum'
                : 'bg-gradient-elegant'
        }`} />
        
        {/* Corner Accents for Luxury Designs */}
        {isLuxuryDesign && (
          <>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-ticket-rose-gold/40 rounded-br-xl" />
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-ticket-rose-gold/40 rounded-tl-xl" />
          </>
        )}
      </div>
    </div>
  );
};