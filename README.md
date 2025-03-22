# Contitution Debate App

## Run Locally
Clone the project
```sh
https://github.com/LewinRobin/Constiution-App.git
```

move to root folder

```sh
cd Constitution-App
```

install node modules

```sh
npm install
```
### Add .env file

create .env file in the root directory

``` properties
# Server Configuration
VITE_API_URL='http://localhost:5000/api'
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.###.mongodb.net/

# JWT Configuration
JWT_SECRET= very_very_long_key
JWT_EXPIRE=1d
```

### Run App in single terminal

```sh
npm run all
```

### Run App using frontend and backend servers

run server(backend)

```sh
npm run start
```

open new terminal in root folder and start vite development server (frontend)

```sh
npm run dev
```
