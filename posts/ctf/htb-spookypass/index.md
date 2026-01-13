---
title: "HTB SpookyPass"
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


## HTB Challenge: SpookyPass (Beginner Write-up)

This is my write-up for the **HackTheBox challenge SpookyPass**.  
It’s a reversing challenge, and since I’m still in my first year of university, I’ll keep it simple and explain step by step how I solved it.  

### Step 1: Download and Unzip the Files  

First, I downloaded the zip file from the challenge and unzipped it:  

```bash
unzip SpookyPass.zip
```

Inside, I found a folder called `rev_spookypass`.  

![HTB Screenshot](zip-unzip.png)  

I moved into the folder:  

```bash
cd rev_spookypass
```

When I listed the files, I saw there was only one file named `pass`.  

![rev ls](rev-ls.png)  

### Step 2: Check the File Type  

Before running any unknown file, I checked what kind of file it was:  

```bash
file pass
```

![file](file.png)  

It showed me that this was an executable binary.  

### Step 3: Run the File  

I tried running it with:  

```bash
./pass
```

It asked me for a password. When I entered something random, it replied:  

```
You're not a real ghost, clear off!
```

![pass](pass.png)  

So clearly, I needed to figure out the correct password.  

### Step 4: Use Strings to Find the Password  

Since this is a reversing challenge, I thought of using the `strings` command.  
This command shows all readable text inside a binary file:  

```bash
strings pass
```

![string pass](string-pass.png)  

Looking through the output, I found the actual password hidden in the file.  

### Step 5: Enter the Password  

I ran the program again and entered the password I found from `strings`.  

![congo](congo.png)  

It worked 🎉 The program revealed the flag.  

## Conclusion  

This was a fun beginner challenge. I learned a few things:  

- Always check what type of file you’re dealing with.  
- The `strings` command can be super helpful for finding hidden text in executables.  
- Sometimes challenges are easier than they look — you don’t always need advanced reversing tools.  

✅ **Flag Captured!**  
