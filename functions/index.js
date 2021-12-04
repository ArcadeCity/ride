// require('dotenv').config()

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./acride-key.json')
const { MAGICSECRET } = require('./secrets')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

exports.auth = functions.https.onCall(async (data, context) => {
  const { Magic } = require('@magic-sdk/admin')
  const magic = new Magic(MAGICSECRET)
  const didToken = data.didToken
  const metadata = await magic.users.getMetadataByToken(didToken)
  functions.logger.info('User metadata:', { metadata })
  if (!metadata.email) return
  const email = metadata.email
  try {
    /* Get existing user by email address,
       compatible with legacy Firebase email users */
    let user = (await admin.auth().getUserByEmail(email)).toJSON()
    const claim = magic.token.decode(didToken)[1]
    return await handleExistingUser(user, claim)
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      /* Create new user */
      return await handleNewUser(email)
    } else {
      throw err
    }
  }
})

const handleExistingUser = async (user, claim) => {
  /* Check for replay attack (https://go.magic.link/replay-attack) */
  let lastSignInTime = Date.parse(user.metadata.lastSignInTime) / 1000
  let tokenIssuedTime = claim.iat
  if (tokenIssuedTime <= lastSignInTime) {
    throw new functions.https.HttpsError('invalid-argument', 'This DID token is invalid.')
  }
  let firebaseToken = await admin.auth().createCustomToken(user.uid)
  return {
    uid: user.uid,
    token: firebaseToken,
  }
}

const handleNewUser = async (email) => {
  const newUser = await admin.auth().createUser({
    email: email,
    emailVerified: true,
  })
  let firebaseToken = await admin.auth().createCustomToken(newUser.uid)
  return {
    uid: newUser.uid,
    token: firebaseToken,
  }
}
