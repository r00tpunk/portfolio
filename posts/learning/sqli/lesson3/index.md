---
type: page
title: "SQL Injection Lab – Lesson 3 (Blind injections - Boolean based)"

draft: false
tags: ["SQL Injection", "Double Query Injection", "Web Security", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page

## Blind injections -(Boolean based)

Blind SQL injection is a technique where the attacker can infer information from the database without seeing the actual query output, using only binary responses.

With pure blind SQLi the application won’t print database values for you — you can only test true/false.

Boolean‑based – the injected condition evaluates to TRUE or FALSE.

# Inject parameter
1. Look for parameters placed inside single quotes: `id='...`  
2. Confirm the app shows errors or returns a page that changes on bad input (even if message hidden — error may still be logged).  

If the response changes, parameter is injectable. If you get SQL error, good — proceed carefully.

## Boolean Logic Construction

1. Inject an AND clause that always evaluates to true or false.
2. True example: AND 1=1 → page shows ***“you are in”***.
3. False example: AND 1=0 → no output.
4. Boolean‑blind SQLi doesn’t print database values to the page for you; it only lets you test ***true/false*** conditions.

## Testing queries

As you can see this is the normal test lab 

```bash
http://localhost:8080/sqli-labs/sqli-labs-master/Less-8/
```

![Alt text](/sqli-03/biN.jpg)

***Now let's break the query***
- For this I'm using the this query to test ***true/false***.
- If it's true the query will show us output such as ***“you are in”***.

```sql
?id=1' AND (ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))) < 101 --+
```

![Alt text](/sqli-03/biB.jpg)

Now we can see that the qurey is broke now it's mean it's false that's why we are not getting any output from it.

```sql
?id=1' AND (ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))) < 105   --+
```

![Alt text](/sqli-03/biC.jpg)

Now you can see that the query is correct now it's mean its true.
