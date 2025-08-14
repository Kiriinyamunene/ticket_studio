import React, { useState } from 'react';
import { Home, Settings, User, Download } from 'lucide-react';

interface EventData {
  eventName: string;
  venue: string;
  date: string;
  time: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  price: string;
  category: string;
  eventImage: string | null;
  additionalNotes: string;
}

const Index = () => {
  const [eventData, setEventData] = useState<EventData>({
    eventName: 'Sample Concert',
    venue: 'Madison Square Garden',
    date: '2024-12-31',
    time: '20:00',
    seatSection: 'GAFLR',
    seatRow: '',
    seatNumber: '',
    price: '$150.00',
    category: 'concert',
    eventImage: null,
    additionalNotes: ''
  });

  const [successMessage, setSuccessMessage] = useState(false);

  const handleInputChange = (field: keyof EventData, value: string | null) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('eventImage', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetApp = () => {
    setEventData({
      eventName: '',
      venue: '',
      date: '',
      time: '',
      seatSection: '',
      seatRow: '',
      seatNumber: '',
      price: '',
      category: 'concert',
      eventImage: null,
      additionalNotes: ''
    });
  };

  const saveSettings = () => {
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const formatDate = (date: string) => {
    if (!date) return 'Select Date';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    if (!time) return 'Select Time';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="back-button" onClick={() => window.history.back()}>Back</div>
        <div className="page-title" style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          Customize Tickets
        </div>
        <button 
          onClick={resetApp}
          style={{
            background: '#ff4d4d',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Reset App
        </button>
      </div>
      
      {/* Container */}
      <div className="container" style={{ overflowY: 'auto', height: 'calc(100% - 50px)' }}>
        {/* Success Message */}
        {successMessage && (
          <div className="success-message" style={{ display: 'block' }}>
            Settings saved successfully! Your tickets have been updated.
          </div>
        )}
        
        {/* Live Preview Section */}
        <div className="preview-section">
          <div className="preview-title">Live Preview</div>
          <div className="ticket-preview">
            <div className="ticket-header">
              <div className="ticket-type-label">American Express® Presale</div>
              <div className="seat-info-container">
                {eventData.seatSection && eventData.seatRow && eventData.seatNumber ? (
                  <>
                    <div className="seat-column">
                      <div className="seat-label">SECTION</div>
                      <div className="seat-value">{eventData.seatSection}</div>
                    </div>
                    <div className="seat-column">
                      <div className="seat-label">ROW</div>
                      <div className="seat-value">{eventData.seatRow}</div>
                    </div>
                    <div className="seat-column">
                      <div className="seat-label">SEAT</div>
                      <div className="seat-value">{eventData.seatNumber}</div>
                    </div>
                  </>
                ) : (
                  <div className="general-admission-layout">
                    <div className="seat-column">
                      <div className="seat-label">SECTION</div>
                      <div className="seat-value">{eventData.seatSection || 'GAFLR'}</div>
                    </div>
                    <div className="general-admission-text">GENERAL ADMISSION</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ticket Image */}
            {eventData.eventImage && (
              <div 
                className="ticket-image-preview" 
                style={{ backgroundImage: `url(${eventData.eventImage})` }}
              >
                <div className="ticket-image-overlay">
                  <div className="event-title-preview">{eventData.eventName || 'Event Name'}</div>
                  <div className="event-details-preview">
                    {formatDate(eventData.date)} • {formatTime(eventData.time)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Ticket Info */}
            <div className="ticket-section-info">
              <div>
                <div className="section-label">{eventData.venue || 'Venue Name'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {formatDate(eventData.date)} • {formatTime(eventData.time)}
                </div>
              </div>
              <div className="ticket-type">
                {eventData.category.charAt(0).toUpperCase() + eventData.category.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div className="section-title">Event Details</div>
          
          <div className="form-group">
            <label htmlFor="eventName">Event Name *</label>
            <input
              type="text"
              id="eventName"
              value={eventData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              placeholder="Enter event name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue *</label>
            <input
              type="text"
              id="venue"
              value={eventData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              placeholder="Enter venue name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={eventData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <input
              type="time"
              id="time"
              value={eventData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={eventData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              value={eventData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="$99.00"
            />
          </div>
        </div>

        {/* Seating Information */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div className="section-title">Seating Information</div>
          
          <div className="form-group">
            <label htmlFor="seatSection">Section</label>
            <input
              type="text"
              id="seatSection"
              value={eventData.seatSection}
              onChange={(e) => handleInputChange('seatSection', e.target.value)}
              placeholder="A1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="seatRow">Row</label>
            <input
              type="text"
              id="seatRow"
              value={eventData.seatRow}
              onChange={(e) => handleInputChange('seatRow', e.target.value)}
              placeholder="12"
            />
          </div>

          <div className="form-group">
            <label htmlFor="seatNumber">Seat Number</label>
            <input
              type="text"
              id="seatNumber"
              value={eventData.seatNumber}
              onChange={(e) => handleInputChange('seatNumber', e.target.value)}
              placeholder="15"
            />
          </div>
        </div>

        {/* Event Image */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div className="section-title">Event Image</div>
          
          <div className="form-group">
            <label htmlFor="eventImage">Upload Image</label>
            <input
              type="file"
              id="eventImage"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {eventData.eventImage && (
              <div 
                className="preview-image" 
                style={{ backgroundImage: `url(${eventData.eventImage})` }}
              />
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div className="section-title">Additional Information</div>
          
          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              value={eventData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Special instructions or notes..."
              rows={3}
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          className="button"
          onClick={saveSettings}
        >
          Save Settings
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <a href="#" className="nav-item active">
          <Home size={20} />
          Home
        </a>
        <a href="#" className="nav-item">
          <Settings size={20} />
          Settings
        </a>
        <a href="#" className="nav-item">
          <Download size={20} />
          Download
        </a>
        <a href="#" className="nav-item">
          <User size={20} />
          Profile
        </a>
      </div>
    </div>
  );
};

export default Index;
