# CrimeMiner

## Install NodeJS
- Download & Install Node.js 18.18.1 LTS
- Open CMD, go to path of the project and run this command `npm install`

## Install Python
- Download & Install Python version 3.11.5 Ad oggi se si installa la versione 3.12.0 di python non ci consente di scaricare la libreria django-neomodel utile per django.
- Open CMD, go to path of the project and run this command `pip install -r requirements.txt`

## Install JDK 17 
- Download & Install JDK on this link https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Create new variable JAVA_HOME and set value as "C:\Apps\ `JDK 17`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `JDK 17`\bin"

## Install Neo4j on Windows
- Download Neo4j Community 5.12.0 folder on this link https://drive.google.com/file/d/1P3TJL8pJirJEB7Pw_XHCD1eqwhVjK-ZP/view?usp=sharing
- Move the downloaded `<neo4j_folder>` to C:\Program Files and also to C:\Apps to grant access to neo4j files
- Create new variable NEO4J_HOME and set value as "C:\Apps\ `<neo4j_folder>`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `<neo4j_folder>`\bin"

## Start Neo4j
- Open CMD as Administrator and just execute `<neo4j_folder>\bin\neo4j console` and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Credentials username: "neo4j" and password: "neo44%*j" for enter db on URL

## Install Project in VSCode
- Download the projet with zip on GitHub and the open the folder of the project on VSCode (Not the zip).

## CrimeMiner Start Application
- Open CMD, go to path of the project 
- Then run the following command: "npm run full"
- Open Browser and write "localhost:8000/CrimeMiner"
- For stop server use command ctrl+c

## Struttura del progetto
  E' stato utilizzato un modello MTV che corrisponde al MVC
  Per comprendere la struttura del progetto visitare il seguente link https://medium.com/@samueleresca/developing-mvc-using-django-and-visual-studio-2015-part-1-fdcca754d310