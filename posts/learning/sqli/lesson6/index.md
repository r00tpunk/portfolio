---
type: page
title: "SQL Injection Lab – Lesson 6 (Second Order Injections)"

draft: false
tags: ["SQL Injection", "Second Order Injections", "Web Security", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page

## Second‑Order Injection

Second ‑ Order SQL injection is similar to stored cross‑site scripting: the attacker injects malicious payload into the database, and the payload is later used in a different query on another page, causing the injection at a later time.

## Lab Walkthrough

Database before creating user.

![Alt text](/sqli-06/dbbefore.jpg)

# User Registration & Login Flow
1. Sign‑up:

![Alt text](/sqli-06/signup.jpg)

2. Enter a username and password (e.g., 1234 / p@ssw0rd) in my case I'm using ***r00tpunk*** as Username and ***blah*** as Password.
![Alt text](/sqli-06/creatinguser.jpg)

3. User successfully created. 

![Alt text](/sqli-06/usercreated.jpg)

# Login:
1. Provide the newly created credentials on the login page.

![Alt text](/sqli-06/nowlogin.jpg)

2. Successful login shows a welcome message and a boxes to change the password.

![Alt text](/sqli-06/loggedin.jpg)

Database after creating user.

![Alt text](/sqli-06/dbafter.jpg)


# Attempting Injection on Username Field
1. I'm creating a second user with username ***r00tpunk' --*** and password ***1234***.
2. The application’s input sanitisation treats the string as a literal, so the user is created with the exact username ***r00tpunk' --***.
3. Logging in with ***r00tpunk' --*** / ***1234*** succeeds, 

![Alt text](/sqli-06/newloggedin.jpg)

4. Showing that the injected username is stored.

![Alt text](/sqli-06/newuserindb.jpg)

5. Look at the Database at number 17 before changing the password of ***r00tpunk' --***. 

![Alt text](/sqli-06/beforechangingpass.jpg)

6. Now I'm changing the password of the user ***r00tpunk' --*** from ***1234*** to ***asdf***.

![Alt text](/sqli-06/changingnewuserpasswd.jpg)

7. Password changed successfully.

![Alt text](/sqli-06/passwdchangedsuccesfully.jpg)

8. Now look after resetting the password for the ***r00tpunk' --*** account, the ***r00tpunk*** account’s password changes, even though the ***r00tpunk*** record itself was never directly edited.

![Alt text](/sqli-06/afterchangingpass.jpg)

9. The injection works because the stored username ***r00tpunk' --*** is later concatenated into an UPDATE query without proper escaping.


## How the Second‑Order Injection Works

- UPDATE users SET password = '<new_password>' WHERE username = '<logged_in_username>' AND password = '<current_password>';

- <logged_in_username> is taken from the session (derived from the value stored in the database).

- If the username in the database contains an unescaped payload like r00tpunk' --, the query becomes:

- UPDATE users SET password = 'ASDF' WHERE username = 'r00tpunk'--' AND password = '1234';

- The -- starts a comment, truncating the remainder of the query and causing the condition to match the r00tpunk row, thereby updating the r00tpunk’s password.
