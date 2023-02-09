# Game
 
## Development

```bash
pnpm install
```


make a `.env` file like this:

```
PORT=5100
GUN_PREFIX=game_v1
```

start the app in dev mode
```bash
pnpm run dev
```

if you get weird build errors

```bash
rm -rf .parcel-cache
// restart the dev server
```

game
- CurrentPlayer/OtherPlayer
    movement 
    animations
    position
    attributes health, etc
- Weapon 
    attributes(holding,attack type)
