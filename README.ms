# DevMatch APIs 

- POST /signup
- POST /login
- POST /logout

- GET /profile/view
- PATH /profile/edit
- PATCH /profile/password

# Status: ignore, interested, accepted, rejected

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

- GET /connections
- GET /request/received
- GET /feed - Gets you the ptofiles of other users on platform 