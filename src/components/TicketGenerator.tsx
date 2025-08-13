import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EventForm } from "./EventForm";
import { TicketPreview } from "./TicketPreview";
import { DesignSelector } from "./DesignSelector";
import { DownloadActions } from "./DownloadActions";

export interface EventData {
  eventName: string;
  venue: string;
  date: string;
  time: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  price: string;
  category: "concert" | "sports" | "theater" | "conference" | "other";
  additionalNotes: string;
  eventImage: string | null;
}

export interface TicketDesign {
  id: string;
  name: string;
  description: string;
  className: string;
}

const ticketDesigns: TicketDesign[] = [
  {
    id: "luxury",
    name: "Luxury Premium",
    description: "Ultra-luxurious design with gold accents and premium styling",
    className: "bg-gradient-luxury text-white border border-ticket-rose-gold/30 shadow-luxury"
  },
  {
    id: "rose-gold",
    name: "Rose Gold Elite",
    description: "Sophisticated rose gold theme with elegant details",
    className: "bg-gradient-rose-gold text-ticket-luxury border border-ticket-luxury/20 shadow-rose-gold"
  },
  {
    id: "platinum",
    name: "Platinum Prestige",
    description: "Premium platinum design for high-end events",
    className: "bg-gradient-platinum text-ticket-luxury border border-ticket-luxury/30 shadow-premium"
  },
  {
    id: "concert",
    name: "Vibrant Concert",
    description: "Dynamic gradients perfect for music events",
    className: "bg-gradient-concert text-white border border-white/20 shadow-glow"
  }
];

export const TicketGenerator = () => {
  const [eventData, setEventData] = useState<EventData>({
    eventName: "",
    venue: "",
    date: "",
    time: "",
    seatSection: "",
    seatRow: "",
    seatNumber: "",
    price: "",
    category: "concert",
    additionalNotes: "",
    eventImage: null
  });
  
  const [selectedDesign, setSelectedDesign] = useState<TicketDesign>(ticketDesigns[0]);

  const handleInputChange = (field: keyof EventData, value: string) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Ticket<span className="text-ticket-premium">Master</span> Clone
          </h1>
          <p className="text-white/80 text-lg">
            Create professional event tickets in seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/95 backdrop-blur">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Event Details</h2>
              <EventForm 
                eventData={eventData}
                onInputChange={handleInputChange}
              />
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Choose Design</h3>
              <DesignSelector
                designs={ticketDesigns}
                selectedDesign={selectedDesign}
                onDesignSelect={setSelectedDesign}
              />
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/95 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Live Preview</h3>
              <TicketPreview 
                eventData={eventData}
                design={selectedDesign}
              />
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur">
              <DownloadActions 
                eventData={eventData}
                design={selectedDesign}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};