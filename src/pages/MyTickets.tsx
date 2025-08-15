import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MyTickets.css';

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
  countdownTargetDate: string;
}

interface Addon {
  name: string;
  included: boolean;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'tickets' | 'addons'>('tickets');
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [addons, setAddons] = useState<Addon[]>([
    { name: 'VIP Early Entry', included: false },
    { name: 'Merchandise Package', included: false },
    { name: 'Premium Parking', included: false }
  ]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: { days: string; hours: string; minutes: string; seconds: string } }>({});
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    // Set background image from localStorage
    const selectedEventImage = localStorage.getItem('selectedEventImage');
    const defaultBannerImage = localStorage.getItem('bannerImage');
    const fallbackImage = 'https://source.unsplash.com/random/800x450/?concert';
    
    const bannerUrl = selectedEventImage || defaultBannerImage || fallbackImage;
    
    if (bannerUrl) {
      document.documentElement.style.setProperty('--event-banner-image', `url('${bannerUrl}')`);
    }
    
    // Load ticket data from localStorage or use selected event data
    const loadTickets = () => {
      // Check if we have selected event data from My Events page
      const selectedEventId = localStorage.getItem('selectedEventId');
      
      let ticketCount = 3;
      let defaultTickets: Ticket[] = [];
      let bannerImage = '';
      
      if (selectedEventId) {
        // Use selected event data
        ticketCount = parseInt(localStorage.getItem('selectedEventTicketCount') || '3');
        const eventTitle = localStorage.getItem('selectedEventTitle') || 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR';
        const eventDate = localStorage.getItem('selectedEventDate') || 'Sat, Nov 22, 2024, 7:00 PM';
        const eventVenue = localStorage.getItem('selectedEventVenue') || 'Chase Center';
        bannerImage = localStorage.getItem('selectedEventImage') || 'https://source.unsplash.com/random/800x450/?concert';
        const ticketType = localStorage.getItem('selectedEventTicketType') || 'General Sale';
        const seatType = localStorage.getItem('selectedEventSeatType') || 'General Admission';
        const section = localStorage.getItem('selectedEventSection') || 'GAFL';
        const row = localStorage.getItem('selectedEventRow') || '22';
        const baseSeat = parseInt(localStorage.getItem('selectedEventSeat') || '24');
        
        for (let i = 0; i < ticketCount; i++) {
          defaultTickets.push({
            id: `ticket-${i + 1}`,
            ticketType: ticketType,
            seatType: seatType,
            section: section,
            row: row,
            seat: (baseSeat + i).toString(),
            eventTitle: eventTitle,
            eventDate: eventDate,
            eventVenue: eventVenue,
            bannerImage: bannerImage,
            countdownTargetDate: localStorage.getItem('countdownTargetDate') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } else {
        // Use default data from Index page
        ticketCount = parseInt(localStorage.getItem('ticketCount') || '3');
        bannerImage = localStorage.getItem('bannerImage') || 'https://source.unsplash.com/random/800x450/?concert';
        
        for (let i = 0; i < ticketCount; i++) {
          defaultTickets.push({
            id: `ticket-${i + 1}`,
            ticketType: localStorage.getItem('ticketType') || 'General Sale',
            seatType: localStorage.getItem('seatType') || 'General Admission',
            section: localStorage.getItem('section') || 'GAFL',
            row: localStorage.getItem('row') || '22',
            seat: (parseInt(localStorage.getItem('seat') || '24') + i).toString(),
            eventTitle: localStorage.getItem('eventName') || 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR',
            eventDate: localStorage.getItem('eventDate') || 'Sat, Nov 22, 2024, 7:00 PM',
            eventVenue: localStorage.getItem('venue') || 'Chase Center',
            bannerImage: bannerImage,
            countdownTargetDate: localStorage.getItem('countdownTargetDate') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      }
      
      setTickets(defaultTickets);
    };

    loadTickets();
    startCountdowns();
  }, []);

  const startCountdowns = () => {
    const interval = setInterval(() => {
      const newCountdowns: { [key: string]: { days: string; hours: string; minutes: string; seconds: string } } = {};
      
      tickets.forEach(ticket => {
        const targetDate = new Date(ticket.countdownTargetDate).getTime();
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
          newCountdowns[ticket.id] = { days: '00', hours: '00', minutes: '00', seconds: '00' };
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          newCountdowns[ticket.id] = {
            days: days.toString().padStart(2, '0'),
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
          };
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  };

  const isCountdownFinished = (ticketId: string) => {
    const targetDate = new Date(tickets.find(t => t.id === ticketId)?.countdownTargetDate || '').getTime();
    const now = new Date().getTime();
    return targetDate <= now;
  };

  const handleTransfer = () => {
    setShowTransferModal(true);
  };

  const handleSell = () => {
    alert('Sell functionality would open here');
  };

  const handleOrders = () => {
    window.location.href = '/orders';
  };

  const toggleSeatSelection = (seat: string) => {
    setSelectedSeats(prev => 
      prev.includes(seat) 
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const renderSeatInfo = (ticket: Ticket) => {
    if (ticket.seatType === 'General Admission') {
      return (
        <div className="seat-info-ga">
          <div className="seat-column-ga">
            <div className="seat-label">SEC</div>
            <div className="seat-value">{ticket.section}</div>
          </div>
          <div className="general-admission-text">General Admission</div>
        </div>
      );
    }

    return (
      <div className="seat-info-container">
        <div className="seat-column">
          <div className="seat-label">SEC</div>
          <div className="seat-value">{ticket.section}</div>
        </div>
        <div className="seat-column">
          <div className="seat-label">ROW</div>
          <div className="seat-value">{ticket.row}</div>
        </div>
        <div className="seat-column">
          <div className="seat-label">SEAT</div>
          <div className="seat-value">{ticket.seat}</div>
        </div>
      </div>
    );
  };

  const renderCountdownOrViewTicket = (ticket: Ticket) => {
    if (isCountdownFinished(ticket.id)) {
      return (
        <div className="view-ticket-section">
          <div className="mobile-entry-text">
            {localStorage.getItem('entryLevel') || 'Mobile Entry'}
          </div>
          <a href="/qr-code" className="view-ticket-link">
            <div className="view-ticket-container">
              <img 
                src="/assets/barcode_tm.png" 
                alt="Barcode Icon" 
                className="view-ticket-icon"
              />
              <span className="view-ticket-text">View Ticket</span>
            </div>
          </a>
        </div>
      );
    }

    const countdown = countdowns[ticket.id];
    if (!countdown) return null;

    return (
      <div className="countdown">
        <div className="countdown-label">Ticket will be ready in:</div>
        <div className="countdown-timer">
          <div className="timer-unit">
            <div className="timer-value">{countdown.days}</div>
            <div className="timer-label">DAY</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{countdown.hours}</div>
            <div className="timer-label">HOUR</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{countdown.minutes}</div>
            <div className="timer-label">MIN</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{countdown.seconds}</div>
            <div className="timer-label">SECONDS</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-tickets-page">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>My Tickets</h1>
          <div className="header-actions">
            <button className="orders-button" onClick={handleOrders}>
              Orders
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          MY TICKETS {tickets.length}
        </div>
        <div 
          className={`tab ${activeTab === 'addons' ? 'active' : ''}`}
          onClick={() => setShowAddonsModal(true)}
        >
          ADD-ONS {addons.filter(a => a.included).length}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'tickets' && (
          <>
            {/* Ticket Swiper */}
            <div className="ticket-swiper-container">
              <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={0}
                centeredSlides={true}
                pagination={{ clickable: true }}
                navigation={false}
                modules={[Pagination]}
                className="ticket-swiper"
              >
                {tickets.map((ticket) => (
                  <SwiperSlide key={ticket.id}>
                    <div className="ticket-card">
                      <div className="tm-icon"></div>
                      <div className="ticket-header">
                        <div className="ticket-type-label">{ticket.ticketType}</div>
                        {renderSeatInfo(ticket)}
                      </div>
                      <div 
                        className="ticket-image"
                        style={{ backgroundImage: `url('${ticket.bannerImage}')` }}
                      >
                        <div className="ticket-image-overlay">
                          <div className="event-title">{ticket.eventTitle}</div>
                          <div className="event-details">{ticket.eventDate} • {ticket.eventVenue}</div>
                        </div>
                      </div>
                      {renderCountdownOrViewTicket(ticket)}
                      <a href="/ticket-details" className="ticket-details-link">
                        View Ticket Details
                      </a>
                      <div className="ticket-card-underline"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="transfer-button" onClick={handleTransfer}>
                Transfer
              </button>
              <button className="sell-button" onClick={handleSell}>
                Sell
              </button>
            </div>

            {/* Map Section */}
            <div className="map-section">
              <div className="map-content" id="mapContent">
                <div className="static-map">
                  <div className="venue-info">
                    <h3>{tickets[0]?.eventVenue || 'Chase Center'}</h3>
                    <p>{tickets[0]?.eventVenue || 'Chase Center'}, San Francisco, CA</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(tickets[0]?.eventVenue + ', San Francisco, CA')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add-ons Modal */}
      {showAddonsModal && (
        <div className="modal-overlay" onClick={() => setShowAddonsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ticket Add-ons</h2>
              <span className="close-modal" onClick={() => setShowAddonsModal(false)}>×</span>
            </div>
            <div className="addon-list">
              {addons.map((addon, index) => (
                <div key={index} className="addon-item">
                  <div className="addon-name">{addon.name}</div>
                  <div className="addon-status">
                    {addon.included ? 'Included' : 'Not Included'}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button onClick={() => window.location.href = '/for-you'}>
                Customize Add-ons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="transfer-modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="transfer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="transfer-header">
              <h2>SELECT TICKETS TO TRANSFER</h2>
            </div>
            
            <div className="safety-message">
              <div className="info-icon">i</div>
              <div className="safety-text">
                Only transfer tickets to people you know and trust to ensure everyone stays safe
              </div>
            </div>

            <div className="transfer-section-info">
              <div className="section-row">
                Sec {tickets[0]?.section}, Row {tickets[0]?.row}
              </div>
              <div className="ticket-count">{tickets.length} Tickets</div>
            </div>

            <div className="transfer-seats">
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="seat-option">
                  <button className="seat-button">
                    {ticket.seatType === 'General Admission' ? 'GA TICKET' : `SEAT ${ticket.seat}`}
                  </button>
                  <div 
                    className={`seat-checkbox ${selectedSeats.includes(ticket.seat) ? 'selected' : ''}`}
                    onClick={() => toggleSeatSelection(ticket.seat)}
                  ></div>
                </div>
              ))}
            </div>

            <div className="transfer-footer">
              <div className="selected-count">{selectedSeats.length} Selected</div>
              <button 
                className="transfer-to-btn"
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  setShowTransferModal(false);
                  alert('Transfer functionality would continue here');
                }}
              >
                TRANSFER TO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
