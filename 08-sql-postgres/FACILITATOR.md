# Class 08: Persistence with a SQL database

## Overview

Lab 8 adds persistence with a SQL database. This will be the first exposure that students have to any type of database. Discuss database modeling and schemas, as well as data types when creating tables. For lab 8, they are simply checking for the existence of records in the database; they will add timestamps and cache invalidation in lab 9. 

Students will be writing a file called `schema.sql` so demonstrate how to write this type of file and execute it from the command line with the following syntax: `psql -d <database-name> -f <filename>`.
  - For example, `psql -d city_explorer -f schema.sql`
  
Additionally, students will be tasked with creating a **cache** of data retrieved from the various APIs, stored in SQL. They will need to not only understand databases and SQL, but also a process by which they can use that to optimize the application.

## How do I prep for today?

- There is not lecture time available to cover code review, or shred talks. Remind students they have a link to a shred talk video in the Code Challenge assignment itself. 
- Review the `schema.sql` file and be prepared to discuss data types, primary keys, and foreign keys. Students will be referencing the primary key in the locations table as the foreign key in all five of the other tables.
- Prepare a 10-15 demonstration to introduce the topic of today's code challenges.

## What changed from the previous class?

API results are now being stored in a SQL database. Students will need to create the database and tables locally, as well as provision the free version of Postgres on Heroku. 

## What might students struggle with today?
* There is a lot of new information here.
* SQL and Databases will be a new concept to be sure.
* Using them in the way that we are, to solve the problem that this lab solves will not be immediately evident.  This is a great opportunity to have some "mob programming" with the group to come to the answer. They can do it!

## What bugs, issues, or surprises have come up in the past for this class?

There is a prework assignment for student to install Heroku and Postgres onto their laptops. The corresponding assignment in Canvas ("Setup of Your Laptop Dev Environment") has the following intructions:

```When you are done installing both the Heroku CLI and postgres, make sure to verifiy them again one directly after the other so that both of the output message are on your terminal screen at the same time. Once they are both on your screen, take a screen single screen shot and use that as your submission for your Canvas assignment.```

By this class there all students should have Postgres installed, and any students who need to do an installation on this day should be retroactively held accountable for not completing the prework.

## General comments
This is a big topical day
* SQL
* Creating a cache with the data retrieved from the API
* Engineering a solution to be abstracted, DRY, and singular in concerns.

## Lecture
* Break this lecture down into 3 parts
1. Relational Databases, DB Design, SQL Commands, psql shell
1. Giving the simple API calls some logic: Check the DB, Return if anything is there, otherwise fetch from API, save to DB and return that. Its recommended that you do this in the mold of `demos/server-demo-1.js` which has this all in one enormous method.
1. Refactoring that logic into a well engineered abstraction, calling out opportuntities where this will become less DRY as you repeat the process with multiple APIs.  Turn `server-demo-1.js` into `server.js` by talking through the big method and breaking it down into parts and functions that only do one thing each (**separation of concerns**)

## Code skeleton

## Whiteboard diagrams
