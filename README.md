# Jupiter One Take Home Test

## Prerequisets

## Prerequisets

Node `^15.14.0` is required

You can use a node version manager to switch between versions, <a href="https://www.npmjs.com/package/n">I'm partial to "n"</a>

You can also use NVM

Then run `n install 15.14.0` or `nvm install 15.14.0`


Go check out <a href="https://github.com/andrew-ballard1/pwnd-api" target="_blank">andrew-ballard1/pwnd-api</a> and complete the setup instructions there.


## Getting Started
1. Run `npm install`
2. Run `echo REACT_APP_API_URL=http://127.0.0.1:3030" >> .env` (or swap out the url and port with whatever values you end up using)
3. Run `npm start`

(Sometimes you'll need to put environment variables into `.env.development` instead, and if all else fails, for the sake of testing just swap out the declaration)

If you don't like running strange code locally, a live demo is available at <a href="https://pwnd-frontend.herokuapp.com">pwnd-frontend.herokuapp.com</a>

## Some notes


This project was used as an introduction to Material-UI and a more in depth dive into react hooks (specifically useContext).

Rather than going ham on parts that are mostly configuration, I thought mentioning here what all I wanted to bulid might be alright instead.

- Firebase lets you create anonymous user records (and handles token generation/validation for both client and server), so when a user hits the page and searches emails, I'd use their tokens to identify the search as theirs, then save that data to a db somewhere. If I ever needed reporting data or usage statistics, I could draw from those records.

- I originally wanted to hook up firebase for client authentication, send bearer tokens between the front and back ends, and set up ddos rules to keep people from spamming, but MVP is best for now

## Now _I've_ got questions for _you_


<img src="https://media.giphy.com/media/MQwnNsDJ1MJZ0E0w1u/giphy.gif" />

I try to make it a habit to take in feedback, so feel free to leave comments on stuff, fiddle around, suggest edits etc. I don't get hard feelings, unless you think Han shot second.

