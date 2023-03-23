# Do You Wanna Go For a Walk?
## The pet weather app for you and your pet
**- by Group 68**

## Set-Up Guide
- [Setup](#Setup)
- [Opening the app](#opening-the-app)

**0. Before doing any of this, if you're using your own laptop/desktop, make sure you've got the latest versions of node and npm installed (npm v: 4.0.5 & node v: 7.4.0) :**

```sh
node -v
npm -v
```

## Setup

**1. Clone this repository :**

```sh
git clone --depth 1 https://github.com/LucianaLA/weather-app.git weather-app
cd weather-app
```

**2. Make it your own :**

```sh
rm -rf .git && git init && npm init
```

> :information_source: Command above re-initializes the repo and sets up your NPM project.

**2a. Make it your own (Windows):**

If you are using Windows you can run the three necessary comand using Powershell. You might need elevated privileges.

```sh
rm -r -fo .git
git init 
npm init
```

**3. Install the dependencies :**

```sh
npm install
```

## Opening the App


**4. Generate a production build in `./build` :**

```sh
npm run build
```

**6. Start local production server with [serve](https://github.com/zeit/serve):**

```sh
npm start
```

 This simply serves up the contents of `./build`. By copying the url provided, you can access the boilerplate from your mobile device or any application with a browser.

 Note that due to the geolocation policies of Google Chrome and other browsers, the location will not be fetched by an unsecure location. To get around this open the command promp and run:

```sh
start chrome --unsafely-treat-insecure-origin-as-secure=[url]
```

>or use

```sh
npm run dev
```

> This opens the development environment for the weather app on localhost:8080 which means geolocation can be allowed without any issues.


