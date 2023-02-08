
import '../../css/MyEvents.css'

//////////////////

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HostNavbar from '../layout/navbars/HostNavbar';
import ParticipantsDialog from '../childcomponents/ParticipantsDialog';
//import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
//////

export default function EventsICreated() {

  const[eventsList, setEventsList] = useState([])
  const[deleteEvent, setDeleteEvent] = useState(1)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');


  useEffect(() => {
    
    const apiCall = async () => {

      await fetch(`https://events-hub-db.herokuapp.com/eventsicreated?user=${JSON.parse(sessionStorage.getItem('eventsHubInfo')).username}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        setEventsList(data)
      })
    }

    if(sessionStorage.getItem('eventsHubInfo') === null || JSON.parse(sessionStorage.getItem('eventsHubInfo')).host === false) {
      navigate('/signin')
    }
    else {
      apiCall()
    }

  }, [deleteEvent, open])

  const deleteEventClick = async (id) => {
    await fetch(`https://events-hub-db.herokuapp.com/deleteeventicreated/${id}`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log('data: ',data);
    })
    setDeleteEvent(deleteEvent+1)
  }

  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id)
    // console.log('opend')
  };
  
  if(sessionStorage.getItem('eventsHubInfo') !== null && JSON.parse(sessionStorage.getItem('eventsHubInfo')).host === true) {

    return (
      <>
        <HostNavbar />
        <div className='events-container'>
          <div className='events-title'><h1>Events I Created</h1></div>

          <div className='events-grid'>
            {eventsList.map((eventObj, index) => {
              let minute = String(eventObj.minute)
              if(minute.length === 1) {
                minute = '0' + minute
              }
              return ( 
                
                  <Card key={index} className='card-container'>
                    <CardContent>
                      <Typography component={'span'} className='card-title-and-delete' sx={{ fontSize: 11 }} color="text.secondary" gutterBottom>
                        <h1 className='title-text'>{eventObj.title}</h1> <Button style={{width:'5px',height:'20px', color:'grey' }}color="inherit" variant="contained" onClick={() => deleteEventClick(eventObj.id)}>Delete</Button>
                      </Typography>
                      <Typography variant="h5"  component="div">
                      <div className='sub-text-container'>
                        <h5 className='sub-text-description' ><div className='sub-text-title'>What</div></h5>
                        <p className='sub-text-description' > {eventObj.description}</p>
                        </div>
                      </Typography>
                      <Typography variant="h5"  component="div">
                      <div className='sub-text-container'>
                        <h5 className='sub-text-description' ><div className='sub-text-title'>Where</div></h5>
                        <p className='sub-text-description' > {eventObj.latitude.toFixed(2)}, {eventObj.longitude.toFixed(2)}, {eventObj.city}</p>
                        </div>
                      </Typography>
                      <Typography variant="h5"  component="div">
                      <div className='sub-text-container'>
                        <h5 className='sub-text-description' ><div className='sub-text-title'>When</div></h5>
                        <p className='sub-text-description' >{eventObj.hour}:{minute} {eventObj.month}/{eventObj.day}/{eventObj.year} </p>
                        </div>
                      </Typography>
                      <div className='participantButton'>
                        <Button style={{height:20, color: 'grey'}} color="inherit" variant="contained" onClick={() => handleClickOpen(eventObj.id)}>Participants</Button>
                      </div>
                    </CardContent>
                  </Card>
                
              )
              
              
            })}
            
              <ParticipantsDialog open={open} selectedMarker={id} setOpen={setOpen}/>
            
          </div>
      </div>
      

      </>
    )
  }
}