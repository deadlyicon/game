import React from 'react'
import sortBy from 'lodash/sortBy'
import GameState from './GameState.js'
import { useCurrentUser, signUp, signIn, signOut } from './auth.js'

export default function App(){
  const currentUser = useCurrentUser()
  return <div>
    <h4>APP</h4>
    <GameState/>
    {currentUser
      ? <CurrentUser/>
      : <LoginForm/>
    }
    <SpeakForm/>
  </div>
}

function LoginForm(){
  const _signUp = event => {
    const { username, secret } = getFormValues(event)
    signUp(username, secret)
  }
  const _signIn = event => {
    const { username, secret } = getFormValues(event)
    signIn(username, secret)
  }
  const onSubmit = event => { event.preventDefault(); }
  return <form {...{onSubmit}}>
    <input name="username" type="text" placeholder="username"/>
    <input name="secret" type="password" placeholder="secret"/>
    <button type="submit" onClick={_signUp}>sign up</button>
    <button type="submit" onClick={_signIn}>sign in</button>
  </form>
}



function CurrentUser() {
  const currentUser = useCurrentUser()
  return <div>
    <pre>currentUser={JSON.stringify(currentUser, null, 2)}</pre>
    <button onClick={signOut}>sign out</button>
  </div>
}
function SpeakForm(){
  const currentUser = useCurrentUser()
  const [sayings, setSayings] = React.useState([])
  console.log({ sayings })
  const sortedSayings = React.useMemo(
    () => sortBy(sayings, ['at']),
    [sayings]
  )
  React.useEffect(
    () => {
      if (!currentUser) return
      currentUser.get('said3').map().on(saying => {
        console.log('saying', saying)
        setSayings(sayings => ({
          ...sayings,
          [saying.id]: saying,
        }))
        // console.log('things said?', x)
      })
    },
    [currentUser]
  )
  if (!currentUser) return
  const onSubmit = event => {
    event.preventDefault();
    const input = event.target.statement
    currentUser.get('said3').set({
      id: crypto.randomUUID(),
      msg: input.value,
      at: Date.now(),
    })
    // gun.get('game').get('state').put({ said: value })
    input.value = ''
  }


  return <form {...{onSubmit}}>
    <input name="statement" type="text" placeholder="say something…"/>
    <button type="submit">speak</button>
    <ol>
      {sortedSayings.map(saying =>
        <li key={saying.id}>
          <div>{saying.msg}</div>
        </li>
      )}
    </ol>
  </form>
}



function getFormValues(event){
  const { form } = event.target
  const formData = new FormData(form)
  return Object.fromEntries(formData.entries())
}
