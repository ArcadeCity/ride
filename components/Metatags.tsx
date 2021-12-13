import Head from 'next/head'

export default function Metatags({
  title = 'Arcade City',
  description = 'Peer-to-peer rides and more. Connect freely!',
  image = 'https://images.squarespace-cdn.com/content/v1/619035e2bc35c369ff9b1d15/ac86791a-247a-42cc-8d5b-11c9a77f0c2c/ride3d.jpg?format=2500w',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@fireship_dev' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
    </Head>
  )
}
