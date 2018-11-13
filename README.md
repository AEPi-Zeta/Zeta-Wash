# Zeta Wash

Zeta Wash is a utilities management app for residencies. It currently allows you to "reserve" machines marking you're using that device, get the status of whether the utilities are being used, and use a log to track who used what.

## Getting Started

Check out the prerequisites, and go to the installation section. Easy as pie!

Here's an image of what it'll look like once you're done:

![signin_page](https://i.imgur.com/ZvZuHTy.png)

On mobile:

<img src="https://i.imgur.com/zBoXDUf.png" width="40%">

Log on mobile:

<img src="https://i.imgur.com/SSafFYp.png" width="40%">


### Prerequisites

You need to have a functioning web server for this to work. Also make sure you have these dependencies installed on your system: nodejs. If you don't, run this command:

```
sudo apt-get install nodejs
```

### Installing

First, download the [latest release](https://github.com/AEPi-Zeta/Zeta-Wash/releases)!

Drag all the files in `Zeta-Wash` to a location accessible to a web server. It works best if it's the root (usually right inside `public_html`. Once that's done, navigate to `backend` and type `npm install` to install all the backend dependencies. 

Then edit the `default.json` file. You only need to modify these settings to get up and running (adding machines and other settings comes later):

```
In "Host":

"frontendURL" <- This is the url to the web page that the user sees
"backendURL" <- This is the url to the backend, which you will probably run on the same server.
                Remember to set a port that is different than your front end port
                The default is 8088, you can stick with this. You may need to run 'ufw allow 8088'
                to let it through your firewall.
       
That's it! Unless you want to use encryption. Then follow the steps below.

In "Encryption":

"useEncryption" <- Set this to true
"certFilePath" <- The path to the certificate, sometimes called "fullchain.pem".
"keyFilePath" <- The path to the private key, sometimes called "privkey.pem".

And then you're done for sure! There are other settings but you can modify that within Zeta Wash.
```

Remember to port forward the port inside default.json. By default it's `8088`.

Once the configuration is done, type `sudo nodejs app.js` in the `backend` folder, located in the root directory. This will run the backend server. On your browser, navigate to your installation folder. Try signing up for a machine to see if it works. If it does, viola! Zeta Wash is now up and running. You'll probably want to 

If you experience problems, know that it's usually caused by a configuration problem. The first thing you should do is check the console. To get there, right click anywhere on the page and click "Inspect element." Then on the menu that pops up, click console. Look at the error there, and try to investigate.

## Configuration

This is an explanation of some key features you can set up, as well as an explanation of some configuration options.

### Features

#### Authentication

To make sure that only you can modify the settings, turn on `Require pin for settings.` Then reload your page.

On the bottom left, you should see a lock button. Click it, and it will ask you to set a pin. Set this pin. It should successfully set. Then, click the lock again and type in the pin you just set. Now you're able to change your settings again!

#### Users list

You may want to have a users list that people select from to reserve their machine. To enable this, go into settings and under `Users` click `Custom users list`.

You'll then want to have a JSON file in the config directory labeled `users.json`. It should be formatted like this:

```
{
    "users": [
        {
            "name": "Jane Doe",
            "email": "janedoe@gmail.com",
        },{
            "name": "Bill Gates",
            "email": "b.gates@hotmail.com",
        },{
            "name": "Steve Jobs",
            "email": "jobs@apple.com",
        }
    ]
}
```

Then try to sign in with one of the users in the list, it should pop us as an autocomplete option.

#### Email notifications

This requires you enable the users feature above. 

Once you do that, go into settings and change alert service under `Users` from `None` to `email`.

Then select your email server from the list. If it does *not* show up, click `Custom` and fill out the `host` and `port` options.

Finally, fill out the `User` and `Password` fields for the email service. This isn't incredibly secure at the moment, so if someone gets access to the server they may be able to read this file in plain text. Just keep that in mind.

You're all set!

#### Adding a machine

To add a machine, simply click `Modify Machines` in the top right dropdown. Then click `Add Machine`. There's a couple things to explain here:

```
"Machine Name" <- The machine name is the singular name of the machine that everyone sees, like 'Washer' or 'Hand saw'.
"Machine Count" <- The number of machines available for this machine. For example, if you have 2 washers or 3 dryers.

The default, maximum, and minimum time are self-explanatory.

"Icon" <- The file name for the icon associated with this machine. This should be in your assets folder, in your web directory (where your index.html is).
"Subject" <- If you are using email alerts, this is the subject header of the email people receive for when the machine they used is done. You can include these variables, and we'll fill them out for you: ${date}, ${name}
"Text" <- If you are using email alerts, this is the text body of the email people receive for when the machine they used is done. You can include these variables, and we'll fill them out for you: ${date}, ${name}
"Time options" <- If you want to have default time options available for this machine, select this. For example, if a machine only runs for 30 minutes, then add a 30 minute time option. The "Name" options is whatever you want (e.g. `30`), the "Label" (e.g. `30 Minutes`) is what the user sees, and the "Time" is the time for that option `(e.g. 30`).
```

Once you set up the settings, you're all ready to add the machine.

## Deployment

If you'd like to install Zeta Wash, go to the Installation section. If you want to build it yourself and/or develop the repository, then this section is for you.

To deploy, simply clone the repository, and go into the `Zeta-Wash` directory. Type `npm install` and all the dependencies will install. Then type `cd backend` and again type `npm install` to install the dependencies for the backend.

Once you do that, you're almost up and running. All you need to do is edit the configuration in `Zeta-Wash/backend/config`, go back into the `Zeta-Wash` directory, and type `ng build --prod`. This will build the app, and put the output files in the `Zeta-Wash/dist` folder. Drag those files into a web server, and drag the `backend` directory into the same folder. This folder should have `index.html` in it as well. If it does **not**, you're in the wrong directory.

The frontend is now complete. The backend is much easier. Just go into the `Zeta-Wash/backend` folder, and type `sudo nodejs app.js`.

Finally, port forward the port `8088` and point it to the server's IP address. Make sure the port is also allowed through the firewall.

## Contributing

Feel free to submit a pull request! I have no guidelines as of yet, so no need to worry about that.

## Authors

* **Isaac Grynsztein** - *Initial work*

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Jeremy Heit as AEPi Zeta chapter House Manager for the idea
