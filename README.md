# Large
Large is a clone of Medium, a blogging platform for video game enthusiasts. Here you are able to make an account and blog about recent games as well as comment on blogs.

## Technologies
This app makes use of the following technologies:
- Express.js
- Pug
- Javascript
- Sequelize
- PostgreSQL

## Setup

1. Clone this repository
```
git clone git@github.com:masontaylor7/Large.git
```
2. Change directories into Large
3. Install dependencies
```
npm install
```
4. In psql, create a PostgreSQL user with a password and CREATEDB privileges
5. Create .env file using the .envexample as a guide.
6. Use the newly created user and password for the DB_USERNAME and DB_PASSWORD fields.
7. Enter a name for your database in the DB_DATABASE field.
8. Create a session secret for the SESSION_SECRET field.
9. For DB_HOST, use localhost, and assign a port.
10. Use sequelize to create the database.
```
npx dotenv sequelize db:create
```
11. Run all migrations.
```
npx dotenv sequelize db:migrate
```
12. Seed the database.
```
npx dotenv sequelize db:seed:all
```
13. Run `npm start`.
14. Navigate to localhost in your browser, specifying the port you used in your .env file.

## Screenshots
This is the splash page for the app that users see when they navigate to the site.
![image](https://user-images.githubusercontent.com/72574258/163453876-36ecaf7d-4a24-49ef-b2fc-4a5c1e672c4d.png)
This is the form for creating a post.
![image](https://user-images.githubusercontent.com/72574258/163453894-32a5992c-b1a7-4034-b7a0-15966bb6f82b.png)
When users click the comments icon on a post, a comments sidebar appears.
![image](https://user-images.githubusercontent.com/72574258/163453907-67481d57-42bd-4284-8437-930dfd5d58b7.png)


