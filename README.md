# x22g6

## Contents:
**REservation Arrows**(RE:Arrows) is an online reservation system for the use of shuttles going from De La Salle University Laguna campus (Biñan) to De La Salle University-Manila(Taft) campus and vice versa. To utilize the web application, a user account is required.  There are two account types: on-site staff (admin), and students. Students are allowed to reserve a maximum of two slots per day and has a reputation point system that will suspend their reservation features if the amount of points goes below a certain number. On-site Staff on the other hand, are allowed to check-in students that have reserved prior to the departure time.

## Prerequisites: 
NodeJS and MongoDB must be installed in the PC. git is optional.

## Installing: 
1. Download or Create a clone of the repository
2. Open Command Prompt 
3. Navigate to project folder
4. Install dependencies: `npm install`
5. To use the application, a MongoDB server must be running locally on port 27017.  Once the MongoDB server is running, run the command `node data-insert.js`.  The script would create a database called "arrows-express" and insert the documents needed by the application, as well as the dummy   user accounts.  If the database already exists, all of the existing data would be overwritten
6. Set the NODE_ENV environment variable to "development": `SET NODE_ENV=development`
7. Run the following command to start the application: `node app.js`.  The following message would be displayed if the application has started properly
```
Listening at port 3000
Connected to database
Added cron jobs
Connected to SMTP Server
```
8. Open a web browser and type the following:
```
http://localhost:3000/
```

## Dummy Accounts:
| Email                      | Password   | Type    | isSuspended |
|----------------------------|------------|---------|-------------|
| mike_quito@dlsu.edu.ph     | herokuapp | Student   |  False |
| john_joseph_reyes@dlsu.edu.ph       | computers  | Student | False |
| joshua_kiel_gaurano@dlsu.edu.ph | p@ssword   | Student | True |

## Authors:
* **Joshua Gaurano** 
* **Mike Quito**
* **Jj Reyes**


## Acknowledgements:
* Sir Arren for being the foundation on website making
