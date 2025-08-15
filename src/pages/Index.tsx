import React, { useState, useEffect } from 'react';


interface EventData {
  eventName: string;
  venue: string;
  date: string;
  time: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  seatType: string;
  entryLevel: string;
  ticketCount: string;
  price: string;
  ticketType: string;
  customTicketType?: string;
  eventImage: string | null;
  venueLocation: string;
  venueImage: string | null;
  mapLocation: string;
  vipEarlyEntry: boolean;
  merchPackage: boolean;
  premiumParking: boolean;
  ticketPrice: string;
  serviceFee: string;
  facilityCharge: string;
  processingFee: string;
  paymentDate: string;
  countdownTarget: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  showCountdown: boolean;
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
    seatType: 'General Admission',
    entryLevel: '',
    ticketCount: '1',
    price: '$150.00',
    ticketType: 'American Express® Presale',
    customTicketType: '',
    eventImage: null,
    venueLocation: '',
    venueImage: null,
    mapLocation: 'Chase Center, San Francisco CA',
    vipEarlyEntry: false,
    merchPackage: false,
    premiumParking: false,
    ticketPrice: '89.50',
    serviceFee: '15.75',
    facilityCharge: '5.00',
    processingFee: '5.50',
    paymentDate: '',
    countdownTarget: '',
    countdownDays: '179',
    countdownHours: '08',
    countdownMinutes: '36',
    countdownSeconds: '11',
    showCountdown: true
  });

  const [successMessage, setSuccessMessage] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate countdown from target date/time
  const calculateCountdown = () => {
    if (!eventData.countdownTarget) {
      return {
        days: parseInt(eventData.countdownDays) || 0,
        hours: parseInt(eventData.countdownHours) || 0,
        minutes: parseInt(eventData.countdownMinutes) || 0,
        seconds: parseInt(eventData.countdownSeconds) || 0
      };
    }

    const targetDate = new Date(eventData.countdownTarget);
    const timeDifference = targetDate.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const countdown = calculateCountdown();

  const handleInputChange = (field: keyof EventData, value: string | null) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof EventData, checked: boolean) => {
    setEventData(prev => ({
      ...prev,
      [field]: checked
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

  const handleVenueImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('venueImage', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTargetDateTimeChange = (value: string) => {
    handleInputChange('countdownTarget', value);
    
    if (value) {
      const targetDate = new Date(value);
      const now = new Date();
      const timeDifference = targetDate.getTime() - now.getTime();
      
      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        // Update manual countdown fields
        handleInputChange('countdownDays', days.toString());
        handleInputChange('countdownHours', hours.toString().padStart(2, '0'));
        handleInputChange('countdownMinutes', minutes.toString().padStart(2, '0'));
        handleInputChange('countdownSeconds', seconds.toString().padStart(2, '0'));
      }
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
      seatType: 'General Admission',
      entryLevel: '',
      ticketCount: '1',
      price: '',
      ticketType: 'American Express® Presale',
      customTicketType: '',
      eventImage: null,
      venueLocation: '',
      venueImage: null,
      mapLocation: 'Chase Center, San Francisco CA',
      vipEarlyEntry: false,
      merchPackage: false,
      premiumParking: false,
      ticketPrice: '89.50',
      serviceFee: '15.75',
      facilityCharge: '5.00',
      processingFee: '5.50',
      paymentDate: '',
      countdownTarget: '',
      countdownDays: '179',
      countdownHours: '08',
      countdownMinutes: '36',
      countdownSeconds: '11',
      showCountdown: true
    });
  };

  const saveSettings = () => {
    // Save all event data to localStorage
    localStorage.setItem('eventName', eventData.eventName);
    localStorage.setItem('venue', eventData.venue);
    localStorage.setItem('date', eventData.date);
    localStorage.setItem('time', eventData.time);
    localStorage.setItem('ticketCount', eventData.ticketCount);
    localStorage.setItem('ticketType', eventData.ticketType);
    localStorage.setItem('seatSection', eventData.seatSection);
    localStorage.setItem('seatRow', eventData.seatRow);
    localStorage.setItem('seatNumber', eventData.seatNumber);
    localStorage.setItem('seatType', eventData.seatType);
    localStorage.setItem('ticketPrice', eventData.ticketPrice);
    localStorage.setItem('venueLocation', eventData.venueLocation);
    
    // Save banner image
    if (eventData.eventImage) {
      localStorage.setItem('bannerImage', eventData.eventImage);
    }
    
    // Save countdown data
    if (eventData.countdownTarget) {
      localStorage.setItem('countdownTargetDate', eventData.countdownTarget);
    }
    
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
               <div className="ticket-type-label">{eventData.ticketType}</div>
                             <div className="seat-info-container">
                 {eventData.seatType === "General Admission" ? (
                   <div className="general-admission-layout">
                     <div className="seat-column">
                       <div className="seat-label">SECTION</div>
                       <div className="seat-value">{eventData.seatSection || 'GAFLR'}</div>
                     </div>
                     <div className="general-admission-text">GENERAL ADMISSION</div>
                   </div>
                 ) : (
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
                 )}
               </div>
            </div>
            
                         {/* Ticket Image with Info Overlay */}
             {eventData.eventImage && (
               <div 
                 className="ticket-image-preview" 
                 style={{ backgroundImage: `url(${eventData.eventImage})` }}
               >
                 <div className="ticket-image-overlay">
                   <div className="event-title-preview">{eventData.eventName || 'Event Name'}</div>
                   <div className="event-details-preview">
                     {formatDate(eventData.date)} • {formatTime(eventData.time)} • {eventData.venue || 'Venue Name'}
                   </div>
                 </div>
               </div>
             )}
            
                         {/* Countdown Timer */}
             {eventData.showCountdown && (
               <div className="countdown-timer" style={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 padding: '10px 15px',
                 backgroundColor: 'white',
                 borderTop: '1px solid #e9ecef'
               }}>
                 <div style={{ textAlign: 'center', flex: '1' }}>
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>
                     {countdown.days.toString().padStart(2, '0')}
                   </div>
                   <div style={{ fontSize: '10px', color: '#000' }}>Days</div>
                 </div>
                 <div style={{ textAlign: 'center', flex: '1' }}>
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>
                     {countdown.hours.toString().padStart(2, '0')}
                   </div>
                   <div style={{ fontSize: '10px', color: '#000' }}>Hours</div>
                 </div>
                 <div style={{ textAlign: 'center', flex: '1' }}>
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>
                     {countdown.minutes.toString().padStart(2, '0')}
                   </div>
                   <div style={{ fontSize: '10px', color: '#000' }}>Minutes</div>
                 </div>
                 <div style={{ textAlign: 'center', flex: '1' }}>
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>
                     {countdown.seconds.toString().padStart(2, '0')}
                   </div>
                   <div style={{ fontSize: '10px', color: '#000' }}>Seconds</div>
                 </div>
               </div>
             )}
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
            <label htmlFor="ticketType">Ticket Type</label>
            <select
              id="ticketType"
              value={eventData.ticketType}
              onChange={(e) => handleInputChange('ticketType', e.target.value)}
            >
              <option value="American Express® Presale">American Express® Presale</option>
              <option value="Verified Fan Presale">Verified Fan Presale</option>
              <option value="General Sale">General Sale</option>
              <option value="VIP Package">VIP Package</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          {eventData.ticketType === "Custom" && (
            <div className="form-group" id="customTicketTypeGroup">
              <label htmlFor="customTicketType">Custom Ticket Type</label>
              <input
                type="text"
                id="customTicketType"
                placeholder="Enter your custom ticket type"
                value={eventData.customTicketType || ""}
                onChange={(e) => handleInputChange('customTicketType', e.target.value)}
              />
            </div>
          )}

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
           <div className="section-title">Seat Information</div>
           
           <div className="form-group">
             <label htmlFor="seatSection">Section</label>
             <input
               type="text"
               id="seatSection"
               value={eventData.seatSection}
               onChange={(e) => handleInputChange('seatSection', e.target.value)}
               placeholder="e.g., GAFLR"
             />
           </div>

           <div className="form-group">
             <label htmlFor="seatType">Seat Type</label>
             <select
               id="seatType"
               value={eventData.seatType || "General Admission"}
               onChange={(e) => handleInputChange('seatType', e.target.value)}
             >
               <option value="General Admission">General Admission</option>
               <option value="Reserved Seating">Reserved Seating</option>
               <option value="VIP Seating">VIP Seating</option>
               <option value="Floor Seating">Floor Seating</option>
               <option value="Balcony">Balcony</option>
             </select>
           </div>

           <div className="form-group">
             <label htmlFor="entryLevel">Entry Level Seat Label</label>
             <input
               type="text"
               id="entryLevel"
               value={eventData.entryLevel || ""}
               onChange={(e) => handleInputChange('entryLevel', e.target.value)}
               placeholder="e.g., Mobile Entry, Entry Level Seat, Lower Section"
             />
           </div>

           {(eventData.seatType === "Reserved Seating" || eventData.seatType === "VIP Seating" || eventData.seatType === "Floor Seating" || eventData.seatType === "Balcony") && (
             <>
               <div className="form-group seat-details">
                 <label htmlFor="seatRow">Row</label>
                 <input
                   type="text"
                   id="seatRow"
                   value={eventData.seatRow}
                   onChange={(e) => handleInputChange('seatRow', e.target.value)}
                   placeholder="e.g., 22"
                 />
               </div>

               <div className="form-group seat-details">
                 <label htmlFor="seatNumber">Seat</label>
                 <input
                   type="text"
                   id="seatNumber"
                   value={eventData.seatNumber}
                   onChange={(e) => handleInputChange('seatNumber', e.target.value)}
                   placeholder="e.g., 24"
                 />
               </div>
             </>
           )}

           <div className="form-group">
             <label htmlFor="ticketCount">Number of Tickets</label>
             <input
               type="number"
               id="ticketCount"
               min="1"
               max="10"
               value={eventData.ticketCount || 1}
               onChange={(e) => handleInputChange('ticketCount', e.target.value)}
             />
           </div>
                   </div>

         {/* Countdown Timer */}
         <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
           <div className="section-title">Countdown Timer</div>
           
                       <div className="form-group">
              <label htmlFor="countdownTarget">Set Target Date and Time</label>
              <input
                type="datetime-local"
                id="countdownTarget"
                value={eventData.countdownTarget}
                onChange={(e) => handleTargetDateTimeChange(e.target.value)}
              />
            </div>
           
           <div className="form-group">
             <label>Or set time remaining manually:</label>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
               <input
                 type="number"
                 id="countdownDays"
                 placeholder="Days"
                 min="0"
                 value={eventData.countdownDays}
                 onChange={(e) => handleInputChange('countdownDays', e.target.value)}
                 style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
               />
               <input
                 type="number"
                 id="countdownHours"
                 placeholder="Hours"
                 min="0"
                 max="23"
                 value={eventData.countdownHours}
                 onChange={(e) => handleInputChange('countdownHours', e.target.value)}
                 style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
               />
               <input
                 type="number"
                 id="countdownMinutes"
                 placeholder="Minutes"
                 min="0"
                 max="59"
                 value={eventData.countdownMinutes}
                 onChange={(e) => handleInputChange('countdownMinutes', e.target.value)}
                 style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
               />
               <input
                 type="number"
                 id="countdownSeconds"
                 placeholder="Seconds"
                 min="0"
                 max="59"
                 value={eventData.countdownSeconds}
                 onChange={(e) => handleInputChange('countdownSeconds', e.target.value)}
                 style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
               />
             </div>
           </div>
           
           <div className="form-group">
             <label htmlFor="showCountdownToggle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <input
                 type="checkbox"
                 id="showCountdownToggle"
                 checked={eventData.showCountdown}
                 onChange={(e) => handleCheckboxChange('showCountdown', e.target.checked)}
               />
               Show Countdown Timer for This Event
             </label>
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

                 {/* Venue Information */}
         <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
           <div className="section-title">Venue Information</div>
           
           <div className="form-group">
             <label htmlFor="eventVenue">Venue Name</label>
             <input
               type="text"
               id="eventVenue"
               value={eventData.venue}
               onChange={(e) => handleInputChange('venue', e.target.value)}
               placeholder="e.g., Chase Center"
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="venueLocation">Venue Location</label>
             <input
               type="text"
               id="venueLocation"
               value={eventData.venueLocation}
               onChange={(e) => handleInputChange('venueLocation', e.target.value)}
               placeholder="e.g., San Francisco, CA"
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="venueImage">Venue Map/Seating Chart (Optional)</label>
             <input
               type="file"
               id="venueImage"
               accept="image/*"
               onChange={handleVenueImageUpload}
             />
             {eventData.venueImage && (
               <div 
                 className="image-preview" 
                 style={{ 
                   width: '100px', 
                   height: '100px', 
                   backgroundImage: `url(${eventData.venueImage})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   border: '1px solid #ddd',
                   borderRadius: '4px',
                   marginTop: '10px'
                 }}
               />
             )}
           </div>
         </div>
         
         {/* Map Settings */}
         <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
           <div className="section-title">Map Settings</div>
           
           <div className="form-group">
             <label htmlFor="mapLocation">Map Location</label>
             <input
               type="text"
               id="mapLocation"
               value={eventData.mapLocation}
               onChange={(e) => handleInputChange('mapLocation', e.target.value)}
               placeholder="e.g., Chase Center, San Francisco CA"
             />
           </div>
         </div>
         
         {/* Add-ons */}
         <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
           <div className="section-title">Add-ons</div>
           
           <div className="form-group">
             <label htmlFor="vipEarlyEntryOption">VIP Early Entry ($25.00)</label>
             <select
               id="vipEarlyEntryOption"
               value={eventData.vipEarlyEntry ? 'true' : 'false'}
               onChange={(e) => handleCheckboxChange('vipEarlyEntry', e.target.value === 'true')}
             >
               <option value="false">Not Included</option>
               <option value="true">Include</option>
             </select>
           </div>
           
           <div className="form-group">
             <label htmlFor="merchPackageOption">Merchandise Package ($45.00)</label>
             <select
               id="merchPackageOption"
               value={eventData.merchPackage ? 'true' : 'false'}
               onChange={(e) => handleCheckboxChange('merchPackage', e.target.value === 'true')}
             >
               <option value="false">Not Included</option>
               <option value="true">Include</option>
             </select>
           </div>
           
           <div className="form-group">
             <label htmlFor="premiumParkingOption">Premium Parking ($30.00)</label>
             <select
               id="premiumParkingOption"
               value={eventData.premiumParking ? 'true' : 'false'}
               onChange={(e) => handleCheckboxChange('premiumParking', e.target.value === 'true')}
             >
               <option value="false">Not Included</option>
               <option value="true">Include</option>
             </select>
           </div>
         </div>
         
         {/* Pricing Information */}
         <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
           <div className="section-title">Pricing Information</div>
           
           <div className="form-group">
             <label htmlFor="ticketPrice">Ticket Price ($)</label>
             <input
               type="number"
               id="ticketPrice"
               min="0"
               step="0.01"
               value={eventData.ticketPrice}
               onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="serviceFee">Service Fee ($)</label>
             <input
               type="number"
               id="serviceFee"
               min="0"
               step="0.01"
               value={eventData.serviceFee}
               onChange={(e) => handleInputChange('serviceFee', e.target.value)}
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="facilityCharge">Facility Charge ($)</label>
             <input
               type="number"
               id="facilityCharge"
               min="0"
               step="0.01"
               value={eventData.facilityCharge}
               onChange={(e) => handleInputChange('facilityCharge', e.target.value)}
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="processingFee">Order Processing Fee ($)</label>
             <input
               type="number"
               id="processingFee"
               min="0"
               step="0.01"
               value={eventData.processingFee}
               onChange={(e) => handleInputChange('processingFee', e.target.value)}
             />
           </div>

           <div className="form-group">
             <label htmlFor="paymentDate">Payment Date</label>
             <input
               type="date"
               id="paymentDate"
               value={eventData.paymentDate}
               onChange={(e) => handleInputChange('paymentDate', e.target.value)}
             />
           </div>
         </div>

                 {/* Save Button */}
         <button 
           className="button"
           onClick={saveSettings}
         >
           Save Changes
         </button>
         <button 
           className="button" 
           style={{ backgroundColor: '#0052cc', marginTop: '10px' }}
           onClick={() => window.location.href='/my-events'}
         >
           View My Events
         </button>
         <button 
           className="button" 
           style={{ backgroundColor: '#1a52ed', marginTop: '10px' }}
           onClick={() => window.location.href='/my-tickets'}
         >
           View My Tickets
         </button>
         <button 
           className="button" 
           style={{ backgroundColor: '#0052cc', marginTop: '10px' }}
           onClick={() => window.location.href='/ticket-details'}
         >
           View Ticket Details
         </button>
         <button 
           className="button" 
           style={{ backgroundColor: '#666', marginTop: '10px' }}
           onClick={() => window.location.href='index.html'}
         >
           Back to Tickets
         </button>
      </div>


    </div>
  );
};

export default Index;
