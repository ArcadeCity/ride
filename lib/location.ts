export const checkLocationPermissions = async () => {
  if (navigator.geolocation) {
    try {
      const perms = await navigator.permissions.query({ name: 'geolocation' })
      return perms.state
    } catch (e) {
      console.log(e)
      return 'error'
    }
  } else {
    return 'disabled'
  }
}
