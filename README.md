# move-api
A movie API built with Express.js, featuring full auth and JWT implementation via Passport.

I've built full frontends to work with this server in React.js and Angular.js:
[React Frontend - Web](https://bentley-myflix-client-react.netlify.app/)
[React Frontend - Git](https://github.com/bentleyjensen/myflix-client-react)
[Angular Frontend - Web](https://bentleyjensen.github.io/myflix-client-angular)
[Angular Frontend - Git](https://github.com/bentleyjensen/myflix-client-angular)

As of this writing, this server is deployed to Heroku [here](https://shrouded-fortress-53636.herokuapp.com/).

## Documentation

Documentation brought to you by [JSDoc](https://jsdoc.app/). To regenerate documentation, run `npm run docgen`. 

## Getting Set Up

This server is built to work with a MongoDB database. Update the `.env` file with the correct link to the database before starting. If you would like, some seed data is provided, though the users will not work due to password hashing issues.

You can start a local MongoDB instance via homebrew:
```
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

To seed the db, run `mongosh`in your shell, then paste the contents of seedData/mongo/mongo-seed.js.

## Development Server

Start the server with `npm start`, and your api will be available at `localhost:8000`.
