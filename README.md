# Project_2_Paleo
This is a shared github repo between group 12 members for Project 2 in Data Visualization bootcamp

## How to JSONify data on your computer

Please clone this repository to your machine and then do the following:
1. Navigate to the **Dinosaur_Fossils_In_The_USA** directory of the repo and launch a GitBash(Windows) or Terminal(Mac).
1.  In open GitBash(Windows) or Terminal(Mac) type `source activate PythonData` and hit ENTER. Do not close GitBash(Windows) or Terminal(Mac).
1. In still open GitBash(Windows) or Terminal(Mac) type `jupyter notebook` and hit ENTER. Do not close GitBash(Windows) or Terminal(Mac).
1. In launched Jupyter Notebook, open **Dinosaur_fossils.ipynb** document and do the following:
    * Run first 17 cells to read csv file, store it in dataframe and clean the data. 
    * Do not close Jupyter notebook and GitBash(Windows) or Terminal(Mac).
1. Launch PgAdmin and do the following:
    * Create database **dino_db**.
    * Open Query Tool in created database.
    * Import **schema.sql** file from cloned repo.
    * Run code to create table from downloaded file.
1. Open the Visual Studio Code and do the following:
    * Open your cloned repo.
    * Create **config.py** document in your cloned repo at same level as ipynb document. 
    * In **congif.py** document set `user = <type your user name>`, `password = <type your password>`, `port = 5432`, `host = “localhost”`.
    * Save the changes and close the Visual Studio Code.
1. Go back to Jupyter notebook and run rest of the cells till the end to connect database. Do not close GitBash(Windows) or Terminal(Mac).
1. To JSONify database, do the following:
	* In open GitBash(Windows) or Terminal(Mac) type `python app.py`.
	* Enter this address in your Chrome browser: http://127.0.0.1:5000/dino_db
   

