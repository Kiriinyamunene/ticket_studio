import { EventData, TicketDesign, ColorScheme } from "./TicketGenerator";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Clock, CreditCard, Hash, Star, Sparkles, Trophy, Zap, GripVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TicketPreviewProps {
  eventData: EventData;
  design: TicketDesign;
  customColors: ColorScheme;
  onSectionPositionsChange?: (positions: {[key: string]: {x: number, y: number}}) => void;
}

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SectionPosition {
  x: number;
  y: number;
}

interface DraggableSection {
  id: string;
  name: string;
  position: SectionPosition;
  isVisible: boolean;
}

export const TicketPreview = ({ eventData, design, customColors, onSectionPositionsChange }: TicketPreviewProps) => {
  const ticketId = "TKT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const qrData = JSON.stringify({
    ticketId,
    event: eventData.eventName,
    venue: eventData.venue,
    date: eventData.date,
    time: eventData.time,
    seat: `${eventData.seatSection}-${eventData.seatRow}-${eventData.seatNumber}`
  });

  const [imagePosition, setImagePosition] = useState<ImagePosition>({
    x: 50,
    y: 50,
    width: 80,
    height: 80
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Draggable sections state
  const [sections, setSections] = useState<DraggableSection[]>([
    { id: 'eventName', name: 'Event Name', position: { x: 20, y: 20 }, isVisible: true },
    { id: 'venue', name: 'Venue', position: { x: 20, y: 60 }, isVisible: true },
    { id: 'dateTime', name: 'Date & Time', position: { x: 20, y: 100 }, isVisible: true },
    { id: 'category', name: 'Category', position: { x: 280, y: 20 }, isVisible: true },
    { id: 'seatInfo', name: 'Seat Info', position: { x: 20, y: 140 }, isVisible: true },
    { id: 'price', name: 'Price', position: { x: 20, y: 200 }, isVisible: true },
    { id: 'ticketId', name: 'Ticket ID', position: { x: 20, y: 220 }, isVisible: true },
    { id: 'qrCode', name: 'QR Code', position: { x: 320, y: 180 }, isVisible: true }
  ]);

  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragSectionStart, setDragSectionStart] = useState({ x: 0, y: 0 });

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

  const getDesignStyles = () => {
    switch (design.id) {
      case "sporty":
        return {
          container: "bg-gradient-to-br from-green-500 to-blue-600 text-white border-2 border-green-400 shadow-lg",
          header: "bg-white/10 border-b border-white/20",
          category: "bg-yellow-500 text-black font-bold",
          seat: "bg-white/15 border border-white/30",
          qr: "bg-white border-2 border-white/30",
          accent: "bg-yellow-500",
          icon: "text-yellow-300"
        };
      case "dark":
        return {
          container: "bg-gray-900 text-white border-2 border-gray-700 shadow-xl",
          header: "bg-gray-800 border-b border-gray-600",
          category: "bg-blue-500 text-white",
          seat: "bg-gray-800 border border-gray-600",
          qr: "bg-white border-2 border-gray-600",
          accent: "bg-blue-500",
          icon: "text-blue-400"
        };
      case "elegant":
        return {
          container: "bg-slate-50 text-slate-900 border-2 border-slate-300 shadow-md",
          header: "bg-white border-b border-slate-200",
          category: "bg-slate-700 text-white",
          seat: "bg-white border border-slate-300",
          qr: "bg-white border-2 border-slate-400",
          accent: "bg-slate-700",
          icon: "text-slate-600"
        };
      case "vibrant":
        return {
          container: "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-2 border-blue-500 shadow-lg",
          header: "bg-white/10 border-b border-white/20",
          category: "bg-white/20 text-white border border-white/30",
          seat: "bg-white/10 border border-white/20",
          qr: "bg-white border-2 border-white/30",
          accent: "bg-white",
          icon: "text-white/80"
        };
      case "custom":
        return {
          container: `border-2 shadow-lg`,
          header: "bg-white/10 border-b border-white/20",
          category: "font-bold",
          seat: "bg-white/15 border border-white/30",
          qr: "bg-white border-2 border-white/30",
          accent: "",
          icon: ""
        };
      default:
        return {
          container: "bg-white text-gray-900 border-2 border-gray-200 shadow-lg",
          header: "bg-gray-50 border-b border-gray-200",
          category: "bg-blue-600 text-white",
          seat: "bg-gray-100 border border-gray-300",
          qr: "bg-white border-2 border-gray-300",
          accent: "bg-blue-600",
          icon: "text-blue-600"
        };
    }
  };

  const styles = getDesignStyles();
  const isSportyDesign = design.id === "sporty";
  const isCustomDesign = design.id === "custom";
  
  // Get custom styles for custom design
  const getCustomStyles = () => {
    if (!isCustomDesign) return {};
    
    return {
      container: {
        background: customColors.background,
        color: customColors.text,
        borderColor: customColors.primary
      },
      category: {
        background: customColors.accent,
        color: customColors.text
      },
      accent: {
        background: customColors.accent
      },
      icon: {
        color: customColors.accent
      }
    };
  };

  const customStyles = getCustomStyles();

  // Handle mouse events for image dragging
  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault();
    if (type === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    } else {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: imagePosition.width,
        height: imagePosition.height
      });
    }
  };

  // Handle section dragging
  const handleSectionMouseDown = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedSection(sectionId);
    setDragSectionStart({
      x: e.clientX - sections.find(s => s.id === sectionId)?.position.x || 0,
      y: e.clientY - sections.find(s => s.id === sectionId)?.position.y || 0
    });
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain to container bounds
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const maxX = containerRect.width - imagePosition.width;
          const maxY = containerRect.height - imagePosition.height;
          
          setImagePosition(prev => ({
            ...prev,
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
          }));
        }
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const scale = 0.5; // Adjust sensitivity
        
        const newWidth = Math.max(40, Math.min(200, resizeStart.width + deltaX * scale));
        const newHeight = Math.max(40, Math.min(200, resizeStart.height + deltaY * scale));
        
        setImagePosition(prev => ({
          ...prev,
          width: newWidth,
          height: newHeight
        }));
      }

      // Handle section dragging
      if (draggedSection) {
        const newX = e.clientX - dragSectionStart.x;
        const newY = e.clientY - dragSectionStart.y;
        
        // Constrain to container bounds
        const container = containerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const maxX = containerRect.width - 100; // Approximate section width
          const maxY = containerRect.height - 50;  // Approximate section height
          
          setSections(prev => prev.map(section => 
            section.id === draggedSection 
              ? {
                  ...section,
                  position: {
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                  }
                }
              : section
          ));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setDraggedSection(null);
    };

    if (isDragging || isResizing || draggedSection) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, draggedSection, dragStart, resizeStart, dragSectionStart, imagePosition.width, imagePosition.height]);

  // Reset image position when ticket image changes
  useEffect(() => {
    if (eventData.ticketImage) {
      setImagePosition({
        x: 50,
        y: 50,
        width: 80,
        height: 80
      });
    }
  }, [eventData.ticketImage]);

  // Pass section positions back to parent component
  useEffect(() => {
    if (onSectionPositionsChange) {
      const positions: {[key: string]: {x: number, y: number}} = {};
      sections.forEach(section => {
        positions[section.id] = section.position;
      });
      onSectionPositionsChange(positions);
    }
  }, [sections, onSectionPositionsChange]);

  // Render draggable section
  const renderDraggableSection = (section: DraggableSection) => {
    if (!section.isVisible) return null;

    const baseClasses = "absolute cursor-move select-none transition-all duration-200";
    const draggingClasses = draggedSection === section.id ? "z-50 scale-105" : "z-10";

    switch (section.id) {
      case 'eventName':
  return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '200px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <h3 className="text-base font-bold truncate text-white">
              {eventData.eventName || "Sports Event"}
            </h3>
          </div>
        );

      case 'venue':
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '150px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{eventData.venue || "Stadium Name"}</span>
            </div>
            </div>
        );

      case 'dateTime':
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '180px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium truncate">{formatDate(eventData.date)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium truncate">{formatTime(eventData.time)}</span>
              </div>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full font-medium ${
              design.id === 'concert'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-primary text-primary-foreground'
            }`}>
              {(eventData.ticketType || "").toUpperCase()}
            </div>
          </div>
        );

      case 'category':
      case 'category':
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '80px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium text-center ${styles.category}`}
              style={isCustomDesign ? customStyles.category : {}}
            >
              {(eventData.ticketType || "").toUpperCase()}
            </div>
          </div>
        );
      case 'seatInfo':
      case 'seatInfo':
        return eventData.seatSection || eventData.seatRow || eventData.seatNumber ? (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '120px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div className={`text-center py-1 px-2 rounded ${styles.seat}`}>
              <div className="text-xs font-medium tracking-wider text-white/70 mb-1">SEAT</div>
              <div className="font-mono font-bold text-sm">
                {[eventData.seatSection, eventData.seatRow, eventData.seatNumber].filter(Boolean).join("-")}
              </div>
            </div>
          </div>
        ) : null;
      case 'price':
        return eventData.price ? (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '100px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div className="flex items-center gap-1 text-lg font-bold text-white">
              <CreditCard className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{eventData.price}</span>
            </div>
          </div>
        ) : null;

      case 'ticketId':
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '150px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
              </div>
            <div className="flex items-center gap-1 text-xs text-white/60 tracking-wider">
              <Hash className="w-2 h-2 flex-shrink-0" />
              <span className="truncate">{ticketId}</span>
            </div>
          </div>
        );

      case 'qrCode':
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${draggingClasses}`}
            style={{
              left: `${section.position.x}px`,
              top: `${section.position.y}px`,
              minWidth: '60px'
            }}
            onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          >
            <div className="flex items-center gap-2 mb-1 opacity-0 hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-white/60" />
              <span className="text-xs font-medium text-white/80">{section.name}</span>
            </div>
            <div className={`p-1 rounded ${styles.qr}`}>
            <QRCodeSVG
              value={qrData}
                size={40}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Ticket Container with 2:1 Aspect Ratio */}
      <div 
        ref={containerRef}
        id="ticket-preview"
        className={`
          relative w-full rounded-xl overflow-hidden
          transform transition-all duration-300 hover:scale-105 
          ${styles.container}
        `}
        style={{
          ...(isCustomDesign ? customStyles.container : {}),
          aspectRatio: '2 / 1', // Length is twice the height
          minHeight: '180px', // Reduced minimum height
          maxHeight: '250px'  // Reduced maximum height
        }}
      >
        {/* Background Image */}
        {eventData.eventImage && (
          <div className="absolute inset-0 opacity-10">
            <img 
              src={eventData.eventImage} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Ticket Image with Drag and Resize */}
        {eventData.ticketImage && (
          <div
            className="absolute cursor-move select-none"
            style={{
              left: `${imagePosition.x}px`,
              top: `${imagePosition.y}px`,
              width: `${imagePosition.width}px`,
              height: `${imagePosition.height}px`,
              zIndex: 20
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
          >
            <img 
              ref={imageRef}
              src={eventData.ticketImage} 
              alt="Ticket image" 
              className="w-full h-full object-cover rounded-lg border-2 border-white/30"
              draggable={false}
            />
            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-white/80 rounded-tl cursor-nw-resize"
              onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
          </div>
        )}

        {/* Sports Decorative Elements */}
        {isSportyDesign && (
          <>
            <div className="absolute top-2 right-2">
              <Trophy className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            <div className="absolute top-3 right-8">
              <Zap className="w-3 h-3 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-16 left-2">
              <Star className="w-2 h-2 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </>
        )}

        {/* Custom Decorative Elements */}
        {isCustomDesign && (
          <>
            <div className="absolute top-2 right-2">
              <Trophy className="w-4 h-4 animate-pulse" style={{ color: customColors.accent }} />
            </div>
            <div className="absolute top-3 right-8">
              <Zap className="w-3 h-3 fill-current animate-pulse" style={{ color: customColors.accent, animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-16 left-2">
              <Star className="w-2 h-2 fill-current animate-pulse" style={{ color: customColors.accent, animationDelay: '1s' }} />
            </div>
          </>
        )}

        {/* Draggable Sections */}
        {sections.map(section => renderDraggableSection(section))}

        {/* Bottom Accent Bar */}
        <div 
          className={`h-1 ${styles.accent}`}
          style={isCustomDesign ? customStyles.accent : {}}
        />
      </div>

      {/* Layout Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 layout-instructions">
        <p className="text-xs text-gray-600 text-center">
          💡 <strong>Customize Layout:</strong> Drag any section to reposition it on your ticket. 
          Each section can be moved independently to create your perfect layout!
        </p>
      </div>
    </div>
  );
};