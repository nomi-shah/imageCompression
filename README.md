# imageCompression
Start as a server to compress image 
`node app.js`

# Crop image
width
height

```
http://localhost:3000/image/crop/:width/:height
http://localhost:3000/image/crop/400/400```
# Resize

Qaulity 0-1

```
http://localhost:3000/image/resize/:qaulity
http://localhost:3000/image/resize/:0.5
```



# Run as a Lamda function to crop image
``` npm install -g lambda-local ```
``` lambda-local -l app.js -t 60 -h crop -e lamda_event.json ```
