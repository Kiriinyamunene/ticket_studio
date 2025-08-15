import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './TicketDetails.css';

interface Ticket {
  id: string;
  ticketType: string;
  seatType: string;
  section: string;
  row: string;
  seat: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  bannerImage: string;
}

const TicketDetails: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isStandalone, setIsStandalone] = useState(false);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    // Check if running as standalone PWA
    if ((window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Load ticket data from localStorage or use selected event data
    const loadTickets = () => {
      // Check if we have selected event data from My Events page
      const selectedEventId = localStorage.getItem('selectedEventId');
      
      let ticketCount = 3;
      let defaultTickets: Ticket[] = [];
      
      if (selectedEventId) {
        // Use selected event data
        ticketCount = parseInt(localStorage.getItem('selectedEventTicketCount') || '3');
        const eventTitle = localStorage.getItem('selectedEventTitle') || 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR';
        const eventDate = localStorage.getItem('selectedEventDate') || 'Sat, Nov 22, 2024, 7:00 PM';
        const eventVenue = localStorage.getItem('selectedEventVenue') || 'Chase Center';
        const bannerImage = localStorage.getItem('selectedEventImage') || 'https://source.unsplash.com/random/800x450/?concert';
        
                 for (let i = 0; i < ticketCount; i++) {
           defaultTickets.push({
             id: `ticket-${i + 1}`,
             ticketType: localStorage.getItem('selectedEventTicketType') || 'General Sale',
             seatType: localStorage.getItem('selectedEventSeatType') || 'General Admission',
             section: localStorage.getItem('selectedEventSection') || 'GAFL',
             row: localStorage.getItem('selectedEventRow') || '22',
             seat: (parseInt(localStorage.getItem('selectedEventSeat') || '24') + i).toString(),
             eventTitle,
             eventDate,
             eventVenue,
             bannerImage
           });
         }
      } else {
        // Use default data from Index page
        ticketCount = parseInt(localStorage.getItem('ticketCount') || '3');
        for (let i = 0; i < ticketCount; i++) {
          defaultTickets.push({
            id: `ticket-${i + 1}`,
            ticketType: localStorage.getItem('ticketType') || 'General Sale',
            seatType: localStorage.getItem('seatType') || 'General Admission',
            section: localStorage.getItem('section') || 'GAFL',
            row: localStorage.getItem('row') || '22',
            seat: (parseInt(localStorage.getItem('seat') || '24') + i).toString(),
            eventTitle: localStorage.getItem('eventTitle') || 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR',
            eventDate: localStorage.getItem('eventDate') || 'Sat, Nov 22, 2024, 7:00 PM',
            eventVenue: localStorage.getItem('eventVenue') || 'Chase Center',
            bannerImage: localStorage.getItem('bannerImage') || 'https://source.unsplash.com/random/800x450/?concert'
          });
        }
      }
      
      setTickets(defaultTickets);
    };

    loadTickets();
  }, []);

  useEffect(() => {
    // Set background image from localStorage - prioritize selected event image
    const selectedEventImage = localStorage.getItem('selectedEventImage');
    const defaultBannerImage = localStorage.getItem('bannerImage');
    const fallbackImage = 'https://source.unsplash.com/random/800x450/?concert';
    
    const bannerUrl = selectedEventImage || defaultBannerImage || fallbackImage;
    
    if (bannerUrl) {
      document.documentElement.style.setProperty('--event-banner-image', `url('${bannerUrl}')`);
    }
  }, [tickets]);

  const generateBarcode = (ticket: Ticket, index: number) => {
    // Generate a unique ticket number with proper format
    const ticketNumber = generateTicketNumber(ticket, index);
    const barcodeData = ticketNumber;
    
    // Create a barcode that covers the full width of the container
    const bars = generateFullWidthBarcode(barcodeData);

    return (
      <svg
        width="280px"
        height="80px"
        viewBox="0 0 280 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <rect x="0" y="0" width="280" height="80" style={{ fill: '#ffffff' }} />
        <g transform="translate(5, 5)" style={{ fill: '#000000' }}>
          {bars}
          <text
            style={{ font: '12px monospace' }}
            textAnchor="middle"
            x="135"
            y="70"
          >
            {barcodeData}
          </text>
        </g>
      </svg>
    );
  };

  const generateTicketNumber = (ticket: Ticket, index: number) => {
    // Create a unique ticket number based on event and seat info
    const eventCode = ticket.eventTitle.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const sectionCode = ticket.section.substring(0, 2).toUpperCase();
    const rowCode = ticket.row.padStart(2, '0');
    const seatCode = ticket.seat.padStart(2, '0');
    const ticketIndex = (index + 1).toString().padStart(2, '0');
    
    // Add a random component for uniqueness
    const randomCode = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${eventCode}${sectionCode}${rowCode}${seatCode}${ticketIndex}${randomCode}`;
  };

  const generateFullWidthBarcode = (barcodeData: string) => {
    const bars: JSX.Element[] = [];
    const totalWidth = 270; // Full width minus padding (280 - 10)
    const charCount = barcodeData.length + 2; // +2 for start/stop characters
    const charWidth = Math.floor(totalWidth / charCount);
    
    let xPosition = 0;
    
    // Add start character
    bars.push(...generateCharacterBars('*', xPosition, charWidth));
    xPosition += charWidth;
    
    // Add data characters
    for (let i = 0; i < barcodeData.length; i++) {
      const char = barcodeData[i];
      bars.push(...generateCharacterBars(char, xPosition, charWidth));
      xPosition += charWidth;
    }
    
    // Add stop character
    bars.push(...generateCharacterBars('*', xPosition, charWidth));
    
    return bars;
  };

  const generateBarcodeBars = (barcodeData: string) => {
    const bars: JSX.Element[] = [];
    let xPosition = 0;
    
    // Add start character
    bars.push(...generateCharacterBars('*', xPosition));
    xPosition += 10;
    
    // Add data characters
    for (let i = 0; i < barcodeData.length; i++) {
      const char = barcodeData[i];
      bars.push(...generateCharacterBars(char, xPosition));
      xPosition += 8;
    }
    
    // Add stop character
    bars.push(...generateCharacterBars('*', xPosition));
    
    return bars;
  };

  const generateCharacterBars = (char: string, xOffset: number, charWidth?: number) => {
    const bars: JSX.Element[] = [];
    const charCode = char.charCodeAt(0);
    
    // Create a more realistic barcode pattern
    const barPattern = generateBarPattern(charCode);
    
    // Calculate bar spacing based on available width
    const availableWidth = charWidth || 8;
    const barSpacing = availableWidth / barPattern.length;
    const barWidth = Math.max(1, barSpacing * 0.6); // 60% of spacing for bar width
    
    for (let i = 0; i < barPattern.length; i++) {
      const isBar = barPattern[i] === '1';
      if (isBar) {
        bars.push(
          <rect
            key={`${char}-${i}-${xOffset}`}
            x={xOffset + (i * barSpacing)}
            y={10}
            width={barWidth}
            height={70}
            fill="#000000"
          />
        );
      }
    }
    
    return bars;
  };

  const generateBarPattern = (charCode: number) => {
    // Generate a binary pattern based on character code for consistency
    const pattern = (charCode % 16).toString(2).padStart(4, '0');
    // Repeat pattern to create more bars
    return pattern + pattern + pattern;
  };

  const handleTransfer = () => {
    // Store flag to open transfer modal when navigating back
    localStorage.setItem('openTransferModalOnLoad', 'true');
    window.location.href = '/';
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  const handleHelp = () => {
    // Implement help functionality
    alert('Need help? Contact support at support@ticketforge.com');
  };

  return (
    <div className={`ticket-details-page ${isStandalone ? 'standalone-mode' : ''}`}>
      {/* Header */}
      <div className="header">
        <span className="close" onClick={handleClose}>×</span>
        <div className="event-title-container">
          <span className="event-title">
            {tickets[0]?.eventTitle || 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR'}
          </span>
          <span className="event-subtitle event-details">
            {tickets[0]?.eventDate || 'Sat, Nov 22, 2024, 7:00 PM'} • {tickets[0]?.eventVenue || 'Chase Center'}
          </span>
        </div>
        <span className="help" onClick={handleHelp}>Help</span>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className="active">MY TICKETS ({tickets.length})</div>
        <div>ADD-ONS (0)</div>
      </div>

      {/* Swiper Container */}
      <div className="swiper-container">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          className="mySwiper"
        >
          {tickets.map((ticket, index) => (
            <SwiperSlide key={ticket.id}>
                             <div className="ticket-card">
                 <div className="ticket-header">{ticket.ticketType}</div>
                
                <div className="seat-info">
                  <div className="seat-column">
                    <div className="seat-label">SEC</div>
                    <div className="seat-value">{ticket.section}</div>
                  </div>
                  {ticket.seatType === 'General Admission' ? (
                    <div className="seat-column general-admission-column">
                      <div className="general-admission-text">General Admission</div>
                    </div>
                  ) : (
                    <>
                      <div className="seat-column">
                        <div className="seat-label">ROW</div>
                        <div className="seat-value">{ticket.row}</div>
                      </div>
                      <div className="seat-column">
                        <div className="seat-label">SEAT</div>
                        <div className="seat-value">{ticket.seat}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="barcode-container">
                  <div className="barcode">
                    <div className="barcode-scan-line"></div>
                    {generateBarcode(ticket, index)}
                  </div>
                  <p className="warning">Screenshots won't get you in.</p>
                  <button className="add-to-wallet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    Add to Apple Wallet
                  </button>
                  <button className="add-to-wallet google-pay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    Add to Google Pay
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Transfer Button */}
      <button className="transfer-btn" onClick={handleTransfer}>
        Transfer
      </button>
    </div>
  );
};

export default TicketDetails;
