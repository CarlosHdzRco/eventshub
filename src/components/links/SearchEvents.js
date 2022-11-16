import React, { useState, useEffect } from 'react';
import Map, { Popup, Marker } from 'react-map-gl';
import mapPin from '../../images/mappin.png'
import Button from '@mui/material/Button';

import MapSearch from '../childcomponents/MapSearch'
import MoreInfoDialog from '../childcomponents/MoreInfoDialog';
import EventsList from '../childcomponents/EventsList';
import '../../css/SearchEvents.css'

let coordinates = {
  'Nashville': [[-86.917648, 36.011851], [-86.542364, 36.284438]],
  'Richmond': [[-77.655329, 37.403857], [-77.270649, 37.655558]],
  'Atlanta': [[-84.582367, 33.636082], [-84.119568, 33.945897]]
}

function SearchEvents() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState({})
  const [eventsList, setEventsList] = useState([])
  const [city, setCity] = useState('Nashville');
  const [open, setOpen] = React.useState(false);

  const openPopUp = (e, eventObj) => {
    e.originalEvent.stopPropagation();
    setSelectedMarker(eventObj)
    setShowPopup(true)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (

    <>
      <MapSearch setEventsList={setEventsList} city={city} setCity={setCity} />

      <MoreInfoDialog open={open} selectedMarker={selectedMarker} setOpen={setOpen}/>

      <div className='mapListFlex'>
        <div>
          <Map
            reuseMaps={true}
            initialViewState={{
              longitude: -86.7816016,
              latitude: 36.1626638,
              zoom: 0
            }}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            style={{width: 600, height: 600}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            maxBounds={coordinates[city]}>


              {eventsList.map((eventObj) => {
                    return (
                      <Marker key={eventObj.event_id} longitude={eventObj.longitude} latitude={eventObj.latitude} anchor="bottom" onClick={(e) => openPopUp(e, eventObj)}>
                          <img src={mapPin} height='30px'/>
                      </Marker>
                    ) 
                  })}

              {showPopup && 
                (<Popup 
                  focusAfterOpen={true}
                  longitude={selectedMarker.longitude}
                  latitude={selectedMarker.latitude}
                  onClose={() => setShowPopup(false)}>
                  <h3>Title: {selectedMarker.title}</h3>

                  <h5>Date: {selectedMarker.month-1}-{selectedMarker.day}-{selectedMarker.year}</h5>
                  <h5>Time: {selectedMarker.hour}:{selectedMarker.minute}</h5>
                  <p>Host: {selectedMarker.user_id}</p>
                  <Button variant='contained' onClick={handleClickOpen}>More Info</Button>
                  <Button variant='contained' color='error' >Add Event</Button>

              </Popup>)}
              
          </Map>
        </div>
        <div>
          <EventsList eventsList={eventsList} setSelectedMarker={setSelectedMarker} setShowPopup={setShowPopup} />
        </div>
        
      </div>
    </>
    
  )
}

export default SearchEvents;