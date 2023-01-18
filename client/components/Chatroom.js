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
