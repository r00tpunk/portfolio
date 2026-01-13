---
type: page
author: "Abdul Rehman"
title: "01. SQL Injection"
draft: true
tags: ["SQLi", "Learning"]

# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page

SQL Injection (SQLi) is a **web security vulnerability** that allows attackers to manipulate a website’s database by injecting malicious SQL code into user input fields.

## Why SQL Injection Happens

SQL Injection occurs due to improper handling of user input. When input is inserted directly into SQL queries without validation, attackers can modify queries.

**Example:**

```sql
SELECT * FROM users WHERE username = 'user_input' AND password = 'user_input';
```
Attacker input:
```sql
' OR '1'='1
```
Becomes:
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '';
```

## Prevention
- Use Prepared Statements / Parameterized Queries:
```php
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND password = ?');
$stmt->execute([$username, $password]);

```
- Validate and sanitize all input.

- Use stored procedures.

- Limit database user permissions.

- Use Web Application Firewalls (WAFs).

## Fixing SQL Injection

- Identify vulnerable queries.

- Refactor with prepared statements or ORM methods.

- Sanitize all input.

- Review database permissions.

- Monitor logs for suspicious activity.

## Conclusion

SQL Injection is dangerous but preventable. Proper coding practices, input validation, and prepared statements keep your applications safe.
