import { Avatar, Box, Button, Skeleton, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { avatarLay, homepage, infoBoxContent, infoBoxIcon, infoBoxLay, infoBoxText, mapLay, myLocationBtn, navLay, searchButton, searchButtonGrp, textField, travelModeLay } from './HomepageStyle'
import { AccessTime, DirectionsBike, DirectionsCar, DirectionsTransit, DirectionsWalk, MyLocation } from '@mui/icons-material';
import { Autocomplete, DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const Homepage = () => {

   // eslint-disable-next-line
   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
      libraries: ['places'],
   })

   const [map, setMap] = useState(null);
   const [directionResponse, setDirectionResponse] = useState(null);
   const [distance, setDistance] = useState("");
   const [duration, setDuration] = useState("");
   const [travelMode, setTravelMode] = useState('DRIVING');

   const originRef = useRef();
   const destinationRef = useRef();
   console.log(directionResponse)


   const center = { lat: 19.0330, lng: 73.0297 }

   async function calculateRoute() {
      if (!isLoaded || originRef.current.value === "" || destinationRef.current.value === "") {
         return
      }

      const directionsService = new window.google.maps.DirectionsService()

      try {
         const result = await directionsService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: window.google.maps.TravelMode[travelMode]
         })

         setDirectionResponse(result)
         setDistance(result.routes[0].legs[0].distance.text)
         setDuration(result.routes[0].legs[0].duration.text)
      } catch (error) {
         console.error('Directions request failed:', error);
      }
   }

   function clearRoute() {
      setDirectionResponse(null)
      setDistance("")
      setDuration("")
      originRef.current.value = ""
      destinationRef.current.value = ""
   }

   useEffect(() => {
      if (originRef.current?.value && destinationRef.current?.value) {
         calculateRoute();
      }
      // eslint-disable-next-line
   }, [travelMode]);

   if (!isLoaded) {
      return <Skeleton variant="rectangular" width={210} />
   }
   return (
      <Box sx={homepage}>
         <Box sx={mapLay}>
            <GoogleMap
               mapContainerStyle={{ width: '100%', height: '100%'}}
               center={center}
               zoom={13}
               onLoad={(map) => setMap(map)}
            >
               <Marker position={center} />
               <Marker position={center} />
               {directionResponse && <DirectionsRenderer directions={directionResponse} />}
            </GoogleMap>
         </Box>

         <Box sx={navLay}>
            <Box sx={{ padding: '30px 20px' }}>
               <Autocomplete>
                  <TextField sx={textField} label="From" variant="outlined" size="small" inputRef={originRef} fullWidth />
               </Autocomplete>

               <Autocomplete>
                  <TextField sx={textField} label="To" variant="outlined" size="small" inputRef={destinationRef} fullWidth />
               </Autocomplete>
               <Box sx={searchButtonGrp} >
                  <Button variant="contained" fullWidth onClick={calculateRoute}>Search</Button>
                  <Button variant="contained" sx={myLocationBtn} onClick={() => map.panTo(center)}><MyLocation fontSize='small' /></Button>
               </Box>
               <Button sx={searchButton} variant="contained" color="error" fullWidth onClick={clearRoute}>Cancel</Button>

               <Box sx={travelModeLay}>
                  <Button variant='contained' onClick={() => setTravelMode('DRIVING')}><DirectionsCar /></Button>
                  <Button variant='contained' onClick={() => setTravelMode('TRANSIT')}><DirectionsTransit /></Button>
                  <Button variant='contained' onClick={() => setTravelMode('WALKING')}><DirectionsWalk /></Button>
               </Box>

               <Box sx={infoBoxLay}>
                  <Box sx={infoBoxContent} borderRadius={2}>
                     <Typography sx={infoBoxText}>{distance ? distance : '0 km'}</Typography>
                  </Box>
                  <Avatar sx={avatarLay}>
                     {/* <i className="fa-solid fa-car-side fa-xl"></i> */}
                     {travelMode === "DRIVING" && <DirectionsCar fontSize='large' />}
                     {travelMode === "BICYCLING" && <DirectionsBike fontSize='large' />}
                     {travelMode === "TRANSIT" && <DirectionsTransit fontSize='large' />}
                     {travelMode === "WALKING" && <DirectionsWalk fontSize='large' />}
                  </Avatar>
               </Box>

               <Box sx={infoBoxLay}>
                  <Box sx={infoBoxContent} borderRadius={2}>
                     <Typography sx={infoBoxText}>{duration ? duration : '0 min'}</Typography>
                  </Box>
                  <Avatar sx={avatarLay}>
                     <AccessTime sx={infoBoxIcon} />
                  </Avatar>
               </Box>

            </Box>
         </Box>
      </Box>
   )
}

export default Homepage