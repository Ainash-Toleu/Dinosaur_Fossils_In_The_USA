# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func

# import info from config document
from config import user, password, host, port

# Define the database connection parameters
connection_string = f'postgresql://{user}:{password}@{host}:{port}/dino_db'

# Connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# Choose the table we wish to use
table = base.classes.dinosaur_fossils

# Instantiate the Flask application. 
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Here's where we define the various application routes ...
@app.route("/")
def IndexRoute():
    ''' This function runs when the browser loads the index route. 
        Note that the html file must be located in a folder called templates. '''

    webpage = render_template("index.html")
    return webpage

@app.route("/dino_db")
def QueryDinosaurDatabase():
    ''' Query the dinosaur database and return the results as a JSON. '''

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(table.specimen_no, table.specimen_id, table.specimen_part, table.specimen_name, table.specimen_class, table.specimen_family, table.specimen_genus, table.lng, table.lat, table.country, table.state).all()
    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_dinosaurs = []
    for specimen_no, specimen_id, specimen_part, specimen_name, specimen_phylum, specimen_class, specimen_family, specimen_genus, lng, lat, country, state in results:
        dict = {}
        dict["specimen_no"] = specimen_no
        dict["specimen_id"] = specimen_id
        dict["specimen_part"] = specimen_part
        dict["specimen_name"] = specimen_name
        dict["specimen_phylum"] = specimen_phylum
        dict["specimen_class"] = specimen_class
        dict["specimen_family"] = specimen_family
        dict["specimen_genus"] = specimen_genus
        dict["lng"] = lng
        dict["lat"] = lat
        dict["country"] = country
        dict["state"] = state

        all_dinosaurs.append(dict)

    # Return the jsonified result. 
    return jsonify(all_dinosaurs)

@app.route("/dendogram")
def QueryDendogramLO():
    ''' Query the dinosaur database and return the results as a JSON. '''

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    resulta = session.query(table.specimen_phylum, table.specimen_class).distinct()
    resultb = session.query(table.specimen_class, table.specimen_family).distinct()
    resultc = session.query(table.specimen_family, table.specimen_genus).distinct()
    resultd = session.query(table.specimen_genus, table.specimen_name).distinct()
    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    levelf = []
    for specimen_phylum, specimen_class in resulta:
        list = [specimen_phylum, specimen_class]
        levelf.append(list)
    for specimen_class, specimen_family in resultb:
        list = [specimen_class, specimen_family]
        levelf.append(list)
    for specimen_family, specimen_genus in resultc:
        list = [specimen_family, specimen_genus]
        levelf.append(list)
    for specimen_genus, specimen_name in resultd:
        list = [specimen_genus, specimen_name]
        levelf.append(list)

    # Return the jsonified result. 
    return jsonify(levelf)


@app.route("/plotly")
def QueryBones():
    ''' Query the dinosaur database and return the results as a JSON. '''
    # Open a session, run the query, and then close the session again
    session = Session(engine)
    resulte = session.query(table.specimen_part, func.count(table.specimen_part)).group_by(table.specimen_part).all()
    session.close()
    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_bones = []
    for specimen_part, value in resulte:
        dict = {}
        dict["specimen_part"] = specimen_part
        dict["value"] = value
        all_bones.append(dict)
    newdict = {subdict["specimen_part"]: subdict["value"] for subdict in all_bones}
    # Return the jsonified result. 
    return jsonify(newdict)
   

    
    

if __name__ == '__main__':
    app.run(debug=True)