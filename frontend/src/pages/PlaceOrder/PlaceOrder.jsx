import React from 'react'
import OpenStreetMap from '../../components/OpenStreetMap/OpenStreetMap'



const PlaceOrder = () => {
  const center = [0,0]
  return (
    <div>
      
      <h1>Select Your Location</h1>
      <OpenStreetMap center={center}/>
    </div>
  )
}

export default PlaceOrder
