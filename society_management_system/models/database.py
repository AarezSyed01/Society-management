import mysql.connector
from mysql.connector import pooling
from society_management_system.config import Config

pool = None

def get_connection_pool():
    global pool
    if pool is None:
        pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="society_pool",
            pool_size=5,
            pool_reset_session=True,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
    return pool

def get_db():
    try:
        return get_connection_pool().get_connection()
    except Exception as e:
        # Fallback to direct connection if pooling is not supported
        return mysql.connector.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )

def query_db(query, args=(), one=False, commit=False):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, args)
        if commit:
            conn.commit()
            last_id = cursor.lastrowid
            return last_id
        rv = cursor.fetchall()
        return (rv[0] if rv else None) if one else rv
    finally:
        cursor.close()
        conn.close()
