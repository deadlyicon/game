import React from 'react'
import gun from './gun.js'

export default function App(){
  console.log({ gun })
  console.log()
  React.useEffect(
    () => {
          // var user = gun.user();
    },
    []
  )
  return <div>APP 2</div>
}
