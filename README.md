# move-api
 a little movie api with details

## Starting

Get mongo running:
```
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

To seed the db, run `mongosh`in your shell, then paste the contents of seedData/mongo/mongo-seed.js.

You'll need to update the connection link in index.js, in the `mongoose.connect` lines (lines 14 and/or 17).
