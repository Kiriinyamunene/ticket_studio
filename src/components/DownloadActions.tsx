import { Button } from "@/components/ui/button";
import { Download, Share2, Printer } from "lucide-react";
import { EventData, TicketDesign, ColorScheme } from "./TicketGenerator";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadActionsProps {
  eventData: EventData;
  design: TicketDesign;
  customColors: ColorScheme;
  sectionPositions: {[key: string]: {x: number, y: number}};
}

export const DownloadActions = ({ eventData, design, customColors, sectionPositions }: DownloadActionsProps) => {
  
  const downloadTicket = async (format: 'png' | 'pdf') => {
    try {
      const ticketElement = document.getElementById('ticket-preview');
      if (!ticketElement) {
        toast.error("Ticket preview not found");
        return;
      }

      // Simple direct capture - no complex modifications
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      if (format === 'png') {
        // Convert to blob and download PNG
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error("Failed to generate image");
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ticket_${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          toast.success("Ticket downloaded as PNG");
        }, 'image/png');
      } else if (format === 'pdf') {
        // Convert to PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        
        // Calculate dimensions to fit the ticket properly on the page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth * 0.8; // 80% of page width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`ticket_${Date.now()}.pdf`);
        
        toast.success("Ticket downloaded as PDF");
      }

    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed");
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const printTicket = async () => {
    try {
      const ticketElement = document.getElementById('ticket-preview');
      if (!ticketElement) {
        toast.error("Ticket preview not found");
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Unable to open print dialog");
        return;
      }

      // Get the computed styles to ensure all CSS is included
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket - ${eventData.eventName}</title>
            <style>
              ${styles}
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
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      
      toast.success("Print dialog opened");
    } catch (error) {
      console.error('Print error:', error);
      toast.error("Failed to open print dialog");
    }
  };

  const isTicketReady = eventData.eventName && eventData.venue && eventData.date;

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Download Options</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={() => downloadTicket('png')}
          disabled={!isTicketReady}
          className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          PNG Image
        </Button>
        
        <Button 
          onClick={() => downloadTicket('pdf')}
          disabled={!isTicketReady}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 hover:border-green-500 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF Document
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={shareTicket}
          disabled={!isTicketReady}
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all duration-200"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button 
          onClick={printTicket}
          disabled={!isTicketReady}
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all duration-200"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {!isTicketReady && (
        <p className="text-sm text-gray-600 text-center">
          Fill in event name, venue, and date to enable downloads
        </p>
      )}
    </div>
  );
};