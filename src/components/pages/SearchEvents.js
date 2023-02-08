import React, { useState, useEffect } from 'react';
import Map, { Popup, Marker } from 'react-map-gl';
import { useNavigate } from 'react-router-dom'
import mapPin from '../../images/mappin.png'
import Button from '@mui/material/Button';

import MapSearch from '../childcomponents/MapSearch'
import MoreInfoDialog from '../childcomponents/MoreInfoDialog';
import EventsList from '../childcomponents/EventsList';
import '../../css/SearchEvents.css'
import HostNavbar from '../layout/navbars/HostNavbar';
import UserNavbar from '../layout/navbars/UserNavbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



let coordinates = {
  'Nashville': [[-86.917648, 36.011851], [-86.542364, 36.284438]],
  'Richmond': [[-77.655329, 37.403857], [-77.270649, 37.655558]],
  'Atlanta': [[-84.582367, 33.636082], [-84.119568, 33.945897]]
}

let markerCoordinates = {
  'Nashville': {lat: 36.16, lng: -86.78},
  'Richmond': {lat: 37.536919, lng: -77.434132},
  'Atlanta': {lat: 33.766452, lng: -84.397659}
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SearchEvents() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState({})
  const [eventsList, setEventsList] = useState([])
  const [city, setCity] = useState('Atlanta');
  const [open, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    if(sessionStorage.getItem('eventsHubInfo') === null) {
      navigate('/signin')
    }

    if(sessionStorage.getItem('eventsHubInfo') !== null) {
      setCity(JSON.parse(sessionStorage.getItem('eventsHubInfo')).city)
    } 

  }, [])
  


  const openPopUp = (e, eventObj) => {
    e.originalEvent.stopPropagation();
    setSelectedMarker(eventObj)
    setShowPopup(true)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMessage(false);
  };

  const handleAddEvent = async () => {
        
    await fetch('https://events-hub-db.herokuapp.com/addparticipant', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({event_id: String(selectedMarker.id), user_id: JSON.parse(sessionStorage.getItem('eventsHubInfo')).username})
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log('data: ',data);

      if(data.status === 'added') {
        // alert("Event Added")
        setColor('success')
        setMessage('Event Added!')
        setOpenMessage(true)
      }
      else if(data.status === 'exists') {
        // alert("Event Already Added")
        setColor('error')
        setMessage('Event Already Added!')
        setOpenMessage(true)
      }
      else if(data.status === 'not added') {
        // alert("Event Not Added")
        setColor('error')
        setMessage('Event Not Added!')
        setOpenMessage(true)
      }
    })

  }

  if(sessionStorage.getItem('eventsHubInfo') != null){

    return (

      <>
        {JSON.parse(sessionStorage.getItem('eventsHubInfo')).host
        ? <HostNavbar />
        : <UserNavbar />
        }
        <div className='events-title'><h1>Search Events</h1></div>
        <MapSearch setEventsList={setEventsList} city={city} setCity={setCity} />

        <MoreInfoDialog open={open} selectedMarker={selectedMarker} setOpen={setOpen}/>

        <div className='mapListFlex'>
          <div>
            <Map id='searchMapStyling'
              reuseMaps={true}
              initialViewState={{
                longitude: markerCoordinates[city].lng,
                latitude: markerCoordinates[city].lat,
                zoom: 0
              }}
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              style={{width: 600, height: 600}}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              maxBounds={coordinates[city]}>


                {eventsList.map((eventObj) => {
                      return (
                        <Marker key={eventObj.id} longitude={eventObj.longitude} latitude={eventObj.latitude} anchor="bottom" onClick={(e) => openPopUp(e, eventObj)}>
                            <img src={mapPin} height='30px' alt='map pin'/>
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
                    <Button variant='contained' color='error' onClick={handleAddEvent} >Add Event</Button>

                </Popup>)}
                
            </Map>
          </div>
          <div>
            <EventsList eventsList={eventsList} setSelectedMarker={setSelectedMarker} setShowPopup={setShowPopup} />
          </div>
        </div>
        <Snackbar open={openMessage} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={color} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </>
      
    )
  }
  else {
    
  }
}

export default SearchEvents;