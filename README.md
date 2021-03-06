# x22g6

## Contents:
**REservation Arrows**(RE:Arrows) is an online reservation system for the use of shuttles going from De La Salle University Laguna campus (Biñan) to De La Salle University-Manila(Taft) campus and vice versa. To utilize the web application, a user account is required.  There are two account types: on-site staff (admin), and students. Students are allowed to reserve a maximum of two slots per day and has a reputation point system that will suspend their reservation features if the amount of points goes below a certain number. On-site Staff on the other hand, are allowed to check-in students that have reserved prior to the departure time.

## Prerequisites: 
NodeJS and MongoDB must be installed in the PC. git is optional.

## Heroku Link to Application:
https://re-arrows.herokuapp.com/

## Installing: 
1. Download or Create a clone of the repository
2. Open Command Prompt 
3. Navigate to project folder
4. Install dependencies: `npm install`
5. To use the application locally, a `.env` file is required.  The file was not commited to git as it contains sensitive information.  A link to the `.env` file would be specified in the comments in the canvas submission of the project. Downloading the file may cause a random filename to the `.env` file. If so, remove the filename and set it to ".env".  Place the `.env` file in the root directory of the project

## Running Application:
1. Open Command Prompt 
2. Navigate to project folder
3. Set the NODE_ENV environment variable to "development": `SET NODE_ENV=development` 
4. Run the following command to start the application: `node app.js`.  At least the following messages (in any order) should be displayed to indicate that the app is working properly
```
Listening at port 3000
Verified SMTP connection configuration
Connected to MongoDB server
Scheduled release date of existing suspended users
Added cron jobs
```
6. Open a web browser and type the following:
```
http://localhost:3000/
```

## Dummy Accounts:
| Email                      | Password   | Type    |
|----------------------------|------------|---------|
|mike_quito@dlsu.edu.ph|herokuapp|Student|
|john_joseph_reyes@dlsu.edu.ph|computers|Student|
|joshua_kiel_gaurano@dlsu.edu.ph|p@ssword|Student|
|john_smith@dlsu.edu.ph|headphones|Staff|

## Authors:
* **Joshua Gaurano** 
* **Mike Quito**
* **Jj Reyes**


## Acknowledgements:
* Sir Arren for being the foundation on website making
