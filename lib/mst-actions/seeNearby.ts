import { RootStore } from '@lib/mst'

const platform =
  // @ts-ignore
  typeof window !== 'undefined' && !!window.H
    ? // @ts-ignore
      new window.H.service.Platform({
        app_id: 'mxdAQmPG6AhYZPlkir9f',
        apikey: '_ZQeCfAB3nJFJ4E7JJ7W-CwSSW3vvUh6032RY85_OVs',
      })
    : null
const service = platform && platform.getSearchService()

export const seeNearby = async (self: RootStore) => {
  function success(pos) {
    const crd = pos.coords
    const approxLatitude = parseFloat(crd.latitude.toFixed(1))
    const approxLongitude = parseFloat(crd.longitude.toFixed(1))
    console.log(`${approxLatitude}, ${approxLongitude}`)
    self.setCoords({ lat: approxLatitude, lng: approxLongitude })

    service.reverseGeocode(
      {
        at: `${approxLatitude},${approxLongitude}`,
      },
      (result) => {
        result.items.forEach((item) => {
          const pretty = `${item.address.city}, ${item.address.state}`
          console.log(pretty)
          self.setCity(pretty)
          self.setCountryCode(item.address.countryCode)
        })
      },
      alert
    )
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted') {
        console.log(result.state)
        navigator.geolocation.getCurrentPosition(success, error)
        //If granted then you can directly call your function here
      } else if (result.state === 'prompt') {
        console.log(result.state)
        navigator.geolocation.getCurrentPosition(success, error, {
          maximumAge: Infinity,
        })
      } else if (result.state === 'denied') {
        console.log('denied')
        //If denied then you have to show instructions to enable location
      }
      result.onchange = function () {
        console.log(result.state)
      }
    })
  } else {
    alert('Sorry Not available!')
  }
}
