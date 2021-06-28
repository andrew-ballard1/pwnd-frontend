# Jupiter One Take Home Test

## Prerequisets


Go check out <a href="https://github.com/andrew-ballard1/pwnd-api" target="_blank">andrew-ballard1/pwnd-api</a> and complete the setup instructions there.


## Getting Started
1. Run `npm install`
2. Run `echo REACT_APP_API_URL=http://127.0.0.1:3030" >> .env` (or swap out the url and port with whatever values you end up using)
3. Run `npm start`


A live demo is available at <a href="https://pwnd-frontend.herokuapp.com">pwnd-frontend.herokuapp.com</a>

## Some notes


This project was used as an introduction to Material-UI and a more in depth dive into react hooks (specifically useContext).

Rather than going ham on parts that are mostly configuration, I thought mentioning here what all I wanted to bulid might be alright instead.

- Firebase lets you create anonymous user records (and handles token generation/validation for both client and server), so when a user hits the page and searches emails, I'd use their tokens to identify the search as theirs, then save that data to a db somewhere. If I ever needed reporting data or usage statistics, I could draw from those records.

- I originally wanted to hook up firebase for client authentication, send bearer tokens between the front and back ends, and set up ddos rules to keep people from spamming, but MVP is best for now


## _I've_ got questions for _you_ now


<div style="width:100%;height:0;padding-bottom:67%;position:relative;"><iframe src="https://giphy.com/embed/MQwnNsDJ1MJZ0E0w1u" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mattel-uno-reverse-card-unogame-MQwnNsDJ1MJZ0E0w1u">via GIPHY</a></p>

I have one bug I've left in that I'm curious if you can find. If I were to send this to QA they'd find it within a few minutes, but I know their process. It has to do with email validation.

Honestly there are a few bugs, but the effort to reward of fixing them is low (I'm talking like minor css bugs).
