---
type: page
title: "SQL Injection Lab – Lesson 4 (Blind injections - Time based)"

draft: false
tags: ["SQL Injection", "Double Query Injection", "Web Security", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page

## Blind injections -(Time based)

An injection technique where the attacker cannot see the query output directly; instead, they infer information through side‑effects such as time delays or content changes.

# Inject parameter
1. Look for parameters placed inside single quotes: `id='...`  
2. Confirm the server shows delays or responds immediately.
3. By measuring latency you can infer boolean results and enumerate the database.

If the delay happen, parameter is injectable.

## Time-Based Paylods Construction
1. Identify injection point (e.g., a URL parameter that is quoted in the query).
2. Close the original string with a single quote (').
3. Insert the conditional payload using ***IF***.
4. Terminate the rest of the query with a comment (-- ).
5. Observe the response time to decide true/false.

# Query will be like this
```sql
' OR IF(SUBSTRING(DATABASE(),1,1)='s', SLEEP(10), 0)-- 
```
the query means: If the first character of the database name is s, the server sleeps 10s → true.

Otherwise the response is immediate → false.

## Testing Paylods

- For this I'm using the this query to test ***true/false***.
- If it's true the query will show ***delay in server***.

```sql
?id=1' and sleep(10)--+
```

![Alt text](/sqli-04/1.jpg)

As you can see on the top left of the web page. The server is reloading it's mean the query is ***True*** 

Now we can check the version and other things (character by character).

```sql
?id=1' and if((select version()) like "10%", sleep(10), null)--+
```

![Alt text](/sqli-04/2.jpg)

As you can see the ***server reload*** on the ***Top Left*** of the webpage it's mean the payload is ***True***.

```sql
?id=1' and  if((select substr(table_name,1,1) from information_schema.tables where table_schema=database()  limit 0,1)='e', sleep(10), null)--+
```

![Alt text](/sqli-04/3.jpg)

As you can see our result is ***True*** you can see the reload on ***Top Left***.
