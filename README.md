# Jupiter One Take Home Test

## Prerequisets

Go check out <a href="https://github.com/andrew-ballard1/pwnd-api" target="_blank">andrew-ballard1/pwnd-api</a> and complete the setup instructions there.
------------
## Getting Started
1. Run `npm install`
2. Run `echo REACT_APP_API_URL=http://127.0.0.1:3030" >> .env` (or swap out the url and port with whatever values you end up using)
3. Run `npm start`


A live demo is available at <a href="https://pwnd-frontend.herokuapp.com">pwnd-frontend.herokuapp.com</a>

------------


## Some notes
This project was used as an introduction to Material-UI and a more in depth dive into react hooks (specifically useContext).

Rather than going ham on parts that are mostly configuration, I decided mentioning here what all I thought about doing might be alright instead.

- Firebase lets you create anonymous user records (and handles token generation/validation for both client and server), so when a user hits the page and searches emails, I'd use their tokens to identify the search as theirs, then save that data to a db somewhere. If I ever needed reporting data or usage statistics, I could draw from those records.

- 
I originally wanted to hook up firebase for client authentication, send bearer tokens between the front and back ends, and set up ddos rules to keep people from spamming 