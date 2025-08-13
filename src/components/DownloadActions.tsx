import { Button } from "@/components/ui/button";
import { Download, Share2, Printer } from "lucide-react";
import { EventData, TicketDesign } from "./TicketGenerator";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface DownloadActionsProps {
  eventData: EventData;
  design: TicketDesign;
}

export const DownloadActions = ({ eventData, design }: DownloadActionsProps) => {
  
  const downloadTicket = async (format: 'png' | 'jpg') => {
    try {
      const ticketElement = document.getElementById('ticket-preview');
      if (!ticketElement) {
        toast.error("Ticket preview not found");
        return;
      }

      // Temporarily increase scale for better quality
      const canvas = await html2canvas(ticketElement, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to generate image");
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${eventData.eventName || 'event'}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(`Ticket downloaded as ${format.toUpperCase()}`);
      }, `image/${format}`, 0.95);

    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download ticket");
    }
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${eventData.eventName}`,
          text: `Check out my ticket for ${eventData.eventName} at ${eventData.venue}!`,
          url: window.location.href
        });
        toast.success("Ticket shared successfully");
      } catch (error) {
        toast.error("Sharing cancelled");
      }
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const printTicket = () => {
    const printWindow = window.open('', '_blank');
    const ticketElement = document.getElementById('ticket-preview');
    
    if (!printWindow || !ticketElement) {
      toast.error("Unable to open print dialog");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${eventData.eventName}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            .ticket-container {
              max-width: 400px;
              margin: 0 auto;
            }
            @media print {
              body { padding: 0; }
              .ticket-container { 
                max-width: none; 
                width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            ${ticketElement.outerHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    toast.success("Print dialog opened");
  };

  const isTicketReady = eventData.eventName && eventData.venue && eventData.date;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Download Options</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={() => downloadTicket('png')}
          disabled={!isTicketReady}
          className="bg-gradient-primary hover:opacity-90 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          PNG Image
        </Button>
        
        <Button 
          onClick={() => downloadTicket('jpg')}
          disabled={!isTicketReady}
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          JPG Image
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={shareTicket}
          disabled={!isTicketReady}
          variant="secondary"
          className="transition-all duration-200 hover:shadow-glow"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button 
          onClick={printTicket}
          disabled={!isTicketReady}
          variant="secondary"
          className="transition-all duration-200 hover:shadow-glow"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {!isTicketReady && (
        <p className="text-sm text-muted-foreground text-center">
          Fill in event name, venue, and date to enable downloads
        </p>
      )}
    </div>
  );
};