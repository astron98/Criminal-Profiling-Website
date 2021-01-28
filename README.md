# Criminal-Profiling-Website


A website which makes the job of Cops simpler by maintaining the details of all the criminals present in different locations across the world as 
listed in the following locations: 1. Prisons 2. Rehabilitation 3. Watchlists


## Installation

1. Use the package manager [npm](https://npmjs.com) to install the dependencies for this website.   
2. Open your terminal/cmd   
NOTE: Here, the password asked will be of your MySQL database.


```bash
npm install
mysql -u root -p -e "create database criminals"
mysql -u root -p criminals < db_query.sql
```


## Usage
1. run the below command in the terminal.
```javascript
node app.js 
```
2. Open the link: ```http://localhost:3000/home``` in your favourite browser.
3. Type this default login credentials: **Username: admin, Password: password890**


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
