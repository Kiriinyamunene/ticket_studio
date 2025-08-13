import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EventForm } from "./EventForm";
import { DesignSelector } from "./DesignSelector";
import { TicketPreview } from "./TicketPreview";
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
  ticketImage: string | null;
  ticketImagePosition: 'left' | 'center' | 'right';
}

export interface TicketDesign {
  id: string;
  name: string;
  description: string;
  className: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const ticketDesigns: TicketDesign[] = [
  {
    id: "sporty",
    name: "Sporty",
    description: "Dynamic green and blue gradient perfect for sports events",
    className: "bg-gradient-to-br from-green-500 to-blue-600 text-white border-2 border-green-400 shadow-lg"
  },
  {
    id: "dark",
    name: "Dark",
    description: "Elegant dark theme with blue accents",
    className: "bg-gray-900 text-white border-2 border-gray-700 shadow-xl"
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Clean slate design with sophisticated typography",
    className: "bg-slate-50 text-slate-900 border-2 border-slate-300 shadow-md"
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Bold blue to purple gradient with high energy",
    className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-2 border-blue-500 shadow-lg"
  },
  {
    id: "custom",
    name: "Custom Colors",
    description: "Create your own unique color scheme",
    className: "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-2 border-blue-400 shadow-lg"
  }
];

const presetColorSchemes = [
  {
    name: "Sporty Green",
    colors: {
      primary: "#22c55e",
      secondary: "#3b82f6",
      accent: "#eab308",
      background: "linear-gradient(135deg, #22c55e, #3b82f6)",
      text: "#ffffff"
    }
  },
  {
    name: "Elegant Purple",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#f59e0b",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      text: "#ffffff"
    }
  },
  {
    name: "Ocean Blue",
    colors: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      accent: "#fbbf24",
      background: "linear-gradient(135deg, #06b6d4, #0891b2)",
      text: "#ffffff"
    }
  },
  {
    name: "Sunset Orange",
    colors: {
      primary: "#f97316",
      secondary: "#ef4444",
      accent: "#fbbf24",
      background: "linear-gradient(135deg, #f97316, #ef4444)",
      text: "#ffffff"
    }
  },
  {
    name: "Midnight Dark",
    colors: {
      primary: "#1e293b",
      secondary: "#334155",
      accent: "#3b82f6",
      background: "linear-gradient(135deg, #1e293b, #334155)",
      text: "#ffffff"
    }
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
    category: "sports",
    additionalNotes: "",
    eventImage: null,
    ticketImage: null,
    ticketImagePosition: 'center'
  });
  
  const [selectedDesign, setSelectedDesign] = useState<TicketDesign>(ticketDesigns[0]);
  const [customColors, setCustomColors] = useState<ColorScheme>({
    primary: "#22c55e",
    secondary: "#3b82f6",
    accent: "#eab308",
    background: "linear-gradient(135deg, #22c55e, #3b82f6)",
    text: "#ffffff"
  });

  // State to track section positions from TicketPreview
  const [sectionPositions, setSectionPositions] = useState<{[key: string]: {x: number, y: number}}>({});

  const handleInputChange = (field: keyof EventData, value: string | null) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (colors: ColorScheme) => {
    setCustomColors(colors);
  };

  // Callback to receive section positions from TicketPreview
  const handleSectionPositionsChange = (positions: {[key: string]: {x: number, y: number}}) => {
    setSectionPositions(positions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
          SportTicket Studio
          </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Create professional sports tickets with custom layouts and designs
          </p>
        </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
          {/* Event Form */}
          <Card className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Event Details</h3>
            <EventForm eventData={eventData} onInputChange={handleInputChange} />
            </Card>

          {/* Design Selector */}
          <Card className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Choose Design</h3>
              <DesignSelector
                designs={ticketDesigns}
                selectedDesign={selectedDesign}
                onDesignSelect={setSelectedDesign}
              customColors={customColors}
              onColorChange={handleColorChange}
              presetSchemes={presetColorSchemes}
              />
            </Card>
          </div>

          <div className="space-y-6">
          {/* Live Preview */}
          <Card className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Live Preview</h3>
              <TicketPreview 
                eventData={eventData}
                design={selectedDesign}
              customColors={customColors}
              onSectionPositionsChange={handleSectionPositionsChange}
              />
            </Card>

          {/* Download Actions */}
          <Card className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
              <DownloadActions 
                eventData={eventData}
                design={selectedDesign}
              customColors={customColors}
              sectionPositions={sectionPositions}
              />
            </Card>
        </div>
      </div>
    </div>
  );
};