# DevMatch APIs

## authRouter:

- POST /signup
- POST /login
- POST /logout

## profileRouter:

- GET /profile/view
- PATH /profile/edit
- PATCH /profile/password

## Status: ignore, interested, accepted, rejected

## requestRouter:

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRouter:

- GET /user/connections
- GET /user/request/received
- GET /user/feed - Gets you the ptofiles of other users on platform
