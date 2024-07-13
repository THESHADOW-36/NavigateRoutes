import { Avatar, Box, Button, Skeleton, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { avatarLay, homepage, infoBoxContent, infoBoxIcon, infoBoxLay, infoBoxText, mapLay, myLocationBtn, navLay, searchButton, searchButtonGrp, textField } from './HomepageStyle'
import { AccessTime, MyLocation } from '@mui/icons-material';
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

   const originRef = useRef();
   const destinationRef = useRef();
   console.log(originRef)
   console.log(destinationRef)

   if (!isLoaded) {
      return <Skeleton variant="rectangular" width={210} />
   }

   const center = { lat: 19.0330, lng: 73.0297 }

   async function calculateRoute() {
      if (originRef.current.value === "" || destinationRef.current.value === "") {
         return
      }

      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()


      const result = await directionsService.route({
         origin: originRef.current.value,
         destination: destinationRef.current.value,
         // eslint-disable-next-line no-undef
         travelMode: google.maps.TravelMode.DRIVING
      })
      console.log(result)

      setDirectionResponse(result)
      setDistance(result.routes[0].legs[0].distance.text)
      setDuration(result.routes[0].legs[0].duration.text)
   }

   function clearRoute() {
      setDirectionResponse(null)
      setDistance("")
      setDuration("")
      originRef.current.value = ""
      destinationRef.current.value = ""
   }

   return (
      <Box sx={homepage}>
         <Box sx={mapLay}>
            <GoogleMap
               mapContainerStyle={{ width: '100%', height: '100%' }}
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

               <Box sx={infoBoxLay}>
                  <Box sx={infoBoxContent} borderRadius={2}>
                     <Typography sx={infoBoxText}>{distance ? distance : '0 km'}</Typography>
                  </Box>
                  <Avatar sx={avatarLay}>
                     <i className="fa-solid fa-car-side fa-xl"></i>
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