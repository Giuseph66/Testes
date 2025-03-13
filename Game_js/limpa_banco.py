import sqlite3

banco=sqlite3.connect("banco.db")

cursor = banco.cursor()
cursor.execute("DROP TABLE IF EXISTS record")
