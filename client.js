// sanity.js
import {createClient} from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const sanityClient = createClient({
  projectId: 'jusy92po',
  dataset: 'monogatame_dataset',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-12-20', // use current date (YYYY-MM-DD) to target the latest API version
  token: import.meta.env.VITE_SANITY_AUTH_TOKEN // Only if you want to update content with the client
})