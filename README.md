# CrimeMiner 

## CrimeMiner Windows Installation

### Install NodeJS
- Download & Install Node.js 18.18.1 LTS

### Install Python
- Download & Install Python version 3.11.5 (As of today, installing python version 3.12.0 does not allow to download the django-neomodel library, useful for django and neo4j).

### Install JDK 17 
- Download & Install JDK on this link https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Create new variable JAVA_HOME and set value as "C:\Program Files\ `JDK 17`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `JDK 17`\bin"

### Install Neo4j First method(Simplified version with neo4j already given)
- Download Neo4j Community 5.12.0 folder on this link https://drive.google.com/file/d/1P3TJL8pJirJEB7Pw_XHCD1eqwhVjK-ZP/view?usp=sharing
- Move the downloaded `<neo4j_folder>` to C:\Program Files to grant access to neo4j files
- Create new variable NEO4J_HOME and set value as "C:\Program Files\ `<neo4j_folder>`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `<neo4j_folder>`\bin"

### Install Neo4j Second method (If neo4j folder is not available.  Don't follow this steps if the last ones have been completed.)
- Download Neo4j Community 5.12.0 folder on this link https://neo4j.com/deployment-center/
- Move the downloaded `<neo4j_folder>` to C:\Program Files to grant access to neo4j files
- Create new variable NEO4J_HOME and set value as "C:\Program Files\ `<neo4j_folder>`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `<neo4j_folder>`\bin"
- Open CMD and run the following command: "cd C:\Program Files\neo4j\bin"
- Now run the command: "neo4j install-service" and service will be installed
- Now install some plugins for the graph:
    - Download [APOC Library 5.12.0](https://github.com/neo4j/apoc/releases/tag/5.12.0)
    - Download [Graph Data Science 2.5.0](https://github.com/neo4j/graph-data-science/releases/tag/2.5.0)
    - Add downloaded libraries into `<neo4j_folder>`\plugins
    - Add following line at the bottom of file `<neo4j_folder>`\conf\neo4j.conf "dbms.security.procedures.unrestricted=gds.\*,apoc.\*" <!--(If you open the README on a editor don't use this "\" in gds. and apoc.)-->
- Now go to "C:\Program Files\ `<neo4j_folder>`\data\dumps"
- Insert the file "neo4j.dump" and open CMD (contact the administrators for neo4j.dump file)
- Now run the command: "neo4j-admin database load --overwrite-destination=true neo4j" and the database is populated

### Start Neo4j First method
- Open CMD as Administrator and just execute "neo4j console" and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Credentials username: "neo4j" and password: "neo44%*j" for enter db on URL

### Start Neo4j Second method(If you did the previous Start Neo4j, ignore this)
- Open CMD as Administrator and just execute "neo4j console" and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Enter init credentials username: "neo4j" and password: "neo4j"
- Neo4j will redirect you to a new password web-page and here you have to enter the project password: "neo44%*j"

### Install Project in VSCode
- Download VSCode
- Download the projet with zip on GitHub and the open the folder of the project on VSCode (Not the zip).
- Open VSCode terminal and run this commands: 
    - `npm install`
    - `pip install -r requirements.txt`

### CrimeMiner Start Application
- Open CMD, go to path of the project 
- Then run the following command: "neo4j console"
- After neo4j is running, open another CMD and run the following command (you can also open the terminal on VSCode and run this command): "npm run full" (Dont execute npm run full command before neo4j console stops running, or project metrics will not work)
- Open Browser and write "localhost:8000/CrimeMiner/"
- For stop server use command ctrl+c

### Documentation of the project
- For project documentation, ho on the GitHub project page and search the Documentation folder.

## CrimeMiner Ubuntu 22.04.3 Installation

### Install NodeJS
- Open CMD, then run the following commands:
    - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
- Close CMD and open again:
    - nvm install v18.18.1

### Install Python
- Generally on Ubuntu, Python is installed by default.
- Open CMD and run following command: sudo apt install python3-pip.

### Install JDK 17 
- Open CMD, then run the following command: sudo apt install openjdk-17-jdk
- After installation run on CMD the following command: gedit ~/.bashrc
- Create new variable JAVA_HOME and set value as "C:\Program Files\ `JDK 17`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `JDK 17`\bin"

### Install Neo4j
- Download [Neo4j Community 5.12.0](https://neo4j.com/download-thanks/?edition=community&release=5.12.0&flavour=unix&_ga=2.215629648.659733033.1701947907-34595816.1701947907)
- Move the downloaded `<neo4j_folder>` to /usr/local to grant access to neo4j files
- After installation run on CMD the following command: gedit ~/.bashrc
- When the file is opened, go at the end and add the following lines:
    - export NEO4J_HOME="/usr/local/`<neo4j_folder>`"
    - export PATH="/usr/local/`<neo4j_folder>`/bin:$PATH"
- Now run the command: "neo4j install-service" and service will be installed
- Now install some plugins for the graph:
    - Download [APOC Library 5.12.0](https://github.com/neo4j/apoc/releases/tag/5.12.0)
    - Download [Graph Data Science 2.5.0](https://github.com/neo4j/graph-data-science/releases/tag/2.5.0)
    - Add downloaded libraries into `<neo4j_folder>`\plugins
    - Add following line at the bottom of file `<neo4j_folder>`\conf\neo4j.conf "dbms.security.procedures.unrestricted=gds.\*,apoc.\*" (If you open the README on a editor don't use this "\" in gds. and apoc.)
- Now open CMD and run the following command "sudo nautilus /usr/local/`<neo4j_folder>`/data/dumps"
- Insert the file "neo4j.dump" (contact the administrators for neo4j.dump file)
- Now return on CMD and run the command: "neo4j-admin database load --overwrite-destination=true neo4j" and the database is populated

### Start Neo4j
- Open CMD as Administrator and just execute "neo4j console" and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Enter init credentials username: "neo4j" and password: "neo4j"
- Neo4j will redirect you to a new password web-page and here you have to enter the project password: "neo44%*j"

### Install Project in VSCode
- Download VSCode
- Download the projet with zip on GitHub and the open the folder of the project on VSCode (Not the zip).
- Open VSCode terminal and run this commands: 
    - `npm install`
    - `pip install -r requirements.txt`

### CrimeMiner Start Application
- Open CMD, go to path of the project 
- Then run the following command: "neo4j console"
- After neo4j is running, open another CMD and run the following command (you can also open the terminal on VSCode and run this command): "npm run full" (Dont execute npm run full command before neo4j console stops running, or project metrics will not work)
- Open Browser and write "localhost:8000/CrimeMiner/"
- For stop server use command ctrl+c

### Documentation of the project
- For project documentation, ho on the GitHub project page and search the Documentation folder.