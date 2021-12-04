import { useEffect } from 'react'

export default function ArcadeMap() {
  let harp
  if (typeof window !== 'undefined') {
    // @ts-ignore
    harp = window.harp as any
  } else {
    harp = null
  }

  useEffect(() => {
    const canvas = document.getElementById('map')
    if (!harp) return
    const mapView = new harp.MapView({
      canvas,
      theme: 'resources/arcade.json',
    })

    // center the camera to RJ
    mapView.lookAt({
      target: new harp.GeoCoordinates(-22.931363110413354, -43.183705305311655),
      zoomLevel: 18,
      tilt: 40,
    })

    // const mapControls = new harp.MapControls(mapView)
    // const ui = new harp.MapControlsUI(mapControls)
    // canvas.parentElement.appendChild(ui.domElement)

    mapView.resize(window.innerWidth, window.innerHeight)
    // mapView.renderLabels = false
    window.onresize = () => mapView.resize(window.innerWidth, window.innerHeight)

    // Rotate
    setTimeout(() => {
      mapView.addEventListener(harp.MapViewEventNames.AfterRender, () => {
        mapView.lookAt({
          heading: mapView.heading + 0.02,
        })
        mapView.update()
      })
    }, 1000)

    const vectorTileDataSource = new harp.VectorTileDataSource({
      authenticationCode: '_ZQeCfAB3nJFJ4E7JJ7W-CwSSW3vvUh6032RY85_OVs',
    })
    mapView.addDataSource(vectorTileDataSource)
  }, [harp])

  return (
    <canvas
      id='map'
      style={{
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    ></canvas>
  )
}
