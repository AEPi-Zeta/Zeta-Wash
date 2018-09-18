# Zeta Wash

Zeta Wash is a utilities management app for residencies. It currently allows you to "sign in," marking you're using that device, get the status of whether the utilities are being used, and a log to track who used what. There are currently two types of utilities supported, in one category:

### Laundry

* Washer
* Dryer

## Getting Started

Check out the prerequisites, and go to the installation section. Easy as pie!

Here's an image of what it'll look like once you're done:

![signin_page](https://i.imgur.com/ZvZuHTy.png)

On mobile:

![mobile_status](https://i.imgur.com/zBoXDUf.png)

Log on mobile:

![mobile_log](https://i.imgur.com/SSafFYp.png)

### Prerequisites

You need to have a functioning web server for this to work. Also make sure you have these dependencies installed on your system: nodejs. If you don't, run this command:

```
sudo apt-get install nodejs
```

### Installing

First, download the [latest release](https://github.com/AEPi-Zeta/Zeta-Wash/releases)!

Drag all the files in `Zeta-Wash` to a location accessible to a web server. It works best if it's the root (usually right inside `public_html`. Once that's done, navigate to `backend` and edit the `default.json` file.

Remember to port forward the port inside default.json. By default it's `8088`.

Once the configuration is done, type `sudo nodejs app.js`. This will run the backend server. On your browser, navigate to your installation folder. Try signing up for a machine to see if it works. If it does, viola! Zeta Wash is now up and running.

If you experience problems, know that it's usually caused by a configuration problem. The first thing you should do is check the console. To get there, right click anywhere on the page and click "Inspect element." Then on the menu that pops up, click console. Look at the error there, and try to investigate.

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
