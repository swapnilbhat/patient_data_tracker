from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import mysql.connector
import os
app = FastAPI()

# Set up CORS for your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000","http://13.232.190.140"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Database configuration
dbconfig = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": os.getenv("SQL_DB_PASSWORD", "password"),#export DATABASE_PASSWORD='yourpassword'
    "database": "patient_database"
}

DB_TABLE = 'rheumat_table'

@app.post('/store_patient_data/')
async def receive_request(request: Request):
    data = await request.json()

    # Connect to the database
    db_connection = mysql.connector.connect(**dbconfig)
    cursor = db_connection.cursor()

    # SQL statement for inserting data
    sql = (
        "INSERT INTO rheumat_table "
        "(name, age, sex, disease_severity, medical_history, other_conditions, vas, haq, das28, unique_id) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    val = (
        data['name'], data['age'], data['sex'], data['diseaseSeverity'],
        data['medicalHistory'], data['otherConditions'], data['vas'],
        data['haq'], data['das28'], data['uniqueId']
    )

    # Insert data into the database
    cursor.execute(sql, val)
    db_connection.commit()

    # Close the cursor and connection
    cursor.close()
    db_connection.close()

    return {"message": "Data stored successfully"}


@app.get('/retrieve_patient_data/{unique_id}')
async def retrieve_patient_data(unique_id: str):
     # Connect to the database
    print(unique_id)
    db_connection = mysql.connector.connect(**dbconfig)
    cursor = db_connection.cursor()

    # SQL statement for fetching data
    sql = "SELECT * FROM rheumat_table WHERE unique_id = %s"
    val = (unique_id,)

    # Fetch data from the database
    cursor.execute(sql, val)
    result = cursor.fetchall()

    # Convert result to a more JSON-friendly format
    data = [dict(zip(cursor.column_names, row)) for row in result]

    # Close the cursor and connection
    cursor.close()
    db_connection.close()

    return data

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
