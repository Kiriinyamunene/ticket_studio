import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './MyEvents.css';

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticketCount: string;
  imageUrl: string;
  ticketType: string;
  section: string;
  row: string;
  seat: string;
  seatType: string;
  ticketPrice: string;
  venueImage?: string;
  venueLocation?: string;
}

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  useEffect(() => {
    loadEvents();
    
    // Set background image from localStorage
    const bannerImage = localStorage.getItem('bannerImage');
    if (bannerImage) {
      document.documentElement.style.setProperty('--event-banner-image', `url('${bannerImage}')`);
    }
  }, []);

  const loadEvents = () => {
    // Load events from localStorage (created from Index page)
    const eventName = localStorage.getItem('eventName');
    const venue = localStorage.getItem('venue');
    const date = localStorage.getItem('date');
    const time = localStorage.getItem('time');
    const ticketCount = localStorage.getItem('ticketCount') || '1';
    const bannerImage = localStorage.getItem('bannerImage');
    const ticketType = localStorage.getItem('ticketType') || 'General Sale';
    const seatSection = localStorage.getItem('seatSection') || 'GAFL';
    const seatRow = localStorage.getItem('seatRow') || '';
    const seat = localStorage.getItem('seat') || '';
    const seatType = localStorage.getItem('seatType') || 'General Admission';
    const ticketPrice = localStorage.getItem('ticketPrice') || '89.50';
    const venueLocation = localStorage.getItem('venueLocation') || '';

    const eventsList: Event[] = [];

    // Only add event if we have the basic required data
    if (eventName && venue && date && time) {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const fullDate = `${formattedDate}, ${formattedTime}`;

      eventsList.push({
        id: '1',
        title: eventName,
        date: fullDate,
        venue: venue,
        ticketCount: ticketCount,
        imageUrl: bannerImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        ticketType: ticketType,
        section: seatSection,
        row: seatRow,
        seat: seat,
        seatType: seatType,
        ticketPrice: ticketPrice,
        venueLocation: venueLocation
      });
    }

    // Add sample events if no custom events exist
    if (eventsList.length === 0) {
      eventsList.push({
        id: '1',
        title: 'BILLIE EILISH: HIT ME HARD AND SOFT: THE TOUR',
        date: 'Sat, Nov 22, 7:00 PM',
        venue: 'Chase Center',
        ticketCount: '2',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        ticketType: 'American Express® Presale',
        section: 'GAFLR',
        row: '22',
        seat: '24',
        seatType: 'Reserved Seating',
        ticketPrice: '89.50'
      });
    }

    setEvents(eventsList);
    updateCounts(eventsList);
  };

  const updateCounts = (eventsList: Event[]) => {
    const now = new Date();
    let upcoming = 0;
    let past = 0;

    eventsList.forEach(event => {
      const eventDate = parseEventDate(event.date);
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      if (eventDateOnly >= nowDateOnly) {
        upcoming++;
      } else {
        past++;
      }
    });

    setUpcomingCount(upcoming);
    setPastCount(past);
  };

  const parseEventDate = (dateStr: string): Date => {
    try {
      const parts = dateStr.split(',');
      if (parts.length >= 3) {
        const monthDay = parts[1].trim().split(' ');
        const month = monthDay[0];
        const day = parseInt(monthDay[1]);
        
        let year = new Date().getFullYear();
        let timeStr = parts[2].trim();
        
        if (parts.length >= 4 && /^\d{4}$/.test(parts[2].trim())) {
          year = parseInt(parts[2].trim());
          timeStr = parts[3].trim();
        }
        
        const timeParts = timeStr.split(' ');
        let time = timeParts[0];
        const ampm = timeParts[1];
        
        const months: { [key: string]: number } = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        
        const monthNum = months[month];
        const [hours, minutes] = time.split(':').map(Number);
        
        const eventDate = new Date(year, monthNum, day);
        
        let adjustedHours = hours;
        if (ampm === 'PM' && hours < 12) adjustedHours += 12;
        if (ampm === 'AM' && hours === 12) adjustedHours = 0;
        
        eventDate.setHours(adjustedHours, minutes, 0, 0);
        
        return eventDate;
      }
      
      return new Date(dateStr);
    } catch (e) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      return futureDate;
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return events.filter(event => {
      const eventDate = parseEventDate(event.date);
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      if (activeTab === 'upcoming') {
        return eventDateOnly >= nowDateOnly;
      } else {
        return eventDateOnly < nowDateOnly;
      }
    }).sort((a, b) => {
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      return activeTab === 'upcoming' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  };

  const handleEventClick = (event: Event) => {
    // Store the selected event data in localStorage for My Tickets page
    localStorage.setItem('selectedEventId', event.id);
    localStorage.setItem('selectedEventTitle', event.title);
    localStorage.setItem('selectedEventDate', event.date);
    localStorage.setItem('selectedEventVenue', event.venue);
    localStorage.setItem('selectedEventImage', event.imageUrl);
    localStorage.setItem('selectedEventTicketCount', event.ticketCount);
    localStorage.setItem('selectedEventTicketType', event.ticketType);
    localStorage.setItem('selectedEventSection', event.section);
    localStorage.setItem('selectedEventRow', event.row);
    localStorage.setItem('selectedEventSeat', event.seat);
    localStorage.setItem('selectedEventSeatType', event.seatType);
    localStorage.setItem('selectedEventTicketPrice', event.ticketPrice);
    localStorage.setItem('selectedEventVenueLocation', event.venueLocation || '');
    
    // Navigate to My Tickets page
    window.location.href = '/my-tickets';
  };

  const handleHelpClick = () => {
    // Navigate to help/create event page
    console.log('Help clicked');
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="my-events-page">
      {/* Header */}
      <div className="header">
        <h1>My Events</h1>
        <button 
          onClick={handleHelpClick}
          className="help-button"
        >
          Help
        </button>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
        >
          UPCOMING ({upcomingCount})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
        >
          PAST ({pastCount})
        </button>
      </div>
      
      {/* Events Container */}
      <div className="events-container">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any {activeTab} events.</p>
            {activeTab === 'upcoming' && (
              <p>Tap "Help" to create a new event.</p>
            )}
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="event-card"
            >
              <div
                className="event-background"
                style={{
                  backgroundImage: `url(${event.imageUrl})`
                }}
              />
              <div className="event-overlay">
                <div className="event-title">
                  {event.title}
                </div>
                <div className="event-details">
                  {event.date} • {event.venue}
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                  className="ticket-count-link"
                >
                  <Calendar size={16} />
                  {event.ticketCount} Tickets
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvents;
