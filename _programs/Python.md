---
title: "Python"
categories: 
  - installation
language:
  - en
program:
  - python

---

Python is one of my favorites tools to play around. It is a scripting tool, which means you can pretty much create anything given enough time and (computer) memory.

Another great point is that it is open-source, meaning that it is free to use, community backed support and a large number of users and project example out there (including many of the project we will be working here).

We will be using Python for a variety of projects, including: ETL (Extract, Transform and Load), Data Analysis, visualization and storytelling, Machine Learning and AI and much more.

Hope the quick walkthrough below may help understand how to install it and some possibilities on how to interact with it.

## Installation

First step is too install Python. While there are tools that may help you install and manage Python (any Anaconda user here?), we will quickly go through how to install basic Python.

For any operating system, you have the option to download the executable file from [Python's downloads page](https://www.python.org/downloads/) and go through the installation process. Windows users (like myself), this is your only real option to directly install Python.

### Ubuntu and other Unix OS

For Unix based operating systems (you may see [Ubuntu]() mentioned in some posts in this blog), it is very simple to install Python. Perform all the steps below in a terminal window.

First we will ensure APT is installed and updated. Sudo is a command that will allow the user to run commands with elevated privilege (necessary for installations), while APT (Advanced Package Tool) provides the capability to install, rmeove and update packages in Unix OS

```
sudo apt install
sudo apt upgrade
```

Once that is completed, we can simply run the below to install python 3's newest stable version

```
sudo apt install python3
```

### MacOS

Even though MacOS is very similar to Unix based operating systems (like Ubuntu above), an extra component is necessary prior to Python installation: a package manager. Make sure to install one of those prior to the Python installation.

In the example below I used brew, but any other manager would work the same way. Just open a terminal and type the below (changing the package manager accordingly)

```
brew install python
```

## Flavors

With Python installed, you can already start using it through your command prompt, but it is usually not to user friendly if you want to explore the code, since Python takes its spaces/tabs very serious (most definitions are dependent on exact number of spaces/tabs and/or line breaks to work correctly).

To improve the code readability and exploration capability, a variety of flavors on how to interact with Python scripts are available. We will go through a couple I personally use on my processes, but feel free to explore on your own.

### Jupyter

Jupyter is one of the most common ways to interact with Python scripts. It works as a web application where all its tools can be access and it is very easy to install (just run the code below in your command prompt).

```
pip install jupyter
```

Its Notebook tool provide a clean and slick area to interact and run your script, but also provides the capability to create annotations and documentation in MarkDown alongside your code, facilitating user readability and guidance. 

Jupyter Labs, on the other hand, provides a complete and complex environment, allowing the user to interact with a variety of files, console, terminal as well as the notebooks mentioned above.

We will definitely see some Jupyter Notebooks being used in the post as it is a pleasing way to include guidance and documentation alongside your code (great for someone trying to follow along).

### Other IDEs

Even though Jupyter is great to display your final code, I am not its biggest fan during development. It chunks the code a little to much, while making it difficult to run one line of code for debugging.

For that reason, we will definitely see some examples where while developing the process, we use another IDE (Integrated Development Environment) tool to create the process.

I currently have been using Microsoft Visual Code as my main development tool, as I like its native (or easy to set) integrations with other Microsoft tools, like GitHub. But there are a myriad of other IDEs available, including one we will discuss later.

## Environments

As you installed Python, it created an environment where al the packages you install will be saved. It is very important to be attentive to your environment, as different packages may have distinct dependencies and it can become a problem when it starts to mix versions of different packages.

To avoid all the packages being installed for a variety of projects mixing in your main environment (which should be kept as clean as possible to avoid confusion), you can create virtual environments. Those virtual environments are a layer on top of the base installation of Python we performed above. 

Ideally, you would have one virtual environment for each project you may perform, with the possibility to share the environment between scripts if they are all part of the same overarching project. This way, the entire development process is packaged and can be maintained more easily.

Virtual Enviroments are easy to create and I highly recommend you start setting them up from your first project (you will thank me later). You can get more details on them on [Python docs](https://docs.python.org/3/library/venv.html).


